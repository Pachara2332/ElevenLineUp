
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/auth-helper';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = 50;
    
    // Optional: Get current user to check "liked" status effectively if we want to optimize later
    // const user = await getAuthUser();

    const posts = await prisma.post.findMany({
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            // avatar: true 
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        likes: {
            select: {
                userId: true
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
          author: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
          likes: true
      }
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
