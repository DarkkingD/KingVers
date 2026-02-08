import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

const typeLabel = (type) => {
  if (type === 'story') return 'Nouvelle fanfiction';
  if (type === 'chapter') return 'Chapitre publié';
  if (type === 'post') return 'Post communautaire';
  return 'Publication de groupe';
};

const getAuthor = (item) => {
  if (item.type === 'story') return item.data.author;
  if (item.type === 'chapter') return item.data.story?.author;
  return item.data.author;
};

const FeedItem = ({ item, actions = {} }) => {
  const { type, data } = item;
  const author = getAuthor(item);

  const title =
    type === 'story'
      ? data.title
      : type === 'chapter'
      ? data.title
      : type === 'post'
      ? 'Post communautaire'
      : 'Publication de groupe';

  const link =
    type === 'story'
      ? `/stories/${data._id}`
      : type === 'chapter'
      ? `/stories/${data.story?._id || data.story}`
      : null;

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
        <span className="rounded-full bg-parchment px-3 py-1">{typeLabel(type)}</span>
        <span>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-dusk">{title}</h3>
          {data.summary && <p className="text-sm text-ink/70">{data.summary}</p>}
          {data.content && <p className="text-sm text-ink/70">{data.content}</p>}
          {author && (
            <div className="mt-3 flex items-center gap-2 text-xs text-ink/60">
              <Avatar
                size="sm"
                name={author.displayName || author.username}
                src={author.avatarUrl}
              />
              <span>{author.displayName || author.username}</span>
            </div>
          )}
        </div>
        {link && (
          <Link to={link} className="text-sm text-ember">
            Lire
          </Link>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <button onClick={actions.onComment} className="rounded-full bg-parchment px-3 py-1">
          Commenter
        </button>
        {type === 'story' && (
          <>
            <button onClick={actions.onFavorite} className="rounded-full bg-parchment px-3 py-1">
              Favoris
            </button>
            <button onClick={actions.onSave} className="rounded-full bg-parchment px-3 py-1">
              Sauvegarder
            </button>
          </>
        )}
        <button onClick={actions.onShare} className="rounded-full bg-parchment px-3 py-1">
          Partager
        </button>
        <button
          className="rounded-full bg-ember px-3 py-1 text-white"
          onClick={actions.onLike}
        >
          Like {data.likesCount || 0}
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
