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

export function FileUpload({ file, onFile, onError, label }: {
  file: File | null; onFile: (f: File | null) => void; onError: (msg: string | null) => void; label: string;
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
      <input ref={input} type="file" accept={ACCEPTED.join(",")} className="sr-only"
        onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      {file ? (
        <FileDetails file={file} onRemove={() => onFile(null)} onReplace={() => input.current?.click()} />
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-grid px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            drag ? "border-primary bg-primary-soft" : "border-input hover:border-primary",
          )}
        >
          <div className="mb-3 grid size-14 place-items-center rounded-xl brut-sm bg-primary text-primary-foreground">
            <UploadCloud className="size-6" />
          </div>
          <p className="font-display text-lg font-bold">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">Drag & drop, or <span className="font-semibold text-primary underline">browse</span></p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">PDF · DOCX · up to {MAX_MB} MB</p>
        </button>
      )}
    </div>
  );
}

export function FileDetails({ file, onRemove, onReplace }: { file: File; onRemove: () => void; onReplace: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl brut-sm bg-card p-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
        <FileText className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{file.name}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {file.name.split(".").pop()?.toUpperCase()} · {(file.size / 1024).toFixed(0)} KB
        </p>
      </div>
      <button onClick={onReplace} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Replace file">
        <RefreshCw className="size-4" />
      </button>
      <button onClick={onRemove} className="rounded-md p-2 text-muted-foreground hover:bg-destructive-soft hover:text-destructive" aria-label="Remove file">
        <X className="size-4" />
      </button>
    </div>
  );
}
