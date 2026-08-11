import Image from "next/image";
import { FileText } from "lucide-react";
import { TextField, TextAreaField, StatusField, FileField, SaveButton } from "@/components/admin/form/Fields";
import { saveCertification } from "@/lib/admin/actions/certifications";

type CertificationRecord = {
  id: string;
  name: string;
  issuer: string;
  issued: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  media?: { url: string; kind: "IMAGE" | "PDF" } | null;
};

export function CertificationForm({ certification }: { certification?: CertificationRecord }) {
  return (
    <form action={saveCertification} className="space-y-5 max-w-2xl">
      {certification && <input type="hidden" name="id" defaultValue={certification.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Name" name="name" defaultValue={certification?.name} required />
        <TextField label="Issuer" name="issuer" defaultValue={certification?.issuer} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Issued (optional)" name="issued" defaultValue={certification?.issued} placeholder="Jul 2026" />
        <TextField label="Credential ID (optional)" name="credentialId" defaultValue={certification?.credentialId} />
      </div>

      <TextField label="Verification URL (optional)" name="credentialUrl" defaultValue={certification?.credentialUrl} />
      <TextAreaField label="Description (optional)" name="description" defaultValue={certification?.description} rows={2} />

      {certification?.media && (
        <div className="flex items-center gap-2 text-xs text-muted">
          {certification.media.kind === "PDF" ? (
            <FileText size={14} />
          ) : (
            <div className="relative size-10 rounded overflow-hidden border border-border">
              <Image src={certification.media.url} alt="Current certificate file" fill sizes="40px" className="object-cover" />
            </div>
          )}
          Current certificate file uploaded
        </div>
      )}
      <FileField label="Certificate file (optional)" name="certificateFile" accept="image/*,application/pdf" hint="Upload to replace" />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(certification?.order ?? 0)} />
        <StatusField defaultValue={certification?.status} />
      </div>

      <SaveButton label={certification ? "Save changes" : "Create certification"} />
    </form>
  );
}
