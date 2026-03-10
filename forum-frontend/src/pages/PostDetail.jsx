import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CommentItem from '../components/CommentItem'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return `${Math.floor(diff)} másodperce`
  if (diff < 3600)  return `${Math.floor(diff / 60)} perce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} órája`
  return `${Math.floor(diff / 86400)} napja`
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}/`),
      api.get(`/posts/${id}/comments/`),
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data)
      setComments(commentsRes.data.results ?? commentsRes.data)
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/posts/${id}/comments/`, { content: newComment })
      setComments(prev => [res.data, ...prev])
      setNewComment('')
    } catch {
      alert('Hiba a komment küldésekor.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Törlöd ezt a témát?')) return
    await api.delete(`/posts/${id}/`)
    navigate('/')
  }

  if (loading) return <div className="spinner" />

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>
      {/* Back */}
      <Link to="/" style={{ fontSize: 13, color: '#6b6b78', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
        ← Vissza
      </Link>

      {/* Post */}
      <div style={{
        background: '#17171a', border: '1px solid #2a2a30',
        borderRadius: 12, padding: '28px 28px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#ff4500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            {post.author_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e8ec' }}>
              u/{post.author_name}
            </div>
            <div style={{ fontSize: 12, color: '#6b6b78' }}>{timeAgo(post.created_at)}</div>
          </div>
          {user?.username === post.author_name && (
            <button
              onClick={handleDeletePost}
              style={{
                marginLeft: 'auto', background: 'none',
                color: '#6b6b78', fontSize: 13,
                padding: '4px 10px', borderRadius: 6,
                border: '1px solid #2a2a30', transition: '0.15s ease',
              }}
              onMouseEnter={e => { e.target.style.color = '#ff4500'; e.target.style.borderColor = '#ff450044' }}
              onMouseLeave={e => { e.target.style.color = '#6b6b78'; e.target.style.borderColor = '#2a2a30' }}
            >
              Téma törlése
            </button>
          )}
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 24, fontWeight: 800,
          color: '#e8e8ec', lineHeight: 1.3, marginBottom: 14,
        }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 15, color: '#b8b8c4', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>
      </div>

      {/* Komment form */}
      <div style={{
        background: '#17171a', border: '1px solid #2a2a30',
        borderRadius: 12, padding: '20px', marginBottom: 20,
      }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 15,
          fontWeight: 700, color: '#e8e8ec', marginBottom: 12,
        }}>
          Hozzászólás
        </h3>
        {user ? (
          <form onSubmit={handleComment}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Írd meg a véleményed..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#0d0d0f', border: '1px solid #2a2a30',
                borderRadius: 8, color: '#e8e8ec', fontSize: 14,
                resize: 'vertical', transition: '0.18s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#ff4500'}
              onBlur={e => e.target.style.borderColor = '#2a2a30'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                style={{
                  padding: '9px 22px', background: '#ff4500',
                  color: '#fff', borderRadius: 8, fontWeight: 600,
                  fontSize: 14, opacity: submitting || !newComment.trim() ? 0.5 : 1,
                  transition: '0.18s ease',
                }}
              >
                {submitting ? 'Küldés...' : 'Elküld'}
              </button>
            </div>
          </form>
        ) : (
          <p style={{ fontSize: 14, color: '#6b6b78' }}>
            <Link to="/login" style={{ color: '#ff4500', fontWeight: 600 }}>Jelentkezz be</Link>{' '}
            a hozzászóláshoz.
          </p>
        )}
      </div>

      {/* Kommentek */}
      <div style={{
        background: '#17171a', border: '1px solid #2a2a30',
        borderRadius: 12, padding: '8px 20px',
      }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b6b78', fontSize: 14, padding: '32px 0' }}>
            Még nincs hozzászólás. Legyél az első!
          </p>
        ) : (
          comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              onDelete={id => setComments(prev => prev.filter(x => x.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  )
}
