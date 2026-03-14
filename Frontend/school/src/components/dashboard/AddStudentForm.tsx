import type { FormEvent } from "react";
import type { StudentFormState } from "../../types";

type AddStudentFormProps = {
  form: StudentFormState;
  onSubmit: (event: FormEvent) => void;
  onChange: (field: keyof StudentFormState, value: string) => void;
};

function AddStudentForm({ form, onSubmit, onChange }: AddStudentFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Add Student</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Student Name"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Roll Number"
          type="number"
          value={form.rollNumber}
          onChange={(event) => onChange("rollNumber", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Class"
          value={form.className}
          onChange={(event) => onChange("className", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Section"
          value={form.section}
          onChange={(event) => onChange("section", event.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-slate-800 px-4 py-2.5 font-medium text-white hover:bg-slate-700"
      >
        Save Student
      </button>
    </form>
  );
}

export default AddStudentForm;
