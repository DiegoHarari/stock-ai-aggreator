import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TickerForm from '../TickerForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

global.fetch = (input: any, init?: any) => {
  // Simple mock for the POST /api/analyze endpoint used by axios.
  const body = init?.body ? JSON.parse(init.body) : {}
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      ticker: body.ticker,
      results: [{ provider: 'mock', text: 'Mock analysis for ' + body.ticker }],
      conclusion: 'Hold'
    })
  } as any)
}

test('submits ticker and shows results', async () => {
  const qc = new QueryClient()
  render(
    <QueryClientProvider client={qc}>
      <TickerForm />
    </QueryClientProvider>
  )

  const input = screen.getByLabelText('ticker-input')
  fireEvent.change(input, { target: { value: 'tsla' } })
  const button = screen.getByText('Analyze')
  fireEvent.click(button)

  await waitFor(() => screen.getByText(/Aggregated results/))
  expect(screen.getByText(/Mock analysis/)).toBeInTheDocument()
  expect(screen.getByText(/Conclusion/)).toBeInTheDocument()
})
