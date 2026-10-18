import "server-only";
import { createClient } from "@supabase/supabase-js";

export function appointmentStorageConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function saveAppointment(data: {
  fullName: string; mobileNormalised: string; preferredDate: string;
  preferredTime: string; service: string; message: string; consent: true;
}): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Appointment database not configured");
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.from("appointments").insert({
    patient_name: data.fullName, phone: data.mobileNormalised.replace(/^\+91/, ""),
    preferred_date: data.preferredDate, preferred_time: data.preferredTime,
    service: data.service, message: data.message, consent: data.consent,
    status: "pending"
  });
  if (error) throw new Error(`Appointment storage failed: ${error.message}`);
}
