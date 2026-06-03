"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/compose":    "Email Sender",
  "/campaigns":  "Bulk Campaign",
  "/smtp":       "SMTP Settings",
  "/resumes":    "Resume Management",
  "/templates":  "Email Templates",
  "/history":    "History & Logs",
};

interface TopNavProps {
  onToggleSidebar?: () => void;
}

export default function TopNav({ onToggleSidebar }: TopNavProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "ResumeMail AI";

  const [name, setName] = useState("Alex Rivera");
  const [designation, setDesignation] = useState("Recruitment Lead");
  const [initials, setInitials] = useState("AR");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fName = sessionStorage.getItem("firstName") || "";
      const lName = sessionStorage.getItem("lastName") || "";
      const des = sessionStorage.getItem("designation") || "";
      
      if (fName) {
        const fullName = `${fName} ${lName}`.trim();
        setName(fullName);
        
        const init = (fName[0] + (lName[0] || "")).toUpperCase();
        setInitials(init);
      }
      if (des) {
        setDesignation(des);
      }
    }
  }, []);

  return (
    <header className="glass-header sticky top-0 z-40 shrink-0">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 max-w-[1280px] mx-auto gap-3">
        
        {/* Toggle Sidebar Button (Mobile/Tablet only) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-xl transition-colors shrink-0"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              className="glass-input w-full pl-10 pr-4 py-2 rounded-2xl text-xs sm:text-sm placeholder:text-outline/60"
              placeholder={`Search ${title.toLowerCase()}…`}
              type="text"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1 pr-2 sm:pr-4 border-r border-white/10">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-white/5 relative">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface" />
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-white/5 hidden sm:inline-block">
              <span className="material-symbols-outlined text-[22px]">help</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-white/5">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">settings</span>
            </button>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-xs sm:text-sm font-bold text-on-surface leading-tight">{name}</p>
              <p className="text-[10px] sm:text-[11px] text-secondary/70">{designation}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/30 border-2 border-primary/20 group-hover:border-primary transition-colors flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
