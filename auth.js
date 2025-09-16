
import { supabase, supabaseAdmin } from "./supabase-client.js";

export async function signUp(email, password) {

    try {
        if(!email || !password) {
            return { error: { message: 'Invalid credentials' } };
        }
        if (typeof email !== "string" || typeof password !== "string") {
        return { data: null, error: { message: "Invalid payload" } };
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
    return { data, error };

    } catch (e) {
        const message = e?.message ?? "Unexpected error";
        const status = e?.status ?? 500;
        return { data: null, error: { message, status } };
  }
}

export async function signIn(email, password) {

    try {
        if(!email || !password) {
            return { error: { message: 'Invalid credentials' } };
        }
        if (typeof email !== "string" || typeof password !== "string") {
        return { data: null, error: { message: "Invalid payload" } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
    return { data, error };
    
    } catch (e) {
        const message = e?.message ?? "Unexpected error";
        const status = e?.status ?? 500;
        return { data: null, error: { message, status } };
  }
}

export async function getUserById(userId) {
  if (!userId) {
    return { data: null, error: { message: "Missing userId" } };
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  return { data, error };
}

export async function deleteAccount(userId) {
  if (!userId) {
    return { data: null, error: { message: "Missing userId" } };
  }

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { data: null, error };
  return { data, error: null };
}
