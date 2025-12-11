import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

export function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'employee' }) {
    const { user, profile, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
        if (!loading && user && role && profile?.role !== role) {
            // Redirect to correct dashboard if trying to access wrong role page
            navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard')
        }
    }, [user, loading, profile, role, navigate])

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>
    if (!user) return null
    if (role && profile?.role !== role) return null

    return <>{children}</>
}
