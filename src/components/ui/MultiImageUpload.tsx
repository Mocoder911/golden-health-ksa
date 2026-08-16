"use client";

import React from "react";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  folder = "uploads",
  label = "Upload Images",
  maxImages = 10,
}: MultiImageUploadProps) {
  const { upload, remove, uploading, progress } = useUpload({ folder });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }
      const url = await upload(file);
      if (url) {
        onChange([...value, url]);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async (index: number) => {
    const url = value[index];
    await remove(url);
    onChange(value.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={i}
            className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10"
          >
            <img
              src={url}
              alt={`Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
            >
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
        {value.length < maxImages && (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              disabled={uploading}
              className="hidden"
              id={`multi-upload-${label}`}
            />
            <label
              htmlFor={`multi-upload-${label}`}
              className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 text-text-muted transition-colors hover:border-emerald/30 hover:text-emerald"
            >
              {uploading ? (
                <span className="text-xs">{progress}%</span>
              ) : (
                <>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="mt-1 text-[10px]">Add</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>
      <p className="text-xs text-text-muted">
        {value.length}/{maxImages} images
      </p>
    </div>
  );
}
