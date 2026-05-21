const variants = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function Alert({ children, variant = 'error', onClose, className = '' }) {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${variants[variant]} ${className}`}
      role="alert"
    >
      <div>{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
