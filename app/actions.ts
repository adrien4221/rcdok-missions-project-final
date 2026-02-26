'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function getBookedSlots(date: string, serviceId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select('preferred_time')
    .eq('preferred_date', date)
    .eq('service_id', serviceId); 

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  return data.map((row) => row.preferred_time);
}


export async function submitRequest(formData: any) {

  const safeAge = formData.age === '' ? null : Number(formData.age);

  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  const trackingNumber = `REQ-${timestamp}-${randomStr}`;

  const { data, error } = await supabase
    .from('requests')
    .insert({
      tracking_number: trackingNumber, // New column for tracking number
      // Map frontend state names to Supabase column names
      first_name: formData.firstName,
      last_name: formData.lastName,
      birthday: formData.birthday, // Can be used in the future for duplication check
      age: safeAge,
      gender: formData.gender,
      
      contact_number: formData.phone, // From Step 3
      email: formData.email,          // From Step 3
      
      city: formData.city,
      barangay: formData.barangay,
      
      service_id: formData.ministry,
      concern_details: formData.concernDetails, // The text area
      
      preferred_date: formData.date,
      preferred_time: formData.selectedTime,
      
      status: 'pending' // Default status
    })
    .select();

  if (error) {
    // Check if it's the specific "Unique Constraint" error (Double Booking)
    if (error.code === '23505') { 
      return { success: false, message: 'Sorry, that time slot was taken just now. Please try another.' };
    }
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

/**
 * Saves all active services and their schedules for a specific location.
 */
export async function saveLocationServices(
  organizationId: string, 
  activeServices: string[], 
  schedules: Record<string, { days: string[], slots: string[] }>
) {
  // 1. Format the data for a bulk upsert
  const upsertData = activeServices.map(serviceId => {
    const schedKey = `${organizationId}_${serviceId}`;
    const sched = schedules[schedKey] || { days: [], slots: [] };
    
    return {
      organization_id: organizationId,
      service_id: serviceId,
      is_active: true,
      available_days: sched.days,
      available_slots: sched.slots
    };
  });

  // 2. Bulk save active services
  if (upsertData.length > 0) {
    const { error } = await supabase
      .from('organization_services')
      .upsert(upsertData, { onConflict: 'organization_id,service_id' });

    if (error) return { success: false, message: error.message };
  }

  // 3. Clean up: Deactivate services that were toggled off
  const { error: cleanupError } = await supabase
    .from('organization_services')
    .update({ is_active: false })
    .eq('organization_id', organizationId)
    .not('service_id', 'in', `(${activeServices.join(',')})`);

  if (cleanupError) return { success: false, message: cleanupError.message };

  return { success: true };
}

/**
 * Fetches the 2-level organization tree (Diocese -> Parishes) 
 * and their configured schedules.
 */
export async function fetchServiceConfigurations() {
  // 1. Get ONLY the Diocese and Parishes (Enforces the 2-level rule)
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .in('type', ['diocese', 'parish'])
    .order('name'); // Sorts parishes alphabetically in the sidebar

  // 2. Get all currently active services and their schedules
  const { data: activeServices, error: servError } = await supabase
    .from('organization_services')
    .select('*')
    .eq('is_active', true);

  if (orgError || servError) {
    console.error('Fetch Error:', orgError || servError);
    return { success: false, tree: [], schedules: {} };
  }

  // 3. Format the Schedules Dictionary for the Frontend
  // Turns database rows into: { "parishUUID_Legal Aid": { days: ['Mon'], slots: ['09:00 AM'] } }
  const schedulesMap: Record<string, { days: string[], slots: string[] }> = {};
  
  activeServices.forEach(record => {
    const key = `${record.organization_id}_${record.service_id}`;
    schedulesMap[key] = {
      days: record.available_days || [],
      slots: record.available_slots || []
    };
  });

  // 4. Build the 2-Level Hierarchy Tree
  const orgMap = new Map();
  
  // First pass: Create the raw nodes and attach their active services
  orgs.forEach(org => {
    orgMap.set(org.id, { 
      id: org.id,
      name: org.name,
      type: org.type,
      children: [], 
      // Look through activeServices and pluck out the ones that belong to THIS parish
      activeServices: activeServices
        .filter(s => s.organization_id === org.id)
        .map(s => s.service_id) 
    });
  });

  // Second pass: Connect the Parishes (children) to the Diocese (parent)
  const rootNodes: any[] = [];
  
  orgMap.forEach((org, id) => {
    // Find the original database record to check for a parent_id
    const originalRecord = orgs.find(o => o.id === id);
    
    if (originalRecord?.parent_id) {
      const parent = orgMap.get(originalRecord.parent_id);
      if (parent) {
        parent.children.push(org);
      }
    } else {
      // If it has no parent, it's the root (The Diocese)
      rootNodes.push(org); 
    }
  });

  return { 
    success: true, 
    tree: rootNodes, 
    schedules: schedulesMap 
  };
}