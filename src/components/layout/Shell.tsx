import { Outlet, NavLink } from 'react-router'
import { Topbar } from './Topbar'
import { cn } from '@/lib/utils'
import { logout } from '@/components/auth/AuthGate'

const navItems = [
  { to: '/overview',       label: 'ภาพรวม',       dot: 'bg-blue-500' },
  { to: '/seminars',       label: 'สัมมนา',       dot: 'bg-[#AF52DE]' },
  { to: '/registrations',  label: 'ผู้ลงทะเบียน',  dot: 'bg-emerald-500' },
  { to: '/report',         label: 'รายงาน',         dot: 'bg-gray-400' },
]

export function Shell() {
  return (
    <div className="flex min-h-screen bg-[#F2F2F7] dark:bg-black font-sans text-black dark:text-white transition-colors duration-200">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-white/72 dark:bg-[#1C1C1E]/72 backdrop-blur-2xl border-r border-black/[0.08] dark:border-white/[0.08] flex flex-col z-20">
        <div className="px-5 py-6">
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Win Win Wealth</h1>
          <p className="text-xs text-gray-400 mt-0.5">ระบบจัดการภายใน</p>
        </div>
        
        <div className="px-4 mb-4">
          <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-150',
                  isActive
                    ? 'bg-[#007AFF]/10 text-[#007AFF] font-medium'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                )
              }
            >
              <div className={cn('w-2 h-2 rounded-full', item.dot)} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-5 flex items-center justify-between">
          <p className="text-xs text-black/30 dark:text-white/30">v0.1.0</p>
          <button
            onClick={logout}
            className="text-xs text-black/30 dark:text-white/30 hover:text-[#FF3B30] transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen relative">
        <Topbar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
