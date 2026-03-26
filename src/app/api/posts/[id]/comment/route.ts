import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'
import { awardXP } from '@/features/gamification/services/xp-service'

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

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        text,
        postId: id,
        userId: user.userId
      },
      include: {
        user: {
          select: { userId: true, name: true, avatar: true }
        },
        post: {
          select: { authorId: true }
        }
      }
    }),
    prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } }
    })
  ])

  // Create Notification
  if (comment.post.authorId !== user.userId) {
    const notification = await prisma.notification.create({
      data: {
        userId: comment.post.authorId,
        actorId: user.userId,
        type: 'COMMENT',
        entityId: id
      },
      include: {
        actor: { select: { name: true, avatar: true } }
      }
    });

    // Emit Socket Event
    const io = (global as any).io;
    if (io) {
        io.to(`user-${comment.post.authorId}`).emit('notification', notification);
    }
  }

  // Award XP to the commenter
  await awardXP(user.userId, 2)

  // Emit to post room for real-time comments
  const io = (global as any).io;
  if (io) {
      io.to(`post-${id}`).emit('new_comment', comment);
  }

  return NextResponse.json(comment)
}
