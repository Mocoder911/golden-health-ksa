"use client";

import React from "react";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Upload Image",
  accept = "image/*",
}: ImageUploadProps) {
  const { upload, uploading, progress } = useUpload({ folder });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const url = await upload(file);
    if (url) {
      onChange(url);
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Upload failed. Please try again.");
    }

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
            >
              <span className="text-xs text-red-400">Remove</span>
            </button>
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
            id={`upload-${label}`}
          />
          <label
            htmlFor={`upload-${label}`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-sm text-text-secondary transition-colors hover:border-emerald/30 hover:text-text-primary"
          >
            {uploading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Uploading {progress}%
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose File
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
