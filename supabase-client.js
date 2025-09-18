
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseAdminKey = process.env.SUPABASE_ADMIN;

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    { auth: { persistSession: false } }
);

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseAdminKey,
    { auth: { persistSession: false } }
);

export function supabaseForUser(token) {
    return createClient(
        supabaseUrl,
        supabaseKey,
        {
            global: {
                headers: { Authorisation: `Bearer ${token}` },
                auth: { persistSession: false }
            }
        }
    )
}