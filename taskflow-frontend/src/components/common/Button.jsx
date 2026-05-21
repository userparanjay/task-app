const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary:
    'bg-white text-slate-700 border border-border hover:bg-slate-50 focus:ring-slate-300',
  danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-400',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
