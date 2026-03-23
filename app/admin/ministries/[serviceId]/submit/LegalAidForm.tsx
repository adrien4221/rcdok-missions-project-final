'use client';

import { useState } from 'react';
import { submitMinistryActivity } from '@/app/actions';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type Parish = { id: string; name: string };

export default function LegalAidForm({ serviceId, parishes }: { serviceId: string, parishes: Parish[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATABASE REQUIRED FIELD ---
  const [activityDate, setActivityDate] = useState('');

  // --- SECTION 1: Client Information ---
  const [clientName, setClientName] = useState('');
  const [dob, setDob] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // --- SECTION 2: Details ---
  const [problemType, setProblemType] = useState('Civil');
  const [priorityLevel, setPriorityLevel] = useState('Medium');
  const [problemDescription, setProblemDescription] = useState('');

  // --- SECTION 3: Assignment & Notes ---
  const [assignedLawyer, setAssignedLawyer] = useState('');
  const [parishId, setParishId] = useState(''); 
  const [initialNotes, setInitialNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct the JSON payload
    const jsonPayload = {
      client_name: clientName,
      dob: dob,
      contact_number: contactNumber,
      problem_type: problemType,
      priority_level: priorityLevel,
      problem_description: problemDescription,
      assigned_lawyer: assignedLawyer,
      initial_notes: initialNotes
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
      alert("Legal Intake Successfully Logged!");
      // Future Update: Clear form here
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Client Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">1. Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Intake</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Full Name</label>
            <input required type="text" placeholder="Juan Dela Cruz" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input required type="tel" placeholder="0912 345 6789" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Details */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          2. Case Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Type</label>
            <select value={problemType} onChange={e => setProblemType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Civil">Civil</option>
              <option value="Family">Family</option>
              <option value="Labor">Labor</option>
              <option value="Property">Property</option>
              <option value="Criminal">Criminal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              Priority Level <AlertCircle size={14} className="text-orange-500"/>
            </label>
            <select value={priorityLevel} onChange={e => setPriorityLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Low">Low (Routine/Inquiry)</option>
              <option value="Medium">Medium (Standard Case)</option>
              <option value="High">High (Urgent/Time-Sensitive)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description</label>
            <textarea required rows={4} placeholder="Describe the legal issue in detail..." value={problemDescription} onChange={e => setProblemDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* SECTION 3: Assignment and Notes */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">3. Assignment & Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Ministry Station</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Station/Parish...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Lawyer</label>
            <input type="text" placeholder="e.g. Atty. Reyes (Optional)" value={assignedLawyer} onChange={e => setAssignedLawyer(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes / Next Steps</label>
            <textarea rows={3} placeholder="What actions were taken or advised today?" value={initialNotes} onChange={e => setInitialNotes(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-10 py-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
          {isSubmitting ? 'Saving Intake...' : 'Submit Legal Intake'} <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}