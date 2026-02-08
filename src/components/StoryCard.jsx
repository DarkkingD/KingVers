import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

const StoryCard = ({ story }) => (
  <div className="card p-5">
    <div className="flex items-start gap-4">
      <div className="h-24 w-16 overflow-hidden rounded-2xl bg-dusk/10">
        {story.coverUrl ? (
          <img src={story.coverUrl} alt={story.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/stories/${story._id}`} className="text-lg font-semibold text-dusk">
              {story.title}
            </Link>
            <p className="text-sm text-ink/70">{story.summary}</p>
          </div>
          <div className="text-xs text-ink/60">
            {story.likesCount || 0} likes · {story.views || 0} vues
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-ink/60">
          <Avatar
            size="sm"
            name={story.author?.displayName || story.author?.username || 'KV'}
            src={story.author?.avatarUrl}
          />
          <span>{story.author?.displayName || story.author?.username}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
          {story.genres?.map((genre) => (
            <span key={genre} className="rounded-full bg-parchment px-2 py-1">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StoryCard;
