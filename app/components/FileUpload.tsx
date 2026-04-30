"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function FileUpload({
  file,
  onChange,
  error,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const meta = useMemo(() => {
    if (!file) return "JPG/PNG up to 10MB";
    return `${file.type.replace("image/", "").toUpperCase()} • ${formatBytes(file.size)}`;
  }, [file]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-[color:var(--surface-text)]">Photo Upload</div>
          <div className="text-xs text-[color:var(--surface-text-faint)]">
            A warm photo makes it personal.
          </div>
        </div>
        <div className="text-xs text-[color:var(--surface-text-faint)]">{meta}</div>
      </div>

      <div className="rounded-3xl border border-[color:var(--line-soft)] bg-white/45 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-[color:var(--line-soft)] bg-white/72 sm:h-24 sm:w-28">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--surface-text-faint)]">
                Preview
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                if (!next) {
                  onChange(null);
                  return;
                }
                if (next.size > MAX_BYTES) {
                  onChange(null);
                  return;
                }
                if (next.type !== "image/png" && next.type !== "image/jpeg") {
                  onChange(null);
                  return;
                }
                onChange(next);
              }}
              className="block w-full text-sm text-[color:var(--surface-text)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--gold)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[color:var(--text-on-gold)] hover:file:bg-[color:var(--gold-light)]"
            />
            <div className="mt-2 text-xs text-[color:var(--surface-text-faint)]">
              Use a clear JPG/PNG photo. Max size 10MB.
            </div>
          </div>
        </div>
      </div>

      {error ? <div className="text-xs text-[color:var(--danger-text)]">{error}</div> : null}
    </div>
  );
}
