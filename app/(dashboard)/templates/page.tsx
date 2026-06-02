"use client";

const templates = [
  {
    id: "job-app",
    icon: "work",
    iconBg: "bg-primary/20 text-primary",
    title: "Job Application",
    meta: "Last used 2h ago · 45% reply rate",
    subject: "Application for {{job_title}} - {{name}} | Professional Portfolio",
    badge: "High Performance",
    badgeColor: "bg-tertiary/20 text-tertiary",
    dot: "bg-tertiary animate-pulse",
  },
  {
    id: "follow-up",
    icon: "schedule",
    iconBg: "bg-tertiary/20 text-tertiary",
    title: "Follow Up",
    meta: "Last used 1d ago · 22% reply rate",
    subject: "Quick question regarding my application to {{company}}",
    badge: "Standard",
    badgeColor: "bg-secondary/20 text-secondary",
    dot: "",
  },
  {
    id: "referral",
    icon: "handshake",
    iconBg: "bg-secondary/20 text-secondary",
    title: "Referral Request",
    meta: "Last used 3d ago · 68% reply rate",
    subject: "Hi {{recipient_name}}, seeking your advice on roles at {{company}}",
    badge: "Top Rated",
    badgeColor: "bg-tertiary/20 text-tertiary",
    dot: "bg-tertiary",
  },
  {
    id: "thank-you",
    icon: "favorite",
    iconBg: "bg-white/10 text-on-surface-variant",
    title: "Thank You",
    meta: "Last used 5h ago · 12% reply rate",
    subject: "Great meeting you, {{interviewer_name}}! | {{job_title}} interview",
    badge: "Post-Interview",
    badgeColor: "bg-white/10 text-on-surface-variant/80",
    dot: "",
  },
];

const variables = {
  "Personal Data":    ["{{name}}", "{{first_name}}"],
  "Job & Company":    ["{{company}}", "{{job_title}}", "{{hiring_manager}}"],
  "System":           ["{{date_today}}"],
};

export default function TemplatesPage() {
  return (
    <div className="flex gap-0 h-[calc(100vh-112px)] -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 overflow-hidden">
      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">
                Email Templates
              </h2>
              <p className="text-on-surface-variant/70 mt-1">
                Manage and optimize your professional outreach sequences.
              </p>
            </div>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 w-fit">
              <span className="material-symbols-outlined text-[20px]">post_add</span>
              Create New Template
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
            {templates.map((t) => (
              <div
                key={t.id}
                className="group glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden"
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`${t.iconBg} p-3 rounded-xl`}>
                    <span className="material-symbols-outlined">{t.icon}</span>
                  </div>
                  {/* Actions – visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                    {[
                      { icon: "edit",         cls: "hover:bg-white/10 text-on-surface-variant" },
                      { icon: "content_copy", cls: "hover:bg-white/10 text-on-surface-variant" },
                      { icon: "delete",       cls: "hover:bg-error/20 text-error" },
                    ].map((a) => (
                      <button
                        key={a.icon}
                        className={`p-2 ${a.cls} rounded-full transition-colors`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-on-surface mb-1">{t.title}</h3>
                <p className="text-[10px] font-bold text-secondary/70 mb-4 uppercase tracking-wider">
                  {t.meta}
                </p>

                {/* Subject preview */}
                <div className="glass-panel rounded-xl p-4 mb-4 border border-white/5 flex-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-1">
                    Subject Preview
                  </span>
                  <p className="font-mono text-on-surface-variant text-sm line-clamp-2">
                    {t.subject}
                  </p>
                </div>

                {/* Badge */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`${t.badgeColor} px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5`}
                  >
                    {t.dot && (
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                    )}
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}

            {/* Add new card */}
            <button className="group glass-card border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:border-primary/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-all group-hover:shadow-xl group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-on-surface">New Template</p>
                <p className="text-sm text-on-surface-variant/60">
                  Start from a blank canvas or AI assistant
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Variables Sidebar */}
      <aside className="w-[300px] glass-sidebar hidden 2xl:flex flex-col p-6 shrink-0 overflow-y-auto border-l border-white/8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em]">
            Available Variables
          </h4>
          <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px]">info</span>
        </div>
        <p className="text-sm text-on-surface-variant/70 mb-5 leading-relaxed">
          Use these placeholders in your templates. Our AI populates them automatically during sending.
        </p>

        <div className="space-y-5 flex-1">
          {Object.entries(variables).map(([group, vars]) => (
            <section key={group}>
              <h5 className="text-[11px] font-bold text-on-surface-variant/80 mb-2 uppercase tracking-wider">
                {group}
              </h5>
              <div className="space-y-2">
                {vars.map((v) => (
                  <button
                    key={v}
                    onClick={() => navigator.clipboard.writeText(v)}
                    className="w-full glass-panel px-3 py-2.5 rounded-xl flex items-center justify-between group hover:bg-primary/10 transition-colors"
                  >
                    <span className="text-primary font-bold text-sm font-mono">{v}</span>
                    <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary text-sm transition-colors">
                      content_copy
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
            <div>
              <p className="text-sm font-bold text-on-surface">Pro Tip</p>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed mt-0.5">
                Personalizing the subject line with{" "}
                <strong>{"{{job_title}}"}</strong> increases open rates by up to 24%.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
