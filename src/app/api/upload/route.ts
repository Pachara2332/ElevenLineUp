
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validation
    if (!file.type.startsWith("image/")) {
       return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json({ error: "File size exceeds 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Resize and optimize with sharp
    const optimizedBuffer = await sharp(buffer)
        .resize(1200, 1200, { // Max width/height 1200px, fit inside
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();

    const key = `community/posts/${uuid()}.jpg`; // Force .jpg extension
    const bucket = process.env.R2_BUCKET;
    const domain = process.env.NEXT_PUBLIC_R2_DOMAIN;

    await r2.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/jpeg',
    }));

    const url = domain ? `${domain}/${key}` : `https://pub-b54491c0affd4412b86ae26eb6c9e7b3.r2.dev/${key}`; 

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
