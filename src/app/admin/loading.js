export default function AdminLoading() {
  return <div role="status" aria-live="polite" className="animate-pulse" aria-label="Yönetim paneli yükleniyor">
    <div className="h-9 w-64 rounded-lg bg-slate-200" />
    <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-44 rounded-2xl bg-white shadow-sm" />)}
    </div>
    <span className="sr-only">Yükleniyor...</span>
  </div>;
}
