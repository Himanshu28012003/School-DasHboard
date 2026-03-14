import type { FormEvent } from "react";
import AlertMessage from "../components/common/AlertMessage";
import AddStudentForm from "../components/dashboard/AddStudentForm";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Leaderboard from "../components/dashboard/Leaderboard";
import MarksEntryForm from "../components/dashboard/MarksEntryForm";
import ResultsTable from "../components/dashboard/ResultsTable";
import StatsOverview from "../components/dashboard/StatsOverview";
import type { MarksFormState, Result, Student, StudentFormState } from "../types";

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
  onLogout: () => void;
  onRefresh: () => void;
  onStudentFormChange: (field: keyof StudentFormState, value: string) => void;
  onMarksFormChange: (field: keyof MarksFormState, value: string) => void;
  onAddStudent: (event: FormEvent) => void;
  onSaveMarks: (event: FormEvent) => void;
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
  onLogout,
  onRefresh,
  onStudentFormChange,
  onMarksFormChange,
  onAddStudent,
  onSaveMarks,
}: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader loggedInUser={loggedInUser} onLogout={onLogout} />
        <StatsOverview totalStudents={totalStudents} totalResults={totalResults} />
        <AlertMessage message={message} error={error} className="mb-6" />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AddStudentForm
            form={studentForm}
            onSubmit={onAddStudent}
            onChange={onStudentFormChange}
          />
          <MarksEntryForm
            form={marksForm}
            students={students}
            onSubmit={onSaveMarks}
            onChange={onMarksFormChange}
          />
        </section>

        <ResultsTable loading={loading} results={results} onRefresh={onRefresh} />
        <Leaderboard results={results} />
      </div>
    </div>
  );
}

export default DashboardPage;
