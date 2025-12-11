import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'

// Temporary lazy loading or just components
// Real components will be implemented next
import EmployeeDashboard from '@/pages/employee/Dashboard'
import EmployeeHistory from '@/pages/employee/History'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminEmployees from '@/pages/admin/Employees'
import AdminReports from '@/pages/admin/Reports'

// Fallback for missing components during build (I need to create them now!)
// I will create empty placeholders after this call to avoid import errors

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-8 container mx-auto px-4 py-4 max-w-7xl">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Employee Routes */}
          <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="/employee/dashboard" element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/history" element={
            <ProtectedRoute role="employee">
              <EmployeeHistory />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute role="admin">
              <AdminEmployees />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute role="admin">
              <AdminReports />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className='p-10 text-center'>Page Not Found</div>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
