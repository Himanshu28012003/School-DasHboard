import { useMemo, useState } from "react";
import type { Result } from "../../types";

type LeaderboardMode = "class" | "section";

type LeaderboardProps = {
  results: Result[];
};

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const RANK_BG: Record<number, string> = {
  1: "from-yellow-50 border-yellow-200",
  2: "from-slate-50 border-slate-200",
  3: "from-orange-50 border-orange-200",
};

function Leaderboard({ results }: LeaderboardProps) {
  const [mode, setMode] = useState<LeaderboardMode>("class");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  const withMarks = useMemo(
    () => results.filter((r) => r.percentage !== null),
    [results]
  );

  const classOptions = useMemo(() => {
    const classes = new Set<string>();
    withMarks.forEach((r) => { if (r.className) classes.add(r.className); });
    return Array.from(classes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [withMarks]);

  const sectionOptions = useMemo(() => {
    const sections = new Set<string>();
    withMarks
      .filter((r) => selectedClass === "all" || r.className === selectedClass)
      .forEach((r) => { if (r.section) sections.add(r.section); });
    return Array.from(sections).sort((a, b) => a.localeCompare(b));
  }, [withMarks, selectedClass]);

  // Groups: each group has a label and a sorted list of students with rank
  const groups = useMemo(() => {
    const buckets = new Map<string, Result[]>();

    if (mode === "class") {
      if (selectedClass !== "all") {
        // Single class selected
        const filtered = withMarks.filter((r) => r.className === selectedClass);
        buckets.set(`Class ${selectedClass}`, filtered);
      } else {
        // All classes — one bucket per class
        for (const r of withMarks) {
          const key = `Class ${r.className}`;
          if (!buckets.has(key)) buckets.set(key, []);
          buckets.get(key)!.push(r);
        }
      }
    } else {
      // Section mode
      const filtered = withMarks.filter(
        (r) =>
          (selectedClass === "all" || r.className === selectedClass) &&
          (selectedSection === "all" || r.section === selectedSection)
      );
      if (selectedClass !== "all" && selectedSection !== "all") {
        buckets.set(`Class ${selectedClass} — Section ${selectedSection}`, filtered);
      } else if (selectedClass !== "all") {
        // All sections of a class
        for (const r of filtered) {
          const key = `Class ${r.className} — Section ${r.section}`;
          if (!buckets.has(key)) buckets.set(key, []);
          buckets.get(key)!.push(r);
        }
      } else {
        // All classes, all sections
        for (const r of filtered) {
          const key = `Class ${r.className} — Section ${r.section}`;
          if (!buckets.has(key)) buckets.set(key, []);
          buckets.get(key)!.push(r);
        }
      }
    }

    // Sort each bucket by percentage desc and assign local rank
    const result: { label: string; entries: { student: Result; rank: number }[] }[] = [];
    const sortedKeys = Array.from(buckets.keys()).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    for (const key of sortedKeys) {
      const sorted = (buckets.get(key) ?? []).sort(
        (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
      );
      let rank = 1;
      const entries = sorted.map((student, index) => {
        if (index > 0 && student.percentage !== sorted[index - 1].percentage) {
          rank = index + 1;
        }
        return { student, rank };
      });
      result.push({ label: key, entries });
    }

    return result;
  }, [withMarks, mode, selectedClass, selectedSection]);

  const gradeColor = (grade: string | null) => {
    switch (grade) {
      case "A+": return "text-emerald-600 bg-emerald-50";
      case "A":  return "text-green-600 bg-green-50";
      case "B":  return "text-blue-600 bg-blue-50";
      case "C":  return "text-amber-600 bg-amber-50";
      default:   return "text-red-600 bg-red-50";
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200 backdrop-blur sm:p-7">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Leaderboard</h2>
          <p className="mt-1 text-sm text-slate-500">Track top performers by class and section.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium">
          <button
            type="button"
            onClick={() => { setMode("class"); setSelectedSection("all"); }}
            className={`px-4 py-2 transition-colors ${
              mode === "class"
                ? "bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Class-wise
          </button>
          <button
            type="button"
            onClick={() => setMode("section")}
            className={`px-4 py-2 transition-colors ${
              mode === "section"
                ? "bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Section-wise
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={selectedClass}
          onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection("all"); }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        >
          <option value="all">All Classes</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>

        {mode === "section" && (
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Sections</option>
            {sectionOptions.map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        )}
      </div>

      {/* Leaderboard groups */}
      {groups.length === 0 ? (
        <p className="text-sm text-slate-400">No results to display yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {groups.map(({ label, entries }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
              {/* Group header */}
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
                {label}
              </h3>

              {/* Entries */}
              <ol className="space-y-2">
                {entries.map(({ student, rank }) => (
                  <li
                    key={student.id}
                    className={`flex items-center gap-3 rounded-lg border bg-gradient-to-r px-3 py-2.5 ${
                      RANK_BG[rank] ?? "from-white border-slate-100"
                    }`}
                  >
                    {/* Rank badge */}
                    <span className="flex w-8 shrink-0 items-center justify-center text-lg">
                      {rank <= 3 ? MEDAL[rank] : (
                        <span className="text-xs font-semibold text-slate-400">#{rank}</span>
                      )}
                    </span>

                    {/* Name & class info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Roll {student.rollNumber} · {student.className}{student.section}
                      </p>
                    </div>

                    {/* Percentage */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">
                        {student.percentage}%
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColor(student.grade)}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
