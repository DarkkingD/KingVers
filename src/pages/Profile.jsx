import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import StoryCard from '../components/StoryCard.jsx';
import Avatar from '../components/Avatar.jsx';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isMe = !id || id === user?.id;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
    preferredGenres: '',
    username: ''
  });

  useEffect(() => {
    const load = async () => {
      if (isMe && user) {
        const res = await api.get('/users/me');
        const data = res.data.user;
        setProfile(data);
        setForm({
          displayName: data.displayName || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          preferredGenres: (data.preferredGenres || []).join(', '),
          username: data.username || ''
        });
      } else if (id) {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data.user);
      }
    };
    load();
  }, [id, isMe, user]);

  const save = async () => {
    const payload = {
      displayName: form.displayName,
      bio: form.bio,
      avatarUrl: form.avatarUrl,
      preferredGenres: form.preferredGenres.split(',').map((g) => g.trim()).filter(Boolean),
      username: form.username
    };
    const res = await api.put('/users/me', payload);
    setProfile(res.data.user);
  };

  const follow = async () => {
    if (!id) return;
    await api.post(`/users/${id}/follow`);
  };

  if (!profile) return <div>Chargement...</div>;

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={profile.displayName || profile.username} src={profile.avatarUrl} size="lg" />
            <div>
              <h1 className="text-2xl text-dusk">{profile.displayName || profile.username}</h1>
              <p className="text-sm text-ink/70">@{profile.username}</p>
              <p className="mt-2 text-sm text-ink/70">{profile.bio}</p>
            </div>
          </div>
          {!isMe && (
            <button onClick={follow} className="rounded-full bg-ink px-4 py-2 text-sm text-white">
              Suivre
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink/60">
          <span className="rounded-full bg-parchment px-3 py-1">
            {profile.followersCount || profile.followers?.length || 0} abonnés
          </span>
          <span className="rounded-full bg-parchment px-3 py-1">
            {profile.followingCount || profile.following?.length || 0} abonnements
          </span>
        </div>
      </section>

      {isMe && (
        <section className="card p-6 space-y-3">
          <SectionHeader title="Parametres" subtitle="Personnalise ton profil public." />
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
            placeholder="Avatar URL"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
          />
          <textarea
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            rows="3"
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Genres preferes (separes par des virgules)"
            value={form.preferredGenres}
            onChange={(e) => setForm({ ...form, preferredGenres: e.target.value })}
          />
          <button onClick={save} className="rounded-lg bg-ink px-4 py-2 text-white">
            Enregistrer
          </button>
        </section>
      )}

      {profile.preferredGenres?.length > 0 && (
        <section className="card p-6">
          <SectionHeader title="Genres preferes" />
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {profile.preferredGenres.map((genre) => (
              <span key={genre} className="rounded-full bg-parchment px-3 py-1">
                {genre}
              </span>
            ))}
          </div>
        </section>
      )}

      {isMe && profile.favorites?.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="Favoris" subtitle="Tes histoires preferees." />
          <div className="grid gap-4">
            {profile.favorites.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        </section>
      )}

      {isMe && profile.library?.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="Bibliotheque personnelle" subtitle="Les histoires que tu suis." />
          <div className="grid gap-4">
            {profile.library.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        </section>
      )}

      {isMe && profile.savedForLater?.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="A lire plus tard" />
          <div className="grid gap-4">
            {profile.savedForLater.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        </section>
      )}

      {isMe && profile.readingHistory?.length > 0 && (
        <section className="card p-6">
          <SectionHeader title="Historique de lecture" />
          <div className="mt-4 space-y-3 text-sm">
            {profile.readingHistory.map((entry) => (
              <div key={`${entry.story?._id}-${entry.chapter?._id}`} className="flex justify-between">
                <div>
                  <div className="font-semibold text-dusk">{entry.story?.title}</div>
                  <div className="text-xs text-ink/60">Chapitre {entry.chapter?.order || '-'}</div>
                </div>
                <div className="text-xs text-ink/60">{entry.minutesRead || 0} min</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Profile;
