'use client';

import { useState, useEffect } from 'react';
import { submitMinistryActivity } from '@/app/actions/actions';
import { CheckCircle2, Shield } from 'lucide-react';

type Parish = { id: string; name: string };

interface CommunityFormProps {
  serviceId: string;
  parishes: Parish[];
  initialData?: any;
  onSuccess?: () => void;
}

const VICARIATES = [
  "Vicariate of San Roque",
  "Vicariate of San Bartolome",
  "Vicariate of Our Lady of Grace",
  "Vicariate of Sacred Heart of Jesus",
  "Vicariate of San Jose De Navotas",
  "External"
];

export default function CommunityForm({
  serviceId,
  parishes = [],
  initialData,
  onSuccess
}: CommunityFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [parishId, setParishId] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [vicariate, setVicariate] = useState('');
  const [totalMembers, setTotalMembers] = useState('');
  const [totalHouseholds, setTotalHouseholds] = useState('');
  const [leaderName, setLeaderName] = useState('');

  useEffect(() => {
    if (initialData) {

      const currentId =
        initialData.organizationId ||
        initialData.parishId;

      setParishId(currentId || '');

      console.log(
        "CommunityForm: Loaded Initial ID ->",
        initialData.id
      );

      const formattedDate = initialData.date
        ? new Date(initialData.date)
            .toISOString()
            .split('T')[0]
        : '';

      setActivityDate(formattedDate);

      setVicariate(
        initialData.details?.vicariate || ''
      );

      setTotalMembers(
        initialData.details?.total_members?.toString() || ''
      );

      setTotalHouseholds(
        initialData.details?.total_households?.toString() || ''
      );

      setLeaderName(
        initialData.details?.leader_name || ''
      );

    } else {

      setParishId('');
      setActivityDate('');
      setVicariate('');
      setTotalMembers('');
      setTotalHouseholds('');
      setLeaderName('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    console.log(
      "Submitting ActivityID:",
      initialData?.id
    );

    const payload = {
      serviceId,
      parishId,
      activityDate,

      // same pattern as ActivityForm
      activityId: initialData?.id || null,

      details: {
        vicariate,
        total_members: Number(totalMembers),
        total_households:
          Number(totalHouseholds) || 0,
        leader_name: leaderName
      }
    };

    const result =
      await submitMinistryActivity(payload);

    setIsSubmitting(false);

    if (result.success) {

      if (onSuccess) {
        onSuccess();
      } else {

        alert(
          "BEC Membership Record Successfully Saved!"
        );

        setParishId('');
        setActivityDate('');
        setVicariate('');
        setTotalMembers('');
        setTotalHouseholds('');
        setLeaderName('');
      }

    } else {

      alert(
        result.message ||
        "An unexpected error occurred saving the record."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Jurisdictional Context */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          <Shield size={20} className="text-[#0060AF]" /> 1. Church Jurisdiction & Leadership
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vicariate</label>
            <select required value={vicariate} onChange={e => setVicariate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none bg-white text-sm">
              <option value="" disabled>Select Vicariate...</option>
              {VICARIATES.map((v, idx) => <option key={idx} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parish / Mission Station</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none bg-white text-sm">
              <option value="" disabled>Select Parish...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Record / Census Date</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BEC Coordinator</label>
            <input required type="text" placeholder="e.g. John Doe" value={leaderName} onChange={e => setLeaderName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none text-sm" />
          </div>

        </div>
      </div>

      {/* SECTION 2: Membership Census Tracker */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Membership Count Census</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Active Members Count</label>
            <input required type="number" min="0" placeholder="e.g. 150" value={totalMembers} onChange={e => setTotalMembers(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none font-semibold text-lg" />
            <p className="text-xs text-gray-400 mt-1">This aggregates directly into your monthly growth percentage charts.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Involved Households / Families</label>
            <input type="number" min="0" placeholder="e.g. 42" value={totalHouseholds} onChange={e => setTotalHouseholds(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none text-gray-700 text-sm" />
          </div>

        </div>
      </div>

      {/* Submit Controls Row */}
      <div className="pt-8 border-t flex gap-4">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all">
          {isSubmitting ? 'Processing...' : initialData ? 'Update Census Report' : 'Submit Membership Count'} 
          <CheckCircle2 size={20} />
        </button>
        {onSuccess && (
          <button type="button" onClick={onSuccess} className="px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}