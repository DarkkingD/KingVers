import Avatar from './Avatar.jsx';

const GroupCard = ({ group }) => (
  <div className="card p-4">
    <div className="flex items-start gap-4">
      <Avatar name={group.name} size="md" />
      <div>
        <h3 className="text-lg font-semibold text-dusk">{group.name}</h3>
        <p className="text-sm text-ink/70">{group.description}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink/60">
          {group.genres?.map((genre) => (
            <span key={genre} className="rounded-full bg-parchment px-2 py-1">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default GroupCard;
