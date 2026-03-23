'use server';

import { createClient } from '@supabase/supabase-js';
import { db } from '@/db';
import { organizations } from '@/db/schemas/organizations';
import { services, organizationServices } from '@/db/schemas/services';
import { eq, and, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { assistanceRequests, requestStatusEnum } from '@/db/schemas/requests';
import { ministryActivities } from '@/db/schemas/activities';

// --- TYPES ---
type OrgUnit = {
  id: string;
  name: string;
  type: string;
  children?: OrgUnit[];
  activeServices: string[];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function getBookedSlots(date: string, serviceId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select('preferred_time')
    .eq('preferred_date', date)
    .eq('service_id', serviceId); 

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  return data.map((row) => row.preferred_time);
}


export async function submitRequest(formData: any) {

  const safeAge = formData.age === '' ? null : Number(formData.age);

  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  const trackingNumber = `REQ-${timestamp}-${randomStr}`;

  const { data, error } = await supabase
    .from('requests')
    .insert({
      tracking_number: trackingNumber, // New column for tracking number
      // Map frontend state names to Supabase column names
      first_name: formData.firstName,
      last_name: formData.lastName,
      birthday: formData.birthday, // Can be used in the future for duplication check
      age: safeAge,
      gender: formData.gender,
      
      contact_number: formData.phone, // From Step 3
      email: formData.email,          // From Step 3
      
      city: formData.city,
      barangay: formData.barangay,
      
      service_id: formData.ministry,
      concern_details: formData.concernDetails, // The text area
      
      preferred_date: formData.date,
      preferred_time: formData.selectedTime,
      
      status: 'pending' // Default status
    })
    .select();

  if (error) {
    // Check if it's the specific "Unique Constraint" error (Double Booking)
    if (error.code === '23505') { 
      return { success: false, message: 'Sorry, that time slot was taken just now. Please try another.' };
    }
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

/**
 * Saves all active services and their schedules for a specific location.
 */
export async function saveLocationServices(
    orgId: string, 
    activeServiceIds: string[], 
    schedules: Record<string, { days: string[], slots: string[] }>
) {
  try {
    // A. Clear out the old services for this specific parish
    await db.delete(organizationServices)
            .where(eq(organizationServices.organizationId, orgId));

    if (activeServiceIds.length === 0) {
        revalidatePath('/admin/services'); 
        revalidatePath(`/directory/parish/${orgId}`); 
        return { success: true };
    }

    // C. Format the new data for insertion
    const dataToInsert = activeServiceIds.map(serviceId => {
        const key = `${orgId}_${serviceId}`;
        const sched = schedules[key];
        
        // Re-combine the arrays into a single string for the database
        const daysStr = sched?.days?.length ? sched.days.join(',') : '';
        const slotsStr = sched?.slots?.length ? sched.slots.join(',') : '';
        const scheduleString = `${daysStr} | ${slotsStr}`;

        return {
            organizationId: orgId,
            serviceId: serviceId,
            schedule: scheduleString,
            description: "Contact the parish for more details regarding this ministry." 
        };
    });

    // D. Insert the new active services
    await db.insert(organizationServices).values(dataToInsert);

    // refresh the UI so the changes show up immediately
    revalidatePath('/admin/services');
    revalidatePath(`/directory/parish/${orgId}`); 

    return { success: true };
  } catch (error) {
    console.error("Error saving configs:", error);
    return { success: false, message: "Database Error" };
  }
}

/**
 * Fetches the 2-level organization tree (Diocese -> Parishes) 
 * and their configured schedules.
 */
export async function fetchServiceConfigurations() {
  try {
    // A. Fetch all organizations
    const allOrgs = await db.select().from(organizations);
    
    // B. Fetch all active service links
    const activeLinks = await db.select().from(organizationServices);

    const masterServices = await db.select().from(services);

    // Helper: Find active services for a specific parish
    const getActiveServiceIds = (orgId: string) => {
        return activeLinks
            .filter(link => link.organizationId === orgId)
            .map(link => link.serviceId);
    };

    // Helper: Recursively build the tree
    const buildTree = (parentId: string | null = null): OrgUnit[] => {
      return allOrgs
        .filter(org => org.parentId === parentId)
        .map(org => ({
          id: org.id,
          name: org.name,
          type: org.type,
          activeServices: getActiveServiceIds(org.id),
          children: buildTree(org.id),
        }));
    };

    // Start the tree at the top level (where parentId is null, i.e., the Diocese)
    const tree = buildTree(null);

    // C. Format the schedules to match the UI state
    // Expects: { "orgId_serviceId": { days: ['Mon'], slots: ['09:00 AM'] } }
    const schedules: Record<string, { days: string[], slots: string[] }> = {};
    activeLinks.forEach(link => {
        const key = `${link.organizationId}_${link.serviceId}`;
        
        // parse the raw schedule string from the database (e.g., "Mon,Tue | 09:00 AM,10:00 AM")
        const [daysStr, slotsStr] = (link.schedule || "").split(" | ");
        
        schedules[key] = {
            days: daysStr ? daysStr.split(",") : [],
            slots: slotsStr ? slotsStr.split(",") : []
        };
    });

    return { success: true, tree, schedules, allServices: masterServices };
  } catch (error) {
    console.error("Error fetching configs:", error);
    return { success: false, tree: [], schedules: {} };
  }
}



export async function submitAssistanceRequest(data: {
  parishId: string;
  serviceId: string;
  name: string;
  email?: string;
  contactNumber?: string;
  message?: string;
}) {
  try {
    // 1. Basic Validation
    if (!data.name || data.name.trim() === '') return { success: false, message: "Name is required." };
    if (!data.email && !data.contactNumber) return { success: false, message: "Provide an email or contact number." };

    // --- INVISIBLE SPAM PROTECTION ---
    // 2. Check for existing pending requests from person that made a request already
    
    // Dynamic condition: check if either the email OR the phone matches
    const contactConditions = [];
    if (data.email) contactConditions.push(eq(assistanceRequests.email, data.email));
    if (data.contactNumber) contactConditions.push(eq(assistanceRequests.contactNumber, data.contactNumber));

    // ...existing code...
    const [existingRequest] = await db
      .select()
      .from(assistanceRequests)
      .where(
        and(
          eq(assistanceRequests.organizationId, data.parishId),
          eq(assistanceRequests.serviceId, data.serviceId),
          eq(assistanceRequests.status, 'pending'),
          or(...contactConditions)
        )
      )
      .limit(1);
    // ...existing code...

    if (existingRequest) {
      return { 
        success: false, 
        message: "You already have a pending request for this service. Please wait for the parish to contact you." 
      };
    }
    // --- END SPAM PROTECTION ---

    // 3. Insert into Supabase 
    await db.insert(assistanceRequests).values({
      organizationId: data.parishId,
      serviceId: data.serviceId,
      requesterName: data.name,
      email: data.email || null, 
      contactNumber: data.contactNumber || null,
      message: data.message || null,
    });

    return { success: true, message: "Request successfully submitted." };
  } catch (error) {
    console.error("Error submitting assistance request:", error);
    return { success: false, message: "A database error occurred. Please try again." };
  }
}

export async function updateRequestStatus(
  requestId: string, 
  // Extracting the exact type from the schema to ensure TypeScript safety
  newStatus: typeof requestStatusEnum.enumValues[number] 
) {
  try {
    await db.update(assistanceRequests)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(assistanceRequests.id, requestId));
      
    revalidatePath('/admin/requests'); // refresh instantly the tables
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false };
  }
}


export async function submitMinistryActivity(data: {
  parishId: string;
  serviceId: string;
  activityDate: string; 
  details: any; // JSON payload holder
}) {
  try {
    if (!data.parishId || !data.activityDate) {
      return { success: false, message: "Parish and Date are required." };
    }

    await db.insert(ministryActivities).values({
      organizationId: data.parishId,
      serviceId: data.serviceId,
      activityDate: data.activityDate,
      details: data.details, 
    });

    return { success: true, message: "Activity successfully logged!" };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false, message: "Database error occurred." };
  }
}