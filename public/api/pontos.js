// /api/pontos.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY)

export default async function handler(req, res) {
  // === GET: retorna todos os pontos com resíduos ===
  if (req.method === 'GET') {
    try {
      // Busca pontos de coleta
      const { data: pontos, error: erroPontos } = await supabase
        .from('pontos_coleta')
        .select('id, nome, endereco, cidade, estado, latitude, longitude')

      if (erroPontos) throw erroPontos

      // Busca resíduos associados
      const { data: relacoes, error: erroRelacoes } = await supabase
        .from('ponto_residuo')
        .select('ponto_id, residuos (nome)')

      if (erroRelacoes) throw erroRelacoes

      // Agrupa resíduos por ponto
      const residuosPorPonto = {}
      relacoes.forEach((r) => {
        if (!residuosPorPonto[r.ponto_id]) residuosPorPonto[r.ponto_id] = []
        residuosPorPonto[r.ponto_id].push(r.residuos.nome)
      })

      // Junta tudo em um único objeto
      const resultado = pontos.map((p) => ({
        ...p,
        residuos: residuosPorPonto[p.id] || [],
      }))

      return res.status(200).json(resultado)
    } catch (error) {
      console.error('Erro ao buscar pontos:', error)
      return res.status(500).json({ error: 'Erro ao buscar pontos de coleta' })
    }
  }

  // === POST: adiciona um novo ponto e associa resíduos ===
  if (req.method === 'POST') {
    try {
      const { nome, endereco, cidade, estado, latitude, longitude, residuos } = req.body

      // Insere o ponto principal
      const { data: novoPonto, error: erroPonto } = await supabase
        .from('pontos_coleta')
        .insert([{ nome, endereco, cidade, estado, latitude, longitude }])
        .select()
        .single()

      if (erroPonto) throw erroPonto

      // Se vierem resíduos, associa cada um
      if (residuos && residuos.length > 0) {
        for (const residuoNome of residuos) {
          // Busca o ID do resíduo pelo nome
          const { data: residuo, error: erroBusca } = await supabase
            .from('residuos')
            .select('id')
            .eq('nome', residuoNome)
            .single()

          if (erroBusca) continue // ignora caso não exista

          // Cria a relação ponto <-> resíduo
          await supabase
            .from('ponto_residuo')
            .insert([{ ponto_id: novoPonto.id, residuo_id: residuo.id }])
        }
      }

      return res.status(201).json({ success: true, ponto: novoPonto })
    } catch (error) {
      console.error('Erro ao adicionar ponto:', error)
      return res.status(500).json({ error: 'Erro ao criar ponto de coleta' })
    }
  }

  // === Método não permitido ===
  res.status(405).json({ error: 'Método não permitido' })
}
