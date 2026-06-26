'use client';

import { useState, useEffect } from 'react';
import { submitMinistryActivity } from '@/app/actions/actions';
import { Plus, Trash2, CheckCircle2, Receipt, MapPin, Utensils, X } from 'lucide-react';

type Parish = { id: string; name: string };
type MarketExpense = { item: string; cost: string };

export default function ActivityForm({ 
  serviceId, 
  parishes = [], 
  initialData, 
  onSuccess 
}: { 
  serviceId: string; 
  parishes?: Parish[];
  initialData?: any;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [parishId, setParishId] = useState('');
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');
  const [foodServed, setFoodServed] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<string | number>('');
  const [marketExpenses, setMarketExpenses] = useState<MarketExpense[]>([{ item: '', cost: '' }]);

  useEffect(() => {
    if (initialData) {
      const currentId = initialData.organizationId || initialData.parishId;
      setParishId(currentId || '');
      console.log("ActivityForm: Loaded Initial ID ->", initialData.id);      
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0] 
        : '';
      setDate(formattedDate);
      
      setArea(initialData.details?.area || '');
      setFoodServed(initialData.details?.food_served || '');
      setBeneficiaries(initialData.details?.beneficiaries || '');
      setMarketExpenses(initialData.details?.market_expenses || [{ item: '', cost: '' }]);
    }
  }, [initialData]);

  const handleAddExpense = () => setMarketExpenses([...marketExpenses, { item: '', cost: '' }]);
  
  const handleRemoveExpense = (index: number) => {
    if (marketExpenses.length > 1) {
      setMarketExpenses(marketExpenses.filter((_, i) => i !== index));
    }
  };

  const handleUpdateExpense = (index: number, field: keyof MarketExpense, value: string) => {
    const newExpenses = [...marketExpenses];
    newExpenses[index][field] = value;
    setMarketExpenses(newExpenses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting ActivityID:", initialData?.id);

    const payload = {
      serviceId,
      parishId,
      activityDate: date,
      activityId: initialData?.id || null, 
      details: {
        area,
        food_served: foodServed,
        beneficiaries: Number(beneficiaries),
        market_expenses: marketExpenses 
      }
    };

    const result = await submitMinistryActivity(payload);

    setIsSubmitting(false);
    
    if (result.success) {
      if (onSuccess) {
        onSuccess(); 
      } else {
        alert("Activity Saved Successfully!");
        setParishId('');
        setDate('');
        setArea('');
        setFoodServed('');
        setBeneficiaries('');
        setMarketExpenses([{ item: '', cost: '' }]);
      }
    } else {
      alert(result.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          <MapPin size={20} /> 1. General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission Station</label>
            <select 
              required 
              value={parishId} 
              onChange={e => setParishId(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0060AF] bg-white text-sm"
            >
              <option value="" disabled>Select Station...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Activity</label>
            <input 
              required 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Area</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Purok 4" 
              value={area} 
              onChange={e => setArea(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          <Utensils size={20} /> 2. Service Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Served</label>
            <input 
              required 
              type="text" 
              placeholder="Menu item" 
              value={foodServed} 
              onChange={e => setFoodServed(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Beneficiaries</label>
            <input 
              required 
              type="number" 
              value={beneficiaries} 
              onChange={e => setBeneficiaries(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          <Receipt size={20} /> 3. Market Expenses Breakdown
        </h3>
        <div className="space-y-3">
          {marketExpenses.map((expense, index) => (
            <div key={index} className="flex gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex-1">
                <input 
                  required
                  placeholder="Item" 
                  value={expense.item} 
                  onChange={e => handleUpdateExpense(index, 'item', e.target.value)} 
                  className="w-full p-2.5 text-sm rounded-lg border border-gray-300 outline-none" 
                />
              </div>
              <div className="w-32">
                <input 
                  required
                  type="number" 
                  placeholder="Cost"
                  value={expense.cost} 
                  onChange={e => handleUpdateExpense(index, 'cost', e.target.value)} 
                  className="w-full p-2.5 text-sm rounded-lg border border-gray-300 outline-none" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveExpense(index)} 
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddExpense} className="text-sm font-bold text-[#0060AF] flex items-center gap-2 px-1">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="pt-8 border-t flex gap-4">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1 bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? 'Processing...' : initialData ? 'Update Activity Report' : 'Submit Activity Report'} 
          <CheckCircle2 size={20} />
        </button>
        {onSuccess && (
          <button type="button" onClick={onSuccess} className="px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}