import type { AuthMode } from "../../types";

type AuthTabsProps = {
  authMode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

function AuthTabs({ authMode, onChange }: AuthTabsProps) {
  return (
    <div className="mb-8 flex rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`w-1/2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          authMode === "login"
            ? "bg-white text-indigo-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onChange("signup")}
        className={`w-1/2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          authMode === "signup"
            ? "bg-white text-indigo-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}

export default AuthTabs;
