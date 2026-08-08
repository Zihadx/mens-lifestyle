import { AccountNav } from "@/features/account/components/account-nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-10">
      <h1 className="mb-8 font-display text-3xl font-medium tracking-tight">My Account</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
