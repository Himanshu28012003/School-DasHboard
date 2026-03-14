type DashboardHeaderProps = {
  loggedInUser: string;
  onLogout: () => void;
};

function DashboardHeader({ loggedInUser, onLogout }: DashboardHeaderProps) {
  return (
    <header className="mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200 backdrop-blur sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Teacher Workspace
          </p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Student Result Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Add students, enter subject marks, and view automatic total, percentage, and grade.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
            Hi, {loggedInUser}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
