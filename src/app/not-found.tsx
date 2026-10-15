import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-site flex-col justify-center px-6 py-24 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
        404
      </p>
      <h1 className="mt-7 text-balance text-3xl font-medium leading-[1.18] tracking-tight sm:text-4xl sm:leading-[1.14]">
        This page doesn’t exist.
      </h1>
      <p className="mt-5 max-w-[46ch] text-pretty leading-relaxed text-neutral-600">
        The link may be broken, or the page may have moved.
      </p>
      <Link
        href="/"
        className="action-quiet mt-9 w-fit border border-neutral-300 px-3 font-sans text-[13px] font-medium"
      >
        <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}
