import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StoryCard from '../components/StoryCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

const StoryList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/stories').then((res) => setStories(res.data.stories || []));
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bibliotheque"
        subtitle="Decouvrez des milliers de fanfictions publiees par la communaute."
      />
      <div className="grid gap-4">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoryList;
