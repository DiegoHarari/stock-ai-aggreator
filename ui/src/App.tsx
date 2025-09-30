import React from 'react'
import TickerForm from './components/TickerForm'
import './styles.css'

export default function App() {
  return (
    <div className="app">
      <h1>Stock and Token AI Aggregator</h1>
      <p>Type a stock ticker (e.g. TSLA) and choose the provider. The backend will aggregate AI responses and a mini conclusion.</p>
      <TickerForm />
    </div>
  )
}
