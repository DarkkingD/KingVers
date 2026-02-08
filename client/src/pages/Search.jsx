import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client.js';
import StoryCard from '../components/StoryCard.jsx';

const Search = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q') || '';
  const [results, setResults] = useState({ stories: [], users: [], groups: [], tags: [], genres: [] });

  useEffect(() => {
    if (!query.trim()) return;
    api.get(`/search?q=${encodeURIComponent(query)}`).then((res) => setResults(res.data));
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-dusk">Recherche: {query}</h1>
      <div className="grid gap-4">
        {results.stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>
      <div className="card p-4">
        <h2 className="text-lg text-dusk">Utilisateurs</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {results.users.map((user) => (
            <span key={user._id} className="rounded-full bg-parchment px-3 py-1">
              {user.displayName || user.username}
            </span>
          ))}
        </div>
      </div>
      <div className="card p-4">
        <h2 className="text-lg text-dusk">Groupes</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {results.groups.map((group) => (
            <span key={group._id} className="rounded-full bg-parchment px-3 py-1">
              {group.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
