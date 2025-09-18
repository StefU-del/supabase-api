
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

export async function getUsers() {

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
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

export async function checkJWT(req, res, next) {
    console.log("Headers :: ", req.headers)

  if (!req.headers.authorization) return res.status(401).json({ error: "Unauthorised" });

  const token = req.headers.authorization.replace(/^Bearer\s+/i, "");
  console.log("JWT :: ", token)
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });
  req.user=data.user;
  next();
}