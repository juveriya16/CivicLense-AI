import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DesktopSidebar, MobileSidebar } from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from './CommandPalette'
import FloatingAssistant from './FloatingAssistant'
import BottomNav from './BottomNav'

export default function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen flex bg-surface">
      <DesktopSidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} onSearchClick={() => setPaletteOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <FloatingAssistant />
    </div>
  )
}
