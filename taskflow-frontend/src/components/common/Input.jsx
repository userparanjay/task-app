export default function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-danger' : 'border-border focus:border-primary-500'
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
