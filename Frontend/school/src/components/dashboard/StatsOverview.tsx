type StatsOverviewProps = {
  totalStudents: number;
  totalResults: number;
};

function StatsOverview({ totalStudents, totalResults }: StatsOverviewProps) {
  const pendingResults = Math.max(totalStudents - totalResults, 0);

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Total Students</p>
        <p className="mt-2 text-3xl font-black text-slate-900">{totalStudents}</p>
        <p className="mt-2 text-xs text-slate-500">All students registered in the dashboard</p>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Results Generated</p>
        <p className="mt-2 text-3xl font-black text-slate-900">{totalResults}</p>
        <p className="mt-2 text-xs text-slate-500">Students with calculated result and grade</p>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Results</p>
        <p className="mt-2 text-3xl font-black text-slate-900">{pendingResults}</p>
        <p className="mt-2 text-xs text-slate-500">Students waiting for marks entry</p>
      </div>
    </section>
  );
}

export default StatsOverview;
