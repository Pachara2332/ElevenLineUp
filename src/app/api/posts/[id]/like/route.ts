import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helper";
import { awardXP } from "@/features/gamification/services/xp-service";

type SocketEmitter = {
  to: (room: string) => {
    emit: (event: string, payload: unknown) => void;
  };
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.like.findFirst({
    where: {
      postId: id,
      userId: user.userId,
    }
  });

  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.post.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      })
    ]);
    return NextResponse.json({ liked: false });
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: {
        postId: id,
        userId: user.userId,
      },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    }),
    prisma.post.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    })
  ]);

  // Create Notification
  if (like.post && like.post.authorId !== user.userId) {
    const notification = await prisma.notification.create({
      data: {
        userId: like.post.authorId,
        actorId: user.userId,
        type: "LIKE",
        entityId: id,
      },
      include: {
        actor: { select: { name: true, username: true, avatar: true } },
      },
    });

    // Emit Socket Event
    const io = (globalThis as typeof globalThis & { io?: SocketEmitter }).io;
    if (io) {
      io.to(`user-${like.post.authorId}`).emit("notification", notification);
    }
  }

  // Award XP to the post author
  if (like.post && like.post.authorId !== user.userId) {
    await awardXP(like.post.authorId, 1);
  }

  return NextResponse.json({ liked: true });
}
