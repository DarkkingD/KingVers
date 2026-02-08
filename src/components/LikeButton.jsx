const LikeButton = ({ liked, count, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-sm ${liked ? 'bg-ember text-white' : 'bg-parchment'}`}
  >
    ? {count}
  </button>
);

export default LikeButton;
