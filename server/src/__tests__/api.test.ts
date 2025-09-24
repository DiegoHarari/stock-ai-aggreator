import request from 'supertest'
import app from '../../index'

describe('POST /api/analyze', () => {
  it('returns 400 without ticker', async () => {
    const res = await request(app).post('/api/analyze').send({})
    expect(res.status).toBe(400)
  })

  it('returns aggregated data for ticker', async () => {
    const res = await request(app).post('/api/analyze').send({ ticker: 'TSLA', providers: ['mock'] })
    expect(res.status).toBe(200)
    expect(res.body.ticker).toBe('TSLA')
    expect(Array.isArray(res.body.results)).toBe(true)
    expect(res.body.conclusion).toBeDefined()
  })
})
