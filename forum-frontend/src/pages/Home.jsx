import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    setLoading(true)
    const url = query ? `/posts/?search=${encodeURIComponent(query)}` : '/posts/'
    api.get(url)
      .then(res => setPosts(res.data.results ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [query])

  const heading = query ? `„${query}” találatok` : 'Legújabb témák'
  const subtext = query ? `${posts.length} találat` : `${posts.length} téma összesen`

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post))
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#e8e8ec', transition: '0.2s ease' }}>{heading}</h1>
          <p style={{ color: '#6b6b78', fontSize: 14, marginTop: 4 }}>{subtext}</p>
        </div>
        {user && !query && (
          <button onClick={() => navigate('/create')} style={{ padding: '10px 22px', background: '#ff4500', color: '#fff', borderRadius: 9, fontWeight: 600, fontSize: 14, fontFamily: 'Syne, sans-serif', border: 'none', cursor: 'pointer' }}>
            + Új téma
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b78', fontSize: 15 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{query ? '🔍' : '📭'}</div>
          {query ? `Nincs találat erre: „${query}”` : 'Még nincs egy téma sem. Légy az első!'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map((post, i) => (
            <div key={post.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
              <PostCard post={post} query={query} onPostUpdate={handlePostUpdate} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
