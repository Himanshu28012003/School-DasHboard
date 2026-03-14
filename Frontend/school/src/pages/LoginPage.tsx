import type { FormEvent } from "react";
import AuthShell from "../components/auth/AuthShell";
import AlertMessage from "../components/common/AlertMessage";
import type { AuthFormState, AuthMode } from "../types";

type LoginPageProps = {
  authMode: AuthMode;
  form: AuthFormState;
  message: string;
  error: string;
  onModeChange: (mode: AuthMode) => void;
  onFormChange: (field: keyof AuthFormState, value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

function LoginPage({ authMode, form, message, error, onModeChange, onFormChange, onSubmit }: LoginPageProps) {
  return (
    <AuthShell
      authMode={authMode}
      onModeChange={onModeChange}
      title="Welcome back"
      subtitle="Sign in to continue to dashboard"
    >
      <AlertMessage message={message} error={error} className="mb-4" />
      <form onSubmit={onSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-500 hover:to-sky-500"
        >
          Login
        </button>
        <p className="text-center text-sm text-slate-500">
          Not registered?{" "}
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className="font-semibold text-indigo-600 transition hover:text-sky-600"
          >
            Register
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
