import type { ReactNode } from "react";
import AuthHero from "./AuthHero";
import AuthTabs from "./AuthTabs";
import type { AuthMode } from "../../types";

type AuthShellProps = {
  authMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AuthShell({ authMode, onModeChange, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-lg lg:grid-cols-2">
        <AuthHero />
        <div className="p-6 sm:p-10">
          <AuthTabs authMode={authMode} onChange={onModeChange} />
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
