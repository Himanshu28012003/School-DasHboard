type AlertMessageProps = {
  message?: string;
  error?: string;
  className?: string;
};

function AlertMessage({ message, error, className = "" }: AlertMessageProps) {
  if (!message && !error) return null;

  return (
    <section className={className}>
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div
          className={`${message ? "mt-3 " : ""}rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700`}
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}

export default AlertMessage;
