'use client';

import { useState, useEffect } from 'react';
import { submitMinistryActivity } from '@/app/actions/actions';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

type Parish = {
  id: string;
  name: string;
};

interface MentalHealthFormProps {
  serviceId: string;
  parishes: Parish[];
  initialData?: any;
  onSuccess?: () => void;
}

export default function MentalHealthForm({
  serviceId,
  parishes = [],
  initialData,
  onSuccess,
}: MentalHealthFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATABASE REQUIRED FIELDS ---
  const [parishId, setParishId] = useState(''); 
  const [activityDate, setActivityDate] = useState(''); 

  // --- SECTION 1: Client Information ---
  const [clientName, setClientName] = useState('');
  const [dob, setDob] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // --- SECTION 2: Consultation Details ---
  const [primaryReason, setPrimaryReason] = useState('');
  const [referralSource, setReferralSource] = useState('Walk-in');
  const [sessionType, setSessionType] = useState('Initial Intake');

  // --- SECTION 3: Clinical Assessment & Notes ---
  const [symptoms, setSymptoms] = useState('');
  const [riskLevel, setRiskLevel] = useState('Low');
  const [assignedCounselor, setAssignedCounselor] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct JSON payload
    const jsonPayload = {
      client_name: clientName,
      dob: dob,
      contact_number: contactNumber,
      primary_reason: primaryReason,
      referral_source: referralSource,
      session_type: sessionType,
      risk_level: riskLevel,
      symptoms_observed: symptoms,
      assigned_counselor: assignedCounselor,
      session_notes: sessionNotes
    };

    // 2. Send it to the database
    const result = await submitMinistryActivity({
      serviceId,
      parishId,
      activityDate,
      activityId: initialData?.id || null,
      details: jsonPayload
    });

    setIsSubmitting(false);
    
    if (result.success) {

      if (onSuccess) {

        onSuccess();

      } else {

        alert(
          initialData
            ? "Mental Health Session Updated!"
            : "Mental Health Session Successfully Logged!"
        );

        setParishId('');
        setActivityDate('');
        setClientName('');
        setDob('');
        setContactNumber('');
        setPrimaryReason('');
        setReferralSource('Walk-in');
        setSessionType('Initial Intake');
        setSymptoms('');
        setRiskLevel('Low');
        setAssignedCounselor('');
        setSessionNotes('');
      }

    } else {

      alert(
        result.message ||
        "An unexpected error occurred saving the session."
      );

    }
  };

  useEffect(() => {
    if (initialData) {

      setParishId(
        initialData.organizationId ||
        initialData.parishId ||
        ''
      );

      setActivityDate(
        initialData.date
          ? new Date(initialData.date)
              .toISOString()
              .split('T')[0]
          : ''
      );

      setClientName(
        initialData.details?.client_name || ''
      );

      setDob(
        initialData.details?.dob || ''
      );

      setContactNumber(
        initialData.details?.contact_number || ''
      );

      setPrimaryReason(
        initialData.details?.primary_reason || ''
      );

      setReferralSource(
        initialData.details?.referral_source || 'Walk-in'
      );

      setSessionType(
        initialData.details?.session_type || 'Initial Intake'
      );

      setSymptoms(
        initialData.details?.symptoms_observed || ''
      );

      setRiskLevel(
        initialData.details?.risk_level || 'Low'
      );

      setAssignedCounselor(
        initialData.details?.assigned_counselor || ''
      );

      setSessionNotes(
        initialData.details?.session_notes || ''
      );

    } else {

      setParishId('');
      setActivityDate('');
      setClientName('');
      setDob('');
      setContactNumber('');
      setPrimaryReason('');
      setReferralSource('Walk-in');
      setSessionType('Initial Intake');
      setSymptoms('');
      setRiskLevel('Low');
      setAssignedCounselor('');
      setSessionNotes('');
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Client Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">1. Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Full Name</label>
            <input required type="text" placeholder="e.g. Maria Santos" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
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

      {/* SECTION 2: Consultation Details */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Encounter Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Session</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
            <select value={sessionType} onChange={e => setSessionType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Initial Intake">Initial Intake</option>
              <option value="Follow-up Counseling">Follow-up Counseling</option>
              <option value="Crisis Intervention">Crisis Intervention</option>
              <option value="Psychiatric Evaluation">Psychiatric Evaluation</option>
              <option value="Group Therapy">Group Therapy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Reason for Consultation</label>
            <input required type="text" placeholder="e.g. Grief, Anxiety, Family Issues" value={primaryReason} onChange={e => setPrimaryReason(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Source</label>
            <select value={referralSource} onChange={e => setReferralSource(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Walk-in">Walk-in / Self</option>
              <option value="Family/Friend">Family / Friend</option>
              <option value="Parish Priest">Parish Priest</option>
              <option value="School/Workplace">School / Workplace</option>
              <option value="Other">Other</option>
            </select>
          </div>

        </div>
      </div>

      {/* SECTION 3: Assessment & Assignment */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">3. Clinical Assessment & Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms Observed</label>
            <input required type="text" placeholder="e.g. Fatigue, loss of appetite, persistent crying" value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              Clinical Risk Level <AlertTriangle size={14} className="text-red-500"/>
            </label>
            <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Low">Low (Stable)</option>
              <option value="Moderate">Moderate (Needs Monitoring)</option>
              <option value="High">High (Immediate Intervention Required)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Station (Parish)</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Station...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Counselor</label>
            <input required type="text" placeholder="e.g. Dr. Gomez" value={assignedCounselor} onChange={e => setAssignedCounselor(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Report / Initial Assessment</label>
            <textarea rows={4} placeholder="Summarize the session and outline the treatment plan..." value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none" />
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t flex gap-4">

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
        >
          {isSubmitting
            ? 'Saving Session...'
            : initialData
            ? 'Update Session'
            : 'Log Mental Health Session'}

          <CheckCircle2 size={20} />
        </button>

        {onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className="px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}