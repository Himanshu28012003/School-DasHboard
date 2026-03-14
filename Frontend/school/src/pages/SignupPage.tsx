import type { FormEvent } from "react";
import AuthShell from "../components/auth/AuthShell";
import AlertMessage from "../components/common/AlertMessage";
import type { AuthFormState, AuthMode } from "../types";

type SignupPageProps = {
  authMode: AuthMode;
  form: AuthFormState;
  message: string;
  error: string;
  onModeChange: (mode: AuthMode) => void;
  onFormChange: (field: keyof AuthFormState, value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

function SignupPage({ authMode, form, message, error, onModeChange, onFormChange, onSubmit }: SignupPageProps) {
  return (
    <AuthShell
      authMode={authMode}
      onModeChange={onModeChange}
      title="Create account"
      subtitle="Sign up to start managing student results"
    >
      <AlertMessage message={message} error={error} className="mb-4" />
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={form.fullName}
          onChange={(event) => onFormChange("fullName", event.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={form.email}
          onChange={(event) => onFormChange("email", event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={form.password}
          onChange={(event) => onFormChange("password", event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={form.confirmPassword}
          onChange={(event) => onFormChange("confirmPassword", event.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-500 hover:to-sky-500"
        >
          Create Account
        </button>
      </form>
    </AuthShell>
  );
}

export default SignupPage;
