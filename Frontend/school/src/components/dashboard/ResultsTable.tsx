import { useMemo, useState } from "react";
import { API_BASE_URL } from "../../constants";
import type { Result } from "../../types";

type ResultsTableProps = {
  loading: boolean;
  results: Result[];
  onRefresh: () => void;
};

function DownloadButton({ studentId, name }: { studentId: number; name: string }) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/results/${studentId}/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `result_${name.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not download PDF. Make sure marks are entered for this student.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      title="Download Result Card PDF"
      className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50"
    >
      {busy ? (
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {busy ? "Generating…" : "PDF"}
    </button>
  );
}

function ResultsTable({ loading, results, onRefresh }: ResultsTableProps) {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  const classOptions = useMemo(() => {
    const classes = new Set<string>();
    results.forEach((result) => {
      if (result.className) {
        classes.add(result.className);
      }
    });
    return Array.from(classes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [results]);

  const sectionOptions = useMemo(() => {
    const sections = new Set<string>();
    results
      .filter((result) => selectedClass === "all" || result.className === selectedClass)
      .forEach((result) => {
        if (result.section) {
          sections.add(result.section);
        }
      });
    return Array.from(sections).sort((a, b) => a.localeCompare(b));
  }, [results, selectedClass]);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const classMatch = selectedClass === "all" || result.className === selectedClass;
      const sectionMatch = selectedSection === "all" || result.section === selectedSection;
      return classMatch && sectionMatch;
    });
  }, [results, selectedClass, selectedSection]);

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200 backdrop-blur sm:p-7">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Result Cards</h2>
          <p className="mt-1 text-sm text-slate-500">Filter by class and section to analyze performance quickly.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedClass}
            onChange={(event) => {
              setSelectedClass(event.target.value);
              setSelectedSection("all");
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Classes</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>
                Class {className}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(event) => setSelectedSection(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Sections</option>
            {sectionOptions.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : filteredResults.length === 0 ? (
        <p className="text-slate-500">No students available yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/90">
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-3 py-2">Rank</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Roll</th>
                <th className="px-3 py-2">Class</th>
                <th className="px-3 py-2">Maths</th>
                <th className="px-3 py-2">Science</th>
                <th className="px-3 py-2">English</th>
                <th className="px-3 py-2">Computer</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">%</th>
                <th className="px-3 py-2">Grade</th>
                <th className="px-3 py-2">Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => {
                const displayRank =
                  selectedClass !== "all" && selectedSection !== "all"
                    ? result.sectionRank
                    : selectedClass !== "all"
                    ? result.classRank
                    : result.overallRank;
                const medalClass =
                  displayRank === 1
                    ? "bg-yellow-100 text-yellow-700 font-bold"
                    : displayRank === 2
                    ? "bg-slate-200 text-slate-700 font-bold"
                    : displayRank === 3
                    ? "bg-orange-100 text-orange-700 font-bold"
                    : "text-slate-500";
                return (
                <tr key={result.id} className="border-b border-slate-100 bg-white/80 transition hover:bg-indigo-50/40">
                  <td className="px-3 py-3">
                    {displayRank !== null ? (
                      <span className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-xs ${medalClass}`}>
                        {displayRank === 1 ? "🥇" : displayRank === 2 ? "🥈" : displayRank === 3 ? "🥉" : `#${displayRank}`}
                      </span>
                    ) : ("-")}
                  </td>
                  <td className="px-3 py-3 font-medium">{result.name}</td>
                  <td className="px-3 py-3">{result.rollNumber}</td>
                  <td className="px-3 py-3">
                    {result.className}
                    {result.section}
                  </td>
                  <td className="px-3 py-3">{result.marks?.maths ?? "-"}</td>
                  <td className="px-3 py-3">{result.marks?.science ?? "-"}</td>
                  <td className="px-3 py-3">{result.marks?.english ?? "-"}</td>
                  <td className="px-3 py-3">{result.marks?.computer ?? "-"}</td>
                  <td className="px-3 py-3">{result.total ?? "-"}</td>
                  <td className="px-3 py-3">{result.percentage !== null ? `${result.percentage}%` : "-"}</td>
                  <td className="px-3 py-3">
                    {result.grade ? (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {result.grade}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {result.total !== null ? (
                      <DownloadButton studentId={result.id} name={result.name} />
                    ) : (
                      <span className="text-xs text-slate-400">No marks</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ResultsTable;
