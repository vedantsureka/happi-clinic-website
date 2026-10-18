import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type Appointment = {
  id: string;
  created_at: string;
  updated_at: string;
  patient_name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  message: string;
  consent: boolean;
  status: AppointmentStatus;
  scheduled_date: string | null;
  scheduled_time: string | null;
  admin_note: string;
};
