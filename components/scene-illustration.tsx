export function SceneIllustration({ variant = "dashboard" }: { variant?: "auth" | "dashboard" }) {
  const isAuth = variant === "auth";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[#0f172a] p-4 text-white shadow-soft sm:p-6">
      <div className="hero-orb animate-pulse-glow left-[-40px] top-[-30px] h-40 w-40 bg-coral/40" />
      <div className="hero-orb animate-float-delayed right-[-50px] top-12 h-36 w-36 bg-teal/30" />
      <div className="hero-orb animate-float-slow bottom-[-30px] left-20 h-28 w-28 bg-gold/30" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-teal/90 sm:tracking-[0.34em]">{isAuth ? "Workflow Preview" : "Live Studio"}</p>
            <h3 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{isAuth ? "Launch delivery without chaos" : "Real-time operating view"}</h3>
          </div>
          <div className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs text-slate-200">Socket-driven</div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-100">Program Radar</p>
              <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">+18% flow</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-center text-sm sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-3 py-4">
                <p className="text-2xl font-semibold">42</p>
                <p className="mt-1 text-slate-300">Tasks</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-4">
                <p className="text-2xl font-semibold">8</p>
                <p className="mt-1 text-slate-300">Projects</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-4">
                <p className="text-2xl font-semibold">94%</p>
                <p className="mt-1 text-slate-300">On track</p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-[1.4rem] bg-slate-950/40 p-4">
              <svg viewBox="0 0 360 160" className="h-28 w-full sm:h-32">
                <defs>
                  <linearGradient id="chartStroke" x1="0" x2="1">
                    <stop offset="0%" stopColor="#f2c14e" />
                    <stop offset="50%" stopColor="#ff6b4a" />
                    <stop offset="100%" stopColor="#0f8b8d" />
                  </linearGradient>
                </defs>
                <path d="M20 130 C60 120, 75 92, 110 98 S170 148, 205 102 S280 45, 340 58" fill="none" stroke="url(#chartStroke)" strokeWidth="8" strokeLinecap="round" />
                <circle cx="110" cy="98" r="6" fill="#f2c14e" />
                <circle cx="205" cy="102" r="6" fill="#ff6b4a" />
                <circle cx="340" cy="58" r="6" fill="#0f8b8d" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="animate-rise-delay-1 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <img
                alt="Team collaboration board"
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'><rect width='600' height='420' rx='36' fill='%23f8fafc'/><rect x='36' y='36' width='528' height='348' rx='28' fill='%23e2e8f0'/><rect x='60' y='70' width='220' height='120' rx='20' fill='%23ff6b4a'/><rect x='300' y='70' width='240' height='56' rx='18' fill='%230f8b8d'/><rect x='300' y='144' width='190' height='46' rx='18' fill='%23f2c14e'/><rect x='60' y='220' width='480' height='120' rx='24' fill='%23101626'/><circle cx='124' cy='280' r='28' fill='%23f2c14e'/><circle cx='208' cy='280' r='28' fill='%23ff6b4a'/><circle cx='292' cy='280' r='28' fill='%230f8b8d'/><rect x='344' y='256' width='150' height='18' rx='9' fill='%23cbd5e1'/><rect x='344' y='286' width='110' height='18' rx='9' fill='%2394a3b8'/></svg>"
                className="h-32 w-full rounded-[1.2rem] object-cover sm:h-36"
              />
            </div>
            <div className="animate-rise-delay-2 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-medium text-slate-100">Signal Feed</p>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/10 px-4 py-3">Task assigned to Design Squad</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Milestone review moved to Friday 10:00</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Delivery health remains stable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
