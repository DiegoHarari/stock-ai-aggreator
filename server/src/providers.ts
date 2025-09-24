import axios from 'axios'

export type ProviderName = 'openai' | 'anthropic' | 'google' | 'mock'

export async function analyzeTicker(ticker: string, providers: ProviderName[]) {
  const tasks = providers.map(p => runProvider(ticker, p))
  const results = await Promise.all(tasks)
  return results
}

async function runProvider(ticker: string, provider: ProviderName) {
  switch (provider) {
    case 'openai':
      return openaiProvider(ticker)
    case 'anthropic':
      return anthropicProvider(ticker)
    case 'google':
      return googleProvider(ticker)
    default:
      return mockProvider(ticker)
  }
}

/**
 * IMPORTANT:
 * The example provider functions below are templates. They will:
 * - Use environment variables OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY if present.
 * - If no key is provided, they return a deterministic mock summary so the project works without keys.
 *
 * To use real providers, set keys in server/.env and uncomment the actual request code.
 */

async function openaiProvider(ticker: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return { provider: 'openai', text: `[MOCK] OpenAI: quick summary for ${ticker}.` }

  // Example OpenAI call (pseudo); adapt to the API version you use.
  const prompt = `Provide concise stock info for ${ticker}. Include current sentiment and short recommendation (buy/hold/sell).`
  // Real request omitted; return mock for safety in this template.
  return { provider: 'openai', text: `OpenAI (mocked) response for ${ticker}: ${prompt}` }
}

async function anthropicProvider(ticker: string) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { provider: 'anthropic', text: `[MOCK] Anthropic: concise notes about ${ticker}.` }

  return { provider: 'anthropic', text: `Anthropic (mocked) response for ${ticker}.` }
}

async function googleProvider(ticker: string) {
  const key = process.env.GOOGLE_API_KEY
  if (!key) return { provider: 'google', text: `[MOCK] Google Gemini: short analysis for ${ticker}.` }

  return { provider: 'google', text: `Google (mocked) response for ${ticker}.` }
}

async function mockProvider(ticker: string) {
  // Provide a little structured mock including price cues to help client show "most important" items.
  const text = [
    `Price: $${(Math.random()*2000).toFixed(2)}`,
    `Market cap: ${(Math.random()*800).toFixed(2)}B`,
    `Short interest: ${(Math.random()*5).toFixed(2)}%`,
    `Sentiment: ${(Math.random() > 0.5) ? 'Bullish' : 'Bearish'}`,
    `Quick take: ${(Math.random() > 0.5) ? 'Consider buy for long term' : 'Consider sell or wait for dip'}`
  ].join(' | ')
  return { provider: 'mock', text }
}
