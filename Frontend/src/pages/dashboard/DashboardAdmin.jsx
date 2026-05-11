import { useState, useEffect } from 'react'
import DashboardShell from '../../components/DashboardShell'
import { usersAPI } from '../../api/client'

const ROL_COLOR = {
  admin:        { bg: 'rgba(210,105,30,0.15)',  text: 'var(--rust)' },
  propietario:  { bg: 'rgba(0,128,128,0.15)',   text: 'var(--teal)' },
  arrendatario: { bg: 'rgba(112,128,144,0.15)', text: 'var(--slate)' },
}
const ESTADO_COLOR = {
  activo:   { bg: 'rgba(34,197,94,0.12)',  text: '#4ade80' },
  inactivo: { bg: 'rgba(239,68,68,0.12)',  text: '#f87171' },
}

function Badge({ text, colorMap }) {
  const c = colorMap[text] || { bg: '#333', text: '#aaa' }
  return (
    <span style={{
      background: c.bg, color: c.text,
      borderRadius: '999px', padding: '2px 10px',
      fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>{text}</span>
  )
}

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '0.6rem 0.875rem', color: 'var(--text)',
  fontSize: '0.9rem', marginBottom: '0.75rem',
}

function ModalUsuario({ user, onClose, onSaved }) {
  const isNew = !user?.id
  const [form, setForm] = useState({
    nombre:   user?.nombre   || '',
    apellido: user?.apellido || '',
    email:    user?.email    || '',
    password: '',
    telefono: user?.telefono || '',
    rol:      user?.rol      || 'arrendatario',
    estado:   user?.estado   || 'activo',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSave() {
    setError(''); setLoading(true)
    try {
      if (isNew) {
        if (!form.password) { setError('La contraseña es requerida.'); setLoading(false); return }
        await usersAPI.crear(form)
      } else {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await usersAPI.editar(user.id, payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '2rem', width: '100%', maxWidth: '440px',
      }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
          {isNew ? 'Nuevo usuario' : 'Editar usuario'}
        </h2>

        {error && <div style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '0.75rem', background: 'rgba(220,50,50,0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <input style={inputStyle} placeholder="Nombre"   value={form.nombre}   onChange={set('nombre')} />
          <input style={inputStyle} placeholder="Apellido" value={form.apellido} onChange={set('apellido')} />
        </div>
        <input style={inputStyle} type="email"    placeholder="Email"                         value={form.email}    onChange={set('email')} />
        <input style={inputStyle} type="password" placeholder={isNew ? 'Contraseña' : 'Nueva contraseña (opcional)'} value={form.password} onChange={set('password')} />
        <input style={inputStyle} placeholder="Teléfono (opcional)" value={form.telefono} onChange={set('telefono')} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <select style={inputStyle} value={form.rol}    onChange={set('rol')}>
            <option value="arrendatario">Arrendatario</option>
            <option value="propietario">Propietario</option>
            <option value="admin">Admin</option>
          </select>
          <select style={inputStyle} value={form.estado} onChange={set('estado')}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.7rem', color: 'var(--text2)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={loading} style={{
            flex: 1, background: 'var(--teal)', border: 'none',
            borderRadius: '8px', padding: '0.7rem', color: '#fff',
            fontWeight: 600, cursor: 'pointer',
          }}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardAdmin() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [modal, setModal]   = useState(null) // null | 'new' | user object

  async function cargar() {
    setLoading(true)
    try {
      const data = await usersAPI.listar()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function handleEliminar(id, nombre) {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return
    try {
      await usersAPI.eliminar(id)
      cargar()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <DashboardShell title="Panel de administración">

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total usuarios', value: users.length },
          { label: 'Admins',         value: users.filter(u => u.rol === 'admin').length },
          { label: 'Propietarios',   value: users.filter(u => u.rol === 'propietario').length },
          { label: 'Arrendatarios',  value: users.filter(u => u.rol === 'arrendatario').length },
          { label: 'Inactivos',      value: users.filter(u => u.estado === 'inactivo').length },
        ].map(c => (
          <div key={c.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Header tabla */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Usuarios</h2>
        <button onClick={() => setModal('new')} style={{
          background: 'var(--rust)', border: 'none', borderRadius: '8px',
          padding: '0.55rem 1.25rem', color: '#fff', fontWeight: 600,
          fontSize: '0.875rem', cursor: 'pointer',
        }}>+ Nuevo usuario</button>
      </div>

      {error   && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>}
      {loading && <p style={{ color: 'var(--text2)' }}>Cargando...</p>}

      {/* Tabla */}
      {!loading && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Nombre', 'Email', 'Teléfono', 'Rol', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '0.6rem 0.75rem',
                    color: 'var(--text2)', fontWeight: 600, fontSize: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem' }}><strong>{u.nombre} {u.apellido}</strong></td>
                  <td style={{ padding: '0.75rem', color: 'var(--text2)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text2)' }}>{u.telefono || '—'}</td>
                  <td style={{ padding: '0.75rem' }}><Badge text={u.rol} colorMap={ROL_COLOR} /></td>
                  <td style={{ padding: '0.75rem' }}><Badge text={u.estado} colorMap={ESTADO_COLOR} /></td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => setModal(u)} style={{
                      background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px',
                      padding: '0.3rem 0.75rem', color: 'var(--text2)', fontSize: '0.8rem', cursor: 'pointer', marginRight: '0.5rem',
                    }}>Editar</button>
                    <button onClick={() => handleEliminar(u.id, u.nombre)} style={{
                      background: 'transparent', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '6px',
                      padding: '0.3rem 0.75rem', color: '#f87171', fontSize: '0.8rem', cursor: 'pointer',
                    }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ModalUsuario
          user={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); cargar() }}
        />
      )}
    </DashboardShell>
  )
}
