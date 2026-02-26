'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { getBookedSlots } from '@/app/actions'; // Import the action we just made

interface Props {
  onBack: () => void;
  // Change: onSubmit now passes the Step 3 data up to the parent
  onSubmit: (data: { date: string; selectedTime: string; phone: string; email: string }) => void;
  serviceId: string; // We need this to check the right calendar!
}

export default function StepSchedule({ onBack, onSubmit, serviceId }: Props) {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Availability State
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // Contact State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Fixed Time Options
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", 
    "01:00 PM", "02:30 PM", "04:00 PM"
  ];

  // --- EFFECT: Fetch Booked Slots when Date Changes ---
  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;
      
      setIsLoadingSlots(true);
      setBookedSlots([]); // Clear old data
      
      // Call Server Action
      const takenTimes = await getBookedSlots(date, serviceId);
      
      setBookedSlots(takenTimes);
      setIsLoadingSlots(false);
    }

    fetchAvailability();
  }, [date, serviceId]);

  const handleConfirm = () => {
    if (!date || !selectedTime || !phone) {
      alert("Please fill in the required fields (Date, Time, Phone).");
      return;
    }
    // Send data to parent
    onSubmit({ date, selectedTime, phone, email });
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
       
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Schedule Visit</h2>
        <p className="text-slate-500 text-sm mt-2">Select a convenient time.</p>
      </div>

       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {/* Contact Inputs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Phone size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Contact Details</h3>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number (Required)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 outline-none"
                />
                 <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 outline-none"
                />
            </div>

            {/* Date Picker */}
            <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Date & Time</h3>
                </div>
                <label className="block text-xs font-semibold text-gray-500 ml-1">Select Date</label>
                <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedTime(null); // Reset time on date change
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 outline-none cursor-pointer"
                />
            </div>

            {/* Time Slots Grid */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1 flex items-center gap-2">
                    <Clock size={12} className="text-blue-600"/> 
                    Available Slots
                    {isLoadingSlots && <Loader2 size={12} className="animate-spin text-gray-400" />}
                </label>
                
                {date ? (
                  <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => {
                          const isTaken = bookedSlots.includes(time);
                          return (
                              <button
                                  key={time}
                                  disabled={isTaken} // THE MAGIC: Disable if taken
                                  onClick={() => setSelectedTime(time)}
                                  className={`
                                      py-2 px-1 text-xs rounded-lg border transition-all font-medium relative overflow-hidden
                                      ${isTaken 
                                        ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' 
                                        : selectedTime === time 
                                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                                      }
                                  `}
                              >
                                  {time}
                                  {isTaken && <span className="absolute inset-0 flex items-center justify-center bg-gray-100/80 text-[10px] text-red-400 font-bold rotate-12">FULL</span>}
                              </button>
                          );
                      })}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    Please select a date first.
                  </div>
                )}
            </div>
       </div>

      <div className="mt-8">
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 group"
        >
          Confirm Appointment <CheckCircle size={20} className="group-hover:scale-110 transition-transform"/>
        </button>
      </div>
    </div>
  );
}