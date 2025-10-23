import { useState, useEffect } from 'react'

function AdminPage({ onNavigate }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [statistics, setStatistics] = useState({
    totalSessions: 0,
    totalQuestions: 0,
    questionsByCategory: []
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Color mapping for categories
  const categoryColors = {
    'Rooms': 'from-purple-500 to-purple-600',
    'Restaurant': 'from-pink-500 to-pink-600',
    'Facilities': 'from-amber-500 to-amber-600',
    'Prices': 'from-blue-500 to-blue-600',
    'Services': 'from-green-500 to-green-600',
    'Uncategorized': 'from-gray-500 to-gray-600',
  }

  // Fetch statistics from backend
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/stats')
      const data = await response.json()
      
      if (data.success) {
        // Add colors to categories
        const categoriesWithColors = data.data.questionsByCategory.map(cat => ({
          ...cat,
          color: categoryColors[cat.category] || 'from-gray-500 to-gray-600'
        }))

        setStatistics({
          totalSessions: data.data.totalSessions,
          totalQuestions: data.data.totalQuestions,
          questionsByCategory: categoriesWithColors
        })
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Fetch stats on component mount
  useEffect(() => {
    fetchStatistics()
    
    // Poll for updates every 5 seconds (near real-time)
    const interval = setInterval(fetchStatistics, 5000)
    
    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setIsUploading(true)
      
      try {
        const formData = new FormData()
        formData.append('pdf', file)
  
        const response = await fetch('http://localhost:5050/api/upload/pdf', {
          method: 'POST',
          body: formData
        })
  
        const result = await response.json()
  
        if (result.success) {
          setUploadedFile(file)
          alert('PDF uploaded successfully!')
        } else {
          alert('Upload failed: ' + result.error)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload PDF: ' + error.message)
      } finally {
        setIsUploading(false)
      }
    } else {
      alert('Please upload a valid PDF file')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      {/* Header */}
      <div 
        className="bg-white/80 backdrop-blur-lg border-b border-purple-200 shadow-lg"
        style={{ boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                  Admin Dashboard
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                  Cincinnati Hotel Management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-1">
            <div 
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200"
              style={{ boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-dark)' }}>
                Hotel Information
              </h2>
              
              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="pdf-upload"
                  className="block w-full cursor-pointer"
                >
                  <div 
                    className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-500 transition duration-200 bg-purple-50/50"
                  >
                    <svg 
                      className="w-12 h-12 mx-auto mb-4" 
                      style={{ color: 'var(--color-primary)' }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {isUploading ? (
                      <p className="text-purple-600 font-semibold">Uploading...</p>
                    ) : (
                      <>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>
                          Click to upload PDF
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                          or drag and drop
                        </p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Current File Info */}
              {uploadedFile && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-dark)' }}>
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}

              <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-light)' }}>
                Uploading a new file will replace the previous one
              </p>
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="lg:col-span-2 space-y-6">
            
            {isLoadingStats ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                <p className="mt-4" style={{ color: 'var(--color-text-light)' }}>Loading statistics...</p>
              </div>
            ) : (
              <>
                {/* Overview Stats Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Total Sessions Card */}
                  <div 
                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200"
                    style={{ boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>
                          Total Chat Sessions
                        </p>
                        <h3 className="text-4xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                          {statistics.totalSessions}
                        </h3>
                      </div>
                      <div 
                        className="p-4 rounded-2xl"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Total Questions Card */}
                  <div 
                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200"
                    style={{ boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>
                          Total Questions
                        </p>
                        <h3 className="text-4xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                          {statistics.totalQuestions}
                        </h3>
                      </div>
                      <div 
                        className="p-4 rounded-2xl"
                        style={{ background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))' }}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions by Category */}
                <div 
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-purple-200"
                  style={{ boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}
                >
                  <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-dark)' }}>
                    Questions by Category
                  </h2>
                  
                  {statistics.questionsByCategory.length > 0 ? (
                    <div className="space-y-4">
                      {statistics.questionsByCategory.map((item, index) => {
                        const percentage = statistics.totalQuestions > 0 
                          ? (item.count / statistics.totalQuestions) * 100 
                          : 0
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                                {item.category}
                              </span>
                              <span className="text-sm font-bold" style={{ color: 'var(--color-text-dark)' }}>
                                {item.count} questions
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-center py-8" style={{ color: 'var(--color-text-light)' }}>
                      No questions yet. Start chatting to see statistics!
                    </p>
                  )}
                </div>

                {/* Real-time Update Indicator */}
                <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: 'var(--color-text-light)' }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Statistics update every 5 seconds</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage