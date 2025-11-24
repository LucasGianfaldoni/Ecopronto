// logout.js - limpa cookie
import { serialize } from 'cookie';


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });


// limpar cookie
res.setHeader('Set-Cookie', serialize('sb_access_token', '', { path: '/', maxAge: -1 }));
return res.json({ ok: true });
}
