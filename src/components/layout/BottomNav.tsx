import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History } from "lucide-react"

export function BottomNav() {
    const location = useLocation()

    // Only show on employee pages and on mobile (handled by CSS md:hidden)
    if (!location.pathname.startsWith('/employee')) return null

    const links = [
        { to: "/employee/dashboard", icon: LayoutDashboard, label: "Home" },
        { to: "/employee/history", icon: History, label: "History" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex justify-around md:hidden z-50 pb-safe">
            {links.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${location.pathname === to ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                    <Icon size={24} />
                    <span className="text-xs mt-1">{label}</span>
                </Link>
            ))}
        </div>
    )
}
