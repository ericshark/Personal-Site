"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyStatus = "idle" | "copying" | "copied" | "error";

export default function ContactEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copyEmail() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 sm:mt-9">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <a
          className="link-quiet min-w-0 break-all py-2 text-sm underline min-[360px]:text-base sm:text-lg"
          href={`mailto:${email}`}
        >
          {email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          disabled={status === "copying"}
          aria-label="Copy email address"
          aria-busy={status === "copying"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-neutral-300 text-neutral-500 transition-colors duration-150 hover:border-ink hover:bg-neutral-100 hover:text-ink disabled:opacity-50"
        >
          {status === "copied" ? (
            <Check size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Copy size={16} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>
      <p
        role="status"
        className="mt-2 min-h-5 text-xs leading-relaxed text-neutral-500"
      >
        {status === "copied" && "Email copied."}
        {status === "error" &&
          "Couldn’t copy. Use the email link to get in touch."}
      </p>
    </div>
  );
}
