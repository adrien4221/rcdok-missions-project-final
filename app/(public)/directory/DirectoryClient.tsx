'use client';

import { useState } from 'react';
import { Search, Coffee, Shield, Smile, PlusSquare, Globe, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Updated shape to include mapped category
type ServiceProp = {
  id: string;
  name: string;
  category: string;
}

type OrganizationProp = {
  id: string;
  name: string;
  address: string;
  mapQuery: string;
  services: ServiceProp[]; // array of services with category info for filtering
};

const categories = [
  { id: 'Nutrition', label: 'Nutrition', icon: Coffee },
  { id: 'Legal Aid', label: 'Legal Aid', icon: Shield },
  { id: 'Mental Health', label: 'Mental Health', icon: Smile },
  { id: 'Drug Rehab', label: 'Drug Rehab', icon: PlusSquare },
  { id: 'Community', label: 'Community', icon: Globe },
  { id: 'Civil Registry', label: 'Civil Registry', icon: FileText },
];

export default function DirectoryClient({ initialOrganizations }: { initialOrganizations: OrganizationProp[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // --- FILTERING LOGIC ---
  const filteredOrganizations = initialOrganizations.filter((org) => {
    // 1. Check both org name and services name when searching
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Check if any of the services match the search query
    const matchesCategory = activeCategory 
      ? org.services.some(s => s.category === activeCategory)
      : true;

    // Must match both conditions to show up
    return matchesSearch && matchesCategory; 
  });

  const selectedOrg = initialOrganizations.find(org => org.id === selectedOrgId);
  const defaultMapQuery = "Diocese+of+Kalookan";

  return (
    <div className="min-h-screen bg-[#def3fd] font-sans pb-12">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white">
        <div className="flex items-center gap-4">
            <Image 
              src="/Diocese-of-Kalookan-Logo.png"     
              alt="Diocese Logo" 
              width={32}          
              height={32} 
              className="rounded-md" 
            />
          <span className="text-xl font-medium text-gray-900 tracking-tight">
            Diocesan Mission Portal
          </span>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                    setSelectedOrgId(null); // Reset map selection on category change
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all shadow-sm border
                    ${isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: The Cards */}
          <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-[calc(100vh-320px)] min-h-[500px] pr-2 pb-4">
            {filteredOrganizations.length === 0 ? (
              <div className="text-center p-8 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-600 font-medium">No locations found.</p>
                <p className="text-sm text-gray-500 mt-1">Try selecting a different ministry or adjusting your search.</p>
              </div>
            ) : (
              filteredOrganizations.map((org) => {
                const isSelected = selectedOrgId === org.id;
                
                return (
                  <div 
                    key={org.id} 
                    onClick={() => setSelectedOrgId(isSelected ? null : org.id)}
                    className={`cursor-pointer rounded-2xl p-6 transition-all border
                      ${isSelected 
                        ? 'bg-white shadow-md border-blue-500 ring-2 ring-blue-100 transform scale-[1.02]' 
                        : 'bg-white shadow-sm border-gray-50 hover:border-blue-200 hover:shadow-md'
                      }`}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{org.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{org.address || 'Address not available'}</p>
                    
                    {/* Display the active services as visual tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {org.services.map(s => (
                        <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                          {s.category}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between mt-2 pt-4 border-t border-gray-100">
                      <Link 
                        href={`/directory/parish/${org.id}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm relative z-10 flex items-center gap-1"
                      >
                        View Details &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: The Google Maps iFrame */}
          <div className="bg-white rounded-xl relative overflow-hidden shadow-sm border border-gray-200 sticky top-28 h-[calc(100vh-320px)] min-h-[500px]">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedOrg ? selectedOrg.mapQuery : defaultMapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>

        </div>
      </main>
    </div>
  );
}