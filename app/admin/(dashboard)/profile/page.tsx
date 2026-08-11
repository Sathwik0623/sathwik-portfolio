import { getAdminProfile } from "@/lib/admin/queries";
import { saveProfile } from "@/lib/admin/actions/profile";
import { TextField, TextAreaField, CheckboxField, SaveButton } from "@/components/admin/form/Fields";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Profile / Hero</h1>

      <form action={saveProfile} className="space-y-5 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Name" name="name" defaultValue={profile?.name} required />
          <TextField label="Location" name="location" defaultValue={profile?.location} required />
        </div>

        <TextField label="Headline" name="headline" defaultValue={profile?.headline} required />
        <TextField
          label="Proof line"
          name="proofLine"
          defaultValue={profile?.proofLine}
          placeholder="Cisco · Hackathon Winner · 550+ DSA Problems"
          required
        />
        <TextAreaField label="Summary (used for SEO/metadata)" name="summary" defaultValue={profile?.summary} rows={4} required />

        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Email" name="email" type="email" defaultValue={profile?.email} required />
          <TextField label="GitHub URL" name="githubUrl" defaultValue={profile?.githubUrl} />
        </div>
        <TextField label="LinkedIn URL" name="linkedinUrl" defaultValue={profile?.linkedinUrl} />

        <CheckboxField label="Show hero section publicly" name="heroVisible" defaultChecked={profile?.heroVisible ?? true} />

        <SaveButton label="Save profile" />
      </form>
    </div>
  );
}
