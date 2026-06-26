import { db } from '@/db';
import { profiles } from '@/db/schemas/profiles';
import { services } from "@/db/schemas/services";
import { eq, desc } from 'drizzle-orm';

import { columns, User } from "./columns";
import { DataTable } from "./data-table";

async function getUsers(): Promise<User[]> {
  const data = await db
    .select({
      id: profiles.id,
      fullName: profiles.full_name,
      createdAt: profiles.created_at,
      email: profiles.email,
      role: profiles.role,
      approved: profiles.is_approved,
      ministry: services.name,
      serviceId: profiles.service_id,
    })
    .from(profiles)
    .leftJoin(
      services,
      eq(profiles.service_id, services.id)
    )
    .orderBy(desc(profiles.created_at));

  return data.map(user => ({
    id: user.id,
    fullName: user.fullName || 'Unnamed User',
    email: user.email,
    ministry: user.ministry,
    serviceId: user.serviceId,
    role: user.role || 'user',
    approved: user.approved,
  }));
}

const allServices = await db
  .select({
    id: services.id,
    name: services.name,
  })
  .from(services);

export default async function UserManagementPage() {
  const data = await getUsers();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <div className="container mx-auto py-10 px-6">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            User Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View and manage registered users.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <DataTable columns={columns} data={data} />
        </div>

      </div>
    </div>
  );
}