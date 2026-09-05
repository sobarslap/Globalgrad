"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

/**
 * Compact "Upload" control for a single checklist item (A3). Hides the native
 * file input behind a styled button, uploads a PDF/image, and refreshes so the
 * server-rendered row shows the new file + updated status.
 */
export function ChecklistUpload({ itemId }: { itemId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: () => {
      setError(null);
      router.refresh();
    },
    onUploadError: (e) => setError(e.message || "Upload failed."),
  });

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) startUpload([file], { itemId });
          e.target.value = ""; // allow re-selecting the same file
        }}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-60"
      >
        <Upload className="h-3 w-3" />
        {isUploading ? "Uploading…" : "Upload"}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
