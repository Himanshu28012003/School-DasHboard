function AuthHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-indigo-600 to-violet-700 p-8 text-white sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-2xl" />

      <div className="relative">
        <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
          Smart School Suite
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
          Student Performance Dashboard
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-sky-100 sm:text-base">
          Manage students, track multiple exam attempts, compare classes by section, and
          generate report cards in a single beautiful workspace.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur">
            <p className="text-xl font-bold">24/7</p>
            <p className="mt-1 text-[11px] text-sky-100">Access</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur">
            <p className="text-xl font-bold">Auto</p>
            <p className="mt-1 text-[11px] text-sky-100">Ranking</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur">
            <p className="text-xl font-bold">PDF</p>
            <p className="mt-1 text-[11px] text-sky-100">Reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthHero;
