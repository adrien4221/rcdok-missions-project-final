'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, User, MapPin, Calendar } from 'lucide-react';
import ProgressBar from '../layout/ProgressBar';

interface Props {
  onNext: (data: any) => void; 
}

export default function StepPersonal({ onNext }: Props) {
  // Unified state for all fields
  const [formData, setFormData] = useState({
    firstName: '',
    birthday: '', // New Field
    age: 20,      // Will be auto-calculated
    gender: 'Female',
    city: 'Navotas City',
    barangay: 'Kaunlaran'
  });

  // Helper: Update a single field
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper: Calculate age automatically when Birthday changes
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBirthDate = e.target.value;
    
    // Calculate Age
    const birthDateObj = new Date(newBirthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      calculatedAge--;
    }

    // Update both Birthday and Age in state
    setFormData(prev => ({
      ...prev,
      birthday: newBirthDate,
      age: calculatedAge > 0 ? calculatedAge : 0 // Prevent negative ages
    }));
  };

  // Manual Age Increment/Decrement (Override)
  const handleIncrement = () => handleChange('age', Math.min(formData.age + 1, 100));
  const handleDecrement = () => handleChange('age', Math.max(formData.age - 1, 1));

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Profile Info</h2>
        <p className="text-slate-500 text-sm mt-2">Tell us a bit about yourself.</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-6">
        
        <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
            <User size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-700">Personal Data</h3>
        </div>
        
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">First Name</label>
          <input
            type="text"
            placeholder="e.g. Alexander"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* --- NEW: Birthday Input --- */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Date of Birth</label>
          <div className="relative">
            <input
                type="date"
                value={formData.birthday}
                onChange={handleBirthdayChange}
                max={new Date().toISOString().split('T')[0]} // Cannot be in future
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-5">
          
          {/* Age Input (Auto-calculated but editable) */}
          <div className="w-1/3">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Age</label>
            <div className="relative group">
              <input 
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-8 py-3 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              
              <div className="absolute right-1 top-1 bottom-1 w-6 flex flex-col border-l border-gray-200">
                <button 
                  onClick={handleIncrement}
                  className="flex-1 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 rounded-tr-md transition-colors"
                >
                  <ChevronUp size={12} strokeWidth={3} />
                </button>
                <button 
                   onClick={handleDecrement}
                   className="flex-1 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 rounded-br-md transition-colors"
                >
                  <ChevronDown size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Gender Select */}
          <div className="w-2/3">
             <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Gender</label>
             <div className="relative group">
              <select 
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
            </div>
          </div>
        </div>

        {/* Location Section */}
         <div className="flex items-center gap-2 mt-6 mb-2 border-b border-gray-100 pb-2">
            <MapPin size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-700">Location</h3>
        </div>

        {/* City Select */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">City of Residence</label>
           <div className="relative group">
            <select 
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            >
              <option>Navotas City</option>
              <option>Manila</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
          </div>
        </div>

        {/* Barangay Select */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Barangay</label>
           <div className="relative group">
            <select 
                value={formData.barangay}
                onChange={(e) => handleChange('barangay', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            >
              <option>Kaunlaran</option>
              <option>San Jose</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
          </div>
        </div>

      </div>

      <div className="mt-8">
        <button
          onClick={() => onNext(formData)} // Pass the full object!
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 active:scale-95 group"
        >
          Go Next <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>
    </div>
  );
}