"use client";

import { useEffect, useRef, useState } from "react";

const failedEmails = [
  { email: "m.smith@outlook.com", error: "SMTP Error: 550" },
  { email: "hr@startup.io",       error: "DNS Resolution Failed" },
  { email: "kevin.v@mega-corp.com", error: "Invalid Mailbox" },
];

const mappings = [
  { col: "Full Name",    field: "Recipient Name",  preview: "John Doe, Jane Smith…" },
  { col: "Contact Email",field: "Email Address",   preview: "john@example.com…" },
  { col: "Org_Name",     field: "Company Name",    preview: "Google, Meta, Apple…" },
  { col: "Job_Title",    field: "Position",        preview: "Sales Engineer…" },
];

export default function CampaignsPage() {
  const [progress, setProgress] = useState(64);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p < 100 ? Math.min(100, p + Math.random() * 0.4) : p));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            Bulk Outreach Campaign
          </h2>
          <p className="text-on-surface-variant/70 mt-1">
            Q4 Sales Engineering Recruitment Drive
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 glass-card rounded-2xl sm:rounded-full p-1.5 sm:p-1">
          {["1. Configuration", "2. Templates", "3. Preview"].map((s, i) => (
            <button
              key={s}
              className={`px-3 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-colors ${
                i === 0
                  ? "bg-white/10 text-primary"
                  : "text-secondary/70 hover:text-on-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left – Import & Mapping */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {/* Import */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-on-surface mb-4">
              Contact List Import
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <button className="flex flex-col items-center justify-center gap-2 p-8 border border-primary/50 bg-primary/10 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                <span className="text-sm font-bold text-primary">Upload CSV</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-8 border border-white/10 hover:bg-white/5 rounded-2xl transition-colors group">
                <span className="material-symbols-outlined text-secondary text-3xl group-hover:text-primary transition-colors">content_paste</span>
                <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Paste List</span>
              </button>
            </div>
            {/* Drop zone */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl bg-white/5 p-12 text-center flex flex-col items-center gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
              </div>
              <p className="text-lg font-bold">
                Drop your CSV here or{" "}
                <span className="text-primary underline">browse</span>
              </p>
              <p className="text-sm text-secondary/70">Support for .csv, .xlsx (Max 10k rows)</p>
            </div>
          </div>

          {/* Mapping */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h4 className="text-sm font-bold text-on-surface">
                Mapping Preview{" "}
                <span className="font-normal text-secondary/70 ml-2">(4 Columns Found)</span>
              </h4>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:brightness-110">
                <span className="material-symbols-outlined text-sm">auto_fix</span>Auto-Detect
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    {["File Column", "System Field", "Preview Data"].map((h) => (
                      <th key={h} className="text-left p-4 text-[10px] font-bold text-secondary/70 border-b border-white/10 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {mappings.map((m) => (
                    <tr key={m.col} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-on-surface">{m.col}</td>
                      <td className="p-4">
                        <select className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-sm text-on-surface outline-none">
                          <option className="bg-surface-container">{m.field}</option>
                        </select>
                      </td>
                      <td className="p-4 text-secondary/60 italic">{m.preview}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right – Progress & Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          {/* Progress */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-5">
                <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />Running
                </span>
                <span className="text-xs text-secondary/70">Est. 2:15 PM</span>
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-5xl font-black text-on-surface">{Math.floor(progress)}%</p>
                  <p className="text-xs text-secondary/70">820 / 1,280 Sent</p>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-tertiary h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(221,184,255,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-white text-[#0b1326] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-sm">
                  <span className="material-symbols-outlined">pause</span>Pause Campaign
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-white/10 hover:bg-white/20 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1 transition-all border border-white/10 text-sm">
                    <span className="material-symbols-outlined text-sm">refresh</span>Resume
                  </button>
                  <button className="bg-error/10 hover:bg-error/20 text-error py-2.5 rounded-xl font-bold flex items-center justify-center gap-1 transition-all border border-error/20 text-sm">
                    <span className="material-symbols-outlined text-sm">cancel</span>Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-[10px] text-secondary/70 font-bold uppercase tracking-widest mb-2">Successful</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-tertiary">792</span>
                <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-[10px] text-secondary/70 font-bold uppercase tracking-widest mb-2">Failed</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-error">28</span>
                <span className="material-symbols-outlined text-error text-xl">error</span>
              </div>
            </div>
          </div>

          {/* Failed list */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h4 className="text-sm font-bold text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>Failed Outreach
              </h4>
              <button className="text-primary text-xs font-bold hover:brightness-110">Retry All</button>
            </div>
            <div className="max-h-[240px] overflow-y-auto divide-y divide-white/5">
              {failedEmails.map((f) => (
                <div key={f.email} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{f.email}</p>
                    <p className="text-[11px] text-error">{f.error}</p>
                  </div>
                  <button className="shrink-0 p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 bg-white/5 text-center border-t border-white/10">
              <button className="text-secondary/70 text-xs font-bold hover:text-on-surface transition-colors">
                View All Errors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
