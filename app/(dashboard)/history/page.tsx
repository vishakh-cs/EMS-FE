"use client";

import { Fragment, useState } from "react";

type LogStatus = "Success" | "Failed" | "Pending";

interface LogRow {
  initials: string;
  name: string;
  email: string;
  subject: string;
  status: LogStatus;
  date: string;
  hasAttachment: boolean;
  errorLog?: string;
}

const rows: LogRow[] = [
  {
    initials: "JS",
    name: "Jordan Smith",
    email: "j.smith@techcorp.com",
    subject: "Senior Product Designer Application",
    status: "Success",
    date: "Oct 24, 2023 14:20",
    hasAttachment: true,
  },
  {
    initials: "DW",
    name: "David Wright",
    email: "dwright@startup.io",
    subject: "Follow-up: UX Research Opportunity",
    status: "Failed",
    date: "Oct 24, 2023 11:05",
    hasAttachment: false,
    errorLog:
      "The mail server for startup.io rejected the connection. DMARC policies may be blocking outbound relay.\n\n> HELO resumesender.ai\n> MAIL FROM: <outreach@resumesender.ai>\n> RCPT TO: <dwright@startup.io>\n! 550 5.7.1 Client host blocked using Spamhaus",
  },
  {
    initials: "ML",
    name: "Maria Lopez",
    email: "m.lopez@designstudio.net",
    subject: "Portfolio & Case Studies",
    status: "Pending",
    date: "Oct 23, 2023 18:45",
    hasAttachment: true,
  },
  {
    initials: "AK",
    name: "Alan Khan",
    email: "akhan@global.com",
    subject: "Introduction: AI Solutions Partner",
    status: "Success",
    date: "Oct 23, 2023 15:10",
    hasAttachment: false,
  },
];

const statusStyles: Record<LogStatus, string> = {
  Success: "bg-tertiary/20 text-tertiary",
  Failed:  "bg-error/20 text-error",
  Pending: "bg-secondary/20 text-secondary",
};

const initialsColors: Record<LogStatus, string> = {
  Success: "bg-tertiary/20 text-tertiary border-tertiary/20",
  Failed:  "bg-error/20 text-error border-error/20",
  Pending: "bg-secondary/20 text-secondary border-secondary/20",
};

const footerCards = [
  {
    icon: "analytics",
    color: "bg-primary/10 border-primary/20 text-primary",
    title: "98.2% Deliverability",
    desc: "Bounce rate is within safe enterprise limits.",
  },
  {
    icon: "verified_user",
    color: "bg-tertiary/10 border-tertiary/20 text-tertiary",
    title: "SMTP Health: Good",
    desc: "All connected mail servers are active.",
  },
  {
    icon: "storage",
    color: "bg-secondary/10 border-secondary/20 text-secondary",
    title: "Log Retention",
    desc: "SMTP logs are archived for 90 days.",
  },
];

export default function HistoryPage() {
  const [tab, setTab] = useState<"history" | "logs">("history");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight mb-1">
            Email Logs
          </h2>
          <p className="text-on-surface-variant/70">
            Monitor your outreach performance and troubleshoot delivery issues.
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {(["history", "logs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-white/10 text-primary shadow-lg shadow-primary/5"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              {t === "history" ? "Sent History" : "Error Logs"}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
            Date Range
          </label>
          <select className="bg-transparent border-none text-sm text-on-surface focus:ring-0 outline-none cursor-pointer">
            <option>Today</option>
            <option selected>Past 7 Days</option>
            <option>Past 30 Days</option>
            <option>Custom Range</option>
          </select>
        </div>
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-1">
          <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
            Status Filter
          </label>
          <select className="bg-transparent border-none text-sm text-on-surface focus:ring-0 outline-none cursor-pointer">
            <option>All Statuses</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-1 md:col-span-2">
          <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
            Recipient Identity
          </label>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">
              alternate_email
            </span>
            <input
              type="text"
              placeholder="Enter name or email address…"
              className="flex-1 bg-transparent border-none text-sm text-on-surface placeholder:text-outline-variant outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                {["Recipient", "Subject", "Status", "Date", "Docs", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <Fragment key={row.email}>
                  <tr
                    className={`hover:bg-white/5 transition-colors group ${
                      row.status === "Failed" ? "bg-error/[0.03]" : ""
                    }`}
                  >
                    {/* Recipient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border ${
                            initialsColors[row.status]
                          }`}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-on-surface">
                            {row.name}
                          </p>
                          <p className="text-xs text-outline">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Subject */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface-variant truncate max-w-[200px]">
                        {row.subject}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          statusStyles[row.status]
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-current ${
                            row.status === "Pending" ? "animate-pulse" : ""
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {row.date}
                    </td>
                    {/* Docs */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          row.hasAttachment
                            ? "text-outline hover:text-primary cursor-pointer transition-colors"
                            : "text-outline-variant"
                        }`}
                      >
                        {row.hasAttachment ? "attach_file" : "attach_file_off"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        {row.status === "Failed" ? (
                          <button
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === row.email ? null : row.email
                              )
                            }
                            className="px-3 py-1 hover:bg-error/10 rounded-lg text-error transition-colors text-sm font-semibold"
                          >
                            Error
                          </button>
                        ) : (
                          <button className="px-3 py-1 hover:bg-primary/10 rounded-lg text-primary transition-colors text-sm font-semibold">
                            View
                          </button>
                        )}
                        <button className="p-2 hover:bg-white/10 rounded-lg text-secondary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            refresh
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Error detail row */}
                  {expandedRow === row.email && row.errorLog && (
                    <tr>
                      <td colSpan={6} className="px-6 py-5">
                        <div className="glass-card border-error/20 rounded-2xl p-5 flex items-start gap-5 shadow-lg">
                          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-error">warning</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-on-surface">
                                SMTP Connection Failure
                              </h4>
                              <span className="font-mono text-xs text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                ERROR_CODE: 550
                              </span>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/10 overflow-x-auto">
                              <pre className="font-mono text-xs text-on-surface-variant/80 leading-relaxed whitespace-pre-wrap">
                                {row.errorLog}
                              </pre>
                            </div>
                          </div>
                          <button
                            onClick={() => setExpandedRow(null)}
                            className="text-secondary hover:text-on-surface shrink-0"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant/70">
            Showing 1 to 4 of 128 results
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-2 rounded-xl border border-white/10 text-secondary hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-xl font-bold text-sm transition-colors ${
                  p === 1
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "text-secondary hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-on-surface-variant/40 mx-1">…</span>
            <button className="w-8 h-8 rounded-xl text-secondary hover:bg-white/10 font-bold text-sm transition-colors">
              32
            </button>
            <button className="p-2 rounded-xl border border-white/10 text-secondary hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {footerCards.map((c) => (
          <div key={c.title} className="glass-card p-5 rounded-2xl flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${c.color}`}
            >
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <div>
              <h5 className="text-sm font-bold text-on-surface">{c.title}</h5>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
