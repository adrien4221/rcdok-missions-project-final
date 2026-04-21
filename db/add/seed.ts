import { db } from "@/db/index"
import { organizations } from "@/db/schemas/organizations";

// don't run again, already added to database
async function seedNewHierarchy() {
  // const VIC_ID = "f18afa4c-6b80-4ba8-8228-345d144c1be4";
  const DIOCESE_ID = "192e99b7-f786-4e6b-8634-b37ed4d60bb1";

  console.log("Creating new Vicariate...");

  const [newVicariate] = await db.insert(organizations).values({
    name: "External",
    type: "vicariate" as const,
    parentId: DIOCESE_ID,
  }).returning({ id: organizations.id });

  console.log(`Created Vicariate with ID: ${newVicariate.id}`);

  const newParishes = [
    {
      name: "Kristong Hari Chapel",
      address: "Montalban, Rizal",
      type: "chapel" as const,
      parentId: newVicariate.id
    },
    {
      name: "Correctional Institute of Women",
      address: "Mandaluyong City",
      type: "station" as const,
      parentId: newVicariate.id
    },
    {
      name: "Tierra Madre Community",
      address: "Zamboanga City",
      type: "station" as const,
      parentId: newVicariate.id
    }
  ];

  await db.insert(organizations).values(newParishes);
  console.log("Added stations to the Vicariate");
}

seedNewHierarchy();