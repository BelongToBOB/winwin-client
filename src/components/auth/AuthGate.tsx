import { useState } from 'react'

const AUTH_KEY = 'ww_auth'
const VALID_USER = 'winwin'
const VALID_PASS = 'winwin2024'

export function logout() {
  localStorage.removeItem(AUTH_KEY)
  window.location.reload()
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === VALID_USER && password === VALID_PASS) {
      localStorage.setItem(AUTH_KEY, 'ok')
      window.location.reload()
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-8">
          <div className="mb-8 text-center">
            <h1 className="text-[20px] font-semibold text-black dark:text-white">Win Win Wealth</h1>
            <p className="text-[13px] text-black/40 dark:text-white/40 mt-1">ระบบจัดการภายใน</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wide">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full h-10 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                placeholder="username"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wide">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-10 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                placeholder="password"
              />
            </div>

            {error && (
              <p className="text-[12px] text-[#FF3B30]">{error}</p>
            )}

            <button
              type="submit"
              className="h-10 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 active:scale-[0.98] transition-all mt-2"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem(AUTH_KEY) !== 'ok') {
    return <LoginForm />
  }
  return <>{children}</>
}
