import { supabase } from '../supabaseClient.js';

export async function listSuggestions(groupLevel) {
  let query = supabase.from('suggested_sessions').select('*');
  if (groupLevel) query = query.eq('group_level', groupLevel);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSuggestion(payload) {
  const { data, error } = await supabase.from('suggested_sessions').insert(payload).select().single();
  if (error) throw error;
  return data;
}
