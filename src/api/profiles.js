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

export async function isCoach() {
  const profile = await getMyProfile().catch(() => null);
  return profile?.role === 'trener' || profile?.role === 'admin';
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

export async function getAthleteById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function listGroupLevels() {
  const { data, error } = await supabase
    .from('profiles')
    .select('group_level')
    .not('group_level', 'is', null);
  if (error) throw error;
  return [...new Set(data.map(d => d.group_level))];
}
