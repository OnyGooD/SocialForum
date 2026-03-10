import { Link } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)   return `${Math.floor(diff)}mp`
  if (diff < 3600) return `${Math.floor(diff / 60)}p`
  if (diff < 86400) return `${Math.floor(diff / 3600)}ó`
  return `${Math.floor(diff / 86400)}n`
}

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} style={{ display: 'block' }}>
      <div style={{
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
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: stringToColor(post.author_name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {post.author_name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, color: '#6b6b78' }}>
            u/{post.author_name} · {timeAgo(post.created_at)}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 17,
          fontWeight: 700,
          color: '#e8e8ec',
          marginBottom: 8,
          lineHeight: 1.35,
        }}>
          {post.title}
        </h2>

        {/* Preview */}
        {post.content && (
          <p style={{
            fontSize: 14,
            color: '#8c8c99',
            lineHeight: 1.55,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {post.content}
          </p>
        )}

        {/* Footer */}
        <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6b6b78' }}>
            💬 {post.comment_count ?? 0} hozzászólás
          </span>
        </div>
      </div>
    </Link>
  )
}

function stringToColor(str = '') {
  const colors = ['#ff4500', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
