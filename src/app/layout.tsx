import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { CommandPalette } from "@/components/command-palette";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hotelzz Dashboard",
  description: "Hotel management dashboard with real-time analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${sourceSans.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="hotel-dashboard-theme">
          <QueryProvider>
            <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
              <Sidebar />
              <main className="ml-64 flex-1">
                <Header />
                <div className="p-8">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </main>
            </div>
            <Toaster position="top-right" richColors closeButton />
            <CommandPalette />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
