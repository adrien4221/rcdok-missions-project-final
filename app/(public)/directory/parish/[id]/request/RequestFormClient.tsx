'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { submitAssistanceRequest } from '@/app/actions'; 
import Image from 'next/image';

type Ministry = { id: string; name: string; icon: string | null };
type Parish = { id: string; name: string };

export default function RequestFormClient({ parish, ministries }: { parish: Parish, ministries: Ministry[] }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Our Form State
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    message: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Call our shiny new Server Action!
    const result = await submitAssistanceRequest({
      parishId: parish.id,
      serviceId: formData.serviceId,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      message: formData.message,
    });
    
    setIsSubmitting(false);

    if (result.success) {
      setStep(4); // Move to the beautiful Success screen
    } else {
      // If our server validation caught an error, show it to the user
      alert(result.message); 
    }
  };

  return (
    <div className="min-h-screen bg-[#def3fd] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#0060AF] px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Request Assistance</h2>
          <p className="text-blue-100 mt-1">Directly to {parish.name}</p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="flex px-8 pt-6 pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 h-2 rounded-full mx-1 ${step >= i ? 'bg-[#0060AF]' : 'bg-gray-200'}`} />
            ))}
          </div>
        )}

        <div className="p-8">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What kind of assistance do you need?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ministries.map(ministry => (
                  <button
                    key={ministry.id}
                    onClick={() => setFormData({ ...formData, serviceId: ministry.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                      ${formData.serviceId === ministry.id 
                        ? 'border-[#0060AF] bg-blue-50 ring-2 ring-blue-100' 
                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                  >
                    <span className="text-2xl">{ministry.icon}</span>
                    <span className="font-semibold text-gray-800">{ministry.name}</span>
                  </button>
                ))}
              </div>
              {ministries.length === 0 && (
                <p className="text-red-500 italic">This parish currently has no active ministries configured.</p>
              )}
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Contact Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              {/* NEW EMAIL FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none"
                  placeholder="juan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input 
                  type="tel" 
                  value={formData.contactNumber}
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none"
                  placeholder="0912 345 6789"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Message & Submit */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Additional Details</h3>

              {/* THE NEW EMPATHETIC DISCLAIMER */}
              <div className="bg-blue-50 border-l-4 border-[#0060AF] p-4 mb-4 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Submitting this form alerts the parish that you need assistance. A ministry volunteer will contact you shortly to confirm availability and schedule based on their regular operating hours.
                </p>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Please briefly explain your situation so the parish can best prepare to help you.</p>
              <div>
                <textarea 
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0060AF] outline-none resize-none"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
          )}

          {/* STEP 4: Success State */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <HeartHandshake className="mx-auto text-[#0060AF] w-24 h-24 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Request Sent</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Your request has been securely forwarded to {parish.name}. A representative from the ministry will contact you shortly.
              </p>
              <Link 
                href={`/directory`}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full transition-colors"
              >
                <ArrowLeft size={18} /> Back to Parish Page
              </Link>
            </div>
          )}

          {/* Navigation Buttons (Hidden on Step 4) */}
          {step < 4 && (
            <div className="mt-10 flex justify-between border-t border-gray-100 pt-6">
              <button 
                onClick={step === 1 ? () => window.history.back() : handleBack}
                className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} /> {step === 1 ? 'Cancel' : 'Back'}
              </button>

              {step < 3 ? (
                <button 
                  onClick={handleNext}
                  disabled={step === 1 && !formData.serviceId}
                  className="bg-[#0060AF] hover:bg-blue-800 text-white font-bold px-8 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || 
                    !formData.name ||
                    (!formData.email && !formData.contactNumber) // Require at least one contact method}
                    }
                  className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-bold px-8 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'} <CheckCircle2 size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}