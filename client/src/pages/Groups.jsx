import { useEffect, useState } from 'react';
import api from '../api/client.js';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', isPrivate: false });

  const load = async () => {
    const res = await api.get('/groups');
    setGroups(res.data.groups || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/groups', form);
    setForm({ name: '', description: '', isPrivate: false });
    load();
  };

  const join = async (id) => {
    await api.post(`/groups/${id}/join`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl text-dusk">Créer un groupe</h2>
        <form onSubmit={create} className="mt-3 space-y-3">
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Nom du groupe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            rows="2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
            />
            Groupe privé
          </label>
          <button className="rounded-lg bg-ink px-4 py-2 text-white">Créer</button>
        </form>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div key={group._id} className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg text-dusk">{group.name}</h3>
              <p className="text-sm text-ink/70">{group.description}</p>
            </div>
            <button onClick={() => join(group._id)} className="rounded-lg bg-ember px-3 py-1 text-white">
              Rejoindre
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
