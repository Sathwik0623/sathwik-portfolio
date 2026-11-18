"use client";

import { useState, useTransition, useRef } from "react";
import { TextField, TextAreaField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveExperience } from "@/lib/admin/actions/content";
import { fetchCompanyLogo } from "@/lib/admin/actions/experience";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from "@/lib/media-limits";

type ExperienceRecord = {
  id: string;
  role: string;
  company: string;
  companyUrl: string | null;
  logoUrl: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string;
  highlights: string;
  tech: string;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

// ── Inline styles reused from Fields.tsx ─────────────────────────────────────
const inputCls =
  "mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors";
const labelSpanCls = "text-xs font-medium text-muted";

export function ExperienceForm({ entry }: { entry?: ExperienceRecord }) {
  // ── Checkbox state ───────────────────────────────────────────────────────
  const [currentRole, setCurrentRole] = useState(entry?.current ?? false);

  // ── Logo state ───────────────────────────────────────────────────────────
  // Three distinct "logo sources":
  //   "existing"  – already saved in DB (edit mode), leave unless replaced/removed
  //   "detected"  – returned by fetchCompanyLogo action
  //   "manual"    – chosen via <input type=file>
  //   "none"      – explicitly removed
  type LogoState =
    | { source: "existing" | "detected"; url: string }
    | { source: "manual"; file: File; preview: string }
    | { source: "none" };

  const initialLogoState: LogoState = entry?.logoUrl
    ? { source: "existing", url: entry.logoUrl }
    : { source: "none" };

  const [logoState, setLogoState] = useState<LogoState>(initialLogoState);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const companyUrlRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showManualUpload, setShowManualUpload] = useState(false);

  // ── Logo detection ───────────────────────────────────────────────────────
  function handleDetectLogo() {
    const url = companyUrlRef.current?.value?.trim();
    if (!url) {
      setDetectError("Enter the Company Website URL first.");
      return;
    }
    setDetectError(null);
    startTransition(async () => {
      const result = await fetchCompanyLogo(url);
      if (result.ok) {
        setLogoState({ source: "detected", url: result.logoUrl });
        setShowManualUpload(false);
      } else {
        setDetectError(result.error);
      }
    });
  }

  function handleManualFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      e.target.setCustomValidity(`File limit exceeded — max ${MAX_UPLOAD_LABEL}.`);
      e.target.reportValidity();
      return;
    }
    e.target.setCustomValidity("");
    const preview = URL.createObjectURL(file);
    setLogoState({ source: "manual", file, preview });
    setDetectError(null);
  }

  function handleRemoveLogo() {
    setLogoState({ source: "none" });
    setShowManualUpload(false);
    setDetectError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Compute the persistent URL to pass in the hidden input.
  // "manual" uploads are handled server-side from the file input; we pass an
  // empty logoUrl so the action knows to read the file field instead.
  const persistentLogoUrl =
    logoState.source === "existing" || logoState.source === "detected"
      ? logoState.url
      : ""; // server action will read the logo file field when present

  const previewUrl =
    logoState.source === "existing" || logoState.source === "detected"
      ? logoState.url
      : logoState.source === "manual"
      ? logoState.preview
      : null;

  return (
    <form action={saveExperience} className="space-y-5 max-w-2xl">
      {entry && <input type="hidden" name="id" defaultValue={entry.id} />}

      {/* Role & Company */}
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Role" name="role" defaultValue={entry?.role} required />
        <TextField label="Company" name="company" defaultValue={entry?.company} required />
      </div>

      {/* Company URL + Logo detection */}
      <div className="space-y-3">
        <label className="block">
          <span className={labelSpanCls}>Company Website (optional)</span>
          <input
            ref={companyUrlRef}
            type="url"
            name="companyUrl"
            defaultValue={entry?.companyUrl ?? ""}
            placeholder="https://example.com"
            className={inputCls}
          />
        </label>

        {/* Logo detect button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDetectLogo}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="size-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Detecting…
              </>
            ) : (
              "Auto-detect logo"
            )}
          </button>
          {logoState.source !== "none" && (
            <button
              type="button"
              onClick={() => { setShowManualUpload(true); }}
              className="text-xs text-muted hover:text-accent transition-colors underline underline-offset-2"
            >
              Replace with custom
            </button>
          )}
          {logoState.source === "none" && (
            <button
              type="button"
              onClick={() => setShowManualUpload((v) => !v)}
              className="text-xs text-muted hover:text-accent transition-colors underline underline-offset-2"
            >
              {showManualUpload ? "Hide upload" : "Upload logo manually"}
            </button>
          )}
        </div>

        {/* Error from detection */}
        {detectError && (
          <p className="text-xs text-red-500">{detectError}</p>
        )}

        {/* Logo preview */}
        {previewUrl && (
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Company logo preview"
              className="size-14 rounded-lg object-contain border border-border bg-white/5"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">
                {logoState.source === "detected" ? "Auto-detected logo" :
                 logoState.source === "manual" ? "Custom upload" :
                 "Current logo"}
              </span>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs text-red-500 hover:text-red-400 transition-colors text-left"
              >
                Remove logo
              </button>
            </div>
          </div>
        )}

        {/* Manual file upload */}
        {showManualUpload && (
          <label className="block">
            <span className={labelSpanCls}>Upload custom logo</span>
            <span className="block text-xs text-muted mt-0.5">
              PNG, JPG, WEBP, SVG · Max {MAX_UPLOAD_LABEL}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="logoFile"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={handleManualFileChange}
              className="mt-1.5 w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3.5 file:py-1.5 file:text-xs file:font-medium file:text-accent-foreground"
            />
          </label>
        )}

        {/* Hidden input carries the persistent logo URL to the server action */}
        <input type="hidden" name="logoUrl" value={persistentLogoUrl} />
      </div>

      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Start date"
          name="startDate"
          defaultValue={entry?.startDate}
          placeholder="Aug 2025"
          required
        />
        {/* End date — hidden when currently working here */}
        <div style={currentRole ? { display: "none" } : {}}>
          <TextField
            label="End date"
            name="endDate"
            defaultValue={entry?.endDate ?? ""}
            placeholder="Jan 2026"
            required={!currentRole}
          />
        </div>
        {/* When hidden, submit empty string so server action receives and converts to null */}
        {currentRole && <input type="hidden" name="endDate" value="" />}
      </div>

      {/* Currently working here checkbox */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="current"
          checked={currentRole}
          onChange={(e) => setCurrentRole(e.target.checked)}
          className="size-4 accent-[var(--accent)]"
        />
        I currently work here
      </label>

      <TextAreaField
        label="Summary (2-3 concise bullets shown by default)"
        name="summary"
        defaultValue={entry?.summary}
        rows={3}
        hint="One bullet per line"
        required
      />
      <TextAreaField
        label="Full detail (revealed behind &quot;View experience&quot;)"
        name="highlights"
        defaultValue={entry?.highlights}
        rows={4}
        hint="One bullet per line"
        required
      />
      <TextField label="Technologies (comma-separated)" name="tech" defaultValue={entry?.tech} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(entry?.order ?? 0)} />
        <StatusField defaultValue={entry?.status} />
      </div>

      <SaveButton label={entry ? "Save changes" : "Create"} />
    </form>
  );
}
