import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get('league') || 'PL';
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.football-data.org/v4/competitions/${league}/standings`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    if (!res.ok) {
      // If league not found or other error, return empty or mock for specific cases like T1
      if (league === 'T1') {
         return NextResponse.json({ 
           data: {
             competition: { name: 'Thai League 1', code: 'T1' },
             standings: [{ table: [] }] 
           } 
         });
      }
      throw new Error(`External API responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Standings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
