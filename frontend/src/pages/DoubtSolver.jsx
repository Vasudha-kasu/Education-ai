import { useState, useRef, useEffect } from "react";
import { askDoubt } from "../lib/api";
import { toast } from "sonner";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada"];
const SUGGESTIONS = [
  "Explain Big-O notation with examples",
  "Why use async/await over promises in JavaScript?",
  "Difference between supervised and unsupervised learning",
  "How does React's virtual DOM work?",
];

export default function DoubtSolver() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your Edu-AI tutor. Ask me anything — code, concepts, career. I'll respond in your language." }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await askDoubt(q, language);
      setMessages(m => [...m, { role: "ai", text: res.answer }]);
    } catch (e) {
      toast.error("AI is unreachable right now");
      setMessages(m => [...m, { role: "ai", text: "Sorry, I couldn't reach the AI service. Try again in a moment." }]);
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12" data-testid="doubt-solver-page">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-2">Powered by Gemini · 24/7</div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold leading-tight">Ask the AI tutor.</h1>
        </div>
        <select
          data-testid="language-select"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="bg-[#f5efe4] border border-[#1a1c1a]/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#c84c2c]"
        >
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="bg-[#f5efe4] border border-[#1a1c1a]/10 rounded-2xl flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "bg-[#1a1c1a] text-[#f5efe4]" : "bg-[#ece2cf] text-[#1a1c1a]"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {busy && <div className="text-xs text-[#1a1c1a]/50">Edu-AI is thinking…</div>}
          <div ref={endRef} />
        </div>

        <div className="border-t border-[#1a1c1a]/10 p-4">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  data-testid="suggestion-chip"
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-xs bg-[#1a1c1a]/5 hover:bg-[#1a1c1a]/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              data-testid="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`Ask anything in ${language}…`}
              className="flex-1 bg-[#ece2cf] rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c84c2c]"
            />
            <button
              data-testid="send-btn"
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className="px-6 rounded-full bg-[#c84c2c] text-[#f5efe4] text-sm font-medium hover:bg-[#a83a1f] disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}