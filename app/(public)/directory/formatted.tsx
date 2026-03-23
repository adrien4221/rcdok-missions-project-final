"use client";

import { useState } from "react";
import { Search, Coffee, Shield, Smile, PlusSquare, Globe } from "lucide-react";
import Link from "next/link";
import { db } from "@/db"; // <-- Adjust this path to where your db/index.ts is!
import { organizations } from "@/db/schemas/organizations"; // <-- Adjust this path too
import { eq } from "drizzle-orm";

// --- MOCK DATA ---
const categories = [
  { id: "Nutrition", label: "Nutrition", icon: Coffee },
  { id: "Legal Aid", label: "Legal Aid", icon: Shield },
  { id: "Mental Health", label: "Mental Health", icon: Smile },
  { id: "Drug Rehab", label: "Drug Rehab", icon: PlusSquare },
  { id: "Community", label: "Community", icon: Globe },
];

const mockOrganizations = [
  {
    id: "1",
    name: "St. Mary's Parish",
    address: "Manila Cathedral, Manila, Philippines", // Used a real address so the iframe works beautifully!
    mapQuery: "Manila+Cathedral",
    services: [
      { id: "s1", name: "Food Pantry", category: "Nutrition", icon: Coffee },
      { id: "s2", name: "Legal Aid", category: "Legal Aid", icon: Shield },
    ],
  },
  {
    id: "2",
    name: "Holy Family Church",
    address: "Quiapo Church, Manila, Philippines",
    mapQuery: "Quiapo+Church",
    services: [
      {
        id: "s3",
        name: "Community Center",
        category: "Community",
        icon: Globe,
      },
    ],
  },
  {
    id: "3",
    name: "Good Shepherd Chapel",
    address: "San Agustin Church, Manila, Philippines",
    mapQuery: "San+Agustin+Church+Manila",
    services: [
      {
        id: "s4",
        name: "Support Groups",
        category: "Mental Health",
        icon: Smile,
      },
    ],
  },
];

export default function ResourceDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // --- FILTERING LOGIC ---
  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.services.some((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = activeCategory
      ? org.services.some((s) => s.category === activeCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  // Find the selected organization object to get its map query
  const selectedOrg = mockOrganizations.find((org) => org.id === selectedOrgId);

  // The default map to show when nothing is clicked
  const defaultMapQuery = "Catholic+Diocese";

  return (
    <div className="min-h-screen bg-[#def3fd] font-sans pb-12">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white">
        {/* logo */}
        <div className="flex items-center gap-4">
          {/* logo container */}
          <div className="w-10 h-10 bg-gradient-to-b from-sky-400 to-red-700 rounded-b-xl rounded-t-sm flex items-center justify-center text-white text-[9px] font-bold shadow-sm border border-gray-100">
            LOGO {/* Ilagay nalang yung logo dito */}
          </div>
          <span className="text-xl font-medium text-gray-900 tracking-tight">
            Diocesan Mission Portal
          </span>
        </div>

        {/* admin login button */}
        <Link
          href="/login"
          className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm"
        >
          Admin Login
        </Link>
      </header>

      {/* SEARCH & FILTERS */}
      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-2xl mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for services or ministries"
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-sm border-none focus:ring-2 focus:ring-[#12c2e9] outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(isActive ? null : cat.id);
                    setSelectedOrgId(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all shadow-sm border
                    ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-blue-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Resource Directory
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: The Cards */}
          <div className="flex flex-col gap-4 h-[calc(100vh-360px)]">
            {filteredOrganizations.length === 0 ? (
              <p className="text-gray-500 italic p-4">
                No locations found matching your criteria.
              </p>
            ) : (
              filteredOrganizations.map((org) => {
                const isSelected = selectedOrgId === org.id;

                return (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrgId(isSelected ? null : org.id)}
                    className={`cursor-pointer rounded-2xl p-6 transition-all border
                      ${
                        isSelected
                          ? "bg-white shadow-md border-blue-500 ring-2 ring-blue-100 transform scale-[1.02]"
                          : "bg-white shadow-sm border-gray-50 hover:border-blue-200 hover:shadow-md"
                      }`}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">{org.address}</p>
                    <div className="flex items-end justify-between">
                      <div className="flex gap-6">
                        {org.services.map((service) => {
                          const ServiceIcon = service.icon;
                          return (
                            <div
                              key={service.id}
                              className="flex items-center gap-1.5 text-sm text-gray-600"
                            >
                              <ServiceIcon
                                size={16}
                                className="text-gray-700"
                              />
                              <span>{service.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      <Link
                        href={`/directory/${org.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm relative z-10"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: The Google Maps iFrame */}
          <div className="bg-white rounded-xl min-h-[500px] relative overflow-hidden shadow-sm border border-gray-200 sticky top-28 h-[calc(100vh-360spx)]">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              // The magic URL that generates the free embed map based on the query string
              src={`https://maps.google.com/maps?q=${
                selectedOrg ? selectedOrg.mapQuery : defaultMapQuery
              }&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}
