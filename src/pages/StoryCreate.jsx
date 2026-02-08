import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';

const StoryCreate = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState({ title: '', summary: '', tags: '', genres: '' });
  const [chapter, setChapter] = useState({ title: '', content: '' });

  const submit = async (event) => {
    event.preventDefault();
    const storyPayload = {
      ...story,
      tags: story.tags.split(',').map((t) => t.trim()).filter(Boolean),
      genres: story.genres.split(',').map((g) => g.trim()).filter(Boolean)
    };
    const storyRes = await api.post('/stories', storyPayload);
    const storyId = storyRes.data.story._id;
    await api.post(`/stories/${storyId}/chapters`, chapter);
    navigate(`/stories/${storyId}`);
  };

  return (
    <div className="mx-auto max-w-2xl card p-6">
      <h1 className="text-2xl font-semibold text-dusk">Nouvelle fanfiction</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Titre"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
        />
        <textarea
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          rows="3"
          placeholder="Résumé"
          value={story.summary}
          onChange={(e) => setStory({ ...story, summary: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Tags (séparés par des virgules)"
          value={story.tags}
          onChange={(e) => setStory({ ...story, tags: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Genres (séparés par des virgules)"
          value={story.genres}
          onChange={(e) => setStory({ ...story, genres: e.target.value })}
        />
        <h2 className="text-lg font-semibold text-dusk">Chapitre 1</h2>
        <input
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          placeholder="Titre du chapitre"
          value={chapter.title}
          onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
        />
        <textarea
          className="w-full rounded-lg border border-dusk/20 px-3 py-2"
          rows="6"
          placeholder="Contenu du chapitre"
          value={chapter.content}
          onChange={(e) => setChapter({ ...chapter, content: e.target.value })}
        />
        <button className="rounded-lg bg-ink px-4 py-2 text-white">Publier</button>
      </form>
    </div>
  );
};

export default StoryCreate;
