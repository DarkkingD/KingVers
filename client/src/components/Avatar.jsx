const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base'
};

const Avatar = ({ src, name = 'KV', size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-dusk/10 text-dusk ${
        sizeMap[size] || sizeMap.md
      }`}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
