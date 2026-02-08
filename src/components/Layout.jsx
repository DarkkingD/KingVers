import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-2xl font-semibold text-dusk">
            KingVerse
          </NavLink>
          <form onSubmit={submitSearch} className="hidden w-full max-w-md md:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher histoires, auteurs, groupes..."
              className="w-full rounded-full border border-dusk/20 bg-white/80 px-4 py-2 text-sm"
            />
          </form>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <NavLink to="/">Accueil</NavLink>
            {user && <NavLink to="/feed">Feed</NavLink>}
            <NavLink to="/stories">Histoires</NavLink>
            <NavLink to="/groups">Groupes</NavLink>
            {user && <NavLink to="/chat">Chat</NavLink>}
            {user && <NavLink to="/create">Creer</NavLink>}
            {user?.roles?.includes('admin') && <NavLink to="/admin">Admin</NavLink>}
            {user ? (
              <div className="flex items-center gap-2">
                <NavLink to="/profile" className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    name={user.displayName || user.username}
                    src={user.avatarUrl}
                  />
                </NavLink>
                <button
                  onClick={logout}
                  className="rounded-full bg-ink px-3 py-1 text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs text-ink/60">
        KingVerse · La communaute des fanfictions · 2026
      </footer>
    </div>
  );
};

export default Layout;
