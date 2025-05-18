import { supabase } from "../supabase/client"

export const registerUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const logoutUser = async () => {
  await supabase.auth.signOut()
}
