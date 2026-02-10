import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'

export async function GET(req: NextRequest) {
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.userId
    },
    include: {
      actor: {
        select: {
          name: true,
          avatar: true
        }
      },
      post: {
        select: {
          id: true,
          content: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  })

  return NextResponse.json(notifications)
}
