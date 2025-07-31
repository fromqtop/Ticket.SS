type Props = {
  commentsString: string;
};

const parseComment = (commentString: string) => {
  return {
    author: commentString.match(/u:([^\s]+)/)?.[1] ?? "不明なユーザー",
    date: commentString.match(/d:([^\s]+)/)?.[1] ?? "投稿日時不明",
    content: commentString
      .replace(/u:[^\s]+/, "")
      .replace(/d:[^\s]+/, "")
      .trim(),
  };
};

export default function CommentList({ commentsString }: Props) {
  if (!commentsString)
    return <div className="text-sm">コメントはありません</div>;

  const comments = commentsString
    .replace(/^---\s*/, "")
    .split("---")
    .map((commentString) => parseComment(commentString));

  return (
    <div className="flex flex-col gap-5">
      {comments.map((comment, index) => (
        <div key={index} className="bg-gray-100 p-3 rounded-md">
          <div className="flex justify-between items-end mb-2">
            <div className="text-sm  text-gray-700">{comment.author}</div>
            <div className="text-xs text-gray-500">{comment.date}</div>
          </div>
          <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
        </div>
      ))}
    </div>
  );
}
