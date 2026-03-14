import type { FormEvent } from "react";
import type { MarksFormState, Student } from "../../types";

type MarksEntryFormProps = {
  form: MarksFormState;
  students: Student[];
  onSubmit: (event: FormEvent) => void;
  onChange: (field: keyof MarksFormState, value: string) => void;
  variant?: "card" | "plain";
};

function MarksEntryForm({
  form,
  students,
  onSubmit,
  onChange,
  variant = "card",
}: MarksEntryFormProps) {
  const containerClass =
    variant === "card" ? "rounded-2xl bg-white p-6 shadow-sm" : "p-0";

  return (
    <form onSubmit={onSubmit} className={containerClass}>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Enter Marks</h2>
      <p className="mt-1 text-sm text-slate-500">Add a new performance attempt for a selected student.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student</span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            value={form.studentId}
            onChange={(event) => onChange("studentId", event.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} (Roll {student.rollNumber})
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Maths</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="0 - 100"
            type="number"
            min={0}
            max={100}
            value={form.maths}
            onChange={(event) => onChange("maths", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Science</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="0 - 100"
            type="number"
            min={0}
            max={100}
            value={form.science}
            onChange={(event) => onChange("science", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">English</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="0 - 100"
            type="number"
            min={0}
            max={100}
            value={form.english}
            onChange={(event) => onChange("english", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Computer</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="0 - 100"
            type="number"
            min={0}
            max={100}
            value={form.computer}
            onChange={(event) => onChange("computer", event.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-500 hover:to-sky-500"
      >
        Save Marks & Calculate Result
      </button>
    </form>
  );
}

export default MarksEntryForm;
