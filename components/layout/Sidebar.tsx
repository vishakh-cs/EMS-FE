"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard",  icon: "dashboard",               label: "Dashboard" },
  { href: "/compose",    icon: "send",                    label: "Email Sender" },
  { href: "/campaigns",  icon: "campaign",                label: "Bulk Campaign" },
  { href: "/smtp",       icon: "settings_input_component",label: "SMTP Settings" },
  { href: "/resumes",    icon: "description",             label: "Resume Management" },
  { href: "/templates",  icon: "mail_outline",            label: "Email Templates" },
  { href: "/history",    icon: "history",                 label: "History & Logs" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] glass-sidebar flex flex-col py-6 px-4 shrink-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & Mobile Close */}
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              ResumeMail AI
            </h1>
            <p className="text-[10px] font-medium text-secondary/70 uppercase tracking-widest mt-1">
              Enterprise Account
            </p>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // close drawer on link navigation in mobile view
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-on-surface-variant/80 hover:bg-white/5"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/campaigns"
          onClick={onClose}
          className="mt-auto w-full bg-primary text-on-primary font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.97] shadow-lg shadow-primary/20 text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          New Campaign
        </Link>
      </aside>
    </>
  );
}
