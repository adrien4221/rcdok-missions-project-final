'use client';

import { useState, useEffect } from 'react';
import { fetchServiceConfigurations, saveLocationServices } from '@/app/actions';
import { ChevronRight, ChevronDown, Building, Church, Save, CalendarDays, Clock, Loader2, Info } from 'lucide-react';

// --- Types ---
type OrgType = 'diocese' | 'parish';

interface OrgUnit {
  id: string;
  name: string;
  type: OrgType;
  children?: OrgUnit[];
  activeServices: string[]; 
}

// EXACT MATCH with your Database Primary Keys
const allServices = [
  { id: 'Busog Puso', name: 'Busog Puso (Nutrition)', icon: '🍲' },
  { id: 'Civil Registry', name: 'Civil Registry', icon: '📝' },
  { id: 'Legal Aid', name: 'Legal Aid (Justice)', icon: '⚖️' },
  { id: 'Kaagapay', name: 'Kaagapay (Mental Health)', icon: '🧠' },
  { id: 'Medical Assistance', name: 'Medical Assistance', icon: '🩺' },
  { id: 'Salubong Rehab', name: 'Salubong (Rehab)', icon: '🏥' },
  { id: 'BEC', name: 'Community (BEC)', icon: '🤝' },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

export default function ServiceConfigPage() {
  const [selectedNode, setSelectedNode] = useState<OrgUnit | null>(null);
  const [nodes, setNodes] = useState<OrgUnit[]>([]);
  const [schedules, setSchedules] = useState<Record<string, { days: string[], slots: string[] }>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Database Data on Load ---
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const result = await fetchServiceConfigurations();
      
      if (result.success) {
        setNodes(result.tree);
        setSchedules(result.schedules);
      } else {
        alert("Failed to load organization data.");
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // --- Toggle Service ON/OFF ---
  const updateNodeServices = (nodeId: string, serviceId: string) => {
    const updateTree = (list: OrgUnit[]): OrgUnit[] => {
      return list.map(node => {
        if (node.id === nodeId) {
          const isActive = node.activeServices.includes(serviceId);
          const newServices = isActive 
            ? node.activeServices.filter(s => s !== serviceId) 
            : [...node.activeServices, serviceId];
          
          const updatedNode = { ...node, activeServices: newServices };
          
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setNodes(prev => updateTree(prev));
  };

  // --- Toggle Specific Day or Time ---
  const toggleScheduleItem = (nodeId: string, serviceId: string, type: 'days' | 'slots', value: string) => {
    const key = `${nodeId}_${serviceId}`;
    setSchedules(prev => {
      const current = prev[key] || { days: [], slots: [] };
      const list = current[type];
      const newList = list.includes(value) ? list.filter(item => item !== value) : [...list, value];
      return { ...prev, [key]: { ...current, [type]: newList } };
    });
  };

  // --- Save to Supabase ---
  const handleSave = async () => {
    if (!selectedNode) return;
    setIsSaving(true);
    const result = await saveLocationServices(selectedNode.id, selectedNode.activeServices, schedules);
    if (result.success) {
       alert("Schedules saved successfully!");
    } else {
       alert("Failed to save: " + result.message);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 text-[#0060AF]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-semibold text-gray-700">Loading Parishes...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans">
      
      {/* --- LEFT SIDEBAR: HIERARCHY TREE --- */}
      <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Diocesan Parishes</h2>
        <div className="space-y-1">
          {nodes.map(node => (
            <TreeNode key={node.id} node={node} selectedId={selectedNode?.id} onSelect={setSelectedNode} />
          ))}
        </div>
      </div>

      {/* --- RIGHT MAIN: CONFIGURATION --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedNode ? (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-lg ${selectedNode.type === 'diocese' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                 {selectedNode.type === 'diocese' ? <Church size={24}/> : <Building size={24}/>}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedNode.name}</h1>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                  {selectedNode.type} Level
                </span>
              </div>
            </div>

            {/* --- THE RULE: Only allow config if it is a Parish --- */}
            {selectedNode.type === 'diocese' ? (
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center flex flex-col items-center">
                 <Info size={40} className="text-blue-400 mb-4" />
                 <h3 className="text-lg font-bold text-blue-900 mb-2">Diocesan Overview</h3>
                 <p className="text-blue-700 max-w-md">
                   Services and schedules are managed at the Parish level. Please select a specific parish from the sidebar to configure its available services.
                 </p>
              </div>

            ) : (
              <>
              {/* Service Toggles (Only visible for Parishes) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-700">Service Availability</h3>
                    <p className="text-xs text-gray-500">Enable services and set their operating schedules.</p>
                  </div>
                  
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#0060AF] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-800 transition-all active:scale-95 disabled:bg-blue-300"
                  >
                      <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {allServices.map(service => {
                    const isActive = selectedNode.activeServices.includes(service.id);
                    const schedKey = `${selectedNode.id}_${service.id}`;
                    const currentSched = schedules[schedKey] || { days: [], slots: [] };

                    return (
                      <div key={service.id} className="flex flex-col transition-colors">
                          <div className={`flex items-center justify-between px-6 py-4 ${isActive ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{service.icon}</span>
                                <span className={`font-medium ${isActive ? 'text-[#0060AF]' : 'text-gray-500'}`}>
                                  {service.name}
                                </span>
                              </div>
                              
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={isActive} 
                                  onChange={() => updateNodeServices(selectedNode.id, service.id)}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0060AF]"></div>
                              </label>
                          </div>

                          {isActive && (
                            <div className="px-6 pb-6 pt-2 bg-blue-50/30 animate-in slide-in-from-top-2 duration-300 space-y-5">
                              <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
                                    <CalendarDays size={14} /> Available Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {DAYS_OF_WEEK.map(day => (
                                      <button
                                        key={day}
                                        onClick={() => toggleScheduleItem(selectedNode.id, service.id, 'days', day)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                                          currentSched.days.includes(day) 
                                            ? 'bg-[#0060AF] text-white border-[#0060AF] shadow-sm' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#0060AF] hover:text-[#0060AF]'
                                        }`}
                                      >
                                        {day}
                                      </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
                                    <Clock size={14} /> Active Time Slots
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {TIME_SLOTS.map(slot => (
                                      <button
                                        key={slot}
                                        onClick={() => toggleScheduleItem(selectedNode.id, service.id, 'slots', slot)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                                          currentSched.slots.includes(slot)
                                            ? 'bg-[#0060AF] text-white border-[#0060AF] shadow-sm' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#0060AF] hover:text-[#0060AF]'
                                        }`}
                                      >
                                        {slot}
                                      </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Building size={48} className="mb-4 opacity-20" />
            <p>Select a parish from the left to configure service availability.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Simplified Tree Node Helper ---
const TreeNode = ({ node, selectedId, onSelect, level = 0 }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;

  return (
    <div className="select-none">
      <div 
        onClick={() => onSelect(node)}
        className={`
           flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors
           ${isSelected ? 'bg-blue-50 text-[#0060AF]' : 'hover:bg-gray-100 text-gray-700'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className={`p-0.5 rounded hover:bg-gray-200 text-gray-400 ${hasChildren ? 'visible' : 'invisible'}`}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <span className={isSelected ? 'text-[#0060AF]' : 'text-gray-400'}>
           {node.type === 'diocese' ? <Church size={16} /> : <Building size={16} />}
        </span>
        
        <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-normal'}`}>
          {node.name}
        </span>
      </div>

      {isOpen && hasChildren && (
        <div>
          {node.children.map((child: any) => (
             <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}