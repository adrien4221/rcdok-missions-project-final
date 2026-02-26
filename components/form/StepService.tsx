import { ChevronDown, ArrowRight, HeartHandshake, Church, MessageSquareText } from 'lucide-react';

interface Props {
  onBack: () => void;
  // FIX: Update type to accept data
  onNext: (data: any) => void; 
  currentData: any;
}

export default function StepService({ onNext, onBack }: Props) {
  return (
    // 
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      
      {/* same font as step personal */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Service Selection</h2>
        <p className="text-slate-500 text-sm mt-2">
          Choose how we can help you today.
        </p>
      </div>

      {/* white bg, soft shadow, rounded corners */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-6">
        
        {/* MINISTRY SELECTION */}
        <div className="space-y-4">
            {/* ministry section header */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <HeartHandshake size={18} className="text-blue-600" />
                <h3 className="font-semibold text-gray-700">Type of Assistance</h3>
            </div>

            {/* select ministry */}
            <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Select Ministry</label>
            <div className="relative group">
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                    <option>Busog Puso</option>
                    <option>Medical Assistance</option>
                    <option>Educational Support</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
            </div>
            </div>

            {/* select parish */}
            <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Select Preferred Parish</label>
            <div className="relative group">
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                    <option>Selected Parish</option>
                    <option>San Lorenzo Ruiz</option>
                    <option>San Roque</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
            </div>
            </div>
        </div>

        {/* CONCERNS */}
        <div className="space-y-4 pt-2">
             {/* concern section header */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <MessageSquareText size={18} className="text-blue-600" />
                <h3 className="font-semibold text-gray-700">Your Concern</h3>
            </div>

            {/* concerns text area */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">Briefly describe your concern</label>
                <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none h-32"
                    placeholder="Please provide more details about your request..."
                />
            </div>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 active:scale-95 group"
        >
          Go Next <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
            onClick={onBack}
            className="w-full py-3 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
            Back to Profile
        </button>
      </div>
    </div>
  );
};