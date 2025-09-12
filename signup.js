
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUp(email, password) {

    const email = email;
    const password = password;

    const response = await supabase.auth.signUp(email, password);
    return response;
}