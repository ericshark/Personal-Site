"use client";

/**
 * The static export bakes in the build year; rendering on the client keeps it current.
 * The server and client years can differ, so the mismatch warning is suppressed.
 */
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
