import { useState, useRef, useEffect } from 'react'
import './App.css'

const BOT_PERSONAS = {
  amigable: {
    label: 'Amigable',
    prompt: 'Eres un asistente muy amigable y casual. Usas un tono cercano, respondes en español y ocasionalmente usas emojis.'
  },
  profesional: {
    label: 'Profesional',
    prompt: 'Eres un asistente profesional y formal. Respondes en español con precisión y claridad, sin usar emojis.'
  },
  tecnico: {
    label: 'Técnico',
    prompt: 'Eres un asistente técnico especializado en programación y tecnología. Respondes en español, usas términos técnicos y das ejemplos de código cuando es relevante.'
  }
}

function getTime() {
  return new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
}

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?', time: getTime() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState('amigable')
  const [botName, setBotName] = useState('ChatBot')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userText = input.trim()
    const newMessages = [...messages, { role: 'user', text: userText, time: getTime() }]
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          systemPrompt: BOT_PERSONAS[persona].prompt
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error del servidor')

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply, time: getTime() }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Error: ${error.message}`,
        time: getTime()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  const saveName = () => {
    if (tempName.trim()) setBotName(tempName.trim())
    setEditingName(false)
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="dot" />
        {editingName ? (
          <div className="name-edit">
            <input
              className="name-input"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
            />
            <button className="name-save" onClick={saveName}>✓</button>
          </div>
        ) : (
          <h1 onClick={() => { setTempName(botName); setEditingName(true) }} title="Clic para editar">
            {botName} <span className="edit-hint">✎</span>
          </h1>
        )}

        <div className="persona-selector">
          {Object.entries(BOT_PERSONAS).map(([key, val]) => (
            <button
              key={key}
              className={`persona-btn ${persona === key ? 'active' : ''}`}
              onClick={() => setPersona(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}>
            <div className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
            <span className="timestamp">{msg.time}</span>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper bot">
            <div className="message bot typing">
              <span className="dot-anim" /><span className="dot-anim" /><span className="dot-anim" />
            </div>
          </div>
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