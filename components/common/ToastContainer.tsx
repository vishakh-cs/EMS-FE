"use client";

import { useEffect, useState } from "react";
import { toastService, Toast } from "@/app/services/toast.service";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Subscribe to incoming toasts in the service emitter
    const unsubscribe = toastService.subscribe((currentToasts) => {
      setToasts(currentToasts);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((t) => {
        const bgStyles = {
          success: "bg-[#172b22] border-[#2e5a44] text-[#81c784]",
          error: "bg-[#2d1515] border-[#5e2929] text-[#e57373]",
          warning: "bg-[#2b2115] border-[#5a442e] text-[#ffb74d]",
          info: "bg-[#15202d] border-[#29425e] text-[#64b5f6]"
        }[t.type];

        const icon = {
          success: "check_circle",
          error: "error",
          warning: "warning",
          info: "info"
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${bgStyles}`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">{icon}</span>
            <p className="text-xs font-semibold leading-relaxed flex-1">{t.message}</p>
            <button
              onClick={() => {
                // simple quick dismissal
                toastService.show("", "info", 0);
              }}
              className="text-on-surface-variant/40 hover:text-on-surface shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
