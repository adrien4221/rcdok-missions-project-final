'use client';

import { useState } from 'react';
import { submitMinistryActivity } from '@/app/actions';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

type Parish = { id: string; name: string };
type ResourceItem = { item: string; quantity: string; unit: string };

const STANDARD_ITEMS = ["Rice", "Canned Goods", "Vegetables", "Meat/Poultry", "Water", "Other"];
const STANDARD_UNITS = ["Kilograms", "Sacks", "Boxes", "Packs", "Pieces", "Liters"];

export default function ActivityForm({ serviceId, parishes }: { serviceId: string, parishes: Parish[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SECTION 1 STATE ---
  const [parishId, setParishId] = useState('');
  const [date, setDate] = useState('');
  const [programType, setProgramType] = useState('Lunch');

  // --- SECTION 2 STATE ---
  const [foodServed, setFoodServed] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');

  // --- SECTION 3 STATE ---
  const [resources, setResources] = useState<ResourceItem[]>([
    { item: 'Rice', quantity: '', unit: 'Kilograms' }
  ]);

  // Dynamic Array Handlers
  const handleAddResource = () => {
    setResources([...resources, { item: 'Rice', quantity: '', unit: 'Kilograms' }]);
  };

  const handleRemoveResource = (indexToRemove: number) => {
    setResources(resources.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdateResource = (index: number, field: keyof ResourceItem, value: string) => {
    const newResources = [...resources]; 
    newResources[index][field] = value;  
    setResources(newResources);          
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct JSON payload
    const jsonPayload = {
      program_type: programType,
      food_served: foodServed,
      beneficiaries: Number(beneficiaries),
      resources_utilized: resources
    };

    // send to server action
    const result = await submitMinistryActivity({
      serviceId,
      parishId,
      activityDate: date,
      details: jsonPayload
    });

    setIsSubmitting(false);
    
    if (result.success) {
      alert("Activity Logged!");
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: General Info */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">1. General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station Location</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Parish...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Activity</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
            <select value={programType} onChange={e => setProgramType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Details */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Served</label>
            <input required type="text" placeholder="e.g. Chicken Lugaw with Egg" value={foodServed} onChange={e => setFoodServed(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Beneficiaries (Kids Fed)</label>
            <input required type="number" min="0" placeholder="e.g. 150" value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
        </div>
      </div>

      {/* SECTION 3: Resource Utilization */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">3. Resource Utilization</h3>
        
        {resources.map((resource, index) => (
          <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-500 mb-1">Resource Item</label>
              <select value={resource.item} onChange={e => handleUpdateResource(index, 'item', e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none">
                {STANDARD_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="w-32">
              <label className="block text-xs text-gray-500 mb-1">Quantity</label>
              <input type="number" step="0.1" min="0" required value={resource.quantity} onChange={e => handleUpdateResource(index, 'quantity', e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none" />
            </div>

            <div className="w-40">
              <label className="block text-xs text-gray-500 mb-1">Unit</label>
              <select value={resource.unit} onChange={e => handleUpdateResource(index, 'unit', e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none">
                {STANDARD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="pt-5">
              <button type="button" onClick={() => handleRemoveResource(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30" disabled={resources.length === 1}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddResource} className="flex items-center gap-2 text-sm font-semibold text-[#0060AF] hover:text-blue-800 transition-colors mt-2">
          <Plus size={16} /> Add Another Resource
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-10 py-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
          {isSubmitting ? 'Saving Activity...' : 'Submit Activity Report'} <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}