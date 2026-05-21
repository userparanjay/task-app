export default function Textarea({ label, id, error, className = '', ...props }) {
  const textareaId = id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={4}
        className={`resize-y rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-danger' : 'border-border focus:border-primary-500'
        }`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
