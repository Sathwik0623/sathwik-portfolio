import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/analytics/AppProviders";
import { getProfile, getPublicCodingProfiles } from "@/lib/content-queries";

// Always read fresh content so an admin publish shows up immediately, no rebuild/redeploy needed.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, codingProfiles] = await Promise.all([getProfile(), getPublicCodingProfiles()]);
  const name = profile?.name ?? "Portfolio";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: profile?.headline,
    description: profile?.summary,
    address: profile?.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    sameAs: codingProfiles.map((l) => l.url),
  };

  return (
    <AppProviders>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar name={name} />
      <main className="flex-1">{children}</main>
      <Footer name={name} email={profile?.email ?? ""} codingProfiles={codingProfiles} />
    </AppProviders>
  );
}

