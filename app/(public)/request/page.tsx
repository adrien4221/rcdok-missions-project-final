'use client';

import { useState } from 'react';
import StepPersonal from '@/components/form/StepPersonal';
import StepService from '@/components/form/StepService';
import StepSchedule from '@/components/form/StepSchedule';
import { submitRequest } from '@/app/actions'; // Import server action

export default function RequestPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // MASTER STATE: Holds data from all steps
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    city: '',
    barangay: '',
    // Step 2
    ministry: 'Busog Puso',
    concernDetails: '',
    // Step 3
    phone: '',
    email: '',
    date: '',
    selectedTime: ''
  });

  // Handler for Step 1 -> 2
  const handlePersonalSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  // Handler for Step 2 -> 3
  const handleServiceSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  // Handler for Step 3 -> Final DB Submission
  const handleFinalSubmit = async (scheduleData: any) => {
    setIsSubmitting(true);
    
    const finalPayload = { ...formData, ...scheduleData };

    try {
      // 1. Send to Supabase
      const result = await submitRequest(finalPayload);
      
      if (result.success) {
        // Success: Redirect or show success screen
        alert("Request Submitted Successfully!");
        window.location.href = '/'; // Go back to home
      } else {
        // Failure (e.g., duplicate slot)
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center pt-10 px-4">
      {/* Progress Bar or Header could go here */}
      
      {/* RENDER STEPS */}
      {step === 1 && <StepPersonal onNext={handlePersonalSubmit} />}
      
      {step === 2 && (
        <StepService 
           onNext={handleServiceSubmit} 
           onBack={() => setStep(1)} 
           // pass current data if user goes back
           currentData={formData} 
        />
      )}
      
      {step === 3 && (
        <StepSchedule 
           onBack={() => setStep(2)} 
           onSubmit={handleFinalSubmit} // Triggers the DB save
           serviceId={formData.ministry} // Required for checking slots
        />
      )}
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           <p className="mt-4 text-blue-900 font-bold">Submitting Request...</p>
        </div>
      )}
    </div>
  );
}