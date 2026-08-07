import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    // flex row: sidebar is `app-sidebar` (position: sticky, top: 0, h-screen)
    // and this container itself does NOT scroll — only the <main> below does.
    // That's what keeps the sidebar visually pinned to the top of the
    // browser window at all times, regardless of content length.
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-h-screen flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
