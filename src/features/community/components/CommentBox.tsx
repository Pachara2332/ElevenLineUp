'use client'
import { useState } from 'react'

interface Props {
  postId: string
  onNewComment: (comment: any) => void
}

export default function CommentBox({ postId, onNewComment }: Props) {
  const [text, setText] = useState<string>('')

  const submit = async () => {
    if (!text.trim()) return

    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    if (!res.ok) return

    const comment = await res.json()
    onNewComment(comment)
    setText('')
  }

  return (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 border rounded-lg px-3 py-2"
        placeholder="Write a comment..."
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <button
        onClick={submit}
        className="bg-emerald-500 text-white px-4 rounded-lg"
      >
        Post
      </button>
    </div>
  )
}
