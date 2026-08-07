import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Foundation build</p>
      <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{siteConfig.name}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{siteConfig.tagline}</p>
      <p className="mt-6 max-w-lg text-xs text-muted-foreground">
        Milestone 01 (project foundation) is wired up: Next.js App Router, TypeScript strict mode, Tailwind design
        tokens, Redux + Redux Persist, TanStack Query, next-themes, and Sonner. The premium homepage arrives in
        Milestone 06.
      </p>
    </main>
  );
}
