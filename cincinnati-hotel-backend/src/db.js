const { Pool } = require('pg')

console.log('Connecting to database...')
console.log('Connection string:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

pool.on('connect', () => {
  console.log('✅ Database connected successfully')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err)
})

module.exports = pool