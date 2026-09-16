import { supabase } from '../supabaseClient.js';

export async function signUpAthlete({ email, password, fullName, groupLevel }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      group_level: groupLevel || null,
      role: 'utover',
    });
    if (profileError) throw profileError;
  }
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
