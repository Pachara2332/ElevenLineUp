import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-helper'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    // ตรวจสอบ authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // รับข้อมูลจาก request body
    const body = await req.json()
    const { password } = body

    console.log('Change password request for user:', user.userId)

    // Validate password
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' }, 
        { status: 400 }
      )
    }

    // Hash password ใหม่
    const hashedPassword = await bcrypt.hash(password, 10)

    // อัพเดทรหัสผ่านในฐานข้อมูล
    await prisma.user.update({
      where: { userId: user.userId },
      data: { password: hashedPassword }
    })

    console.log('Password changed successfully for user:', user.userId)

    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully' 
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' }, 
      { status: 500 }
    )
  }
}