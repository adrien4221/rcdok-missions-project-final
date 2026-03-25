import { db } from "@/db/index"
import { organizations } from "@/db/schemas/organizations";

// don't run again, already added to database
async function seedNewHierarchy() {
  const DIOCESE_ID = "192e99b7-f786-4e6b-8634-b37ed4d60bb1";

  console.log("Creating new Vicariate...");

  const [newVicariate] = await db.insert(organizations).values({
    name: "Vicariate of San Jose De Navotas",
    type: "vicariate" as const,
    parentId: DIOCESE_ID,
  }).returning({ id: organizations.id });

  console.log(`Created Vicariate with ID: ${newVicariate.id}`);

  const newParishes = [
    {
      name: "Diocesan Shrine & Parish of San Jose de Navotas",
      address: "1086 M. Naval St, Navotas City",
      type: "parish" as const,
      parentId: newVicariate.id 
    },
    {
      name: "Nuestra Señora De Los Remedios – Quasi Parish",
      address: "442 M. Naval St., NBBN, Navotas City",
      type: "quasi-parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "San Exequiel Moreno Parish",
      address: "Labahita cor. Langaray Sts., Ph 2. Kaunlaran Village 1409, Caloocan City",
      type: "parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "San Ildefonso Parish",
      address: "Estrella corner L. R. Yangco Sts., Navotas City",
      type: "parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "San Lorenzo Ruiz and Companion Martyrs Parisha & St. Francis of Assisi Parish",
      address: "Phase 1-C, Kaunlaran Village, North Bay, Boulevard South, Navotas City",
      type: "parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "San Roque De Navotas Parish",
      address: "M. Naval St., San Roque, Navotas City",
      type: "parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "Sta. Clare of Assisi Parish",
      address: "Maya-Maya Street, Alupihang Dagat St, Longos, Malabon City",
      type: "parish" as const,
      parentId: newVicariate.id
    },
    {
      name: "Sto. Niño De Pasion Parish",
      address: "4 Daanghari St., Daanghari, Navotas City",
      type: "parish" as const,
      parentId: newVicariate.id
    }
  ];

  await db.insert(organizations).values(newParishes);
  console.log("Added parishes to the new Vicariate");
}

seedNewHierarchy();