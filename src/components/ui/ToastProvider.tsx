"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "#1a1b23",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0f5",
        },
      }}
    />
  );
}
