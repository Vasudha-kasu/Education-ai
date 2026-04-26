export const Footer = () => (
  <footer className="border-t border-[#1a1c1a]/10 mt-24 bg-[#ece2cf]" data-testid="main-footer">
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="font-serif-display text-3xl font-semibold mb-3">Edu-AI Core</div>
        <p className="text-sm text-[#1a1c1a]/70 max-w-md leading-relaxed">
          The adaptive learning OS for the next generation of Indian engineers.
          Learn in your language. Get answered in seconds. Adapt to your pace.
        </p>
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-[#1a1c1a]/50 mb-4">Learn</div>
        <ul className="space-y-2 text-sm">
          <li><a href="/courses" className="hover:text-[#c84c2c]">Courses</a></li>
          <li><a href="/sessions" className="hover:text-[#c84c2c]">Live sessions</a></li>
          <li><a href="/mentors" className="hover:text-[#c84c2c]">Mentors</a></li>
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-[#1a1c1a]/50 mb-4">Career</div>
        <ul className="space-y-2 text-sm">
          <li><a href="/jobs" className="hover:text-[#c84c2c]">Jobs</a></li>
          <li><a href="/doubt-solver" className="hover:text-[#c84c2c]">Ask AI</a></li>
          <li><a href="/dashboard" className="hover:text-[#c84c2c]">Dashboard</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-[#1a1c1a]/10">
      <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-[#1a1c1a]/50 flex flex-wrap justify-between gap-3">
        <span>© 2026 Edu-AI Core. Built with care for learners.</span>
        <span>Powered by Gemini · Whisper · Adaptive Bloom AI</span>
      </div>
    </div>
  </footer>
);