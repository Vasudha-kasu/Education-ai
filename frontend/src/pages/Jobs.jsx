import { useEffect, useState } from "react";
import { fetchJobs } from "../lib/api";
import { toast } from "sonner";

const Tag = ({ children, highlight }) => (
  <span className={`px-3 py-1 rounded-full text-[11px] tracking-wide ${
    highlight ? "bg-[#c84c2c] text-[#f5efe4]" : "bg-[#f5efe4]/10 text-[#f5efe4]/85 border border-[#f5efe4]/20"
  }`}>{children}</span>
);

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchJobs().then(d => { setJobs(d.jobs || []); setActive(d.jobs?.[0] || null); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 text-[#1a1c1a]/50">Loading jobs…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" data-testid="jobs-page">
      <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-3">Curated openings</div>
      <h1 className="font-serif-display text-5xl sm:text-6xl font-semibold leading-tight">Jobs that match your skill.</h1>
      <p className="text-[#1a1c1a]/70 mt-3 max-w-2xl">Hand-picked openings from India's top product companies. Updated weekly.</p>

      <div className="grid lg:grid-cols-12 gap-6 mt-12">
        <div className="lg:col-span-5 space-y-3" data-testid="jobs-list">
          {jobs.map(j => (
            <button
              key={j.id}
              data-testid={`job-card-${j.id}`}
              onClick={() => setActive(j)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                active?.id === j.id
                  ? "border-[#c84c2c] bg-[#f5efe4] shadow-[0_15px_40px_-20px_rgba(200,76,44,0.4)]"
                  : "border-[#1a1c1a]/10 bg-[#f5efe4] hover:border-[#1a1c1a]/30"
              }`}
            >
              <div className="flex gap-4">
                <img
                  src={j.logo}
                  alt={j.company}
                  className="w-12 h-12 rounded-xl bg-[#ece2cf] object-contain p-1"
                  onError={(e) => { e.target.style.visibility = "hidden"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#1a1c1a]/60">{j.company}</div>
                  <div className="font-serif-display text-lg font-semibold leading-tight">{j.title}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#1a1c1a]/60 mt-1.5">
                    <span><i className="fa-solid fa-location-dot mr-1"></i>{j.location}</span>
                    <span><i className="fa-solid fa-indian-rupee-sign mr-1"></i>{j.salary}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {active && (
          <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start" data-testid="job-detail">
            <div className="bg-[#1a1c1a] text-[#f5efe4] rounded-2xl p-7">
              <div className="flex items-start gap-4 mb-5">
                <img
                  src={active.logo}
                  alt=""
                  className="w-14 h-14 rounded-xl bg-[#f5efe4] p-1"
                  onError={(e) => { e.target.style.visibility = "hidden"; }}
                />
                <div>
                  <div className="text-sm text-[#f5efe4]/60">{active.company} · {active.posted}</div>
                  <h2 className="font-serif-display text-3xl font-semibold leading-tight">{active.title}</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                <Tag>{active.type}</Tag>
                <Tag>{active.experience}</Tag>
                <Tag>{active.location}</Tag>
                <Tag highlight>{active.salary}</Tag>
              </div>
              <p className="text-sm text-[#f5efe4]/80 leading-relaxed mb-6">{active.description}</p>
              <div className="mb-5">
                <div className="text-xs uppercase tracking-widest text-[#f5efe4]/50 mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">{active.skills.map(s => <Tag key={s}>{s}</Tag>)}</div>
              </div>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-[#f5efe4]/50 mb-2">Requirements</div>
                <ul className="space-y-1.5">
                  {active.requirements.map(r => (
                    <li key={r} className="text-sm flex gap-2"><span className="text-[#c84c2c]">▹</span>{r}</li>
                  ))}
                </ul>
              </div>
              <button
                data-testid="apply-btn"
                onClick={() => toast.success("Application submitted! Recruiter will get back within 5 business days.")}
                className="w-full py-3 rounded-full bg-[#c84c2c] text-[#f5efe4] font-medium hover:bg-[#a83a1f]"
              >
                Apply for this role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}