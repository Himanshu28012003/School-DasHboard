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
        <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div>
      ) : null}
      {error ? (
        <div className={`${message ? "mt-3 " : ""}rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800`}>
          {error}
        </div>
      ) : null}
    </section>
  );
}

export default AlertMessage;
