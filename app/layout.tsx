import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/content-queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";
  const headline = profile?.headline ?? "";
  const summary = profile?.summary ?? "";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} — ${headline}`,
      template: `%s — ${name}`,
    },
    description: summary,
    keywords: [
      "Sathwik Kothapalli",
      "Software Engineer",
      "Backend Developer",
      "AI Engineer",
      "Python Developer",
      "FastAPI",
      "Cisco",
    ],
    authors: [{ name }],
    openGraph: {
      type: "website",
      url: siteUrl,
      title: `${name} — ${headline}`,
      description: summary,
      siteName: name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${headline}`,
      description: summary,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


