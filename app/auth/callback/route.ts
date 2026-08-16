import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  const redirectPath =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/account";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/auth-code-error", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase auth callback error:", error);

    return NextResponse.redirect(
      new URL("/auth/auth-code-error", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL(redirectPath, requestUrl.origin)
  );
};