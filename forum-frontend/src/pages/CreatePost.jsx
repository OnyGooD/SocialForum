import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setError('A cím nem lehet üres.')
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/posts/', { title, content })
      navigate(`/post/${res.data.id}`)
    } catch (err) {
      setError('Hiba a téma létrehozásakor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 26,
        fontWeight: 800, color: '#e8e8ec', marginBottom: 28,
      }}>
        Új téma létrehozása
      </h1>

      <div style={{
        background: '#17171a', border: '1px solid #2a2a30',
        borderRadius: 12, padding: '28px',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8c8c99', display: 'block', marginBottom: 7 }}>
              Cím *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Mi a témád?"
              maxLength={200}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#0d0d0f', border: '1px solid #2a2a30',
                borderRadius: 8, color: '#e8e8ec', fontSize: 15,
                transition: '0.18s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#ff4500'}
              onBlur={e => e.target.style.borderColor = '#2a2a30'}
            />
            <div style={{ fontSize: 12, color: '#6b6b78', marginTop: 5, textAlign: 'right' }}>
              {title.length}/200
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8c8c99', display: 'block', marginBottom: 7 }}>
              Tartalom
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Fejtsd ki részletesebben... (opcionális)"
              rows={6}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#0d0d0f', border: '1px solid #2a2a30',
                borderRadius: 8, color: '#e8e8ec', fontSize: 15,
                resize: 'vertical', transition: '0.18s ease',
              }}
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

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px', borderRadius: 8,
                background: 'transparent', border: '1px solid #2a2a30',
                color: '#8c8c99', fontSize: 14, fontWeight: 500,
              }}
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              style={{
                padding: '10px 24px', borderRadius: 8,
                background: '#ff4500', color: '#fff',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700, fontSize: 14,
                opacity: loading || !title.trim() ? 0.55 : 1,
                transition: '0.18s ease',
              }}
            >
              {loading ? 'Létrehozás...' : 'Téma közzététele'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
