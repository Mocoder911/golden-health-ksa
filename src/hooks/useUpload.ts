"use client";

import { createClient } from "@/lib/supabaseClient";
import { useState, useRef, type ChangeEvent } from "react";

interface UseUploadOptions {
  bucket?: string;
  folder?: string;
}

export function useUpload(options: UseUploadOptions = {}) {
  const { bucket = "media", folder = "" } = options;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(10);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = folder ? `${folder}/${name}` : name;

    setProgress(30);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      setProgress(0);
      return null;
    }

    setProgress(80);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    setProgress(100);
    setUploading(false);

    return publicUrl;
  };

  const uploadMultiple = async (files: FileList): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await upload(files[i]);
      if (url) urls.push(url);
    }
    return urls;
  };

  const remove = async (url: string): Promise<boolean> => {
    const supabase = createClient();
    // Extract path from public URL
    const urlParts = url.split("/storage/v1/object/public/");
    if (urlParts.length < 2) return false;
    const fullPath = urlParts[1];
    const [bucketName, ...pathParts] = fullPath.split("/");
    const filePath = pathParts.join("/");

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    return !error;
  };

  return {
    upload,
    uploadMultiple,
    remove,
    uploading,
    progress,
    inputRef,
  };
}
