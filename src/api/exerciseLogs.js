import { supabase } from '../supabaseClient.js';

export async function listLogsForSession(sessionExerciseIds, athleteId) {
  if (!sessionExerciseIds?.length) return [];
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('athlete_id', athleteId)
    .in('session_exercise_id', sessionExerciseIds);
  if (error) throw error;
  return data;
}

export async function upsertLog({ sessionExerciseId, athleteId, weightKg, timeSeconds, notes }) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .upsert({
      session_exercise_id: sessionExerciseId,
      athlete_id: athleteId,
      weight_kg: weightKg ?? null,
      time_seconds: timeSeconds ?? null,
      notes: notes ?? null,
      logged_at: new Date().toISOString(),
    }, { onConflict: 'session_exercise_id,athlete_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
