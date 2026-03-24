import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return `${Math.floor(diff)}mp`
  if (diff < 3600) return `${Math.floor(diff / 60)}p`
  if (diff < 86400) return `${Math.floor(diff / 3600)}ó`
  return `${Math.floor(diff / 86400)}n`
}

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuth()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Törlöd ezt a kommentet?')) return
    setDeleting(true)
    try {
      await api.delete(`/comments/${comment.id}/`)
      onDelete(comment.id)
    } catch {
      alert('Hiba a törlés során.')
      setDeleting(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid #2a2a30', animation: 'fadeUp 0.3s ease forwards' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: stringToColor(comment.author_name),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>
        {comment.author_name?.[0]?.toUpperCase()}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <Link to={`/u/${comment.author_name}`} style={{ fontSize: 13, fontWeight: 600, color: '#e8e8ec', textDecoration: 'none' }}>
            u/{comment.author_name}
          </Link>
          <span style={{ fontSize: 12, color: '#6b6b78' }}>{timeAgo(comment.created_at)}</span>
          {user && user.username === comment.author_name && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                marginLeft: 'auto', background: 'none', color: '#6b6b78', fontSize: 12,
                padding: '2px 6px', borderRadius: 4, border: '1px solid transparent', transition: '0.15s ease',
              }}
              onMouseEnter={e => { e.target.style.color = '#ff4500'; e.target.style.borderColor = '#ff450044' }}
              onMouseLeave={e => { e.target.style.color = '#6b6b78'; e.target.style.borderColor = 'transparent' }}
            >
              törlés
            </button>
          )}
        </div>

        <p style={{ fontSize: 14, color: '#c8c8d0', lineHeight: 1.6 }}>{comment.content}</p>
      </div>
    </div>
  )
}

function stringToColor(str = '') {
  const colors = ['#ff4500', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
