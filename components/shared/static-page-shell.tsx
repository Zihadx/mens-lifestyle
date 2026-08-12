export function StaticPageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 font-display text-3xl font-medium tracking-tight">{title}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  );
}
