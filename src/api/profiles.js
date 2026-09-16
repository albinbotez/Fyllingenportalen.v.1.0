import { supabase } from '../supabaseClient.js';

export async function getMyProfile() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function listAthletes() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'utover')
    .order('full_name');
  if (error) throw error;
  return data;
}
