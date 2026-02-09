import { useState, useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  user: {
    name: string
    email?: string
    avatar?: string 
    lineupsCount?: number
    postsCount?: number
    streak?: number
  }
}

interface UserStats {
  userId: string
  email: string
  name: string
  avatar: string | null
  createdAt: string
  lineupsCount: number
  postsCount: number
  streak: number
  gameStats: {
    [key: string]: {
      currentStreak: number
      maxStreak: number
      totalPlayed: number
      totalWins: number
      winRate: number
    }
  }
}

export default function ProfileDrawer({ open, onClose, user }: Props) {
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile')
  const [savedNotification, setSavedNotification] = useState(false)
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // State สำหรับข้อมูลสถิติที่ดึงจาก API
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // อัพเดท avatar เมื่อ user prop เปลี่ยน
  useEffect(() => {
    setAvatar(user?.avatar || '')
    setName(user?.name || '')
    setUploadSuccess(false)
  }, [user])

  // ดึงข้อมูลสถิติเมื่อเปิด drawer
  useEffect(() => {
    if (open) {
      fetchUserStats()
    }
  }, [open])

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true)
      const res = await fetch('/api/user/stats')
      
      if (!res.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await res.json()
      setStats(data.data)
    } catch (error) {
      console.error('Failed to load user stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const saveProfile = async () => {
    try {
      console.log('Saving profile with avatar:', avatar)
      
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          avatar
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }

      const result = await res.json()
      console.log('Profile saved:', result)

      setSavedNotification(true)
      setUploadSuccess(false)
      
      setTimeout(() => setSavedNotification(false), 2000)
      
      // รีเฟรชข้อมูลสถิติ
      fetchUserStats()
      
      // รีเฟรชหน้าเพื่อให้ข้อมูลอัพเดท
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save profile')
    }
  }

  const changePassword = async () => {
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!res.ok) {
        throw new Error('Failed to change password')
      }

      setPassword('')
      alert('Password changed successfully!')
    } catch (error) {
      console.error('Password change error:', error)
      alert('Failed to change password')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading file:', file.name)

      const res = await fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()
      console.log('Upload response:', data)
      
      setAvatar(data.url)
      setUploadSuccess(true)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // ใช้ข้อมูลจาก stats ถ้ามี ไม่งั้นใช้ค่าเริ่มต้นจาก props
  const displayStats = {
    lineupsCount: stats?.lineupsCount ?? user.lineupsCount ?? 0,
    postsCount: stats?.postsCount ?? user.postsCount ?? 0,
    streak: stats?.streak ?? user.streak ?? 0,
  }

  return (
    <>
      {savedNotification && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <span className="text-xl">✓</span>
          <span className="font-semibold">Saved successfully!</span>
        </div>
      )}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div className={`fixed top-0 right-0 h-full w-[420px] bg-gradient-to-br from-slate-50 to-gray-100 shadow-2xl transition-transform overflow-y-auto z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 h-32 px-6 pt-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            ✕
          </button>

          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-500 text-white text-3xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pt-16 pb-6">
          <div className="mb-6">
            <div className="font-bold text-2xl text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="text-2xl mb-1">⚽</div>
              <div className="font-bold text-xl text-gray-900">
                {loadingStats ? (
                  <div className="h-7 w-8 mx-auto bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  displayStats.lineupsCount
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium">Lineups</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="text-2xl mb-1">📝</div>
              <div className="font-bold text-xl text-gray-900">
                {loadingStats ? (
                  <div className="h-7 w-8 mx-auto bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  displayStats.postsCount
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium">Posts</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-xl text-emerald-600">
                {loadingStats ? (
                  <div className="h-7 w-8 mx-auto bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  displayStats.streak
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium">Streak</div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'stats' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Settings
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-4 bg-white rounded-2xl p-5 shadow-sm">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 border-2 border-gray-300 flex-shrink-0 relative">
                    {avatar ? (
                      <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-gray-500">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {uploadSuccess && (
                      <div className="absolute inset-0 bg-emerald-600/90 flex items-center justify-center">
                        <span className="text-white text-3xl">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="cursor-pointer inline-block">
                      <div className={`px-4 py-2 rounded-lg transition font-medium text-sm text-center ${
                        uploading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}>
                        {uploading ? 'Uploading...' : 'Choose Image'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                
                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200 animate-fade-in">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded successfully! Click "Save Changes" to confirm.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Display Name
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <button
                onClick={saveProfile}
                className={`w-full text-white px-4 py-3 rounded-xl font-semibold transition ${
                  uploadSuccess || name !== user?.name
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg animate-pulse-slow'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg'
                }`}
              >
                {uploadSuccess || name !== user?.name ? 'Save Changes ⚠️' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Game Performance</h3>
                {loadingStats ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats?.gameStats && Object.keys(stats.gameStats).length > 0 ? (
                      Object.entries(stats.gameStats).map(([gameType, gameStat]) => (
                        <div key={gameType} className="border-b border-gray-100 pb-3 last:border-0">
                          <div className="text-sm font-semibold text-gray-700 mb-2">
                            {gameType.replace(/_/g, ' ')}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Win Rate:</span>
                              <span className="font-bold text-emerald-600">{gameStat.winRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Played:</span>
                              <span className="font-bold text-gray-900">{gameStat.totalPlayed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Wins:</span>
                              <span className="font-bold text-gray-900">{gameStat.totalWins}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Streak:</span>
                              <span className="font-bold text-gray-900">{gameStat.currentStreak}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No game statistics yet
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 text-center border-2 ${
                    displayStats.lineupsCount > 0 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="text-xs font-semibold text-gray-700">First Lineup</div>
                  </div>
                  <div className={`rounded-xl p-3 text-center border-2 ${
                    displayStats.streak >= 5
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                    <div className="text-3xl mb-1">⭐</div>
                    <div className="text-xs font-semibold text-gray-700">5 Day Streak</div>
                  </div>
                  <div className={`rounded-xl p-3 text-center border-2 ${
                    displayStats.postsCount >= 10
                      ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                    <div className="text-3xl mb-1">✍️</div>
                    <div className="text-xs font-semibold text-gray-700">10 Posts</div>
                  </div>
                  <div className={`rounded-xl p-3 text-center border-2 ${
                    displayStats.streak >= 30
                      ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                    <div className="text-3xl mb-1">🔥</div>
                    <div className="text-xs font-semibold text-gray-700">30 Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Change Password</h3>
                <div className="space-y-2.5">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-12 focus:border-emerald-500 focus:outline-none transition text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={changePassword}
                    className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-gray-700 text-sm">Email Notifications</span>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-gray-700 text-sm">Public Profile</span>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button className="w-full bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200 text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}