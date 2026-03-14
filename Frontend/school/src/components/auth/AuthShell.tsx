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
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-2xl backdrop-blur-md lg:grid-cols-2">
        <AuthHero />
        <div className="p-6 sm:p-10 lg:p-12">
          <AuthTabs authMode={authMode} onChange={onModeChange} />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
