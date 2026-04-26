import { useEffect, useState } from "react";
import { fetchNotes, deleteNote, fetchStats } from "../lib/api";
import { toast } from "sonner";
import jsPDF from "jspdf";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-[#1a1c1a] text-[#f5efe4] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs uppercase tracking-widest text-[#f5efe4]/50">{label}</span>
      <i className={`fa-solid ${icon} text-[#c84c2c]`}></i>
    </div>
    <div className="font-serif-display text-4xl font-semibold">{value}</div>
  </div>
);

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    Promise.all([fetchNotes(), fetchStats()])
      .then(([n, s]) => { setNotes(n.notes || []); setStats(s); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const remove = async (id) => {
    await deleteNote(id);
    toast.success("Note deleted");
    refresh();
  };

  const downloadPDF = (note) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(note.title, 15, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(new Date(note.created_at).toLocaleString(), 15, 28);
    doc.line(15, 32, 195, 32);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(note.content, 175), 15, 42);
    doc.save(`${note.title}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" data-testid="dashboard-page">
      <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-3">Your space</div>
      <h1 className="font-serif-display text-5xl sm:text-6xl font-semibold leading-tight">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10" data-testid="stats-grid">
        <StatCard label="Notes saved" value={stats?.notes_count ?? 0} icon="fa-file-pdf" />
        <StatCard label="Doubts asked" value={stats?.doubts_count ?? 0} icon="fa-circle-question" />
        <StatCard label="Quizzes taken" value={stats?.assignments_attempted ?? 0} icon="fa-square-check" />
        <StatCard label="Courses available" value={stats?.courses_count ?? 6} icon="fa-graduation-cap" />
      </div>

      <div className="mt-12">
        <h2 className="font-serif-display text-3xl font-semibold mb-5">Saved PDF notes</h2>
        {loading ? (
          <div className="text-[#1a1c1a]/50">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="bg-[#ece2cf] border border-dashed border-[#1a1c1a]/20 rounded-2xl p-10 text-center" data-testid="empty-notes">
            <i className="fa-solid fa-file-pdf text-3xl text-[#1a1c1a]/30 mb-3"></i>
            <p className="text-[#1a1c1a]/60">
              No notes saved yet. Visit any course and tap "Save as PDF" inside the notes panel.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map(n => (
              <div key={n.id} data-testid={`note-${n.id}`} className="bg-[#f5efe4] border border-[#1a1c1a]/10 rounded-2xl p-5 hover:border-[#c84c2c] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs text-[#1a1c1a]/55">{new Date(n.created_at).toLocaleDateString()}</div>
                  <button
                    data-testid={`delete-${n.id}`}
                    onClick={() => remove(n.id)}
                    className="text-[#1a1c1a]/40 hover:text-[#c84c2c]"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
                <h3 className="font-serif-display text-lg font-semibold mb-2 line-clamp-2">{n.title}</h3>
                <p className="text-xs text-[#1a1c1a]/65 line-clamp-3 mb-4">{n.content}</p>
                <button
                  data-testid={`download-${n.id}`}
                  onClick={() => downloadPDF(n)}
                  className="w-full py-2 rounded-full bg-[#1a1c1a] text-[#f5efe4] text-xs font-medium hover:bg-[#c84c2c]"
                >
                  <i className="fa-solid fa-download mr-1"></i> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}