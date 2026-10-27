import { FileText, RefreshCw, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACCEPTED = [".pdf", ".docx"];
const MAX_MB = 10;

export function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ACCEPTED.includes(ext)) return "Only PDF and DOCX files are supported.";
  if (file.size > MAX_MB * 1024 * 1024) return `File is larger than ${MAX_MB} MB.`;
  return null;
}

export function FileUpload({
  file,
  onFile,
  onError,
  label,
}: {
  file: File | { name: string; size?: number } | null;
  onFile: (f: File | null) => void;
  onError: (msg: string | null) => void;
  label: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const pick = (f?: File) => {
    if (!f) return;
    const err = validateFile(f);
    onError(err);
    onFile(err ? null : f);
  };

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {file ? (
        <FileDetails
          file={file}
          onRemove={() => onFile(null)}
          onReplace={() => input.current?.click()}
        />
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/40 cursor-pointer",
            drag
              ? "border-champagne bg-champagne/10 shadow-[0_0_30px_rgba(196,165,116,0.15)]"
              : "border-white/10 bg-[#131316] hover:border-white/25 hover:bg-[#18181D]",
          )}
        >
          <div className="mb-3.5 grid size-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-champagne shadow-sm">
            <UploadCloud className="size-5 text-champagne" />
          </div>
          <p className="font-display text-base font-bold text-zinc-100">{label}</p>
          <p className="mt-1 text-xs text-zinc-400">
            Drag & drop document, or{" "}
            <span className="font-semibold text-zinc-200 underline decoration-champagne/60 underline-offset-2">
              browse files
            </span>
          </p>
          <p className="mt-3 font-mono text-[11px] text-zinc-500">PDF or DOCX up to {MAX_MB} MB</p>
        </button>
      )}
    </div>
  );
}

export function FileDetails({
  file,
  onRemove,
  onReplace,
}: {
  file: File | { name: string; size?: number };
  onRemove: () => void;
  onReplace: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#131316] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-champagne">
        <FileText className="size-5 text-champagne" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-100">{file.name}</p>
        <p className="font-mono text-xs text-zinc-400">
          {file.name.split(".").pop()?.toUpperCase()} ·{" "}
          {file.size ? (file.size / 1024).toFixed(0) : "120"} KB
        </p>
      </div>
      <button
        onClick={onReplace}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 cursor-pointer"
        aria-label="Replace file"
      >
        <RefreshCw className="size-4" />
      </button>
      <button
        onClick={onRemove}
        className="rounded-lg p-2 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
        aria-label="Remove file"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
