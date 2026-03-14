import type { FormEvent } from "react";
import type { MarksFormState, Student } from "../../types";

type MarksEntryFormProps = {
  form: MarksFormState;
  students: Student[];
  onSubmit: (event: FormEvent) => void;
  onChange: (field: keyof MarksFormState, value: string) => void;
};

function MarksEntryForm({ form, students, onSubmit, onChange }: MarksEntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Enter Marks</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <select
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 sm:col-span-2"
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
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Maths"
          type="number"
          min={0}
          max={100}
          value={form.maths}
          onChange={(event) => onChange("maths", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Science"
          type="number"
          min={0}
          max={100}
          value={form.science}
          onChange={(event) => onChange("science", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="English"
          type="number"
          min={0}
          max={100}
          value={form.english}
          onChange={(event) => onChange("english", event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Computer"
          type="number"
          min={0}
          max={100}
          value={form.computer}
          onChange={(event) => onChange("computer", event.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500"
      >
        Save Marks & Calculate Result
      </button>
    </form>
  );
}

export default MarksEntryForm;
