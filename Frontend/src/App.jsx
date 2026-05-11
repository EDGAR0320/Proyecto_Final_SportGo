import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login          from './pages/Login'
import Register       from './pages/Register'
import DashboardAdmin       from './pages/dashboard/DashboardAdmin'
import DashboardPropietario from './pages/dashboard/DashboardPropietario'
import DashboardArrendatario from './pages/dashboard/DashboardArrendatario'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Privadas por rol */}
          <Route path="/dashboard/admin" element={
            <PrivateRoute roles={['admin']}>
              <DashboardAdmin />
            </PrivateRoute>
          }/>
          <Route path="/dashboard/propietario" element={
            <PrivateRoute roles={['propietario']}>
              <DashboardPropietario />
            </PrivateRoute>
          }/>
          <Route path="/dashboard/arrendatario" element={
            <PrivateRoute roles={['arrendatario']}>
              <DashboardArrendatario />
            </PrivateRoute>
          }/>

          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
