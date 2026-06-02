import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard – ResumeMail AI" };

const stats = [
  {
    label: "Total Emails Sent",
    value: "1,284",
    trend: "+12% vs last month",
    trendIcon: "trending_up",
    trendColor: "text-tertiary",
    icon: "send",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    label: "Sent Today",
    value: "42",
    trend: "158 limit remaining",
    trendIcon: "schedule",
    trendColor: "text-primary",
    icon: "today",
    iconBg: "bg-secondary/10 text-secondary",
  },
  {
    label: "Failed Deliveries",
    value: "3",
    trend: "View error logs",
    trendIcon: "error",
    trendColor: "text-error",
    icon: "report",
    iconBg: "bg-error/10 text-error",
  },
];

const quickActions = [
  { icon: "edit_square",  label: "Compose",  href: "/compose" },
  { icon: "rocket_launch",label: "Bulk Run", href: "/campaigns" },
  { icon: "upload_file",  label: "Resume",   href: "/resumes" },
  { icon: "swap_vert",    label: "SMTP Test",href: "/smtp" },
];

const chartBars = [
  { day: "Mon", pct: 45 },
  { day: "Tue", pct: 65 },
  { day: "Wed", pct: 80 },
  { day: "Thu", pct: 40 },
  { day: "Fri", pct: 95 },
  { day: "Sat", pct: 25 },
  { day: "Sun", pct: 15 },
];

const activity = [
  {
    to: "hr@techsolutions.com",
    subject: "Senior Software Engineer Application",
    status: "Sent",
    statusColor: "bg-tertiary/20 text-tertiary",
    date: "Oct 24, 14:32",
  },
  {
    to: "recruiting@innovate.io",
    subject: "Regarding the Fullstack Developer role",
    status: "Failed",
    statusColor: "bg-error/20 text-error",
    date: "Oct 24, 11:15",
  },
  {
    to: "j.doe@globalcorp.net",
    subject: "Interview Follow-up: Senior Frontend Role",
    status: "Pending",
    statusColor: "bg-secondary/20 text-secondary",
    date: "Oct 23, 18:45",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-on-surface-variant/70 mt-1">
            Track your outreach performance and campaign health in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-2xl w-fit">
          <span className="w-2.5 h-2.5 bg-tertiary rounded-full animate-pulse shadow-[0_0_8px_rgba(221,184,255,0.6)]" />
          <span className="text-sm font-semibold text-tertiary">
            SMTP: Connected &amp; Active
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="md:col-span-3 glass-card p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-bold text-secondary/80 uppercase tracking-widest">
                {s.label}
              </p>
              <h3 className="text-4xl font-bold text-on-surface mt-2">
                {s.value}
              </h3>
            </div>
            <div
              className={`mt-4 flex items-center text-sm font-medium gap-1 ${s.trendColor}`}
            >
              <span className="material-symbols-outlined text-lg">
                {s.trendIcon}
              </span>
              <span>{s.trend}</span>
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="md:col-span-3 glass-panel p-6 rounded-2xl shadow-xl shadow-primary/10">
          <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all gap-1.5 text-center"
              >
                <span className="material-symbols-outlined text-xl text-primary">
                  {a.icon}
                </span>
                <span className="text-[10px] font-bold uppercase text-on-surface">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Chart + Resume */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Chart */}
        <div className="md:col-span-8 glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-surface">
                Email Volume
              </h3>
              <p className="text-sm text-on-surface-variant/70">
                7-day outreach activity
              </p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-on-surface-variant px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-4 h-[200px] px-2">
            {chartBars.map((b) => (
              <div
                key={b.day}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div
                  className="w-full bg-primary/20 rounded-t-xl hover:bg-primary/40 transition-colors"
                  style={{ height: `${b.pct}%` }}
                />
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">
                  {b.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Resume */}
        <div className="md:col-span-4 glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <h4 className="text-xl font-bold text-on-surface">Active Resume</h4>
            <p className="text-sm text-on-surface-variant/70 mb-5">
              Technical_Resume_V2.pdf
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 shadow-inner flex-1">
              {[3 / 4, 1, 5 / 6, 2 / 3].map((w, i) => (
                <div
                  key={i}
                  className="h-3 bg-white/10 rounded"
                  style={{ width: `${w * 100}%` }}
                />
              ))}
            </div>
            <Link
              href="/resumes"
              className="mt-5 w-full text-primary font-bold text-sm py-3 border-2 border-primary/30 rounded-xl hover:bg-primary/10 transition-all hover:border-primary/50 active:scale-[0.98] text-center"
            >
              Review &amp; Edit Resume
            </Link>
          </div>
          <div className="absolute -bottom-8 -right-8 text-white/5 rotate-12 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: 160 }}>
              description
            </span>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-lg font-bold text-on-surface">Recent Activity</h3>
          <Link
            href="/history"
            className="text-sm font-bold text-primary hover:brightness-125 transition-all"
          >
            View all history
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                {["Recipient", "Subject", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activity.map((row) => (
                <tr
                  key={row.to}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-on-surface">
                    {row.to}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant/80">
                    {row.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${row.statusColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/60">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
