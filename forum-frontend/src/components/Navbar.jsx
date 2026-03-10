import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const S = {
  nav: {
    background: '#111113',
    borderBottom: '1px solid #2a2a30',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 22,
    color: '#ff4500',
    letterSpacing: '-0.5px',
  },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  btn: {
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: '0.18s ease',
  },
  btnGhost: {
    background: 'transparent',
    color: '#e8e8ec',
    border: '1px solid #2a2a30',
  },
  btnAccent: {
    background: '#ff4500',
    color: '#fff',
    border: 'none',
  },
  user: {
    fontSize: 13,
    color: '#6b6b78',
    marginRight: 4,
  }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link to="/" style={S.logo}>f/forum</Link>
        <div style={S.right}>
          {user ? (
            <>
              <span style={S.user}>u/{user.username}</span>
              <button
                style={{ ...S.btn, ...S.btnAccent }}
                onClick={() => navigate('/create')}
              >
                + Új téma
              </button>
              <button
                style={{ ...S.btn, ...S.btnGhost }}
                onClick={logout}
              >
                Kilépés
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{ ...S.btn, ...S.btnGhost }}>Belépés</button>
              </Link>
              <Link to="/register">
                <button style={{ ...S.btn, ...S.btnAccent }}>Regisztráció</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
