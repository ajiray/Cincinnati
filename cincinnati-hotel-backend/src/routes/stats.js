const express = require('express')
const pool = require('../db')
const router = express.Router()

// Get statistics
router.get('/', async (req, res) => {
  try {
    // Total sessions
    const sessionsResult = await pool.query(
      'SELECT COUNT(DISTINCT session_id) as total FROM chat_sessions'
    )
    
    // Total questions
    const questionsResult = await pool.query(
      'SELECT COUNT(*) as total FROM chat_messages'
    )
    
    // Questions by category
    const categoryResult = await pool.query(`
      SELECT 
        COALESCE(category, 'Uncategorized') as category, 
        COUNT(*) as count 
      FROM chat_messages 
      GROUP BY category 
      ORDER BY count DESC
    `)

    res.json({
      success: true,
      data: {
        totalSessions: parseInt(sessionsResult.rows[0].total),
        totalQuestions: parseInt(questionsResult.rows[0].total),
        questionsByCategory: categoryResult.rows.map(row => ({
          category: row.category,
          count: parseInt(row.count)
        }))
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message
    })
  }
})

module.exports = router