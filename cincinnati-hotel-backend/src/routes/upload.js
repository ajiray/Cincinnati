const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const router = express.Router()

// Configure multer
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// PDF upload endpoint
router.post('/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' })
    }

    console.log('File received:', req.file.originalname, req.file.size, 'bytes')

    // Create FormData to send to n8n
    const formData = new FormData()
    formData.append('data', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })

    console.log('Sending to n8n...')

    // Send to n8n webhook
    const n8nResponse = await axios.post(
      `${process.env.N8N_WEBHOOK_URL}/webhook/upload-pdf-to-drive`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000 // 60 seconds
      }
    )

    console.log('n8n response:', n8nResponse.data)

    res.json({ 
      success: true, 
      message: 'PDF uploaded to Google Drive successfully',
      data: n8nResponse.data
    })

  } catch (error) {
    console.error('Upload error:', error.message)
    if (error.response) {
      console.error('n8n error response:', error.response.data)
    }
    res.status(500).json({ 
      error: 'Failed to upload PDF',
      details: error.response?.data || error.message 
    })
  }
})

module.exports = router