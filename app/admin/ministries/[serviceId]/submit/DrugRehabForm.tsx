'use client';

import { useState } from 'react';
import { submitMinistryActivity } from '@/app/actions';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type Parish = { id: string; name: string };

export default function DrugRehabForm({ serviceId, parishes }: { serviceId: string, parishes: Parish[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  // --- DATABASE REQUIRED FIELDS ---
  const [parishId, setParishId] = useState(''); 
  const [activityDate, setActivityDate] = useState(''); 

  // --- SECTION 1: Client Information ---
  const [clientName, setClientName] = useState(searchParams.get('clientName') || '');
  const [dob, setDob] = useState('');
  const [contactNumber, setContactNumber] = useState(searchParams.get('contactNumber') || '');
  const [primarySubstance, setPrimarySubstance] = useState('');

  // --- SECTION 2: Intake & Assessment ---
  const [priorityLevel, setPriorityLevel] = useState('Medium');
  const [referralSource, setReferralSource] = useState('Walk-in');

  // --- SECTION 3: Program & Session Details ---
  const [sessionType, setSessionType] = useState('Initial Intake');
  const [assignedProgram, setAssignedProgram] = useState('Outpatient');
  const [assignedCounselor, setAssignedCounselor] = useState('');
  const [sessionNotes, setSessionNotes] = useState(searchParams.get('reason') || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct the JSON payload
    const jsonPayload = {
      client_name: clientName,
      dob: dob,
      contact_number: contactNumber,
      primary_substance: primarySubstance,
      referral_source: referralSource,
      priority_level: priorityLevel,
      session_type: sessionType,
      assigned_program: assignedProgram,
      assigned_counselor: assignedCounselor,
      session_notes: sessionNotes
    };

    // send it to the database via server action
    const result = await submitMinistryActivity({
      serviceId,
      parishId, 
      activityDate, 
      details: jsonPayload
    });

    setIsSubmitting(false);
    
    if (result.success) {
      alert("Rehab Session Successfully Logged!");
      // Future Update: Reset form fields here
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Client Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">1. Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Full Name</label>
            <input required type="text" placeholder="e.g. Juan Dela Cruz" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input required type="tel" placeholder="0912 345 6789" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Substance of Dependency</label>
            <input required type="text" placeholder="e.g. Methamphetamine, Alcohol, Marijuana" value={primarySubstance} onChange={e => setPrimarySubstance(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Intake and Assessment */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Encounter Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Session/Intake</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Source</label>
            <select value={referralSource} onChange={e => setReferralSource(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Walk-in">Walk-in / Self</option>
              <option value="Family Member">Family Member</option>
              <option value="Barangay/LGU">Barangay / LGU</option>
              <option value="Parish Priest">Parish Priest</option>
              <option value="Law Enforcement">Law Enforcement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              Priority / Risk Level <AlertCircle size={14} className="text-orange-500"/>
            </label>
            <select value={priorityLevel} onChange={e => setPriorityLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Low">Low (Stable, Seeking Support)</option>
              <option value="Medium">Medium (Active Dependency)</option>
              <option value="High">High (Severe Withdrawal / Crisis)</option>
            </select>
          </div>

        </div>
      </div>

      {/* SECTION 3: Program Enrollment and Progress */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">3. Session & Program Logistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Station (Parish)</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Station/Parish...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Counselor / Facilitator</label>
            <input required type="text" placeholder="e.g. Dr. Santos or Bro. Mark" value={assignedCounselor} onChange={e => setAssignedCounselor(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
            <select value={sessionType} onChange={e => setSessionType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Initial Intake">Initial Intake</option>
              <option value="Psychiatrist Check-up">Psychiatrist Check-up</option>
              <option value="Individual Counseling">Individual Counseling</option>
              <option value="Group Support Session">Group Support Session</option>
              <option value="Family Counseling">Family Counseling</option>
              <option value="Program Completion">Program Completion / Graduation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Program Pathway</label>
            <select value={assignedProgram} onChange={e => setAssignedProgram(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Outpatient">Outpatient (Community-Based)</option>
              <option value="Inpatient">Inpatient Referral</option>
              <option value="Support Group Only">Support Group Only</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Encounter Notes</label>
            <textarea rows={4} placeholder="Summarize the session, client's progress, or next steps..." value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none" />
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-10 py-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
          {isSubmitting ? 'Saving Session...' : 'Log Rehab Session'} <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}