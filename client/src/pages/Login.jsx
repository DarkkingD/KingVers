import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/feed');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        (err?.message === 'Network Error' ? 'Serveur indisponible' : 'Identifiants invalides');
      setError(message);
    }
  };

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  return (
    <div className="mx-auto max-w-md card p-6">
      <h1 className="text-2xl font-semibold text-dusk">Connexion</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-ember">{error}</p>}
        <button className="w-full rounded-lg bg-ink py-2 text-white">Se connecter</button>
      </form>
      <div className="mt-4 flex flex-col gap-2 text-sm">
        <a
          className="rounded-lg border border-dusk/20 px-3 py-2 text-center"
          href={`${apiBase}/api/auth/google`}
        >
          Continuer avec Google
        </a>
        <Link to="/register" className="text-center text-ember">
          Pas de compte ? Inscription
        </Link>
      </div>
    </div>
  );
};

export default Login;
