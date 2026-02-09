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

  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: id,
        userId: user.userId
      }
    }
  })

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id }
    })
    return NextResponse.json({ liked: false })
  }

  await prisma.like.create({
    data: {
      postId: id,
      userId: user.userId
    }
  })

  return NextResponse.json({ liked: true })
}
