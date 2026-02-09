import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const text = body.text?.trim()

  if (!text) {
    return NextResponse.json({ error: 'Text required' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      text,
      postId: id,
      userId: user.userId
    },
    include: {
      user: {
        select: { userId: true, name: true }
      }
    }
  })

  return NextResponse.json(comment)
}
