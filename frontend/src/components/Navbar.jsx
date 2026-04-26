import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/jobs", label: "Jobs" },
  { to: "/sessions", label: "Sessions" },
  { to: "/mentors", label: "Mentors" },
  { to: "/doubt-solver", label: "Ask AI" },
  { to: "/dashboard", label: "Dashboard" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md bg-[#f5efe4]/85 border-b border-[#1a1c1a]/10"
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="brand-link">
          <div className="w-9 h-9 rounded-xl bg-[#1a1c1a] text-[#f5efe4] grid place-items-center transition-transform group-hover:rotate-6">
            <span className="font-serif-display text-xl font-bold leading-none">e</span>
          </div>
          <div>
            <div className="font-serif-display text-xl font-semibold leading-none">Edu-AI</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[#1a1c1a]/60 mt-0.5">Core</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `px-4 py-2 text-sm rounded-full transition-all ${
                  isActive
                    ? "bg-[#1a1c1a] text-[#f5efe4]"
                    : "text-[#1a1c1a]/75 hover:text-[#1a1c1a] hover:bg-[#1a1c1a]/5"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/courses"
          data-testid="cta-explore-btn"
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c84c2c] text-[#f5efe4] text-sm font-medium hover:bg-[#a83a1f] transition-colors"
        >
          Start learning <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-[#1a1c1a]/5"
          onClick={() => setOpen((o) => !o)}
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#1a1c1a]/10 bg-[#f5efe4]" data-testid="mobile-menu">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm ${
                    isActive ? "bg-[#1a1c1a] text-[#f5efe4]" : "hover:bg-[#1a1c1a]/5"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};