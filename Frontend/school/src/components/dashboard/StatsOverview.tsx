type StatsOverviewProps = {
  totalStudents: number;
  totalResults: number;
};

function StatsOverview({ totalStudents, totalResults }: StatsOverviewProps) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total Students</p>
        <p className="mt-2 text-3xl font-semibold">{totalStudents}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Results Generated</p>
        <p className="mt-2 text-3xl font-semibold">{totalResults}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Pending Results</p>
        <p className="mt-2 text-3xl font-semibold">{Math.max(totalStudents - totalResults, 0)}</p>
      </div>
    </section>
  );
}

export default StatsOverview;
