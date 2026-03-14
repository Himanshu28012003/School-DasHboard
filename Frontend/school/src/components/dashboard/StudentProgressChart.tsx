import { useMemo } from "react";
import type { ProgressPoint, Student } from "../../types";

type StudentProgressChartProps = {
  students: Student[];
  selectedStudentId: string;
  onStudentChange: (studentId: string) => void;
  progress: ProgressPoint[];
  loading: boolean;
};

function StudentProgressChart({
  students,
  selectedStudentId,
  onStudentChange,
  progress,
  loading,
}: StudentProgressChartProps) {
  const selectedStudent = students.find((student) => String(student.id) === selectedStudentId);

  const chartPoints = useMemo(() => {
    if (progress.length === 0) return "";
    return progress
      .map((item, index) => {
        const x = progress.length === 1 ? 20 : 20 + (index * 260) / (progress.length - 1);
        const y = 120 - (item.percentage / 100) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [progress]);

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200 backdrop-blur sm:p-7">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Student Progress</h2>
          <p className="mt-1 text-sm text-slate-500">View growth across multiple exam attempts.</p>
        </div>
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={selectedStudentId}
          onChange={(event) => onStudentChange(event.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} (Roll {student.rollNumber})
            </option>
          ))}
        </select>
      </div>

      {!selectedStudentId ? (
        <p className="text-sm text-slate-500">Select a student to view progress.</p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading progress...</p>
      ) : progress.length === 0 ? (
        <p className="text-sm text-slate-500">No marks history available yet.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">
            {selectedStudent?.name} · {selectedStudent?.className}
            {selectedStudent?.section}
          </p>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 300 140" className="h-40 w-full min-w-[300px]">
              <line x1="20" y1="20" x2="20" y2="120" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="20" y1="120" x2="280" y2="120" stroke="#cbd5e1" strokeWidth="1" />
              <polyline fill="none" stroke="#4f46e5" strokeWidth="3" points={chartPoints} />
              {progress.map((item, index) => {
                const x = progress.length === 1 ? 20 : 20 + (index * 260) / (progress.length - 1);
                const y = 120 - (item.percentage / 100) * 100;
                return (
                  <g key={item.attemptNo}>
                    <circle cx={x} cy={y} r="4" fill="#4f46e5" />
                    <text x={x} y={136} textAnchor="middle" fontSize="9" fill="#64748b">
                      A{item.attemptNo}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
            {progress.map((item) => (
              <div key={item.attemptNo} className="rounded-lg bg-slate-50 px-2 py-1">
                Attempt {item.attemptNo}: <span className="font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default StudentProgressChart;
