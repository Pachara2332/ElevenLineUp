import { ImageResponse } from '@vercel/og';
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const lineup = await prisma.lineup.findUnique({
        where: { slug },
        include: {
            team: { select: { name: true, logo: true } },
            user: { select: { name: true } },
            slots: true,
        },
    });

    if (!lineup) {
        return new Response('Lineup not found', { status: 404 });
    }

    // Use a constrained width for the pitch so it doesn't stretch out too wide
    const pitchWidth = 700;
    const pitchHeight = 550;
    const offsetX = (1200 - pitchWidth) / 2;
    const offsetY = (630 - pitchHeight) / 2 + 40; // Push down slightly to make room for header

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#0f172a', // slate-900
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Full background gradient */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(to bottom, #16a34a, #15803d, #14532d)', // Green pitch
                    }}
                />

                {/* Pitch boundary and markings (constrained) */}
                <div style={{
                    position: 'absolute',
                    left: offsetX,
                    top: offsetY,
                    width: pitchWidth,
                    height: pitchHeight,
                    border: '4px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px',
                    display: 'flex'
                }} />

                {/* Center line */}
                <div style={{ position: 'absolute', top: offsetY + pitchHeight / 2, left: offsetX, width: pitchWidth, height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', display: 'flex' }} />
                {/* Center circle */}
                <div style={{ position: 'absolute', top: offsetY + pitchHeight / 2 - 100, left: offsetX + pitchWidth / 2 - 100, width: '200px', height: '200px', border: '4px solid rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex' }} />

                {/* Header Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.9), rgba(15,23,42,0.4), rgba(15,23,42,0))',
                    color: 'white',
                    height: '250px',
                }}>
                    <h1 style={{ fontSize: '72px', fontWeight: '800', margin: 0, display: 'flex', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        {lineup.name}
                    </h1>
                    <div style={{ display: 'flex', fontSize: '32px', marginTop: '16px', color: '#6ee7b7', fontWeight: 'bold' }}>
                        {lineup.formation} LINEUP • BY {lineup.user.name.toUpperCase()}
                    </div>
                </div>

                {/* Players */}
                {lineup.slots.map((slot) => {
                    const name = slot.playerName?.replace(/\s*\(\d+\)$/, "").split(" ").slice(-1)[0] || "";

                    return (
                        <div
                            key={slot.slotId}
                            style={{
                                position: 'absolute',
                                // Map the 0-100% relative coordinates to our bounded pitch area
                                left: offsetX + (slot.x / 100) * pitchWidth,
                                top: offsetY + (slot.y / 100) * pitchHeight,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '36px',
                                    backgroundColor: '#334155', // slate-700
                                    border: '4px solid white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.8)',
                                    overflow: 'hidden',
                                }}
                            >
                                {slot.playerImage && !slot.playerImage.includes('default.jpg') ? (
                                    <img
                                        src={slot.playerImage}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    name.charAt(0)
                                )}
                            </div>

                            <div
                                style={{
                                    marginTop: '10px',
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900/90
                                    color: 'white',
                                    padding: '4px 16px',
                                    borderRadius: '16px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                                }}
                            >
                                {name}
                            </div>
                        </div>
                    );
                })}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
