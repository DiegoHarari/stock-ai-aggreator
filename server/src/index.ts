import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { analyzeTicker } from './providers'

dotenv.config()

const app = express()
app.use(bodyParser.json())

app.post('/api/analyze', async (req, res) => {
  const { ticker, providers } = req.body
  if (!ticker) return res.status(400).json({ error: 'ticker required' })
  try {
    const results = await analyzeTicker(ticker, providers || ['mock'])
    res.json({ ticker, results, conclusion: aggregateConclusion(results) })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message || 'server error' })
  }
})

function aggregateConclusion(results: { provider: string; text: string }[]) {
  // Very naive heuristic: look for buy/sell keywords across provider texts.
  const text = results.map(r => r.text.toLowerCase()).join(' ')
  const buy = (text.match(/buy/g) || []).length
  const sell = (text.match(/sell/g) || []).length
  if (buy > sell) return 'Recommendation: Consider BUY (based on aggregated responses)'
  if (sell > buy) return 'Recommendation: Consider SELL (based on aggregated responses)'
  return 'Recommendation: Hold / No strong consensus.'
}

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => console.log(`Server listening on ${port}`))

export default app
