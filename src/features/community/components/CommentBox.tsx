'use client'
import { useState } from 'react'

interface Props {
  postId: string
  onNewComment: (comment: any) => void
}

export default function CommentBox({ postId, onNewComment }: Props) {
  const [text, setText] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) throw new Error('Failed to post comment')

      const comment = await res.json()
      onNewComment(comment)
      setText('')
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 border rounded-lg px-3 py-2 disabled:bg-gray-100"
        placeholder="Write a comment..."
        value={text}
        onChange={(e)=>setText(e.target.value)}
        disabled={isSubmitting}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submit()}
      />
      <button
        onClick={submit}
        disabled={isSubmitting || !text.trim()}
        className="bg-emerald-500 text-white px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Posting...
          </>
        ) : (
          'Post'
        )}
      </button>
    </div>
  )
}
