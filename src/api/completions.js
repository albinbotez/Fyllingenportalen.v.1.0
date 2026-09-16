import { supabase } from '../supabaseClient.js';

export async function getCompletion(sessionId, athleteId) {
  const { data, error } = await supabase
    .from('session_completions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('athlete_id', athleteId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertCompletion(sessionId, athleteId, status) {
  const { data, error } = await supabase
    .from('session_completions')
    .upsert({
      session_id: sessionId,
      athlete_id: athleteId,
      status,
      completed_at: status === 'fullfort' ? new Date().toISOString() : null,
    }, { onConflict: 'session_id,athlete_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listCompletionsForAthlete(athleteId, sessionIds) {
  if (!sessionIds?.length) return [];
  const { data, error } = await supabase
    .from('session_completions')
    .select('*')
    .eq('athlete_id', athleteId)
    .in('session_id', sessionIds);
  if (error) throw error;
  return data;
}
