import type { AuthMode } from "../../types";

type AuthTabsProps = {
  authMode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

function AuthTabs({ authMode, onChange }: AuthTabsProps) {
  return (
    <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
          authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onChange("signup")}
        className={`w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
          authMode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}

export default AuthTabs;
