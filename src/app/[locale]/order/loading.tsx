export default function OrderLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-6 rounded-lg border border-border bg-card p-6">
          <div className="h-12 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="flex justify-end gap-4">
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
