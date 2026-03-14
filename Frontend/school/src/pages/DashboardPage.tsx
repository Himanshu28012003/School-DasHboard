import type { FormEvent } from "react";
import { useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import AddStudentForm from "../components/dashboard/AddStudentForm";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Leaderboard from "../components/dashboard/Leaderboard";
import MarksEntryForm from "../components/dashboard/MarksEntryForm";
import ResultsTable from "../components/dashboard/ResultsTable";
import SectionComparisonChart from "../components/dashboard/SectionComparisonChart";
import StatsOverview from "../components/dashboard/StatsOverview";
import StudentProgressChart from "../components/dashboard/StudentProgressChart";
import Modal from "../components/common/Modal";
import type {
  MarksFormState,
  ProgressPoint,
  Result,
  SectionComparison,
  Student,
  StudentFormState,
} from "../types";

type DashboardPageProps = {
  loggedInUser: string;
  totalStudents: number;
  totalResults: number;
  loading: boolean;
  message: string;
  error: string;
  students: Student[];
  results: Result[];
  studentForm: StudentFormState;
  marksForm: MarksFormState;
  progressStudentId: string;
  progressData: ProgressPoint[];
  progressLoading: boolean;
  chartClassName: string;
  classOptions: string[];
  sectionComparisonData: SectionComparison[];
  sectionComparisonLoading: boolean;
  onLogout: () => void;
  onRefresh: () => void;
  onProgressStudentChange: (studentId: string) => void;
  onChartClassChange: (className: string) => void;
  onStudentFormChange: (field: keyof StudentFormState, value: string) => void;
  onMarksFormChange: (field: keyof MarksFormState, value: string) => void;
  onAddStudent: (event: FormEvent) => Promise<void> | void;
  onSaveMarks: (event: FormEvent) => Promise<void> | void;
};

function DashboardPage({
  loggedInUser,
  totalStudents,
  totalResults,
  loading,
  message,
  error,
  students,
  results,
  studentForm,
  marksForm,
  progressStudentId,
  progressData,
  progressLoading,
  chartClassName,
  classOptions,
  sectionComparisonData,
  sectionComparisonLoading,
  onLogout,
  onRefresh,
  onProgressStudentChange,
  onChartClassChange,
  onStudentFormChange,
  onMarksFormChange,
  onAddStudent,
  onSaveMarks,
}: DashboardPageProps) {
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);

  return (
    <div className="min-h-screen text-slate-800">
      <div className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-6 lg:px-10">
        <DashboardHeader loggedInUser={loggedInUser} onLogout={onLogout} />
        <StatsOverview totalStudents={totalStudents} totalResults={totalResults} />
        <AlertMessage message={message} error={error} className="mb-6" />

        <section className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowAddStudentModal(true)}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-500 hover:to-teal-500"
          >
            + Add Student
          </button>
          <button
            type="button"
            onClick={() => setShowMarksModal(true)}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-500 hover:to-sky-500"
          >
            + Add Marks
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Refresh Data
          </button>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <StudentProgressChart
            students={students}
            selectedStudentId={progressStudentId}
            onStudentChange={onProgressStudentChange}
            progress={progressData}
            loading={progressLoading}
          />
          <SectionComparisonChart
            classOptions={classOptions}
            selectedClass={chartClassName}
            onClassChange={onChartClassChange}
            data={sectionComparisonData}
            loading={sectionComparisonLoading}
          />
        </section>

        <ResultsTable loading={loading} results={results} onRefresh={onRefresh} />
        <Leaderboard results={results} />
        <Modal
          open={showAddStudentModal}
          title="Add Student"
          onClose={() => setShowAddStudentModal(false)}
        >
          <AddStudentForm
            form={studentForm}
            onSubmit={async (event) => {
              await onAddStudent(event);
              setShowAddStudentModal(false);
            }}
            onChange={onStudentFormChange}
            variant="plain"
          />
        </Modal>

        <Modal
          open={showMarksModal}
          title="Add Marks"
          onClose={() => setShowMarksModal(false)}
        >
          <MarksEntryForm
            form={marksForm}
            students={students}
            onSubmit={async (event) => {
              await onSaveMarks(event);
              setShowMarksModal(false);
            }}
            onChange={onMarksFormChange}
            variant="plain"
          />
        </Modal>
      </div>
    </div>
  );
}

export default DashboardPage;
