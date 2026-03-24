import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function PostActions({ post, onPostUpdate, compact = false }) {
  const { user } = useAuth()
  const [pending, setPending] = useState(false)

  const toggleLike = async (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (!user || pending) return
    setPending(true)
    try {
      const res = await api.post(`/posts/${post.id}/toggle-like/`)
      onPostUpdate?.(res.data.post)
    } catch {
      alert('A like mentése nem sikerült.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: compact ? 10 : 14 }}>
      <button
        onClick={toggleLike}
        disabled={!user || pending}
        title={user ? 'Like' : 'Jelentkezz be a like-hoz'}
        style={{
          background: post.liked_by_me ? '#ff450018' : '#111113',
          color: post.liked_by_me ? '#ff6b35' : '#c8c8d0',
          border: `1px solid ${post.liked_by_me ? '#ff450055' : '#2a2a30'}`,
          borderRadius: 999,
          padding: '7px 12px',
          fontSize: 13,
          fontWeight: 600,
          cursor: user ? 'pointer' : 'not-allowed',
          opacity: !user || pending ? 0.7 : 1,
          transition: '0.18s ease',
        }}
      >
        {post.liked_by_me ? '♥' : '♡'} {post.like_count ?? 0}
      </button>
      <span style={{ fontSize: 13, color: '#6b6b78' }}>
        💬 {post.comment_count ?? 0} hozzászólás
      </span>
    </div>
  )
}
