import DashboardShell from '../../components/DashboardShell'
import { useAuth } from '../../context/AuthContext'

const cardStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '1.5rem',
}

// Datos de ejemplo — reemplazar con llamadas reales a la API cuando existan las rutas de equipos
const EQUIPOS_DEMO = [
  { id: 1, nombre: 'Bicicleta de montaña Trek', categoria: 'Ciclismo',   precio: 80,  estado: 'disponible',  rentas: 12 },
  { id: 2, nombre: 'Kayak individual Perception', categoria: 'Acuático', precio: 120, estado: 'rentado',      rentas: 7  },
  { id: 3, nombre: 'Tabla de snowboard Burton',   categoria: 'Invierno', precio: 95,  estado: 'disponible',  rentas: 4  },
]

export default function DashboardPropietario() {
  const { user } = useAuth()

  return (
    <DashboardShell title={`Bienvenido, ${user?.nombre}`}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Mis equipos',    value: EQUIPOS_DEMO.length },
          { label: 'Disponibles',    value: EQUIPOS_DEMO.filter(e => e.estado === 'disponible').length },
          { label: 'En renta',       value: EQUIPOS_DEMO.filter(e => e.estado === 'rentado').length },
          { label: 'Total rentas',   value: EQUIPOS_DEMO.reduce((a, e) => a + e.rentas, 0) },
        ].map(c => (
          <div key={c.label} style={cardStyle}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Mis equipos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Mis equipos</h2>
        <button style={{
          background: 'var(--teal)', border: 'none', borderRadius: '8px',
          padding: '0.55rem 1.25rem', color: '#fff', fontWeight: 600,
          fontSize: '0.875rem', cursor: 'pointer',
        }}>+ Publicar equipo</button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {EQUIPOS_DEMO.map(eq => (
          <div key={eq.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '10px',
              background: 'rgba(0,128,128,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
            }}>
              {eq.categoria === 'Ciclismo' ? '🚵' : eq.categoria === 'Acuático' ? '🚣' : '🏂'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{eq.nombre}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{eq.categoria} · {eq.rentas} rentas</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', color: 'var(--teal)' }}>Bs. {eq.precio}/día</div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                color: eq.estado === 'disponible' ? '#4ade80' : 'var(--rust)',
              }}>{eq.estado}</span>
            </div>
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.4rem 0.875rem',
              color: 'var(--text2)', fontSize: '0.82rem', cursor: 'pointer',
            }}>Editar</button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text2)', textAlign: 'center' }}>
        Los datos de equipos son de ejemplo. Conectar con <code>/api/equipos</code> cuando esté disponible.
      </p>
    </DashboardShell>
  )
}
