import { useState, useEffect } from 'react'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/posts/')
      .then(res => setPosts(res.data.results ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28, fontWeight: 800, color: '#e8e8ec',
          }}>
            Legújabb témák
          </h1>
          <p style={{ color: '#6b6b78', fontSize: 14, marginTop: 4 }}>
            {posts.length} téma összesen
          </p>
        </div>
        {user && (
          <button
            onClick={() => navigate('/create')}
            style={{
              padding: '10px 22px',
              background: '#ff4500',
              color: '#fff',
              borderRadius: 9,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'Syne, sans-serif',
              transition: '0.18s ease',
            }}
            onMouseEnter={e => e.target.style.background = '#e03d00'}
            onMouseLeave={e => e.target.style.background = '#ff4500'}
          >
            + Új téma
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="spinner" />
      ) : posts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          color: '#6b6b78', fontSize: 15,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          Még nincs egy téma sem. Légy az első!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
