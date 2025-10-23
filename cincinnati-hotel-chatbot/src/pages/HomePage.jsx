function HomePage({ onNavigate }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="max-w-4xl w-full">
          {/* Main Content Card */}
          <div 
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-purple-200"
            style={{ boxShadow: '0 20px 60px rgba(139, 92, 246, 0.15)' }}
          >
            
            {/* Logo/Brand Section */}
            <div className="text-center mb-12">
              <div 
                className="inline-block p-6 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                }}
              >
                <svg 
                  className="w-20 h-20 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
              <h1 
                className="text-6xl font-bold mb-4 tracking-tight"
                style={{ color: 'var(--color-text-dark)' }}
              >
                Cincinnati Hotel
              </h1>
              <p 
                className="text-xl font-light"
                style={{ color: 'var(--color-text-light)' }}
              >
                Your AI-Powered Concierge at Your Service
              </p>
            </div>
  
            {/* Divider */}
            <div 
              className="w-24 h-1 mx-auto mb-12 rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
            ></div>
  
            {/* Selection Section */}
            <div className="max-w-2xl mx-auto">
              <h2 
                className="text-3xl font-semibold mb-8 text-center"
                style={{ color: 'var(--color-text-dark)' }}
              >
                Choose Your Experience
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Admin Button */}
                <button 
                  onClick={() => onNavigate('admin')}
                  className="group relative text-white font-bold py-8 px-8 rounded-2xl transition-all duration-300 shadow-xl transform hover:-translate-y-2 active:scale-95"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)'}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition duration-300">
                      <svg 
                        className="w-12 h-12" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                    </div>
                    <span className="text-2xl">Admin</span>
                    <span className="text-sm text-purple-100 opacity-90">Manage & Monitor</span>
                  </div>
                </button>
  
                {/* User Button */}
                <button 
                  onClick={() => onNavigate('user')}
                  className="group relative text-white font-bold py-8 px-8 rounded-2xl transition-all duration-300 shadow-xl transform hover:-translate-y-2 active:scale-95"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                    boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(236, 72, 153, 0.3)'}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 transition duration-300">
                      <svg 
                        className="w-12 h-12" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                    </div>
                    <span className="text-2xl">User</span>
                    <span className="text-sm text-pink-100 opacity-90">Chat with AI Assistant</span>
                  </div>
                </button>
  
              </div>
  
              <p 
                className="text-center mt-10 text-lg"
                style={{ color: 'var(--color-text-light)' }}
              >
                Experience seamless hotel information at your fingertips
              </p>
            </div>
          </div>
  
          {/* Footer */}
          <p 
            className="text-center mt-6 text-sm"
            style={{ color: 'var(--color-text-light)' }}
          >
            Powered by Advanced AI Technology
          </p>
        </div>
      </div>
    )
  }
  
  export default HomePage