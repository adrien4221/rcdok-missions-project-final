'use client';

import { useState, useEffect } from 'react';
import { submitMinistryActivity } from '@/app/actions/actions';
import { CheckCircle2, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type Parish = { id: string; name: string };

interface CivilRegistryFormProps {
  serviceId: string;
  parishes: Parish[];
  initialData?: any;
  onSuccess?: () => void;
}

export default function CivilRegistryForm({
  serviceId,
  parishes,
  initialData,
  onSuccess
}: CivilRegistryFormProps)

 {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  // --- DATABASE REQUIRED FIELDS ---
  const [parishId, setParishId] = useState(''); 
  const [activityDate, setActivityDate] = useState('');

  // --- SECTION 1: Record Information ---
  const [sacramentType, setSacramentType] = useState('Baptismal Registration');
  const [dateReceived, setDateReceived] = useState('');
  const [processingStaff, setProcessingStaff] = useState('');

  // --- SECTION 2: Applicant Form ---
  const [applicantName, setApplicantName] = useState(searchParams.get('clientName') || '');
  const [dob, setDob] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [civilStatus, setCivilStatus] = useState('Single');

  // --- SECTION 3: Remarks ---
  const [remarks, setRemarks] = useState(searchParams.get('reason') || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // construct the JSON payload
    const jsonPayload = {
      sacrament_type: sacramentType,
      applicant_name: applicantName,
      dob: dob,
      place_of_birth: placeOfBirth,
      gender: gender,
      civil_status: civilStatus,
      date_received: dateReceived,
      processing_staff: processingStaff,
      remarks: remarks
    };

    // send to database via server action
    const result = await submitMinistryActivity({
      activityId: initialData?.id || null,
      serviceId,
      parishId,
      activityDate,
      details: jsonPayload
    });

    setIsSubmitting(false);
    
    if (result.success) {

      if (onSuccess) {
        onSuccess();
      } else {
        alert(
          initialData
            ? "Civil Registry Record Updated!"
            : "Civil Registry Document Successfully Logged!"
        );

        setParishId('');
        setActivityDate('');

        setSacramentType('Baptismal Registration');
        setDateReceived('');
        setProcessingStaff('');

        setApplicantName('');
        setDob('');
        setPlaceOfBirth('');
        setGender('Female');
        setCivilStatus('Single');

        setRemarks('');
      }

    } else {

      alert(
        result.message ||
        "Failed to save record."
      );

    }
  };

  useEffect(() => {
    if (initialData) {
      const details = initialData.details || {};

      setParishId(
        initialData.organizationId ||
        initialData.parishId ||
        ''
      );

      setActivityDate(
        initialData.releaseDate
          ? new Date(initialData.releaseDate)
              .toISOString()
              .split('T')[0]
          : ''
      );

      setSacramentType(
        details.sacrament_type || 'Baptismal Registration'
      );

      setDateReceived(
        details.date_received
          ? new Date(details.date_received)
              .toISOString()
              .split('T')[0]
          : ''
      );

      setProcessingStaff(
        details.processing_staff || ''
      );

      setApplicantName(
        details.applicant_name || ''
      );

      setDob(
        details.dob
          ? new Date(details.dob)
              .toISOString()
              .split('T')[0]
          : ''
      );

      setPlaceOfBirth(
        details.place_of_birth || ''
      );

      setGender(
        details.gender || 'Female'
      );

      setCivilStatus(
        details.civil_status || 'Single'
      );

      setRemarks(
        details.remarks || ''
      );
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECTION 1: Record & Processing Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2 flex items-center gap-2">
          <FileText size={18} /> 1. Document & Processing Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Record / Sacrament Type</label>
            <select value={sacramentType} onChange={e => setSacramentType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Baptismal Registration">Late Baptismal Registration</option>
              <option value="Confirmation Record">Confirmation Record</option>
              <option value="Marriage Validation">Marriage Validation / Registration</option>
              <option value="Death Certificate">Death Certificate Processing</option>
              <option value="Document Correction">Correction of Clerical Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Received Date</label>
            <input required type="date" value={dateReceived} onChange={e => setDateReceived(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Release / Completion Date</label>
            <input required type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Processing Parish / Station</label>
            <select required value={parishId} onChange={e => setParishId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="" disabled>Select Station...</option>
              {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Processed By (Staff Name)</label>
            <input required type="text" placeholder="e.g. Sis. Ana" value={processingStaff} onChange={e => setProcessingStaff(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

        </div>
      </div>

      {/* SECTION 2: Applicant Details */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">2. Applicant Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Full Name</label>
            <input required type="text" placeholder="e.g. Maria Santos" value={applicantName} onChange={e => setApplicantName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
            <input required type="text" placeholder="e.g. Taytay, Rizal" value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
            <select value={civilStatus} onChange={e => setCivilStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

        </div>
      </div>

      {/* SECTION 3: Remarks */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-[#0060AF] border-b pb-2">3. Additional Notes</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea rows={3} placeholder="Note any complications, missing documents submitted later, or special circumstances..." value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-10 py-3 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
          {isSubmitting? 'Processing...': initialData? 'Update Registry Record': 'Log Registry Document'} <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}