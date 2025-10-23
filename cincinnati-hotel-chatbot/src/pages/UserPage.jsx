import { useState, useRef, useEffect } from 'react'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

function UserPage({ onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm the Cincinnati Hotel AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' })
  const messagesEndRef = useRef(null)
  
  const sessionIdRef = useRef('user-session-' + Date.now())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatMessage = (text) => {
    if (!text) return ''
    
    // Convert markdown-style formatting to HTML
    let formatted = text
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Bullet points: - item or * item
      .replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br/>')
    
    // Wrap list items in <ul>
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-4 mt-2 space-y-1">$1</ul>')
    }
    
    return formatted
  }

  const handleContactFormSubmit = (e) => {
    e.preventDefault()
    alert('Thank you! A customer service representative will contact you soon.')
    setShowContactForm(false)
    setContactInfo({ name: '', phone: '', email: '' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (inputMessage.trim() === '' || isLoading) return

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionIdRef.current
        })
      })

      const data = await response.json()

      if (data.success) {
        const botResponse = {
          id: messages.length + 2,
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, botResponse])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <div 
        className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-purple-200 shadow-lg"
        style={{ boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-purple-100 rounded-lg transition duration-200"
              style={{ color: 'var(--color-primary)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-xl"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                  Cincinnati Hotel
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                  AI Assistant • Online
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`flex items-end space-x-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-pink-500 to-amber-500'
                }`}>
                  {message.sender === 'bot' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'bot'
                        ? 'bg-white/90 backdrop-blur shadow-md'
                        : 'text-white shadow-lg'
                    }`}
                    style={message.sender === 'user' ? {
                      background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))'
                    } : {}}
                  >
                    <div 
                      className={`text-sm ${message.sender === 'bot' ? '' : 'text-white'}`}
                      style={message.sender === 'bot' ? { color: 'var(--color-text-dark)' } : {}}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                    />
                  </div>

                  {message.sender === 'bot' && message.text && message.text.toLowerCase().includes("don't have that information") && (
                    <div className="mt-3 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                      <p className="text-sm mb-3 font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                        Would you like to leave your contact details?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowContactForm(true)}
                          className="flex-1 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                        >
                          Yes, please
                        </button>
                        <button
                          onClick={() => {}}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-purple-300 font-semibold transition-all duration-200 hover:bg-purple-100"
                          style={{ color: 'var(--color-text-dark)' }}
                        >
                          No, thanks
                        </button>
                      </div>
                    </div>
                  )}

                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                     style={{ color: 'var(--color-text-light)' }}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-end space-x-2 max-w-[70%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white/90 backdrop-blur shadow-md rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-t border-purple-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              placeholder="Ask me anything about Cincinnati Hotel..."
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/90 backdrop-blur transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
              style={{ color: 'var(--color-text-dark)' }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-4 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
            Powered by AI • All information based on hotel documentation
          </p>
        </div>
      </div>

      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div 
                className="inline-block p-4 rounded-2xl mb-4"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                Contact Information
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                A customer service representative will get back to you
              </p>
            </div>

            <form onSubmit={handleContactFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition duration-200"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowContactForm(false)
                    setContactInfo({ name: '', phone: '', email: '' })
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold transition-all duration-200 hover:bg-gray-50"
                  style={{ color: 'var(--color-text-dark)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPage