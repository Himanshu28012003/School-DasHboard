import type { FormEvent } from "react";
import type { StudentFormState } from "../../types";

type AddStudentFormProps = {
  form: StudentFormState;
  onSubmit: (event: FormEvent) => void;
  onChange: (field: keyof StudentFormState, value: string) => void;
  variant?: "card" | "plain";
};

function AddStudentForm({ form, onSubmit, onChange, variant = "card" }: AddStudentFormProps) {
  const containerClass =
    variant === "card" ? "rounded-2xl bg-white p-6 shadow-sm" : "p-0";

  return (
    <form onSubmit={onSubmit} className={containerClass}>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Add Student</h2>
      <p className="mt-1 text-sm text-slate-500">Create a student profile with class and section details.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student Name</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Enter full name"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Roll Number</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="e.g. 12"
            type="number"
            value={form.rollNumber}
            onChange={(event) => onChange("rollNumber", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="e.g. 10"
            value={form.className}
            onChange={(event) => onChange("className", event.target.value)}
            required
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Section</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="e.g. A"
            value={form.section}
            onChange={(event) => onChange("section", event.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-500 hover:to-teal-500"
      >
        Save Student
      </button>
    </form>
  );
}

export default AddStudentForm;
