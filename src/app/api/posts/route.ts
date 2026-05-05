
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/auth-helper';
import { awardPostXP } from '@/features/gamification/services/xp-service';

const prisma = new PrismaClient();

type SocketEmitter = {
  to: (room: string) => {
    emit: (event: string, payload: unknown) => void;
  };
};

export async function GET(req: Request) {
  try {
    const take = 50;

    const posts = await prisma.post.findMany({
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          }
        },
        comments: {                 // ← เพิ่มตรงนี้
          include: {
            user: {
              select: { 
                name: true, 
                avatar: true 
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
    });

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, imageUrl } = body;

    if (!content) {
        return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.userId, // Use ID from auth, not body
        content,
        imageUrl,
      },
      include: {
          author: { select: { userId: true, name: true, avatar: true, username: true } },
          _count: { select: { likes: true, comments: true } },
          likes: true
      }
    });

    // Broadcast new post to all connected clients via Socket.IO
    const io = (globalThis as typeof globalThis & { io?: SocketEmitter }).io;
    if (io) {
        console.log('Broadcasting new post to feed room');
        io.to('feed').emit('new_post', post);
    }

    // Award XP for creating a post
    await awardPostXP(user.userId);

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
