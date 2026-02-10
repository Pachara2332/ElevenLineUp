import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  text: string
  createdAt: string
  user: {
    name: string
    avatar?: string | null
  }
}

interface Props {
  comments: Comment[]
}

export default function CommentList({ comments }: Props) {
  if (!comments?.length) return null

  return (
    <div className="mt-3 space-y-3">
      {comments.map((c: Comment) => (
        <div key={c.id} className="flex gap-3">
          {c.user.avatar ? (
            <img
              src={c.user.avatar}
              alt={c.user.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-800">
              {c.user.name.charAt(0)}
            </div>
          )}

          <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 shadow-sm flex-1">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-emerald-900">{c.user.name}</div>
              <div className="text-xs text-emerald-900/50">
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </div>
            </div>

            <p className="text-black-800 mt-1">{c.text}</p>
          </div>

        </div>
      ))}

    </div>
  )
}

