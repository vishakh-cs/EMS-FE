"use client";

import { useState, useRef } from "react";

export default function ResumesPage() {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6 pb-8">
      {/* Hero */}
      <section className="glass-panel rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/30 flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Default Resume Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight mb-2">
              Resume Management
            </h1>
            <p className="text-on-surface-variant/80 max-w-2xl">
              Manage your primary CV for automated outreach. Our AI analyzes your
              default resume to personalize every email sent through the campaign
              manager.
            </p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20 shrink-0 text-sm">
            <span className="material-symbols-outlined text-[20px]">autorenew</span>
            Replace Resume
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left – File info */}
        <div className="lg:col-span-4 space-y-5">
          {/* File card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
                <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
              </div>
              <span className="text-xs text-on-surface-variant/60 bg-white/5 border border-white/10 px-2 py-1 rounded font-mono">
                PDF
              </span>
            </div>
            <h4 className="text-xl font-semibold text-on-surface mb-1 break-all">
              Software_Engineer_Resume.pdf
            </h4>
            <p className="text-sm text-on-surface-variant/60 mb-5">
              Last updated: Oct 24, 2023
            </p>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-5">
              {[
                { label: "File Size", value: "245 KB" },
                { label: "Format",    value: "Standard PDF" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    {m.label}
                  </p>
                  <p className="text-base font-bold text-on-surface mt-0.5">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {[
                { icon: "visibility", label: "View Resume",     danger: false },
                { icon: "download",  label: "Download File",   danger: false },
                { icon: "delete",    label: "Delete Resume",   danger: true },
              ].map((a) => (
                <button
                  key={a.label}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors group ${
                    a.danger
                      ? "border-error/20 hover:bg-error/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        a.danger
                          ? "text-error"
                          : "text-on-surface-variant/60 group-hover:text-primary transition-colors"
                      }`}
                    >
                      {a.icon}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        a.danger ? "text-error" : "text-on-surface"
                      }`}
                    >
                      {a.label}
                    </span>
                  </div>
                  {!a.danger && (
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px]">
                      chevron_right
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign stats */}
          <div className="glass-panel rounded-2xl p-6">
            <h5 className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mb-4">
              Campaign Performance
            </h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant/60">Emails Sent</span>
                <span className="text-base font-bold text-on-surface">1,240</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-primary shadow-[0_0_8px_rgba(195,192,255,0.4)] rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant/60">Response Rate</span>
                <span className="text-base font-bold text-tertiary">18.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right – Preview + Upload */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Preview */}
          <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                Resume Preview
              </span>
              <div className="flex gap-2">
                {["zoom_in", "zoom_out"].map((ic) => (
                  <button
                    key={ic}
                    className="p-1 text-on-surface-variant/60 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{ic}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 p-8 overflow-auto bg-surface-dim/40 flex justify-center">
              <div className="w-full max-w-[600px] bg-white shadow-2xl p-12 min-h-[700px]">
                {/* Skeleton resume lines */}
                <div className="h-6 w-1/3 bg-slate-100 mb-8 rounded" />
                <div className="space-y-2 mb-10">
                  <div className="h-4 w-full bg-slate-50 rounded" />
                  <div className="h-4 w-5/6 bg-slate-50 rounded" />
                </div>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-3 pt-2">
                      <div className="h-5 w-1/2 bg-slate-100 rounded" />
                      <div className="h-3 w-1/3 bg-slate-50 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1, 1, 4 / 5].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 bg-slate-50 rounded"
                        style={{ width: `${w * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-5 w-1/4 bg-slate-100 rounded" />
                    <div className="h-3 w-full bg-slate-50 rounded" />
                    <div className="h-3 w-3/4 bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
              dragging
                ? "border-primary bg-white/10"
                : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10"
            }`}
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 mb-4 transition-transform group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30">
              <span className="material-symbols-outlined text-primary text-[32px]">
                cloud_upload
              </span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-1">
              Upload New Resume
            </h4>
            <p className="text-on-surface-variant/70 mb-6">
              Drag and drop your PDF or DOCX file here, or click to browse.
            </p>
            <div className="flex gap-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span>Max 10 MB
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span>PDF, DOCX
              </span>
            </div>
            <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
