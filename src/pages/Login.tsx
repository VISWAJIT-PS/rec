import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { toast } = useToast()

    const [adminEmail, setAdminEmail] = useState("")
    const [adminPassword, setAdminPassword] = useState("")
    const [empId, setEmpId] = useState("")
    const [empPass, setEmpPass] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
        })

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } else {
            navigate('/admin/dashboard')
        }
        setLoading(false)
    }

    const handleEmployeeLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const email = `${empId}@app.com`.toLowerCase()

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: empPass,
        })

        if (error) {
            console.error(error)
            toast({ title: "Login Failed", description: "Invalid ID or Password", variant: "destructive" })
        } else {
            navigate('/employee/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Attendance App</CardTitle>
                    <CardDescription className="text-lg">Secure Login Portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="employee" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 p-1">
                            <TabsTrigger value="employee" className="text-base">Employee</TabsTrigger>
                            <TabsTrigger value="admin" className="text-base">Admin</TabsTrigger>
                        </TabsList>

                        <TabsContent value="employee">
                            <form onSubmit={handleEmployeeLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="empId">Employee ID</Label>
                                    <Input
                                        id="empId"
                                        placeholder="E.g. EMP001"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="empPass">Password (DOB: DDMMYYYY)</Label>
                                    <Input
                                        id="empPass"
                                        type="password"
                                        placeholder="********"
                                        value={empPass}
                                        onChange={(e) => setEmpPass(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11 text-base group" disabled={loading}>
                                    {loading ? "Logging in..." : "Check In / Dashboard"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="admin">
                            <form onSubmit={handleAdminLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">Email</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminPass">Password</Label>
                                    <Input
                                        id="adminPass"
                                        type="password"
                                        placeholder="********"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                    {loading ? "Verifying..." : "Access Admin Panel"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        </div>
    )
}
