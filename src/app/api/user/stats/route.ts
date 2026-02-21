import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'

export async function GET(req: Request) {
  try {
    // ตรวจสอบ authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ดึงข้อมูลผู้ใช้พร้อมสถิติ
    const userData = await prisma.user.findUnique({
      where: { userId: user.userId },
      select: {
        userId: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        
        // นับจำนวน Lineups
        _count: {
          select: {
            lineups: true,
            posts: true,
          }
        },
        
        // ดึงข้อมูล Game Stats
        userGameStats: {
          select: {
            gameType: true,
            currentStreak: true,
            maxStreak: true,
            totalPlayed: true,
            totalWins: true,
          }
        },

        // ดึงข้อมูล Gamification (XP & Badges)
        userStats: {
          select: {
            xp: true,
            predictionWins: true,
            postsCount: true,
            badges: true,
          }
        }
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // คำนวณ streak สูงสุดจากทุกเกม
    const maxStreak = userData.userGameStats.reduce((max, stat) => {
      return Math.max(max, stat.currentStreak)
    }, 0)

    // จัดรูปแบบข้อมูลเพื่อส่งกลับ
    const stats = {
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      
      // สถิติ
      lineupsCount: userData._count.lineups,
      postsCount: userData._count.posts,
      streak: maxStreak,
      xp: userData.userStats?.xp || 0,
      badges: userData.userStats?.badges || [],
      
      // รายละเอียดเกมแต่ละประเภท
      gameStats: userData.userGameStats.reduce((acc, stat) => {
        acc[stat.gameType] = {
          currentStreak: stat.currentStreak,
          maxStreak: stat.maxStreak,
          totalPlayed: stat.totalPlayed,
          totalWins: stat.totalWins,
          winRate: stat.totalPlayed > 0 
            ? Math.round((stat.totalWins / stat.totalPlayed) * 100) 
            : 0
        }
        return acc
      }, {} as Record<string, any>)
    }

    return NextResponse.json({ 
      success: true, 
      data: stats 
    })

  } catch (error) {
    console.error('Fetch user stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' }, 
      { status: 500 }
    )
  }
}