import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) return setError('A két jelszó nem egyezik.')
    if (form.password.length < 6) return setError('A jelszónak legalább 6 karakter hosszúnak kell lennie.')
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.username) setError('Ez a felhasználónév már foglalt.')
      else if (data?.email) setError('Ez az email cím már használatban van.')
      else setError('Hiba a regisztráció során. Próbáld újra.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#17171a', border: '1px solid #2a2a30',
        borderRadius: 14, padding: '36px 32px',
        animation: 'fadeUp 0.35s ease forwards',
      }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 26,
          fontWeight: 800, color: '#e8e8ec', marginBottom: 6,
        }}>
          Regisztráció
        </h1>
        <p style={{ color: '#6b6b78', fontSize: 14, marginBottom: 28 }}>
          Csatlakozz a közösséghez!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {[
            { key: 'username', label: 'Felhasználónév', type: 'text', ph: 'kovacs_janos' },
            { key: 'email', label: 'Email cím', type: 'email', ph: 'pelda@email.hu' },
            { key: 'password', label: 'Jelszó', type: 'password', ph: '••••••••' },
            { key: 'password2', label: 'Jelszó megerősítése', type: 'password', ph: '••••••••' },
          ].map(({ key, label, type, ph }) => (
            <div key={key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8c8c99', display: 'block', marginBottom: 7 }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={set(key)}
                placeholder={ph}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#ff4500'}
                onBlur={e => e.target.style.borderColor = '#2a2a30'}
              />
            </div>
          ))}

          {error && (
            <div style={{
              background: '#ff450015', border: '1px solid #ff450040',
              borderRadius: 8, padding: '10px 14px', color: '#ff6b35', fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6, padding: '12px',
              background: '#ff4500', color: '#fff', borderRadius: 9,
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
              opacity: loading ? 0.6 : 1, transition: '0.18s ease',
            }}
          >
            {loading ? 'Regisztráció...' : 'Fiók létrehozása'}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: 'center', fontSize: 14, color: '#6b6b78' }}>
          Már van fiókod?{' '}
          <Link to="/login" style={{ color: '#ff4500', fontWeight: 600 }}>
            Jelentkezz be
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: '#0d0d0f', border: '1px solid #2a2a30',
  borderRadius: 8, color: '#e8e8ec', fontSize: 15,
  transition: '0.18s ease',
}
