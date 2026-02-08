import { useEffect, useState } from 'react';
import api from '../api/client.js';
import FeedItem from '../components/FeedItem.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

const Feed = () => {
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState('recent');
  const [postText, setPostText] = useState('');

  const loadFeed = async () => {
    const { data } = await api.get(`/feed?sort=${sort}`);
    setItems(data.items || []);
  };

  useEffect(() => {
    loadFeed();
  }, [sort]);

  const likeItem = async (item) => {
    const endpoints = {
      story: `/likes/story/${item.data._id}`,
      chapter: `/likes/chapter/${item.data._id}`,
      post: `/likes/post/${item.data._id}`,
      grouppost: `/likes/grouppost/${item.data._id}`
    };
    const endpoint = endpoints[item.type];
    if (!endpoint) return;
    await api.post(endpoint);
    loadFeed();
  };

  const favoriteStory = async (item) => {
    if (item.type !== 'story') return;
    await api.post(`/users/me/favorites/${item.data._id}`);
  };

  const saveStory = async (item) => {
    if (item.type !== 'story') return;
    await api.post(`/users/me/save/${item.data._id}`);
  };

  const createPost = async () => {
    if (!postText.trim()) return;
    await api.post('/posts', { content: postText });
    setPostText('');
    loadFeed();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Fil d'actualite"
        subtitle="Actualites, chapitres et activites des communautes que vous suivez."
      />

      <div className="card p-4">
        <textarea
          className="w-full rounded-lg border border-dusk/20 p-3"
          rows="3"
          placeholder="Partager une mise a jour avec la communaute..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['recent', 'popular', 'recommended'].map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`rounded-full px-4 py-2 text-xs ${
                  sort === key ? 'bg-ink text-white' : 'bg-parchment'
                }`}
              >
                {key === 'recent' ? 'Recent' : key === 'popular' ? 'Populaire' : 'Recommande'}
              </button>
            ))}
          </div>
          <button onClick={createPost} className="rounded-full bg-ink px-4 py-2 text-xs text-white">
            Publier
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <FeedItem
            key={`${item.type}-${item.data._id}`}
            item={item}
            actions={{
              onLike: () => likeItem(item),
              onFavorite: () => favoriteStory(item),
              onSave: () => saveStory(item)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
