// Cliente HTTP centralizado para la API de SportGo (Express en :3000)
// Vite redirige /api → http://localhost:3000 via proxy (vite.config.js)

const BASE = '/api'

function getToken() {
  return localStorage.getItem('sportgo_token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })
  } catch (networkErr) {
    // El backend no está corriendo o no hay conexión
    throw new Error('No se puede conectar con el servidor. ¿Está corriendo el backend en :3000?')
  }

  // Parsear JSON solo si hay contenido
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`)
  }

  return data
}

// Auth
export const authAPI = {
  login:    (email, password)           => request('POST', '/auth/login',    { email, password }),
  register: (nombre, apellido, email, password, telefono) =>
                                           request('POST', '/auth/register', { nombre, apellido, email, password, telefono }),
}

// Users (requiere token JWT)
export const usersAPI = {
  listar:   ()          => request('GET',    '/users'),
  ver:      (id)        => request('GET',    `/users/${id}`),
  crear:    (data)      => request('POST',   '/users',     data),
  editar:   (id, data)  => request('PUT',    `/users/${id}`, data),
  eliminar: (id)        => request('DELETE', `/users/${id}`),
}