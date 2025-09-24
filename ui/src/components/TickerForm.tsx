import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

type Provider = 'openai' | 'anthropic' | 'google' | 'mock'

export default function TickerForm() {
  const [ticker, setTicker] = useState('')
  const [providers, setProviders] = useState<Provider[]>(['mock'])
  const mutation = useMutation({
    mutationFn: (data: { ticker: string; providers: Provider[] }) =>
      axios.post('/api/analyze', data).then(r => r.data)
  })

  function toggleProvider(p: Provider) {
    setProviders(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  return (
    <div>
      <div>
        <input
          aria-label="ticker-input"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          placeholder="TSLA"
        />
        <button disabled={!ticker || mutation.isLoading} onClick={() => mutation.mutate({ ticker, providers })}>
          Analyze
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        Providers:
        <label><input type="checkbox" checked={providers.includes('mock')} onChange={() => toggleProvider('mock')} /> mock</label>
        <label><input type="checkbox" checked={providers.includes('openai')} onChange={() => toggleProvider('openai')} /> OpenAI (GPT)</label>
        <label><input type="checkbox" checked={providers.includes('anthropic')} onChange={() => toggleProvider('anthropic')} /> Anthropic (Claude)</label>
        <label><input type="checkbox" checked={providers.includes('google')} onChange={() => toggleProvider('google')} /> Google (Gemini)</label>
      </div>

      <div className="results" role="region" aria-live="polite">
        {mutation.isLoading && <div>Loading…</div>}
        {mutation.isError && <div role="alert">Error: {(mutation.error as any)?.message}</div>}
        {mutation.data && (
          <div>
            <h3>Aggregated results for {mutation.data.ticker}</h3>
            {mutation.data.results.map((r: any) => (
              <div key={r.provider} className="card">
                <strong>{r.provider}</strong>
                <p>{r.text}</p>
              </div>
            ))}
            <div className="card">
              <strong>Conclusion</strong>
              <p>{mutation.data.conclusion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
