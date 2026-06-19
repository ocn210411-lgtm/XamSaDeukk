const _u = 'https://api.groq.com/openai/v1/chat/completions'
const _k = import.meta.env.VITE_AI_KEY
const _m = 'llama-3.3-70b-versatile'

export async function callAI(messages, opts = {}) {
  const res = await fetch(_u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_k}` },
    body: JSON.stringify({ model: _m, messages, temperature: opts.temp ?? 0.7, max_tokens: opts.max ?? 800 })
  })
  if (!res.ok) throw new Error('Erreur IA')
  const data = await res.json()
  return data.choices[0].message.content
}
