import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server-client";
import { db } from "@/db";
import { profiles } from "@/db/schemas/profiles";
import { eq } from "drizzle-orm";

import StaffShell from "@/components/staff-shell";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .then((rows) => rows[0]);

  if (!profile) {
    redirect("/login");
  }

  if (!profile.is_approved) {
    redirect("/login");
  }

  // Only staff allowed
  if (profile.role !== "staff") {
    redirect("/login");
  }

  return (
    <StaffShell>
      {children}
    </StaffShell>
  );
}