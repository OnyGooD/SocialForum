import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const handleSearch = (e) => {
    const val = e.target.value
    if (window.location.pathname !== '/') {
      navigate('/?q=' + encodeURIComponent(val))
      return
    }
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  return (
    <nav style={{ background: '#111113', borderBottom: '1px solid #2a2a30', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#ff4500', letterSpacing: '-0.5px', flexShrink: 0 }}>
          f/forum
        </Link>

        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#6b6b78', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Keresés a témák között..."
            style={{ width: '100%', padding: '8px 14px 8px 34px', background: '#0d0d0f', border: '1px solid #2a2a30', borderRadius: 8, color: '#e8e8ec', fontSize: 14, transition: '0.18s ease' }}
            onFocus={e => e.target.style.borderColor = '#ff4500'}
            onBlur={e => e.target.style.borderColor = '#2a2a30'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }}>
          {user ? (
            <>
              <Link to={`/u/${user.username}`} style={{ fontSize: 13, color: '#6b6b78', textDecoration: 'none' }}>
                u/{user.username}
              </Link>
              <button onClick={() => navigate('/create')} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: '#ff4500', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Új téma</button>
              <button onClick={logout} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: 'transparent', color: '#e8e8ec', border: '1px solid #2a2a30', cursor: 'pointer' }}>Kilépés</button>
            </>
          ) : (
            <>
              <Link to="/login"><button style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: 'transparent', color: '#e8e8ec', border: '1px solid #2a2a30', cursor: 'pointer' }}>Belépés</button></Link>
              <Link to="/register"><button style={{ padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: '#ff4500', color: '#fff', border: 'none', cursor: 'pointer' }}>Regisztráció</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
