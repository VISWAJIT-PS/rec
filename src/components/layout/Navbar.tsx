import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const { signOut, user, profile } = useAuth()

    if (!user) return null

    return (
        <nav className="border-b p-4 flex justify-between items-center bg-card shadow-sm sticky top-0 z-50">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {profile?.role === 'admin' ? 'Admin Portal' : 'Staff Attendance'}
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                    {profile?.name}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                    Logout
                </Button>
            </div>
        </nav>
    )
}
