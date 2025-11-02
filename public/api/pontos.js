// /api/pontos.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('pontos').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { nome, lat, lng } = req.body
    const { error } = await supabase.from('pontos').insert([{ nome, lat, lng }])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ success: true })
  }

  res.status(405).json({ error: 'Método não permitido' })
}