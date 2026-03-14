import type { SectionComparison } from "../../types";

type SectionComparisonChartProps = {
  classOptions: string[];
  selectedClass: string;
  onClassChange: (className: string) => void;
  data: SectionComparison[];
  loading: boolean;
};

function SectionComparisonChart({
  classOptions,
  selectedClass,
  onClassChange,
  data,
  loading,
}: SectionComparisonChartProps) {
  const maxValue = data.length > 0 ? Math.max(...data.map((item) => item.averagePercentage), 100) : 100;

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200 backdrop-blur sm:p-7">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Class vs Sections</h2>
          <p className="mt-1 text-sm text-slate-500">Compare average section performance within a class.</p>
        </div>
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={selectedClass}
          onChange={(event) => onClassChange(event.target.value)}
        >
          <option value="">Select Class</option>
          {classOptions.map((className) => (
            <option key={className} value={className}>
              Class {className}
            </option>
          ))}
        </select>
      </div>

      {!selectedClass ? (
        <p className="text-sm text-slate-500">Select a class to compare sections.</p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading section comparison...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-slate-500">No section data available for this class.</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const width = Math.max(6, (item.averagePercentage / maxValue) * 100);
            return (
              <div key={item.section}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Section {item.section}</span>
                  <span className="text-slate-500">Avg {item.averagePercentage}% · {item.studentCount} students</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SectionComparisonChart;
