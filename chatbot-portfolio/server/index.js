import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Leer el .env manualmente
const envPath = join(__dirname, '.env')
const envContent = readFileSync(envPath, 'utf-8')
const GROQ_API_KEY = envContent
  .split('\n')
  .find(line => line.startsWith('GROQ_API_KEY='))
  ?.split('=')[1]
  ?.trim()

console.log('API KEY cargada:', GROQ_API_KEY ? 'sí ✓' : 'no ✗')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos' })
  }

  try {
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
          ...messages
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message })
    }

    const reply = data.choices[0].message.content
    res.json({ reply })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})