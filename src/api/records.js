import { supabase } from '../supabaseClient.js';

export async function listRecords(athleteId) {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('recorded_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertRecord(payload) {
  const { data, error } = await supabase
    .from('records')
    .upsert(payload, { onConflict: 'athlete_id,discipline' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRecordHistory(athleteId, discipline) {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .eq('athlete_id', athleteId)
    .eq('discipline', discipline)
    .order('recorded_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function listDisciplines() {
  const { data, error } = await supabase.from('records').select('discipline');
  if (error) throw error;
  return [...new Set(data.map(d => d.discipline))].sort();
}

export async function getRecordHistoryForDiscipline(discipline) {
  const { data, error } = await supabase
    .from('records')
    .select('*, profiles(full_name)')
    .eq('discipline', discipline)
    .order('recorded_at', { ascending: true });
  if (error) throw error;
  return data;
}
