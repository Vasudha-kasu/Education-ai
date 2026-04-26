import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { fetchCourse, generateAssignment, evaluateAssignment, saveNote } from "../lib/api";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada"];
const BLOOM_LEVELS = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [bloom, setBloom] = useState("Understand");
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busyAsg, setBusyAsg] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCourse(id, language).then(setCourse).finally(() => setLoading(false));
  }, [id, language]);

  const lesson = course?.lessons?.[activeLesson];

  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Voice transcription not supported. Try Chrome."); return; }
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return; }
    const r = new SR();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-IN";
    r.onresult = (e) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript + " ";
      setNoteContent(prev => (prev + " " + txt).trim());
    };
    r.onerror = (e) => { toast.error("Voice error: " + e.error); setRecording(false); };
    r.onend = () => setRecording(false);
    r.start();
    recognitionRef.current = r;
    setRecording(true);
    toast.success("Listening — speak your notes");
  };

  const downloadPDF = async () => {
    if (!noteContent.trim()) { toast.error("Note is empty"); return; }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(course.title, 15, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Lesson: ${lesson.title}`, 15, 30);
    doc.text(`Language: ${language} · ${new Date().toLocaleString()}`, 15, 37);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(noteContent, 175);
    doc.text(lines, 15, 52);
    doc.save(`${course.title}-${lesson.title}.pdf`);
    try {
      await saveNote({ course_id: course.id, lesson_id: lesson.id, title: `${course.title} — ${lesson.title}`, content: noteContent });
      toast.success("Notes saved to dashboard");
    } catch (_) {}
  };

  const startAssignment = async () => {
    setBusyAsg(true); setResult(null); setAssignment(null); setAnswers({});
    try {
      const a = await generateAssignment(course.id, lesson.id, lesson.title, bloom);
      setAssignment(a);
    } catch (e) { toast.error("Failed to generate assignment"); }
    finally { setBusyAsg(false); }
  };

  const submitAssignment = async () => {
    if (!assignment) return;
    setBusyAsg(true);
    try {
      const userAns = assignment.questions.map(q => String(answers[q.id] ?? -1));
      const r = await evaluateAssignment({ course_id: course.id, lesson_id: lesson.id, bloom_level: bloom, questions: assignment.questions, answers: userAns });
      setResult(r);
      setBloom(r.next_level);
      const msg = { promoted: "Level up! 🎓", stay: "Keep practicing", demoted: "Let's strengthen the basics" };
      toast.success(`${r.score}% — ${msg[r.verdict]}`);
    } catch (e) { toast.error("Could not evaluate"); }
    finally { setBusyAsg(false); }
  };

  if (loading || !course) return <div className="max-w-7xl mx-auto px-6 py-20 text-[#1a1c1a]/50">Loading course…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="course-detail-page">
      <Link to="/courses" className="text-sm text-[#1a1c1a]/60 hover:text-[#c84c2c]">← All courses</Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs tracking-widest uppercase text-[#c84c2c] mb-2">{course.category} · {course.instructor}</div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold">{course.title}</h1>
          <p className="text-[#1a1c1a]/70 mt-3 max-w-2xl">{course.description_translated || course.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-wider text-[#1a1c1a]/60">Language</label>
          <select
            data-testid="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#f5efe4] border border-[#1a1c1a]/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#c84c2c]"
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mt-10">
        {/* LESSONS SIDEBAR */}
        <aside className="lg:col-span-3" data-testid="lessons-sidebar">
          <div className="bg-[#ece2cf] rounded-2xl p-4 sticky top-24">
            <div className="text-xs uppercase tracking-widest text-[#1a1c1a]/60 px-2 mb-3">{course.lessons.length} lessons</div>
            <ul className="space-y-1">
              {course.lessons.map((l, i) => (
                <li key={l.id}>
                  <button
                    onClick={() => { setActiveLesson(i); setAssignment(null); setResult(null); }}
                    data-testid={`lesson-${l.id}`}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                      i === activeLesson ? "bg-[#1a1c1a] text-[#f5efe4]" : "hover:bg-[#1a1c1a]/5"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-60 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-sm leading-snug">
                      {l.title}
                      <div className="text-[10px] opacity-60 mt-0.5">{l.duration}</div>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-9 space-y-8">
          <div className="aspect-video rounded-2xl overflow-hidden border border-[#1a1c1a]/10 bg-black" data-testid="video-player">
            <iframe
              key={lesson.video_id}
              src={`https://www.youtube.com/embed/${lesson.video_id}?rel=0`}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div>
            <h2 className="font-serif-display text-2xl font-semibold">{lesson.title}</h2>
            <p className="text-sm text-[#1a1c1a]/60 mt-1">Lesson {activeLesson + 1} of {course.lessons.length} · {lesson.duration}</p>
          </div>

          {/* NOTES PANEL */}
          <div className="bg-[#f5efe4] border border-[#1a1c1a]/10 rounded-2xl p-6" data-testid="notes-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-display text-xl font-semibold">Your notes</h3>
                <p className="text-xs text-[#1a1c1a]/60 mt-0.5">Type, or tap the mic to dictate. Save as PDF.</p>
              </div>
              <div className="flex gap-2">
                <button
                  data-testid="voice-record-btn"
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-colors ${
                    recording ? "bg-[#c84c2c] text-[#f5efe4] animate-pulse" : "border border-[#1a1c1a]/20 hover:bg-[#1a1c1a]/5"
                  }`}
                >
                  <i className="fa-solid fa-microphone"></i> {recording ? "Stop" : "Voice"}
                </button>
                <button
                  data-testid="download-pdf-btn"
                  onClick={downloadPDF}
                  className="px-4 py-2 rounded-full bg-[#1a1c1a] text-[#f5efe4] text-xs font-medium flex items-center gap-2 hover:bg-[#c84c2c] transition-colors"
                >
                  <i className="fa-solid fa-file-pdf"></i> Save as PDF
                </button>
              </div>
            </div>
            <textarea
              data-testid="note-textarea"
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Write or dictate your notes here…"
              className="w-full h-40 bg-[#ece2cf] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c84c2c] resize-y"
            />
          </div>

          {/* ASSIGNMENT PANEL */}
          <div className="bg-[#1a1c1a] text-[#f5efe4] rounded-2xl p-6" data-testid="assignment-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-serif-display text-xl font-semibold">Adaptive assignment</h3>
                <p className="text-xs text-[#f5efe4]/60 mt-1">
                  Bloom's Taxonomy · current level: <span className="text-[#c84c2c] font-semibold">{bloom}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  data-testid="bloom-selector"
                  value={bloom}
                  onChange={e => setBloom(e.target.value)}
                  className="bg-[#f5efe4]/10 border border-[#f5efe4]/20 rounded-full px-3 py-1.5 text-xs"
                >
                  {BLOOM_LEVELS.map(b => <option key={b} value={b} className="text-black">{b}</option>)}
                </select>
                <button
                  data-testid="generate-assignment-btn"
                  onClick={startAssignment}
                  disabled={busyAsg}
                  className="px-5 py-2 rounded-full bg-[#c84c2c] text-[#f5efe4] text-xs font-medium hover:bg-[#a83a1f] disabled:opacity-50"
                >
                  {assignment ? "Regenerate" : "Generate quiz"}
                </button>
              </div>
            </div>

            {busyAsg && !assignment && <div className="text-sm text-[#f5efe4]/60">Generating questions with Gemini…</div>}

            {assignment && !result && (
              <div className="space-y-5">
                {assignment.questions.map((q, qi) => (
                  <div key={q.id} data-testid={`question-${q.id}`} className="border-t border-[#f5efe4]/10 pt-4">
                    <div className="text-sm font-medium mb-3">{qi + 1}. {q.question}</div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={`flex gap-2 items-start p-2 rounded-md cursor-pointer hover:bg-[#f5efe4]/5 ${answers[q.id] === oi ? "bg-[#c84c2c]/20" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={answers[q.id] === oi}
                            onChange={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                            className="mt-1 accent-[#c84c2c]"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  data-testid="submit-assignment-btn"
                  onClick={submitAssignment}
                  disabled={busyAsg}
                  className="px-6 py-2.5 rounded-full bg-[#f5efe4] text-[#1a1c1a] text-sm font-medium hover:bg-[#c84c2c] hover:text-[#f5efe4] transition-colors disabled:opacity-50"
                >
                  Submit answers
                </button>
              </div>
            )}

            {result && (
              <div data-testid="assignment-result" className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <div className="font-serif-display text-5xl text-[#c84c2c] font-semibold">{result.score}%</div>
                  <div className="text-sm text-[#f5efe4]/70">
                    {result.correct}/{result.total} correct · next level:{" "}
                    <span className="text-[#c84c2c] font-semibold">{result.next_level}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {result.feedback.map((f, i) => (
                    <div key={i} className={`p-3 rounded-lg text-xs ${f.is_correct ? "bg-green-900/30" : "bg-red-900/30"}`}>
                      <div className="font-medium">{f.question}</div>
                      {f.explanation && <div className="text-[#f5efe4]/70 mt-1">{f.explanation}</div>}
                    </div>
                  ))}
                </div>
                <button
                  data-testid="next-level-btn"
                  onClick={() => { setResult(null); setAssignment(null); }}
                  className="px-5 py-2 rounded-full bg-[#c84c2c] text-[#f5efe4] text-xs font-medium"
                >
                  Continue to {result.next_level}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}