interface Comment {
  id: string
  text: string
  user: {
    name: string
  }
}

interface Props {
  comments: Comment[]
}

export default function CommentList({ comments }: Props) {
  if (!comments?.length) return null

  return (
    <div className="mt-3 space-y-2">
      {comments.map((c: Comment) => (
        <div key={c.id} className="bg-gray-100 rounded-lg px-3 py-2">
          <span className="font-semibold">{c.user.name}</span>
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  )
}
