const buildTree = (comments) => {
  const map = new Map();
  comments.forEach((comment) => {
    map.set(comment._id, { ...comment, replies: [] });
  });
  const roots = [];
  map.forEach((comment) => {
    if (comment.parent) {
      const parent = map.get(comment.parent);
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
};

const CommentNode = ({ comment }) => (
  <div className="mt-4 border-l border-dusk/20 pl-4">
    <div className="text-sm font-semibold text-dusk">
      {comment.author?.displayName || comment.author?.username}
    </div>
    <p className="text-sm text-ink/70">{comment.content}</p>
    {comment.replies.map((reply) => (
      <CommentNode key={reply._id} comment={reply} />
    ))}
  </div>
);

const CommentThread = ({ comments }) => {
  const tree = buildTree(comments || []);
  return (
    <div>
      {tree.map((comment) => (
        <CommentNode key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentThread;
