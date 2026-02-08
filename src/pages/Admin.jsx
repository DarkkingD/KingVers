import { useEffect, useState } from 'react';
import api from '../api/client.js';
import SectionHeader from '../components/SectionHeader.jsx';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [banId, setBanId] = useState('');
  const [storyId, setStoryId] = useState('');
  const [commentId, setCommentId] = useState('');
  const [postId, setPostId] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data.stats));
  }, []);

  const banUser = async () => {
    if (!banId.trim()) return;
    await api.post(`/admin/ban/${banId}`);
    setBanId('');
  };

  const deleteStory = async () => {
    if (!storyId.trim()) return;
    await api.delete(`/admin/story/${storyId}`);
    setStoryId('');
  };

  const deleteComment = async () => {
    if (!commentId.trim()) return;
    await api.delete(`/admin/comment/${commentId}`);
    setCommentId('');
  };

  const deletePost = async () => {
    if (!postId.trim()) return;
    await api.delete(`/admin/post/${postId}`);
    setPostId('');
  };

  if (!stats) return <div>Chargement...</div>;

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <SectionHeader title="Admin Dashboard" subtitle="Vue d'ensemble du contenu de la plateforme." />
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-parchment p-4">
            <div className="text-xs text-ink/70">Utilisateurs</div>
            <div className="text-2xl font-semibold">{stats.users}</div>
          </div>
          <div className="rounded-lg bg-parchment p-4">
            <div className="text-xs text-ink/70">Histoires</div>
            <div className="text-2xl font-semibold">{stats.stories}</div>
          </div>
          <div className="rounded-lg bg-parchment p-4">
            <div className="text-xs text-ink/70">Commentaires</div>
            <div className="text-2xl font-semibold">{stats.comments}</div>
          </div>
          <div className="rounded-lg bg-parchment p-4">
            <div className="text-xs text-ink/70">Posts</div>
            <div className="text-2xl font-semibold">{stats.posts}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6 space-y-3">
          <SectionHeader title="Moderation" subtitle="Actions rapides sur les comptes." />
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="User ID a bannir"
            value={banId}
            onChange={(e) => setBanId(e.target.value)}
          />
          <button onClick={banUser} className="rounded-lg bg-ink px-4 py-2 text-white">
            Bannir
          </button>
        </div>
        <div className="card p-6 space-y-3">
          <SectionHeader title="Suppression" subtitle="Supprimer rapidement un contenu." />
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Story ID"
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
          />
          <button onClick={deleteStory} className="rounded-lg bg-ember px-4 py-2 text-white">
            Supprimer histoire
          </button>
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Comment ID"
            value={commentId}
            onChange={(e) => setCommentId(e.target.value)}
          />
          <button onClick={deleteComment} className="rounded-lg bg-ember px-4 py-2 text-white">
            Supprimer commentaire
          </button>
          <input
            className="w-full rounded-lg border border-dusk/20 px-3 py-2"
            placeholder="Post ID"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
          <button onClick={deletePost} className="rounded-lg bg-ember px-4 py-2 text-white">
            Supprimer post
          </button>
        </div>
      </section>
    </div>
  );
};

export default Admin;
