'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Future Update: Replace with an actual database query to check 'users' or 'admins'
  // Uses a hardcoded master password to test the pipeline.
  if (email === 'admin@diocese.com' && password === 'admin123') {
    
    // Secure HTTP-only cookie that lasts for 24 hours
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated_true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // redirect to the admin dashboard after successful login
    redirect('/admin/request-management'); 
  }

  return { error: 'Invalid email or password.' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}