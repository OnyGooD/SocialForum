import { Link, useNavigate } from 'react-router-dom'
import PostActions from './PostActions'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return `${Math.floor(diff)}mp`
  if (diff < 3600) return `${Math.floor(diff / 60)}p`
  if (diff < 86400) return `${Math.floor(diff / 3600)}ó`
  return `${Math.floor(diff / 86400)}n`
}

function Highlight({ text, query }) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: '#ff450033', color: '#ff6b35', borderRadius: 3, padding: '0 2px' }}>{part}</mark>
          : part
      )}
    </>
  )
}

export default function PostCard({ post, query = '', onPostUpdate }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      style={{
        background: '#17171a',
        border: '1px solid #2a2a30',
        borderRadius: 10,
        padding: '18px 20px',
        transition: '0.18s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#ff4500'
        e.currentTarget.style.background = '#1c1c20'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2a2a30'
        e.currentTarget.style.background = '#17171a'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: stringToColor(post.author_name),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          overflow: 'hidden',
        }}>
          {post.author_avatar ? (
            <img src={post.author_avatar} alt={post.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            post.author_name?.[0]?.toUpperCase()
          )}
        </div>
        <span style={{ fontSize: 13, color: '#6b6b78' }}>
          <Link
            to={`/u/${post.author_name}`}
            onClick={(e) => e.stopPropagation()}
            style={{ color: '#6b6b78', textDecoration: 'none', fontWeight: 600 }}
          >
            u/{post.author_name}
          </Link>{' '}
          · {timeAgo(post.created_at)}
        </span>
      </div>

      <h2 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 17, fontWeight: 700,
        color: '#e8e8ec', marginBottom: 8, lineHeight: 1.35,
      }}>
        <Highlight text={post.title} query={query} />
      </h2>

      {post.content && (
        <p style={{
          fontSize: 14, color: '#8c8c99', lineHeight: 1.55,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {post.content}
        </p>
      )}

      <PostActions post={post} onPostUpdate={onPostUpdate} compact />
    </div>
  )
}

function stringToColor(str = '') {
  const colors = ['#ff4500', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
