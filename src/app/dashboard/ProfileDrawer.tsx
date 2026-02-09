import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  user: {
    name: string
    email?: string
    lineupsCount?: number
    postsCount?: number
    streak?: number
  }
}

export default function ProfileDrawer({ open, onClose, user }: Props) {
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile')
  const [savedNotification, setSavedNotification] = useState(false)

  const saveProfile = async () => {
    await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 2000)
  }

  const changePassword = async () => {
    await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
  }

  return (
    <>
      {savedNotification && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <span className="text-xl">✓</span>
          <span className="font-semibold">Saved successfully!</span>
        </div>
      )}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div className={`fixed top-0 right-0 h-full w-[420px] bg-gradient-to-br from-slate-50 to-gray-100 shadow-2xl transition-transform overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 h-32 px-6 pt-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            ✕
          </button>

          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-3xl">
              {user.name.charAt(0)}
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
              <div className="font-bold text-xl text-gray-900">{user.lineupsCount ?? 0}</div>
              <div className="text-xs text-gray-500 font-medium">Lineups</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="text-2xl mb-1">📝</div>
              <div className="font-bold text-xl text-gray-900">{user.postsCount ?? 0}</div>
              <div className="text-xs text-gray-500 font-medium">Posts</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-bold text-xl text-emerald-600">{user.streak ?? 0}</div>
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
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Display Name</label>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <button
                onClick={saveProfile}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Game Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-bold text-emerald-600">--</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Games</span>
                    <span className="font-bold text-gray-900">--</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-bold text-gray-900">{user.streak ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-3 text-center">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="text-xs font-semibold text-gray-700">First Win</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 text-center">
                    <div className="text-3xl mb-1">⭐</div>
                    <div className="text-xs font-semibold text-gray-700">5 Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                  />
                  <button
                    onClick={changePassword}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700 text-sm">Email Notifications</span>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700 text-sm">Public Profile</span>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}