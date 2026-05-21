export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-600 to-primary-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
            TF
          </span>
          <span className="text-xl font-semibold">TaskFlow</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Enterprise task management for microservice architectures
          </h2>
          <p className="mt-4 max-w-md text-primary-100">
            Built to integrate with Express services, Kafka events, Kubernetes ingress, Redis,
            and PostgreSQL.
          </p>
        </div>
        <p className="text-sm text-primary-200">© 2026 TaskFlow</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
              TF
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
