"use client";

import { useState, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { store, persistor } from "@/store/index";
import { PreviewAutoSession } from "@/components/shared/preview-auto-session";

/**
 * next-themes renders an inline <script> to set the theme class before
 * hydration, avoiding a flash of the wrong theme. React 19 warns about any
 * <script> rendered inside a component tree — that warning is a false
 * positive here (the script still runs correctly during SSR). next-themes
 * hasn't shipped a fix, so this is the maintainer-recommended workaround:
 * filter just that one console.error message in development.
 * See: https://github.com/pacocoursey/next-themes/issues/385
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    originalConsoleError.apply(console, args);
  };
}

function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-center" richColors closeButton />
            <PreviewAutoSession />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
