import type { Metadata } from "next";
import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login – ResumeMail AI" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[30px] text-on-primary">
              description
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            ResumeMail AI
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant/70">
            Enterprise Resume Management &amp; Outreach
          </p>
        </div>

        {/* Card */}
        <section className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-on-surface mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-on-surface-variant/80 mb-6">
            Please enter your details to sign in.
          </p>

          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container/80 backdrop-blur-sm px-3 text-xs text-outline uppercase tracking-wider">
                or continue with
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", icon: "G" },
              { label: "GitHub", icon: "GH" },
            ].map((s) => (
              <button
                key={s.label}
                className="flex items-center justify-center gap-2 py-2.5 glass-panel rounded-xl text-sm font-medium text-on-surface hover:bg-white/10 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-5 text-center">
          <p className="text-sm text-on-surface-variant/70">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-sm font-bold text-primary hover:brightness-125 transition-all"
            >
              Create an account
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
