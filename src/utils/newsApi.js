const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function analyzeNews({ title, text, url }) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text, url: url || null }),
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.')
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const detail = typeof errorBody?.detail === 'string' ? errorBody.detail : ''
    throw new Error(detail || `A API respondeu com erro (${response.status}).`)
  }

  return response.json()
}
