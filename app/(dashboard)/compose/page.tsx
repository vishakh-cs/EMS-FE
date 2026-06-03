"use client";

import React, { useState, Fragment } from "react";
import { postApi, getApi, smtp } from "@/app/services";

const templates = [
  "Standard Application Follow-up",
  "Initial Outreach - Engineering Role",
  "Networking Request",
  "Post-Interview Thank You",
];

const subjectOptions = [
  "Application for MERN Stack Developer Position",
  "Application for Full Stack Developer Position",
  "Application for Software Engineer Position",
  "Application for React Developer Position",
  "Application for Node.js Developer Position",
  "Application for Frontend Developer Position",
  "Application for Backend Developer Position",
];

const templateContents: Record<string, string> = {
  "Standard Application Follow-up": `Dear Hiring Manager,

I hope you are doing well.

I am writing to express my interest in software development opportunities within your organization.

I am a Full Stack Developer with nearly two years of hands-on experience building scalable web applications using React.js, Next.js, Node.js, Express.js, MongoDB, and MySQL. Throughout my career, I have worked on projects across multiple industries including FinTech, Healthcare, Learning Management Systems (LMS), Human Resource Management Systems (HRMS), Enterprise Management Platforms, and Power Grid/Energy Management solutions.

My experience includes developing modern and responsive user interfaces, building secure and efficient backend services, designing RESTful APIs, implementing authentication and authorization systems, integrating third-party services, optimizing database performance, and delivering enterprise dashboards and reporting solutions. I have been involved in the complete software development lifecycle, from requirement analysis and architecture design to deployment and maintenance.

I am passionate about solving real-world business problems through technology and continuously expanding my technical expertise. I enjoy working in collaborative environments where I can contribute to building reliable, scalable, and user-focused software solutions.

I have attached my resume for your review and would be grateful for the opportunity to discuss how my skills and experience can contribute to your team.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,

Vishakh CS
Software Developer

Email: vishakhcs51@gmail.com
LinkedIn: linkedin.com/in/vishakh-cs
GitHub: github.com/vishakh-cs
Portfolio: https://portfolio-2026-v2m4.vercel.app`
};

const variables = {
  Personal: ["{{name}}", "{{linkedin_url}}"],
  Company: ["{{company}}", "{{hiring_manager}}", "{{position}}"],
  Industry: ["{{industry_niche}}", "{{skill_1}}"],
};

