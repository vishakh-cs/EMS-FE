"use client";

import { useState } from "react";
import { postApi, smtp } from "@/app/services";

export default function SmtpPage() {
  const [showPass, setShowPass] = useState(false);
  const [testState, setTestState] = useState<"idle" | "testing" | "success">("idle");

  // Form states
  const [provider, setProvider] = useState("Google Gmail");
  const [host, setHost] = useState("");
  const [port, setPort] = useState(587);
  const [secure, setSecure] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fromName, setFromName] = useState("");
  const [replyTo, setReplyTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleTest = () => {
    setTestState("testing");
    setTimeout(() => {
      setTestState("success");
      setTimeout(() => setTestState("idle"), 3000);
    }, 1500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // call standard postApi for setting SMTP Configuration
      const payload = {
        service_provider: provider,
        smtp_host: host,
        smtp_port: port,
        is_secure_ssl: secure,
        smtp_username: username,
        smtp_password: password,
      };

      await postApi(smtp.setSMTPConfiguration, payload);
      setSuccess(true);
      setIsConfigured(true);
    } catch (err: any) {
      console.error("Failed to save SMTP configuration:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save settings. Please verify SMTP details.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">
          SMTP Configuration
        </h2>
        <p className="text-on-surface-variant/70 mt-1">
          Configure your outgoing mail server to enable automated resume outreach campaigns.
        </p>
      </div>

      {/* Status badge */}
      {isConfigured ? (
        <div className="flex items-center gap-2 w-fit px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(195,192,255,0.6)] animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-wider">SMTP: Configured</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 w-fit px-4 py-2 bg-error/10 text-error border border-error/30 rounded-2xl animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_8px_rgba(255,180,171,0.6)]" />
          <span className="text-sm font-bold uppercase tracking-wider">SMTP: Not Configured</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-sm bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px]">warning</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 text-sm bg-primary/10 border border-primary/30 text-primary rounded-2xl flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>SMTP Configuration saved successfully!</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSave}>
        {/* Provider Details */}
        <section className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">hub</span>
            Provider Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">
                Service Provider
              </label>
              <select
                disabled={loading}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none"
              >
                {["Google Gmail", "Microsoft Outlook", "Yahoo Mail", "Zoho Mail", "Custom SMTP Server"].map((o) => (
                  <option key={o} value={o} className="bg-surface-container">{o}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">SMTP Host</label>
              <input
                type="text"
                required
                disabled={loading}
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="smtp.provider.com"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">SMTP Port</label>
              <input
                type="number"
                required
                disabled={loading}
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                placeholder="587"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-medium text-on-surface">Secure SSL/TLS</p>
                <p className="text-xs text-on-surface-variant/60">Encryption mandatory</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={loading}
                  checked={secure}
                  onChange={(e) => setSecure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">lock_person</span>
            Authentication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">
                SMTP Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user@company.com"
                  className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">
                SMTP Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  key
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="glass-input w-full pl-11 pr-12 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sender Profile */}
        {/* <section className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_outline</span>
            Sender Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">From Name</label>
              <input
                type="text"
                required
                disabled={loading}
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="John Doe | Recruiter"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">Reply-To Email</label>
              <input
                type="email"
                required
                disabled={loading}
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="replies@company.com"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          </div>
        </section> */}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-bold hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">save</span>
            {loading ? "Saving Settings..." : "Save Settings"}
          </button>
          {/* <button
            type="button"
            onClick={handleTest}
            disabled={testState === "testing" || loading}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 border ${
              testState === "success"
                ? "bg-tertiary/10 border-tertiary/30 text-tertiary"
                : "bg-white/5 border-white/10 text-on-surface hover:bg-white/10"
            }`}
          >
            <span
              className={`material-symbols-outlined ${testState === "testing" ? "animate-spin" : testState === "success" ? "" : "group-hover:rotate-180 transition-transform duration-500"}`}
            >
              {testState === "success" ? "check_circle" : "sync"}
            </span>
            {testState === "testing"
              ? "Testing…"
              : testState === "success"
              ? "Connection Successful!"
              : "Test Connection"}
          </button> */}
        </div>
      </form>

      {/* Help */}
      <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <span className="material-symbols-outlined text-tertiary">info</span>
        <p className="text-sm text-on-surface-variant/80">
          Need help? Check our{" "}
          <a href="#" className="text-primary font-bold hover:underline">
            Configuration Guide
          </a>{" "}
          for provider-specific app password instructions.
        </p>
      </div>
    </div>
  );
}
