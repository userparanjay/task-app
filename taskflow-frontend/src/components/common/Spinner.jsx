const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function Spinner({ size = 'md', label }) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-primary-200 border-t-primary-600`}
      />
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  );
}
