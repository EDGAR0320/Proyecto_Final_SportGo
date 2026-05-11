import DashboardShell from '../../components/DashboardShell'
import { useAuth } from '../../context/AuthContext'

const cardStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '1.5rem',
}

const CATEGORIAS = [
  { emoji: '🚵', nombre: 'Ciclismo',     cantidad: 24 },
  { emoji: '🚣', nombre: 'Acuático',     cantidad: 18 },
  { emoji: '🏂', nombre: 'Invierno',     cantidad: 11 },
  { emoji: '🥾', nombre: 'Trail/Senderismo', cantidad: 31 },
]

const RENTAS_DEMO = [
  { id: 1, equipo: 'Bicicleta Trek X-Caliber', propietario: 'Ana García', desde: '2026-05-10', hasta: '2026-05-12', precio: 160, estado: 'activa'    },
  { id: 2, equipo: 'Kayak Perception Swifty',  propietario: 'Ana García', desde: '2026-04-20', hasta: '2026-04-21', precio: 120, estado: 'completada' },
]

export default function DashboardArrendatario() {
  const { user } = useAuth()

  return (
    <DashboardShell title={`Hola, ${user?.nombre} 👋`}>

      {/* Buscador */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem',
        display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'center',
      }}>
        <input placeholder="¿Qué equipo buscás?" style={{
          flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '0.65rem 1rem', color: 'var(--text)',
          fontSize: '0.95rem',
        }} />
        <button style={{
          background: 'var(--rust)', border: 'none', borderRadius: '8px',
          padding: '0.65rem 1.5rem', color: '#fff', fontWeight: 600,
          fontSize: '0.9rem', cursor: 'pointer',
        }}>Buscar</button>
      </div>

      {/* Categorías */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Explorar categorías</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {CATEGORIAS.map(cat => (
          <button key={cat.nombre} style={{
            ...cardStyle, cursor: 'pointer', textAlign: 'center',
            transition: 'border-color 0.2s', background: 'var(--bg2)',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.nombre}</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{cat.cantidad} equipos</div>
          </button>
        ))}
      </div>

      {/* Mis rentas */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Mis rentas</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {RENTAS_DEMO.map(r => (
          <div key={r.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{r.equipo}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>
                Propietario: {r.propietario} · {r.desde} → {r.hasta}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', color: 'var(--teal)' }}>Bs. {r.precio}</div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                color: r.estado === 'activa' ? '#4ade80' : 'var(--slate)',
              }}>{r.estado}</span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text2)', textAlign: 'center' }}>
        Las rentas son de ejemplo. Conectar con <code>/api/rentas</code> cuando esté disponible.
      </p>
    </DashboardShell>
  )
}
