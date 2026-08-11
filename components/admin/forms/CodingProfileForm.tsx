import { TextField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveCodingProfile } from "@/lib/admin/actions/content";

type CodingProfileRecord = {
  id: string;
  platform: string;
  username: string;
  url: string;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function CodingProfileForm({ profile }: { profile?: CodingProfileRecord }) {
  return (
    <form action={saveCodingProfile} className="space-y-5 max-w-md">
      {profile && <input type="hidden" name="id" defaultValue={profile.id} />}

      <TextField label="Platform" name="platform" defaultValue={profile?.platform} required placeholder="LeetCode" />
      <TextField label="Username (optional)" name="username" defaultValue={profile?.username} />
      <TextField label="Profile URL" name="url" defaultValue={profile?.url} required />

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(profile?.order ?? 0)} />
        <StatusField defaultValue={profile?.status} />
      </div>

      <SaveButton label={profile ? "Save changes" : "Create"} />
    </form>
  );
}
