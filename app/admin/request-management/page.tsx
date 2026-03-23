import { db } from '@/db';
import { assistanceRequests } from '@/db/schemas/requests';
import { organizations } from '@/db/schemas/organizations';
import { services } from '@/db/schemas/services';
import { eq, desc } from 'drizzle-orm';
import { columns, Request } from "./columns";
import { DataTable } from "./data-table";

async function getRequests(): Promise<Request[]> {
  const data = await db.select({
      id: assistanceRequests.id,
      name: assistanceRequests.requesterName,
      contact: assistanceRequests.contactNumber,
      email: assistanceRequests.email,
      status: assistanceRequests.status,
      date_requested: assistanceRequests.createdAt,
      ministry: services.name, 
      parish: organizations.name, 
      serviceId: assistanceRequests.serviceId, 
      details: assistanceRequests.message,
    })
    .from(assistanceRequests)
    .innerJoin(services, eq(assistanceRequests.serviceId, services.id))
    .innerJoin(organizations, eq(assistanceRequests.organizationId, organizations.id))
    .orderBy(desc(assistanceRequests.createdAt)); 

  return data.map(req => ({
    id: req.id,
    name: req.name,
    contact: req.contact || req.email || 'No contact provided', 
    ministry: req.ministry,
    parish: req.parish,
    date_requested: req.date_requested.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    }),
    status: req.status,
    serviceId: req.serviceId, 
    details: req.details || 'No additional details provided.',
  }));
}

export default async function RequestManagementPage() {
  const data = await getRequests()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <div className="container mx-auto py-10 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Assistance Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review and process incoming requests from parishioners.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}