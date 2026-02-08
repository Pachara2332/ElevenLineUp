import { NextRequest } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // สร้าง PDF ขนาด A4 (595 x 842 points)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const lineup = await prisma.lineup.findUnique({
    where: { lineupId: id },
    include: { 
      slots: true,
      team: true,
      user: true
    },
  });

  if (!lineup) {
    return new Response('Lineup not found', { status: 404 });
  }

  // =============== Header Section ===============
  const headerY = 790;
  
  // Title
  page.drawText(lineup.name || 'Team Lineup', {
    x: 50,
    y: headerY,
    size: 24,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Formation
  page.drawText(`Formation: ${lineup.formation}`, {
    x: 50,
    y: headerY - 30,
    size: 14,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Team name
  if (lineup.team?.name) {
    page.drawText(`Team: ${lineup.team.name}`, {
      x: 50,
      y: headerY - 50,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Divider line
  page.drawLine({
    start: { x: 50, y: headerY - 70 },
    end: { x: 545, y: headerY - 70 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // =============== Football Pitch ===============
  const pitchX = 50;
  const pitchY = 80;
  const pitchWidth = 495;
  const pitchHeight = 600;

  // Pitch background
  page.drawRectangle({
    x: pitchX,
    y: pitchY,
    width: pitchWidth,
    height: pitchHeight,
    color: rgb(0.13, 0.55, 0.13),
  });

  // Pitch border
  page.drawRectangle({
    x: pitchX,
    y: pitchY,
    width: pitchWidth,
    height: pitchHeight,
    borderColor: rgb(1, 1, 1),
    borderWidth: 3,
  });

  // Halfway line
  page.drawLine({
    start: { x: pitchX, y: pitchY + pitchHeight / 2 },
    end: { x: pitchX + pitchWidth, y: pitchY + pitchHeight / 2 },
    thickness: 2,
    color: rgb(1, 1, 1),
  });

  // Center circle
  const centerX = pitchX + pitchWidth / 2;
  const centerY = pitchY + pitchHeight / 2;
  page.drawCircle({
    x: centerX,
    y: centerY,
    size: 50,
    borderWidth: 2,
    borderColor: rgb(1, 1, 1),
  });

  // Center spot
  page.drawCircle({
    x: centerX,
    y: centerY,
    size: 3,
    color: rgb(1, 1, 1),
  });

  // Penalty areas
  const penaltyAreaWidth = pitchWidth * 0.35;
  const penaltyAreaHeight = 100;

  // Top penalty area
  page.drawRectangle({
    x: pitchX + (pitchWidth - penaltyAreaWidth) / 2,
    y: pitchY + pitchHeight - penaltyAreaHeight,
    width: penaltyAreaWidth,
    height: penaltyAreaHeight,
    borderColor: rgb(1, 1, 1),
    borderWidth: 2,
  });

  // Bottom penalty area
  page.drawRectangle({
    x: pitchX + (pitchWidth - penaltyAreaWidth) / 2,
    y: pitchY,
    width: penaltyAreaWidth,
    height: penaltyAreaHeight,
    borderColor: rgb(1, 1, 1),
    borderWidth: 2,
  });

  // Goal areas
  const goalAreaWidth = pitchWidth * 0.2;
  const goalAreaHeight = 40;

  // Top goal area
  page.drawRectangle({
    x: pitchX + (pitchWidth - goalAreaWidth) / 2,
    y: pitchY + pitchHeight - goalAreaHeight,
    width: goalAreaWidth,
    height: goalAreaHeight,
    borderColor: rgb(1, 1, 1),
    borderWidth: 2,
  });

  // Bottom goal area
  page.drawRectangle({
    x: pitchX + (pitchWidth - goalAreaWidth) / 2,
    y: pitchY,
    width: goalAreaWidth,
    height: goalAreaHeight,
    borderColor: rgb(1, 1, 1),
    borderWidth: 2,
  });

  // =============== Helper function for initials ===============
  function getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // =============== Helper function to crop image to circle ===============
  async function cropImageToCircle(imageUrl: string, size: number): Promise<Buffer> {
    try {
      // ดาวน์โหลดรูปภาพ
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // สร้าง SVG mask สำหรับวงกลม
      const circleMask = Buffer.from(
        `<svg width="${size}" height="${size}">
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
        </svg>`
      );

      // ใช้ Sharp ตัดรูปเป็นวงกลม
      const circularImage = await sharp(buffer)
        .resize(size, size, { fit: 'cover' }) // ครอบและปรับขนาด
        .composite([
          {
            input: circleMask,
            blend: 'dest-in', // ใช้ mask เป็นวงกลม
          },
        ])
        .png() // แปลงเป็น PNG (รองรับ transparency)
        .toBuffer();

      return circularImage;
    } catch (error) {
      console.error('Error cropping image:', error);
      throw error;
    }
  }

  // =============== Draw Players ===============
  const playerRadius = 25;
  const playerDiameter = playerRadius * 2;

  for (const slot of lineup.slots) {
    const x = pitchX + (slot.x / 100) * pitchWidth;
    const y = pitchY + pitchHeight - (slot.y / 100) * pitchHeight;

    // ตรวจสอบตำแหน่งเทียบกับขอบสนาม
    const isNearTop = slot.y < 20;
    const isNearBottom = slot.y > 80;
const isGK = slot.position === 'GK';


    // Draw player
    if (slot.playerImage) {
      try {
        // ตัดรูปเป็นวงกลม
        const circularImageBuffer = await cropImageToCircle(slot.playerImage, playerDiameter);
        
        // Embed รูปที่ตัดแล้วลงใน PDF
        const img = await pdfDoc.embedPng(circularImageBuffer);

        // วาดรูปวงกลม (ตอนนี้รูปจะเป็นวงกลมแล้ว ไม่ล้น)
        page.drawImage(img, {
          x: x - playerRadius,
          y: y - playerRadius,
          width: playerDiameter,
          height: playerDiameter,
        });

        // Border วงกลม
        page.drawCircle({
          x,
          y,
          size: playerRadius,
          borderWidth: 3,
          borderColor: rgb(0.2, 0.4, 0.8),
        });
      } catch (error) {
        console.error('Error loading image:', error);
        // ถ้าโหลดรูปไม่ได้ ให้แสดงชื่อย่อแทน
        drawInitialsCircle(page, x, y, playerRadius, slot.playerName || 'N/A', font, fontBold);
      }
    } else {
      // ถ้าไม่มีรูปภาพ - แสดงชื่อย่อ
      drawInitialsCircle(page, x, y, playerRadius, slot.playerName || 'N/A', font, fontBold);
    }

   // Player name - ปรับตำแหน่งตามขอบและตำแหน่ง
const nameText = slot.playerName || 'Unknown';
const nameWidth = font.widthOfTextAtSize(nameText, 9);

// GK ชื่ออยู่บน, ST ชื่ออยู่ล่าง, ใกล้ขอบล่างชื่ออยู่บน, ไม่งั้นอยู่ล่าง
const nameYOffset = isNearBottom && !isGK ? playerRadius + 25 : -playerRadius - 20;
const nameTextYOffset = isNearBottom && !isGK ? playerRadius + 28 : -playerRadius - 17;
    
    // Background for name
page.drawRectangle({
  x: x - nameWidth / 2 - 4,
  y: y + nameYOffset,
  width: nameWidth + 8,
  height: 14,
  color: rgb(0, 0, 0),
  opacity: 0.7,
});

page.drawText(nameText, {
  x: x - nameWidth / 2,
  y: y + nameTextYOffset,
  size: 9,
  font: font,
  color: rgb(1, 1, 1),
});

    // Position label - ปรับตำแหน่งตามขอบ
   // Position label - ปรับตำแหน่งตามขอบและตำแหน่ง
const posText = slot.position;
const posWidth = font.widthOfTextAtSize(posText, 8);

// GK position อยู่ล่าง, ST position อยู่บน, ใกล้ขอบบนอยู่ล่าง, ไม่งั้นอยู่บน
const posYOffset = isGK ? playerRadius + 8 : (isNearTop ? playerRadius + 10 : (isNearBottom ? -playerRadius - 20 : playerRadius + 8));
const posTextYOffset = isGK ? playerRadius + 10 : (isNearTop ? playerRadius + 14 : (isNearBottom ? -playerRadius - 18 : playerRadius + 10));
    
    page.drawRectangle({
  x: x - posWidth / 2 - 3,
  y: y + posYOffset,
  width: posWidth + 6,
  height: 12,
  color: rgb(1, 0.84, 0),
  opacity: 0.9,
});

page.drawText(posText, {
  x: x - posWidth / 2,
  y: y + posTextYOffset,
  size: 8,
  font: fontBold,
  color: rgb(0, 0, 0),
});
  }

  // =============== Footer ===============
  const footerY = 50;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  page.drawText(`Generated on ${currentDate}`, {
    x: 50,
    y: footerY,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  if (lineup.user?.name) {
    const createdByText = `Created by: ${lineup.user.name}`;
    const createdByWidth = font.widthOfTextAtSize(createdByText, 8);
    page.drawText(createdByText, {
      x: 545 - createdByWidth,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // =============== Save PDF ===============
  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lineup-${lineup.name || id}.pdf"`,
    },
  });
}

// =============== Helper Function ===============
function drawInitialsCircle(
  page: any,
  x: number,
  y: number,
  radius: number,
  name: string,
  font: any,
  fontBold: any
) {
  const initials = getInitials(name);

  // Background circle
  page.drawCircle({
    x,
    y,
    size: radius,
    color: rgb(0.2, 0.4, 0.8),
  });

  // Inner circle
  page.drawCircle({
    x,
    y,
    size: radius - 2,
    color: rgb(0.25, 0.45, 0.85),
  });

  // Border
  page.drawCircle({
    x,
    y,
    size: radius,
    borderWidth: 3,
    borderColor: rgb(1, 1, 1),
  });

  // Draw initials
  const initialsSize = 14;
  const initialsWidth = fontBold.widthOfTextAtSize(initials, initialsSize);
  
  page.drawText(initials, {
    x: x - initialsWidth / 2,
    y: y - initialsSize / 3,
    size: initialsSize,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
}

function getInitials(name: string): string {
  if (!name || name === 'N/A') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}