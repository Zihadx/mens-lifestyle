import Link from "next/link";
import { siteConfig } from "@/config/site";

interface AuthShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <Link href="/" className="mb-8 text-center font-display text-2xl font-semibold">
        {siteConfig.name}
      </Link>
      <div className="rounded-lg border border-border p-6 sm:p-8">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="font-display text-xl font-medium">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
      {footer ? <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p> : null}
    </div>
  );
}
