const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const uploadRoutes = require('./routes/upload')
const chatRoutes = require('./routes/chat')
const statsRoutes = require('./routes/stats')



const app = express()
const PORT = process.env.PORT || 5050

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cincinnati-psi.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...')
    const result = await pool.query('SELECT NOW()')
    console.log('Database query successful:', result.rows[0])
    res.json({ success: true, time: result.rows[0] })
  } catch (error) {
    console.error('Database test error:', error.message)
    res.json({ success: false, error: error.message })
  }
})

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Cincinnati Hotel Backend API' })
})

app.use('/api/upload', uploadRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/stats', statsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Test DB: http://localhost:${PORT}/test-db`)
  console.log(`Stats: http://localhost:${PORT}/api/stats`)
})