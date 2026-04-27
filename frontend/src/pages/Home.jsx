import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchStats } from "../lib/api";

const features = [
  { icon: "fa-bolt", title: "Instant doubt solving", desc: "AI answers your questions 24/7 in any language — no more waiting on a mentor." },
  { icon: "fa-language", title: "Learn in your language", desc: "Every course translates instantly to Hindi, Tamil, Telugu, Bengali and more." },
  { icon: "fa-code", title: "Real-time coding help", desc: "Stuck on logic? Edu-AI debugs and explains your code line-by-line." },
  { icon: "fa-route", title: "Adaptive Bloom levels", desc: "Assignments that auto-adjust to your skill — based on Bloom's Taxonomy." },
  { icon: "fa-microphone", title: "Voice → PDF notes", desc: "Talk while watching. Whisper transcribes & saves directly into your PDF." },
  { icon: "fa-briefcase", title: "Curated tech jobs", desc: "Hand-picked openings from Razorpay, Cred, Flipkart and more." },
];

const Stat = ({ label, value }) => (
  <div className="flex justify-between items-baseline border-b border-[#f5efe4]/10 pb-3">
    <span className="text-sm text-[#f5efe4]/60">{label}</span>
    <span className="font-serif-display text-3xl font-semibold text-[#c84c2c]">{value}</span>
  </div>
);

export default function Home() {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchStats().then(setStats).catch(() => {}); }, []);

  return (
    <div className="paper-grain" data-testid="home-page">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 anim-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1c1a]/5 border border-[#1a1c1a]/10 text-xs tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c84c2c] animate-pulse"></span>
              Adaptive learning · powered by Gemini
            </div>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              Learn anything,<br />
              <span className="italic text-[#c84c2c]">in any language,</span><br />
              at <em className="not-italic underline decoration-[3px] underline-offset-[6px] decoration-[#c84c2c]">your</em> pace.
            </h1>
            <p className="mt-7 text-lg text-[#1a1c1a]/70 max-w-2xl leading-relaxed">
              Edu-AI Core is a single space where curated YouTube playlists become structured courses,
              every lesson auto-generates a Bloom-level quiz, and a Gemini tutor answers every doubt — in your language.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/courses"
                data-testid="hero-courses-btn"
                className="px-7 py-3.5 rounded-full bg-[#1a1c1a] text-[#f5efe4] hover:bg-[#c84c2c] transition-colors text-sm font-medium"
              >
                Browse free courses <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
              </Link>
              <Link
                to="/doubt-solver"
                data-testid="hero-ai-btn"
                className="px-7 py-3.5 rounded-full border-2 border-[#1a1c1a] text-[#1a1c1a] hover:bg-[#1a1c1a] hover:text-[#f5efe4] transition-colors text-sm font-medium"
              >
                Ask the AI tutor
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 anim-fade-up delay-200">
            <div className="bg-[#1a1c1a] text-[#f5efe4] rounded-3xl p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
              <div className="text-xs tracking-widest uppercase text-[#f5efe4]/50 mb-5">Live snapshot</div>
              <div className="space-y-5">
                <Stat label="Courses ready" value={stats?.courses_count ?? 6} />
                <Stat label="Curated jobs" value={stats?.jobs_count ?? 6} />
                <Stat label="Live sessions" value={stats?.sessions_count ?? 6} />
                <Stat label="Notes saved" value={stats?.notes_count ?? 0} />
                <Stat label="Doubts answered" value={stats?.doubts_count ?? 0} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#ece2cf] border-y border-[#1a1c1a]/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl mb-14">
            <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-4">What Edu-AI does for you</div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold leading-tight">Six superpowers, one app.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                data-testid={`feature-card-${i}`}
                className="group p-7 rounded-2xl bg-[#f5efe4] border border-[#1a1c1a]/10 hover:border-[#c84c2c] transition-all hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1a1c1a] text-[#c84c2c] grid place-items-center mb-5 group-hover:bg-[#c84c2c] group-hover:text-[#f5efe4] transition-colors">
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h3 className="font-serif-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#1a1c1a]/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-4">How it works</div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold leading-tight mb-6">
              A loop that gets smarter every lesson.
            </h2>
            <p className="text-[#1a1c1a]/70 leading-relaxed">
              Take a look how it works
            </p>
          </div>
          <ol className="space-y-5">
            {[
              ["Pick a course", "Choose from CodeWithHarry, Apna College, Krish Naik & more."],
              ["Watch + take notes", "PDF notes panel with voice-to-text — built into every lesson."],
              ["Solve adaptive quiz", "4 questions on your current Bloom level."],
              ["AI scores & adapts", "Score 75%+ → level up. Below 40% → review the basics."],
              ["Ask anything anytime", "The AI tutor remembers your context, in your language."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5">
                <div className="font-serif-display text-3xl font-semibold text-[#c84c2c] w-12 leading-none">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-base">{t}</h4>
                  <p className="text-sm text-[#1a1c1a]/65 mt-0.5">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
