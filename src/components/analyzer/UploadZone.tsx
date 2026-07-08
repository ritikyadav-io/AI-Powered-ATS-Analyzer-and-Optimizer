import { UploadCloud, FileText, X } from "lucide-react";
import { useState, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function UploadZone({ onFile }: { onFile?: (f: File | null) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);

  const handle = (f: File | null) => { setFile(f); onFile?.(f); };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setHover(false); handle(e.dataTransfer.files?.[0] ?? null); };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => handle(e.target.files?.[0] ?? null);

  return (
    <label
      onDragOver={e => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition-all
        ${hover ? "border-accent bg-accent/5" : "border-border/80 bg-card hover:border-accent hover:bg-accent/5"}`}
    >
      <input type="file" accept=".pdf,.docx,.doc" className="sr-only" onChange={onChange} />
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-secondary text-foreground">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">Drop your resume here</div>
            <div className="mt-1 text-sm text-muted-foreground">PDF or DOCX · max 10 MB</div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-medium">
              Browse files
            </div>
          </motion.div>
        ) : (
          <motion.div key="file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex w-full items-center gap-3 text-left">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-secondary text-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · ready to analyze</div>
            </div>
            <button type="button" onClick={(e) => { e.preventDefault(); handle(null); }} className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </label>
  );
}