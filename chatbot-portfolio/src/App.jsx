import { useState, useRef, useEffect } from 'react'
import './App.css'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userText = input.trim()
    const newMessages = [...messages, { role: 'user', text: userText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }))

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Eres un asistente útil y amigable. Responde siempre en español.' },
            ...history
          ]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error Groq:', data)
        throw new Error(data.error?.message || 'Error desconocido')
      }

      const botReply = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', text: botReply }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Error: ${error.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="dot" />
        <h1>ChatBot</h1>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot typing">Escribiendo...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}

export default App