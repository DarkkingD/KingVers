import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/feed');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        (err?.message === 'Network Error' ? 'Serveur indisponible' : 'Impossible de creer le compte');
      setError(message);
    }
  };

  return (
    <div className="mx-auto max-w-md card p-6">
      <h1 className="text-2xl font-semibold text-dusk">Inscription</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Pseudo"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Nom affiche"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
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
        <button className="w-full rounded-lg bg-ink py-2 text-white">Creer mon compte</button>
      </form>
      <Link to="/login" className="mt-4 block text-center text-ember">
        Deja inscrit ? Connexion
      </Link>
    </div>
  );
};

export default Register;
