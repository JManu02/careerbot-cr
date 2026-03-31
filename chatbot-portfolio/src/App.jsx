import { useState, useRef, useEffect } from 'react'
import './App.css'

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

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: history })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error del servidor')
      }

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
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