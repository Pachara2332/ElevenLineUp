import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth-helper'
import prisma from '@/lib/prisma'
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuid } from "uuid"
import sharp from "sharp"

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

    // Resize and optimize with sharp for avatar
    // Avatar usually doesn't need to be huge, 400x400 is good
    const optimizedBuffer = await sharp(buffer)
        .resize(400, 400, {
            fit: 'cover', // Cut to square
            position: 'center'
        })
        .jpeg({ quality: 80 })
        .toBuffer()

    // สร้าง key สำหรับ R2 (แยก folder avatars)
    const key = `avatars/${user.userId}-${uuid()}.jpg`
    const bucket = process.env.R2_BUCKET
    const domain = process.env.NEXT_PUBLIC_R2_DOMAIN

    // Upload to subscriber bucket
    await r2.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/jpeg',
    }))

    // URL สำหรับเข้าถึงรูปภาพ
    const cleanDomain = domain ? domain.replace(/\/$/, '') : 'https://pub-b54491c0affd4412b86ae26eb6c9e7b3.r2.dev';
    const avatarUrl = `${cleanDomain}/${key}`;

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