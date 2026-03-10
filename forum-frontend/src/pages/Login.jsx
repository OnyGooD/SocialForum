import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Hibás felhasználónév vagy jelszó.')
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
          Bejelentkezés
        </h1>
        <p style={{ color: '#6b6b78', fontSize: 14, marginBottom: 28 }}>
          Üdvözlünk vissza!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8c8c99', display: 'block', marginBottom: 7 }}>
              Felhasználónév
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="felhasználónév"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#ff4500'}
              onBlur={e => e.target.style.borderColor = '#2a2a30'}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8c8c99', display: 'block', marginBottom: 7 }}>
              Jelszó
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#ff4500'}
              onBlur={e => e.target.style.borderColor = '#2a2a30'}
            />
          </div>

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
            {loading ? 'Belépés...' : 'Belépés'}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: 'center', fontSize: 14, color: '#6b6b78' }}>
          Nincs még fiókod?{' '}
          <Link to="/register" style={{ color: '#ff4500', fontWeight: 600 }}>
            Regisztrálj
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
