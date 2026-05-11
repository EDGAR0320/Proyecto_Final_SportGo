import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ROL_LABEL = { admin: 'Administrador', propietario: 'Propietario', arrendatario: 'Arrendatario' }
const ROL_COLOR = { admin: 'var(--rust)', propietario: 'var(--teal)', arrendatario: 'var(--slate)' }

export default function DashboardShell({ title, children }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <header style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 2rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'var(--font-head)', fontSize: '1.8rem',
          color: 'var(--teal)', letterSpacing: '0.06em',
        }}>
          ⚡ SportGo
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.nombre}</div>
            <div style={{
              fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: ROL_COLOR[user?.rol],
            }}>
              {ROL_LABEL[user?.rol]}
            </div>
          </div>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.4rem 1rem',
            color: 'var(--text2)', fontSize: '0.85rem', cursor: 'pointer',
          }}>
            Salir
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>{title}</h1>
        <div style={{ width: '40px', height: '3px', background: 'var(--teal)', marginBottom: '2rem', borderRadius: '2px' }} />
        {children}
      </main>
    </div>
  )
}
