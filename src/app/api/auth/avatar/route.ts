import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getAuthUser } from '@/lib/auth-helper'
import prisma from '@/lib/prisma'
import { existsSync } from 'fs'

export async function POST(req: Request) {
  try {
    // ตรวจสอบ authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // รับ form data
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // แปลงเป็น buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // สร้างชื่อไฟล์ที่ unique
    const fileExtension = file.name.split('.').pop() || 'png'
    const fileName = `${user.userId}-${Date.now()}.${fileExtension}`
    
    // กำหนด path สำหรับบันทึกไฟล์
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, fileName)

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // บันทึกไฟล์
    await writeFile(filePath, buffer)

    // URL สำหรับเข้าถึงรูปภาพ
    const avatarUrl = `/uploads/${fileName}`

    // อัพเดท database
    await prisma.user.update({
      where: { userId: user.userId },
      data: { avatar: avatarUrl }
    })

    return NextResponse.json({ 
      success: true, 
      url: avatarUrl 
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' }, 
      { status: 500 }
    )
  }
}