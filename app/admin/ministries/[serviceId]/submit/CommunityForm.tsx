'use client';

import { useState } from 'react';
import { submitMinistryActivity } from '@/app/actions';
import { CheckCircle2 } from 'lucide-react';

type Parish = { id: string; name: string };

export default function CommunityForm({ serviceId, parishes }: { serviceId: string, parishes: Parish[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATABASE REQUIRED FIELDS ---
  const [parishId, setParishId] = useState(''); // Host Parish
  const [activityDate, setActivityDate] = useState('');

  // --- SECTION 1: Activity Information ---
  const [activityTitle, setActivityTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [programType, setProgramType] = useState('Outreach');

  // --- SECTION 2: Details & People ---
  const [targetGroup, setTargetGroup] = useState('Families');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [volunteers, setVolunteers] = useState('');
  const [coordinator, setCoordinator] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct the JSON payload
    const jsonPayload = {
      activity_title: activityTitle,
      time: time,
      location_barangay: location,
      program_type: programType,
      target_group: targetGroup,
      beneficiaries: Number(beneficiaries),
      volunteers: Number(volunteers),
      coordinator: coordinator
    };

    // send to database via server action
    const result = await submitMinistryActivity({
      serviceId,
      parishId, 
      activityDate, 
      details: jsonPayload
    });

    setIsSubmitting(false);
    
    if (result.success) {
      alert("Community Activity Successfully Logged!");
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Activity Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">1. Activity Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
            <input required type="text" placeholder="e.g. Coastal Clean-up Drive" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organizing Parish</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Parish...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Location / Barangay</label>
            <input required type="text" placeholder="e.g. Brgy. San Juan Covered Court" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
            <select value={programType} onChange={e => setProgramType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Feeding Program">Feeding Program</option>
              <option value="Medical Mission">Medical Mission</option>
              <option value="Outreach">Outreach</option>
              <option value="Relief Distribution">Relief Distribution</option>
              <option value="Environmental">Environmental</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Target Group & People */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Impact & Participants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Group</label>
            <select value={targetGroup} onChange={e => setTargetGroup(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Youth">Youth</option>
              <option value="Families">Families</option>
              <option value="Senior Citizens">Senior Citizens</option>
              <option value="General Public">General Public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Coordinator</label>
            <input required type="text" placeholder="e.g. Bro. Mark Santos" value={coordinator} onChange={e => setCoordinator(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beneficiaries (Estimated)</label>
            <input required type="number" min="0" placeholder="e.g. 200" value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Volunteers</label>
            <input required type="number" min="0" placeholder="e.g. 15" value={volunteers} onChange={e => setVolunteers(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-10 py-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
          {isSubmitting ? 'Saving Activity...' : 'Submit Community Activity'} <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}