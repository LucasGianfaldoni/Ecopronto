// register.js (Vercel serverless function, ESM)
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY // usar service role para criar usuário com senha
);


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });


const { email, password, name } = req.body || {};
if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });


try {
// cria user via Admin (service role) - já faz hash da senha
const { data, error } = await supabase.auth.admin.createUser({
email,
password,
user_metadata: { name }
});


if (error) {
return res.status(400).json({ error: error.message });
}


// não retornamos service role tokens; apenas meta do usuário
return res.status(201).json({ user: { id: data.id, email: data.email, user_metadata: data.user_metadata } });
} catch (err) {
console.error('REGISTER ERR', err);
return res.status(500).json({ error: 'Erro interno' });
}
}