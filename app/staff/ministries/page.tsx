import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server-client";
import { db } from "@/db";
import { profiles } from "@/db/schemas/profiles";
import { eq } from "drizzle-orm";

export default async function StaffMinistriesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  if (!profile?.service_id) {
    return (
      <div className="p-10">
        No ministry assigned.
      </div>
    );
  }

  redirect(`/staff/ministries/${profile.service_id}/analytics`);
}