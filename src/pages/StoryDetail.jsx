import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import CommentThread from '../components/CommentThread.jsx';
import StoryCard from '../components/StoryCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const loadStory = async () => {
    const storyRes = await api.get(`/stories/${id}`);
    const chaptersRes = await api.get(`/stories/${id}/chapters`);
    setStory(storyRes.data.story);
    setChapters(chaptersRes.data.chapters || []);
  };

  useEffect(() => {
    loadStory();
  }, [id]);

  useEffect(() => {
    const targetType = activeChapter ? 'chapter' : 'story';
    const targetId = activeChapter?._id || id;
    api
      .get(`/comments?targetType=${targetType}&targetId=${targetId}`)
      .then((res) => setComments(res.data.comments || []));
  }, [id, activeChapter]);

  useEffect(() => {
    if (!user) return;
    api.get('/users/me').then((res) => setProfileData(res.data.user));
    api.get('/recommendations?limit=4').then((res) => setRecommendations(res.data.recommendations || []));
  }, [user]);

  const likeStory = async () => {
    await api.post(`/likes/story/${id}`);
    loadStory();
  };

  const likeChapter = async () => {
    if (!activeChapter) return;
    await api.post(`/likes/chapter/${activeChapter._id}`);
    const chaptersRes = await api.get(`/stories/${id}/chapters`);
    setChapters(chaptersRes.data.chapters || []);
  };

  const toggleFavorite = async () => {
    await api.post(`/users/me/favorites/${id}`);
    const res = await api.get('/users/me');
    setProfileData(res.data.user);
  };

  const toggleSave = async () => {
    await api.post(`/users/me/save/${id}`);
    const res = await api.get('/users/me');
    setProfileData(res.data.user);
  };

  const toggleLibrary = async () => {
    await api.post(`/users/me/library/${id}`);
    const res = await api.get('/users/me');
    setProfileData(res.data.user);
  };

  const sendComment = async () => {
    if (!commentText.trim()) return;
    const targetType = activeChapter ? 'chapter' : 'story';
    const targetId = activeChapter?._id || id;
    await api.post('/comments', { targetType, targetId, content: commentText });
    setCommentText('');
    const res = await api.get(`/comments?targetType=${targetType}&targetId=${targetId}`);
    setComments(res.data.comments || []);
  };

  const selectChapter = async (chapter) => {
    setActiveChapter(chapter);
    if (!user) return;
    await api.post('/users/me/reading', {
      storyId: id,
      chapterId: chapter._id,
      minutesRead: 5
    });
  };

  if (!story) return <div>Chargement...</div>;

  const isFavorite = profileData?.favorites?.some((fav) => fav._id === id);
  const isSaved = profileData?.savedForLater?.some((fav) => fav._id === id);
  const inLibrary = profileData?.library?.some((fav) => fav._id === id);

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          <div className="overflow-hidden rounded-2xl bg-dusk/10">
            {story.coverUrl ? (
              <img src={story.coverUrl} alt={story.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl text-dusk">{story.title}</h1>
                <p className="text-sm text-ink/70">{story.summary}</p>
              </div>
              <button onClick={likeStory} className="rounded-full bg-ember px-4 py-2 text-white">
                Like {story.likesCount || 0}
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink/60">
              <Avatar
                size="sm"
                name={story.author?.displayName || story.author?.username}
                src={story.author?.avatarUrl}
              />
              <span>{story.author?.displayName || story.author?.username}</span>
              <span>·</span>
              <span>{story.views || 0} vues</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {story.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-parchment px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
              {story.genres?.map((genre) => (
                <span key={genre} className="rounded-full bg-parchment px-3 py-1 text-xs">
                  {genre}
                </span>
              ))}
            </div>
            {user && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <button
                  onClick={toggleFavorite}
                  className={`rounded-full px-3 py-1 ${isFavorite ? 'bg-ink text-white' : 'bg-parchment'}`}
                >
                  Favoris
                </button>
                <button
                  onClick={toggleSave}
                  className={`rounded-full px-3 py-1 ${isSaved ? 'bg-ink text-white' : 'bg-parchment'}`}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={toggleLibrary}
                  className={`rounded-full px-3 py-1 ${inLibrary ? 'bg-ink text-white' : 'bg-parchment'}`}
                >
                  Ajouter a la bibliotheque
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-dusk">Chapitres</h2>
          <div className="mt-3 space-y-2">
            {chapters.map((chapter) => (
              <button
                key={chapter._id}
                onClick={() => selectChapter(chapter)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeChapter?._id === chapter._id ? 'bg-ink text-white' : 'bg-parchment'
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-6">
          {activeChapter ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-dusk">{activeChapter.title}</h2>
                <button
                  onClick={likeChapter}
                  className="rounded-full bg-ember px-3 py-1 text-white"
                >
                  Like {activeChapter.likesCount || 0}
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">
                {activeChapter.content}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink/70">Selectionne un chapitre pour lire.</p>
          )}
        </div>
      </div>

      <section className="card p-6">
        <h3 className="text-lg font-semibold text-dusk">Commentaires</h3>
        <div className="mt-4">
          <textarea
            className="w-full rounded-lg border border-dusk/20 p-3"
            rows="3"
            placeholder="Ajouter un commentaire"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={sendComment} className="mt-2 rounded-lg bg-ink px-4 py-2 text-white">
            Publier
          </button>
        </div>
        <CommentThread comments={comments} />
      </section>

      {recommendations.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="Pour continuer" subtitle="Des histoires qui matchent ton profil." />
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <StoryCard key={rec.story._id} story={rec.story} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StoryDetail;
