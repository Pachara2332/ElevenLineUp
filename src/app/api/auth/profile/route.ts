import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'

export async function PUT(req: Request) {
  try {
    // ตรวจสอบ authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // รับข้อมูลจาก request body
    const body = await req.json()
    const { name, avatar } = body

    console.log('Updating profile for user:', user.userId)
    console.log('Received data:', { name, avatar })

    // Validate ข้อมูล
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // เตรียมข้อมูลสำหรับ update
    const updateData: any = {
      name: name.trim()
    }

    // ⚠️ อัพเดท avatar ถ้ามีการส่งมา (สำคัญมาก!)
    if (avatar !== undefined && avatar !== null) {
      updateData.avatar = avatar
      console.log('Updating avatar to:', avatar)
    }

    // อัพเดทข้อมูลในฐานข้อมูล
    const updated = await prisma.user.update({
      where: { userId: user.userId },
      data: updateData,
      select: {
        userId: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log('Profile updated successfully:', updated)

    return NextResponse.json({ 
      success: true, 
      data: updated 
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    )
  }
}