import { ArrowLeft } from 'lucide-react';

export default function MinistriesIndexPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md text-center">
        <div className="bg-blue-50 text-[#0060AF] p-4 rounded-full mb-4">
          <ArrowLeft size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Ministry</h2>
        <p className="text-gray-500">
          Click on a ministry from the sidebar on the left to view its analytics, log new activities, and manage its records.
        </p>
      </div>
    </div>
  );
}