export default function ComposePage() {
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("Standard Application Follow-up");
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(templateContents["Standard Application Follow-up"]);

  // Sending email status
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachByDefault, setAttachByDefault] = useState(true);

  // Mail History status
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedHistoryRow, setExpandedHistoryRow] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getApi(smtp.mailHistory);
      setHistoryItems(response?.data?.data || response?.data || []);
    } catch (err) {
      console.error("Failed to fetch mail history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const parsePreview = (text: string) => {
    let userName = "Alex Rivera";
    if (typeof window !== "undefined") {
      const fName = sessionStorage.getItem("firstName");
      const lName = sessionStorage.getItem("lastName");
      if (fName) {
        userName = `${fName} ${lName || ""}`.trim();
      }
    }
    const cleanUserName = userName.toLowerCase().replace(/[^a-z0-9]/g, "");

    return text
      .replace(/\{\{hiring_manager\}\}/g, "John Doe")
      .replace(/\{\{position\}\}/g, "Senior Software Engineer")
      .replace(/\{\{company\}\}/g, "TechCorp Solutions")
      .replace(/\{\{industry_niche\}\}/g, "Artificial Intelligence")
      .replace(/\{\{skill_1\}\}/g, "React & Next.js")
      .replace(/\{\{name\}\}/g, userName)
      .replace(/\{\{linkedin_url\}\}/g, `linkedin.com/in/${cleanUserName}`);
  };

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    if (templateContents[val]) {
      setBody(templateContents[val]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      setError("Please fill in recipient, subject, and email body.");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      let attachments: any[] = [];
      if (attachedFile && attachByDefault) {
        const base64Content = await fileToBase64(attachedFile);
        attachments.push({
          filename: attachedFile.name,
          content: base64Content,
          encoding: "base64",
        });
      }

      const payload = {
        to,
        subject,
        mail_content: body,
        cc: cc || undefined,
        bcc: bcc || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      await postApi(smtp.sendEmail, payload);
      setSuccess(true);

      // Clear form
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
    } catch (err: any) {
      console.error("Failed to send email:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send email. Please check if SMTP is configured.";
      setError(errMsg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5 h-[calc(100vh-112px)] -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 overflow-hidden">
      {/* Compose Pane */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white/5 rounded-2xl border border-white/10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5 py-5">
          <h2 className="text-xl font-bold text-on-surface">Compose Email</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowHistory(true);
                fetchHistory();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              Mail History
            </button>
            <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-[18px]">auto_fix</span>
              AI Rewrite
            </button>
          </div>
        </div>

        {/* Status Notification Banners */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 text-sm bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3.5 text-sm bg-primary/10 border border-primary/30 text-primary rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Email sent successfully through SMTP server!</span>
          </div>
        )}

        {/* Fields */}
        <div className="p-6 border-b border-white/10 space-y-4 bg-white/5">
          {/* To */}
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium text-on-surface-variant/70 shrink-0">To</span>
            <div className="flex-1 flex flex-wrap gap-2 p-2 border border-white/10 rounded-xl bg-white/5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all">
              <input
                type="email"
                required
                disabled={sending}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@company.com"
                className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline/50"
              />
              <button
                type="button"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-primary text-xs font-bold ml-auto px-2"
              >
                Cc/Bcc
              </button>
            </div>
          </div>

          {/* Cc/Bcc */}
          {showCcBcc && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-16 text-sm font-medium text-on-surface-variant/70 shrink-0">Cc</span>
                <input
                  type="text"
                  disabled={sending}
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Add cc recipients…"
                  className="glass-input flex-1 px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-sm font-medium text-on-surface-variant/70 shrink-0">Bcc</span>
                <input
                  type="text"
                  disabled={sending}
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="Add bcc recipients…"
                  className="glass-input flex-1 px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <span className="w-16 text-sm font-medium text-on-surface-variant/70 shrink-0">Subject</span>
            <div className="flex-1 flex gap-3 w-full">
              <input
                type="text"
                required
                disabled={sending}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line…"
                className="glass-input flex-1 px-4 py-2.5 rounded-xl text-sm font-medium"
              />
              <select
                disabled={sending}
                onChange={(e) => setSubject(e.target.value)}
                className="glass-input px-3 py-2.5 rounded-xl text-sm max-w-[200px] cursor-pointer"
                value={subjectOptions.includes(subject) ? subject : ""}
              >
                <option value="" disabled>Quick Subjects</option>
                {subjectOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-surface-container">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template */}
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium text-on-surface-variant/70 shrink-0">Template</span>
            <div className="relative flex-1">
              <select
                disabled={sending}
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
              >
                {templates.map((t) => (
                  <option key={t} value={t} className="bg-surface-container">{t}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/70 text-[20px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2 bg-white/5 flex items-center gap-1 border-b border-white/10">
          {[
            { icon: "format_bold", title: "Bold" },
            { icon: "format_italic", title: "Italic" },
            { icon: "format_underlined", title: "Underline" },
            null,
            { icon: "format_list_bulleted", title: "List" },
            { icon: "format_list_numbered", title: "Numbered" },
            null,
            { icon: "link", title: "Link" },
            { icon: "image", title: "Image" },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="w-px h-6 bg-white/10 mx-1" />
            ) : (
              <button
                type="button"
                key={item.icon}
                title={item.title}
                className="p-2 text-on-surface-variant/80 hover:text-primary hover:bg-white/10 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </button>
            )
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white/5">
          <textarea
            required
            disabled={sending}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="glass-input w-full h-full min-h-[450px] resize-none rounded-xl p-4 text-sm font-mono leading-relaxed text-on-surface/90"
          />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 px-4 sm:px-6 py-4 flex flex-wrap gap-3 items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <button type="button" className="px-5 py-2 glass-card text-on-surface text-sm font-medium rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">drafts</span>Save Draft
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-5 py-2 glass-card text-on-surface text-sm font-medium rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>Preview
            </button>
          </div>
          <button
            type="submit"
            onClick={handleSend}
            disabled={sending}
            className="px-7 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send Now</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Right Side Panel: Resume Attachment Box */}
      <aside className="w-full xl:w-80 flex flex-col gap-4 p-4 xl:p-0 bg-transparent shrink-0">
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-on-surface uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">attach_file</span>
            Resume Attachment
          </h4>
          
          {/* Attachment Content */}
          {attachedFile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    {attachedFile.name.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-on-surface truncate">{attachedFile.name}</p>
                  <p className="text-[10px] text-on-surface-variant/70">{(attachedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 hover:bg-error/10 text-error rounded-lg transition-colors shrink-0"
                  title="Remove attachment"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              
              {/* Toggle switch */}
              <div className="flex items-center justify-between py-1 px-1">
                <span className="text-xs text-on-surface-variant/70 font-medium select-none">Attach in payload</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachByDefault}
                    onChange={(e) => setAttachByDefault(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/50 italic py-2">
              No custom resume attached. Select one below to include it.
            </p>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.docx,.doc"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAttachedFile(e.target.files[0]);
                setAttachByDefault(true);
              }
            }}
            className="hidden"
          />

          <label
            htmlFor="resume-upload"
            className="border-2 border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all text-on-surface-variant/70 text-xs font-semibold select-none text-center block w-full"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Attach Custom Resume
          </label>
        </div>
      </aside>

      {/* Premium Glassmorphic Email Preview Modal Overlay */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col max-h-[85vh] animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Email Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-secondary hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* To */}
              <div className="flex items-center gap-3 py-2 border-b border-white/5">
                <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest w-16 shrink-0">To:</span>
                <span className="text-sm text-on-surface font-mono truncate">{to || "recipient@company.com"}</span>
              </div>

              {/* Subject */}
              <div className="flex items-center gap-3 py-2 border-b border-white/5">
                <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest w-16 shrink-0">Subject:</span>
                <span className="text-sm text-on-surface font-bold font-mono truncate">{subject || "(No Subject)"}</span>
              </div>

              {/* Attachment */}
              {attachedFile && attachByDefault && (
                <div className="flex items-center gap-3 py-2 border-b border-white/5">
                  <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest w-16 shrink-0">Files:</span>
                  <span className="text-sm text-primary font-mono flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px]">attach_file</span>
                    {attachedFile.name} ({(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              )}

              {/* Body */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest block mb-3">Processed Body</span>
                <pre className="font-mono text-sm leading-relaxed text-on-surface-variant/90 whitespace-pre-wrap">
                  {parsePreview(body)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2 glass-card text-on-surface text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                Close Preview
              </button>
              <button
                onClick={(e) => {
                  setShowPreview(false);
                  handleSend(e);
                }}
                disabled={sending}
                className="px-6 py-2 bg-primary text-on-primary text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Glassmorphic Email History Modal Overlay */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col max-h-[85vh] animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Outreach History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-secondary hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2 border-r-transparent"></div>
                  <span className="text-xs text-on-surface-variant/70">Fetching history...</span>
                </div>
              ) : historyItems.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant/50 italic text-sm">
                  No sent history found. Start sending emails to build your logs.
                </div>
              ) : (
                <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Recipient</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Subject</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Status</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Date</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {historyItems.map((item) => (
                          <Fragment key={item._id}>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-on-surface truncate max-w-[150px]">{item.to}</td>
                              <td className="px-4 py-3 text-sm text-on-surface-variant/80 truncate max-w-[200px]">{item.subject}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === 'Success' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-error/10 text-error border border-error/20'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-on-surface-variant/70">
                                {new Date(item.createdAt).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </td>
                              <td className="px-4 py-3 text-right space-x-2">
                                {item.status === "Failed" && item.errorLog && (
                                  <button
                                    onClick={() => setExpandedHistoryRow(expandedHistoryRow === item._id ? null : item._id)}
                                    className="px-2 py-1 text-xs hover:bg-error/10 text-error rounded transition-colors"
                                  >
                                    Error Details
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setTo(item.to);
                                    setSubject(item.subject);
                                    setBody(item.mail_content);
                                    setShowHistory(false);
                                  }}
                                  className="px-2.5 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-all font-semibold"
                                >
                                  Reuse Template
                                </button>
                              </td>
                            </tr>
                            {expandedHistoryRow === item._id && item.errorLog && (
                              <tr className="bg-error/[0.02]">
                                <td colSpan={5} className="px-4 py-3">
                                  <div className="bg-black/40 p-3 rounded-lg border border-error/20 text-xs font-mono text-error/90 max-h-[150px] overflow-y-auto">
                                    {item.errorLog}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-5 py-2 glass-card text-on-surface text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
