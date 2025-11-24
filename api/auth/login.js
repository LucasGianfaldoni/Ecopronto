// login.js - autentica usuário com email+senha, seta cookie httpOnly com access token
import { createClient } from '@supabase/supabase-js';
import { serialize } from 'cookie';


const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });


const { email, password, remember } = req.body || {};
if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });


try {
const { data, error } = await supabase.auth.signInWithPassword({ email, password });


if (error) return res.status(401).json({ error: error.message });


const session = data.session;
if (!session) return res.status(500).json({ error: 'Sessão não retornada' });


const cookieOptions = {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: 'lax',
path: '/',
};


if (remember) cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 dias


// salva access token no cookie (não salvar refresh token junto por segurança)
res.setHeader('Set-Cookie', serialize('sb_access_token', session.access_token, cookieOptions));


return res.json({ user: session.user, expires_at: session.expires_at });
} catch (err) {
console.error('LOGIN ERR', err);
return res.status(500).json({ error: 'Erro interno' });
}
}
localStorage.setItem("logged", "true");