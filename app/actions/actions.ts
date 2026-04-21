"use server";

import { db } from "@/db/index";
import { organizations } from "@/db/schemas/organizations";
import { ministryActivities } from '@/db/schemas/activities';
import { services, organizationServices } from "@/db/schemas/services"; 
import { revalidatePath } from 'next/cache';
import { eq, desc } from "drizzle-orm";
import { ilike } from "drizzle-orm";

export async function fetchActiveStationsByServiceName(serviceName: string) {
  try {
    const activeStations = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        schedule: organizationServices.schedule 
      })
      .from(organizations)
      .innerJoin(
        organizationServices, 
        eq(organizations.id, organizationServices.organizationId)
      )
      .innerJoin(
        services,
        eq(organizationServices.serviceId, services.id)
      )
      .where(
        ilike(services.name, `%${serviceName}%`) 
      );

    return { success: true, data: activeStations };
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, data: [] };
  }
}

export async function fetchActivitiesWithPagination(serviceId: string, page: number = 1, limit: number = 7) {
  const offset = (page - 1) * limit;

  try {
    const data = await db
      .select({
        id: ministryActivities.id,
        date: ministryActivities.activityDate,
        details: ministryActivities.details,
        parishName: organizations.name,
        organizationId: organizations.id,
      })
      .from(ministryActivities)
      .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
      .where(eq(ministryActivities.serviceId, serviceId))
      .orderBy(desc(ministryActivities.activityDate))
      .limit(limit)
      .offset(offset);

    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function deleteActivity(id: string) {
  try {
    await db
      .delete(ministryActivities)
      .where(eq(ministryActivities.id, id));
    revalidatePath('/dashboard'); 
    
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete activity" 
    };
  }
}

export async function submitMinistryActivity(data: any) {
  const { activityId, serviceId, parishId, activityDate, details } = data;

  try {
    if (activityId) {
      await db.update(ministryActivities)
        .set({
          organizationId: parishId,
          activityDate: activityDate,
          details: details
        })
        .where(eq(ministryActivities.id, activityId));

      console.log("Activity updated:", activityId);
    } else {
      await db.insert(ministryActivities).values({
        serviceId,
        organizationId: parishId,
        activityDate,
        details
      });

      console.log("New activity created");
    }

    revalidatePath('/dashboard');
    console.log("Data in server action:", activityId);
    return { success: true };
  } catch (e) {
    return { success: false, message: "Error saving data" };
  }
}