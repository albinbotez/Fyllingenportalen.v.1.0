import { supabase } from '../supabaseClient.js';

export async function listExercises() {
  const { data, error } = await supabase.from('exercises').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function createExercise(payload) {
  const { data, error } = await supabase.from('exercises').insert(payload).select().single();
  if (error) throw error;
  return data;
}
