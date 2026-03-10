import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppBar } from "@/components/app-bar";
import { ImportSheetRulesDialog } from "@/components/import-sheet-rules-dialog";
import { ImportSheetRulesDialogProvider } from "@/context/import-sheet-rules-dialog-context";

import "./globals.css";

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "ASIN Harvest | Extract Amazon product data across all marketplaces",
  description:
    "Automated product data retrieval across all Amazon marketplaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ImportSheetRulesDialogProvider> */}
          <AppBar />
          {children}
          {/* </ImportSheetRulesDialogProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
