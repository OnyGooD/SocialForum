import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)} mp`
  if (diff < 3600) return `${Math.floor(diff / 60)} p`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ó`
  return `${Math.floor(diff / 86400)} n`
}

function stringToColor(str = '') {
  const colors = ['#ff4500', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function ProfilePage() {
  const { username } = useParams()
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)

  const isOwnProfile = useMemo(() => user?.username === username, [user, username])

  const loadProfile = () => {
    setLoading(true)
    api.get(`/users/${username}/`)
      .then((res) => {
        setProfile(res.data)
        setBio(res.data.bio || '')
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (username) loadProfile()
  }, [username])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const form = new FormData()
      form.append('bio', bio)
      if (avatarFile) form.append('avatar', avatarFile)
      await api.patch('/users/me/', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      await refreshUser()
      setAvatarFile(null)
      loadProfile()
    } catch {
      alert('Nem sikerült menteni a profilodat.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (!profile) return <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px', color: '#e8e8ec' }}>A profil nem található.</div>

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: stringToColor(profile.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile.username?.[0]?.toUpperCase()
            )}
          </div>

          <div>
            <h1 style={{ margin: 0, color: '#e8e8ec', fontFamily: 'Syne, sans-serif', fontSize: 28 }}>u/{profile.username}</h1>
            <p style={{ margin: '6px 0 0', color: '#6b6b78', fontSize: 14 }}>Regisztrált: {new Date(profile.date_joined).toLocaleDateString('hu-HU')}</p>
            {profile.bio && <p style={{ margin: '10px 0 0', color: '#c8c8d0', fontSize: 14, lineHeight: 1.6 }}>{profile.bio}</p>}
          </div>
        </div>

        {isOwnProfile && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid #2a2a30' }}>
            <h3 style={{ color: '#e8e8ec', marginTop: 0 }}>Profil szerkesztése</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8c8c99', marginBottom: 6 }}>Bemutatkozás</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ width: '100%', padding: '12px 14px', background: '#0d0d0f', border: '1px solid #2a2a30', borderRadius: 8, color: '#e8e8ec', fontSize: 14, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8c8c99', marginBottom: 6 }}>Profilkép feltöltése</label>
                <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} style={{ color: '#c8c8d0' }} />
                {avatarFile && <p style={{ fontSize: 12, color: '#6b6b78', marginTop: 6 }}>Kiválasztva: {avatarFile.name}</p>}
              </div>
              <div>
                <button type="submit" disabled={saving} style={{ padding: '10px 18px', background: '#ff4500', color: '#fff', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Mentés...' : 'Profil mentése'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <section style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 12, padding: 20 }}>
          <h2 style={{ color: '#e8e8ec', marginTop: 0, marginBottom: 16 }}>Létrehozott témák</h2>
          {profile.posts.length === 0 ? (
            <p style={{ color: '#6b6b78' }}>Még nem hozott létre témát.</p>
          ) : profile.posts.map((post) => (
            <div key={post.id} style={{ padding: '14px 0', borderBottom: '1px solid #2a2a30' }}>
              <Link to={`/post/${post.id}`} style={{ color: '#e8e8ec', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>{post.title}</Link>
              {post.content && <p style={{ color: '#8c8c99', fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{post.content}</p>}
              <p style={{ color: '#6b6b78', fontSize: 13, marginTop: 8 }}>♥ {post.like_count} · 💬 {post.comment_count} · {timeAgo(post.created_at)}</p>
            </div>
          ))}
        </section>

        <section style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 12, padding: 20 }}>
          <h2 style={{ color: '#e8e8ec', marginTop: 0, marginBottom: 16 }}>Hozzászólásai</h2>
          {profile.comments.length === 0 ? (
            <p style={{ color: '#6b6b78' }}>Még nem szólt hozzá témákhoz.</p>
          ) : profile.comments.map((comment) => (
            <div key={comment.id} style={{ padding: '14px 0', borderBottom: '1px solid #2a2a30' }}>
              <p style={{ color: '#c8c8d0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{comment.content}</p>
              <p style={{ color: '#6b6b78', fontSize: 13, marginTop: 8 }}>
                ehhez a témához: <Link to={`/post/${comment.post_id}`} style={{ color: '#ff4500', textDecoration: 'none', fontWeight: 600 }}>{comment.post_title}</Link> · {timeAgo(comment.created_at)}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
