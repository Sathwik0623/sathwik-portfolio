"use client";

import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from "@/lib/media-limits";

export function TextField({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 3,
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      {hint && <span className="block text-xs text-muted-soft mt-0.5">{hint}</span>}
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        required={required}
        className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-y"
      />
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--accent)]" />
      {label}
    </label>
  );
}

export function StatusField({ defaultValue = "DRAFT" }: { defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">Status</span>
      <select
        name="status"
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </label>
  );
}

export function FileField({ label, name, accept, hint }: { label: string; name: string; accept: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="block text-xs text-muted-soft mt-0.5">
        {hint ? `${hint} · ` : ""}Max {MAX_UPLOAD_LABEL}
      </span>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size > MAX_UPLOAD_BYTES) {
            e.target.setCustomValidity(
              `File limit exceeded — please upload a file under ${MAX_UPLOAD_LABEL}.`,
            );
            e.target.reportValidity();
          } else {
            e.target.setCustomValidity("");
          }
        }}
        className="mt-1.5 w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3.5 file:py-1.5 file:text-xs file:font-medium file:text-accent-foreground"
      />
    </label>
  );
}

export function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
    >
      {label}
    </button>
  );
}
