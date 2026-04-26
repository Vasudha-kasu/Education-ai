import { useEffect, useState } from "react";
import { fetchMentors } from "../lib/api";
import { toast } from "sonner";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors().then(d => setMentors(d.mentors || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 text-[#1a1c1a]/50">Loading mentors…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" data-testid="mentors-page">
      <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-3">Real engineers · real advice</div>
      <h1 className="font-serif-display text-5xl sm:text-6xl font-semibold leading-tight">Mentors who've been there.</h1>
      <p className="text-[#1a1c1a]/70 mt-3 max-w-2xl">
        Each mentor has shipped to millions of users. Book a 1:1 or join their live session.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {mentors.map((m, i) => (
          <div
            key={m.id}
            data-testid={`mentor-card-${m.id}`}
            className="bg-[#f5efe4] rounded-2xl p-6 border border-[#1a1c1a]/10 hover:border-[#c84c2c] transition-all hover:-translate-y-1 anim-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-16 h-16 rounded-full object-cover bg-[#ece2cf]"
                onError={(e) => { e.target.style.visibility = "hidden"; }}
              />
              <div>
                <h3 className="font-serif-display text-lg font-semibold leading-tight">{m.name}</h3>
                <div className="text-xs text-[#1a1c1a]/60">{m.role}</div>
              </div>
            </div>
            <p className="text-sm text-[#1a1c1a]/70 leading-relaxed mb-4">{m.bio}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {m.expertise.map(s => <span key={s} className="px-2 py-0.5 text-[10px] bg-[#1a1c1a]/5 rounded-full">{s}</span>)}
            </div>
            <div className="flex items-center justify-between border-t border-[#1a1c1a]/10 pt-3">
              <div className="text-xs text-[#1a1c1a]/65">
                <i className="fa-solid fa-star text-[#c84c2c]"></i> {m.rating} · {m.sessions} sessions · {m.experience}
              </div>
              <button
                data-testid={`book-${m.id}`}
                onClick={() => toast.success(`Booking flow opened for ${m.name}`)}
                className="px-3 py-1.5 rounded-full bg-[#1a1c1a] text-[#f5efe4] text-xs font-medium hover:bg-[#c84c2c]"
              >
                Book 1:1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}