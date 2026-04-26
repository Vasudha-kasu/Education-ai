import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../lib/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchCourses().then(d => setCourses(d.courses || [])).finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];
  const filtered = filter === "All" ? courses : courses.filter(c => c.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" data-testid="courses-page">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs tracking-[0.22em] uppercase text-[#c84c2c] mb-3">Curated YouTube · structured for you</div>
          <h1 className="font-serif-display text-5xl sm:text-6xl font-semibold leading-tight">All courses</h1>
          <p className="mt-3 text-[#1a1c1a]/70 max-w-xl">
            Six handpicked playlists from India's best educators — turned into trackable, adaptive courses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              data-testid={`filter-${c.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs tracking-wide transition-all ${
                filter === c
                  ? "bg-[#1a1c1a] text-[#f5efe4]"
                  : "bg-[#1a1c1a]/5 text-[#1a1c1a]/70 hover:bg-[#1a1c1a]/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-[#1a1c1a]/50">Loading courses…</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              data-testid={`course-card-${c.id}`}
              className="group bg-[#f5efe4] rounded-2xl overflow-hidden border border-[#1a1c1a]/10 hover:border-[#c84c2c] transition-all hover:-translate-y-1 anim-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="aspect-video bg-[#1a1c1a] relative overflow-hidden">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f5efe4] text-[#1a1c1a] text-[10px] font-medium tracking-wider uppercase">
                  {c.level}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-[#1a1c1a]/50 mb-2 flex items-center gap-2">
                  <span>{c.category}</span><span>·</span><span>{c.instructor}</span>
                </div>
                <h3 className="font-serif-display text-xl font-semibold leading-snug mb-2 group-hover:text-[#c84c2c] transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-[#1a1c1a]/65 line-clamp-2">{c.description}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-[#1a1c1a]/60">
                  <span><i className="fa-solid fa-star text-[#c84c2c]"></i> {c.rating} · {c.enrolled.toLocaleString()} enrolled</span>
                  <span>{c.lessons_count} lessons</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}