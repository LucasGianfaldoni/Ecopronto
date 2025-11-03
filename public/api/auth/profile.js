// profile.js - rota protegida que lê token do cookie
import { createClient } from '@supabase/supabase-js';
import { parse } from 'cookie';


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


export default async function handler(req, res) {
const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
const token = cookies.sb_access_token;


if (!token) return res.status(401).json({ error: 'Não autenticado' });


try {
const { data, error } = await supabase.auth.getUser(token);
if (error) return res.status(401).json({ error: error.message });


return res.json({ user: data.user });
} catch (err) {
console.error('PROFILE ERR', err);
return res.status(500).json({ error: 'Erro interno' });
}
}