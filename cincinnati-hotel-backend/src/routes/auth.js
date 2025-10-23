const express = require('express')
const { google } = require('googleapis')
const router = express.Router()

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Store tokens (in production, use database)
let tokens = null

// Generate auth URL
router.get('/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent'
  })
  res.redirect(authUrl)
})

// OAuth callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query
  
  try {
    const { tokens: newTokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(newTokens)
    tokens = newTokens
    
    res.send('Authorization successful! You can close this window.')
  } catch (error) {
    console.error('Error getting tokens:', error)
    res.status(500).send('Authorization failed')
  }
})

// Export for use in other routes
module.exports = { router, oauth2Client, getTokens: () => tokens }