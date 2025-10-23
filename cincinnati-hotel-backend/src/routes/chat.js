const express = require('express')
const axios = require('axios')
const router = express.Router()

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' })
    }

    console.log('Chat message received:', message)

    // Send to n8n AI Agent webhook
    const n8nResponse = await axios.post(
      `${process.env.N8N_WEBHOOK_URL}/webhook/chat`,
      {
        message: message.trim(),
        sessionId: sessionId || 'default'
      },
      {
        timeout: 30000 // 30 seconds
      }
    )

    console.log('AI response:', n8nResponse.data)

    res.json({
      success: true,
      response: n8nResponse.data.response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat error:', error.message)
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.response?.data || error.message
    })
  }
})

module.exports = router