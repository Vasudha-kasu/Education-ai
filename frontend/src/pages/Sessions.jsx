import { useEffect, useState } from "react";
import { fetchSessions } from "../lib/api";
import { toast } from "sonner";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions().then(d => setSessions(d.sessions || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 text-[#1a1c1a]/50">Loading sessions…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" data-testid="sessions-page">
      <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-3">Live · 1:1 · group</div>
      <h1 className="font-serif-display text-5xl sm:text-6xl font-semibold leading-tight">Mentor sessions, this week.</h1>
      <p className="text-[#1a1c1a]/70 mt-3 max-w-2xl">
        Real engineers from Google, Razorpay, Atlassian and more — answering your questions, live.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {sessions.map((s, i) => (
          <div
            key={s.id}
            data-testid={`session-card-${s.id}`}
            className="bg-[#f5efe4] rounded-2xl border border-[#1a1c1a]/10 overflow-hidden hover:border-[#c84c2c] transition-all hover:-translate-y-1 anim-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="aspect-video relative bg-[#1a1c1a]">
              <img
                src={s.thumbnail}
                alt={s.title}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#c84c2c] text-[#f5efe4] text-[10px] tracking-wider uppercase">
                {s.price}
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#1a1c1a]/80 text-[#f5efe4] text-[10px]">
                {s.duration}
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs text-[#1a1c1a]/55 mb-1">{s.mentor} · {s.mentor_role}</div>
              <h3 className="font-serif-display text-lg font-semibold leading-snug mb-2">{s.title}</h3>
              <p className="text-xs text-[#1a1c1a]/65 line-clamp-2 mb-4">{s.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.tags.map(t => <span key={t} className="px-2 py-0.5 text-[10px] bg-[#1a1c1a]/5 rounded-full">{t}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-[#1a1c1a]/65 mb-4">
                <span><i className="fa-regular fa-calendar mr-1"></i>{s.date}</span>
                <span><i className="fa-regular fa-clock mr-1"></i>{s.time}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#1a1c1a]/60">{s.seats_left} of {s.total_seats} seats left</span>
                <button
                  data-testid={`enroll-${s.id}`}
                  onClick={() => toast.success(`Reserved your seat for "${s.title}"`)}
                  className="px-4 py-2 rounded-full bg-[#1a1c1a] text-[#f5efe4] text-xs font-medium hover:bg-[#c84c2c] transition-colors"
                >
                  Reserve seat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}