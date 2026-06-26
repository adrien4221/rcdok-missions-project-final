'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { Lock, UserPlus, ChevronDown } from 'lucide-react';

interface UserProfile {
  is_approved: boolean;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [serviceId, setServiceId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        // User sign-up logic
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
              service_id: serviceId,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          setSuccess("Registration submitted! Please wait for an Admin to approve your access.");
          setMode('signin');
          setFullName('');
          setServiceId('');
        }

      } else {
        // user log-in logic
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !data.user) {
          setError(authError?.message || "Invalid login credentials");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved, role')
          .eq('id', data.user.id)
          .single();

        const userProfile = profile as UserProfile | null;

        if (profileError || !userProfile) {
          console.error("Profile fetch error:", profileError);
          setError("Profile data could not be loaded. Contact administrator.");
          return;
        }

        if (userProfile.is_approved) {
          if (userProfile.role === 'admin') {
            router.push("/admin");
          } else if (userProfile.role === "staff") {
            router.push("/staff");
          }
        } else {
          await supabase.auth.signOut();
          setError("Your account is pending administrator approval.");
        }
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      setError("Supabase connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ddf6ff] p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-blue-100 transition-all">
        
        {/* header */}
        <div className="bg-[#0060AF] p-8 text-center text-white">
          <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-4">
            {mode === 'signin' ? <Lock size={32} /> : <UserPlus size={32} />}
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'signin' ? 'Diocese Admin Portal' : 'Staff Registration'}
          </h1>
          <p className="text-blue-100 mt-2 text-sm">
            {mode === 'signin' ? 'Sign in to manage ministry operations.' : 'Request access to the portal.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* status message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm text-center border border-emerald-100 font-medium">
              {success}
            </div>
          )}

          {/* sign-Up input fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text" 
                  required 
                  placeholder="Juan Dela Cruz"
                  className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-slate-50 focus:ring-2 focus:ring-[#0060AF] focus:bg-white outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ministry</label>
                <div className="relative">
                  <select 
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-slate-50 focus:ring-2 focus:ring-[#0060AF] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your ministry</option>
                    <option value="17b9bee1-9041-4d03-86a6-1edae4c1bae5">Nutrition Ministry (Busog Puso)</option>
                    <option value="99823fae-b23d-4478-81fc-1e2c039be0ec">Civil Registry Ministry</option>
                    <option value="f1fc9691-6882-4e32-8073-3d64a94bb1a2">Justice Ministry</option>
                    <option value="0dfdf43c-819f-4020-aef3-5179b48ef44a">Mental Health Ministry (Kaagapay)</option>
                    <option value="2ebdda8b-a4c2-4b6d-92c7-982d1c7d5f88">Drug Rehabilitation Ministry (Salubong)</option>
                    <option value="ed983f8c-8919-4501-ab97-38dc118a4e9f">Community Ministry (BEC)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </>
          )}

          {/* input fields */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email" 
              required 
              placeholder="email@diocese.com"
              className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-slate-50 focus:ring-2 focus:ring-[#0060AF] focus:bg-white outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-slate-50 focus:ring-2 focus:ring-[#0060AF] focus:bg-white outline-none transition-all" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0060AF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 shadow-md mt-2"
          >
            {isLoading ? 'Processing...' : mode === 'signin' ? 'Secure Login' : 'Request Access'}
          </button>
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
                setSuccess('');
              }}
              className="text-sm font-semibold text-[#0060AF] hover:text-blue-800 transition-colors"
            >
              {mode === 'signin' ? "Need staff access? Request Registration" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>

        <div className="bg-slate-50 py-4 border-t border-slate-100 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}