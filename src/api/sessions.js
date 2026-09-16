import { supabase } from '../supabaseClient.js';

export async function listSessions({ from, to, athleteId } = {}) {
  let query = supabase.from('sessions').select('*, session_exercises(*)');
  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);
  if (athleteId) query = query.eq('athlete_id', athleteId);
  const { data, error } = await query.order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSession(id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, session_exercises(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createSession(payload) {
  const { data, error } = await supabase.from('sessions').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateSession(id, payload) {
  const { data, error } = await supabase.from('sessions').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  if (error) throw error;
}
