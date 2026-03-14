type DashboardHeaderProps = {
  loggedInUser: string;
  onLogout: () => void;
};

function DashboardHeader({ loggedInUser, onLogout }: DashboardHeaderProps) {
  return (
    <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Student Result Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Add students, enter subject marks, and view automatic total, percentage, and grade.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Hi, {loggedInUser}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
