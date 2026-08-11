"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Trophy,
  ShieldCheck,
  Code2,
  GraduationCap,
  FileText,
  Link2,
  Notebook,
  Image as ImageIcon,
  BarChart3,
  Inbox,
  Settings,
  Eye,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/preview", label: "Preview site", icon: Eye },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/certifications", label: "Certifications", icon: ShieldCheck },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/coding-profiles", label: "Coding Profiles", icon: Link2 },
  { href: "/admin/articles", label: "Articles", icon: Notebook },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/leads", label: "Contact Leads", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 shrink-0 border-r border-border p-5 flex flex-col overflow-y-auto">
        <p className="text-sm font-semibold px-2 mb-6">Admin</p>
        <nav className="flex-1 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground hover:bg-background-elevated"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-background-elevated transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>
      <main className="flex-1 p-6 sm:p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
