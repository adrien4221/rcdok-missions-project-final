import { LayoutDashboard, Wrench } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    // We use a full-height flex container to center the content perfectly
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-gray-50/50">
      
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
          <LayoutDashboard size={40} className="text-[#0060AF]" />
        </div>
        {/* Little construction badge */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          <Wrench size={18} className="text-amber-600" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        Overview Dashboard
      </h1>
      <p className="text-gray-500 max-w-md font-medium leading-relaxed">
        This section is currently being designed. In the future, you will see high-level statistics, recent activity, and quick actions here.
      </p>
      
      {/* Optional: Quick hint for the user */}
      <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0060AF]"></span>
        </span>
        Navigate using the top menu to view Requests and Services.
      </div>

    </div>
  );
}