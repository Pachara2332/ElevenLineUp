import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEAGUES = [
    { name: 'Premier League', url: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_Premier_League' },
    { name: 'La Liga', url: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_La_Liga' },
    { name: 'Serie A', url: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_Serie_A' },
    { name: 'Bundesliga', url: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_Bundesliga' },
    { name: 'Ligue 1', url: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_Ligue_1' },
];

const scraper = axios.create({
    headers: {
        'User-Agent': 'ElevenLineUpBot/1.0 (Educational Project; contact: elevenlineup@example.com)',
        'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 15000,
});

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Player {
    name: string;
    position: string;
    number: string;
    image_url?: string;
    wiki_url?: string;
}

interface Team {
    name: string;
    league: string;
    logo_url?: string;
    players: Player[];
}

// Helper to normalize position
function normalizePosition(pos: string): string {
    pos = pos.trim().toUpperCase().replace(/\./g, '');
    
    // Quick map
    if (pos === 'G') return 'GK';
    if (pos === 'D') return 'DF';
    if (pos === 'M') return 'MF';
    if (pos === 'F') return 'FW';

    // Handle slash/space for multi-pos
    if (pos.includes('/') || pos.includes(' ')) {
        return normalizePosition(pos.split(/[\/\s]+/)[0]);
    }
    return pos;
}

function mapPosition(wikiPos: string): string {
    if (wikiPos === 'GK') return 'GK';
    if (['DF', 'CB', 'LB', 'RB', 'WB', 'RWB', 'LWB'].includes(wikiPos)) return 'DEF';
    if (['MF', 'CM', 'DM', 'AM', 'RM', 'LM'].includes(wikiPos)) return 'MID';
    if (['FW', 'ST', 'RW', 'LW', 'CF', 'SS'].includes(wikiPos)) return 'FWD';
    return wikiPos;
}

function isPlayerPosition(pos: string): boolean {
    return /^(GK|DF|MF|FW|CB|LB|RB|CM|DM|AM|RW|LW|ST|CF|SS|WB|RWB|LWB)$/.test(pos);
}

async function scrapeTeam(teamUrl: string, leagueName: string): Promise<Team | null> {
    try {
        const fullUrl = teamUrl.startsWith('http') ? teamUrl : `https://en.wikipedia.org${teamUrl}`;
        await sleep(1000 + Math.random() * 1000); // Polite delay

        const { data } = await scraper.get(fullUrl);
        const $ = cheerio.load(data);

        const teamName = $('h1#firstHeading').text().trim();
        const logoUrl = $('.infobox img').first().attr('src');
        const fullLogoUrl = logoUrl ? `https:${logoUrl}` : undefined;

        console.log(`Analyzing: ${teamName}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let bestTable: any = null;
        let maxPlayersFound = 0;

        // Find all wikitables and score them
        $('table.wikitable').each((_i, table) => {
            const $table = $(table);
            const caption = $table.find('caption').text().trim().toLowerCase();
            
            // Negative check
            if (/staff|management|coach|administration|transfers|loans|reserve/.test(caption)) return;

            // Check headers
            let hasPosCol = false;
            let hasPlayerCol = false;
            $table.find('tr').first().find('th').each((_j, th) => {
                const headerText = $(th).text().trim().toLowerCase();
                if (/pos/.test(headerText)) hasPosCol = true;
                if (/player|name/.test(headerText)) hasPlayerCol = true;
            });

            // Must have Position column to be a squad table
            if (!hasPosCol) return;

            // Count valid players in this table
            let validPlayers = 0;
            $table.find('tr').each((k, row) => {
                 if (k === 0) return;
                 const cols = $(row).find('td, th');
                 // Heuristic: check if Position column contains valid codes
                 let posText = '';
                 if (cols.length >= 4) posText = $(cols[1]).text();
                 else if (cols.length === 3) posText = $(cols[0]).text();
                 
                 if (posText && isPlayerPosition(normalizePosition(posText))) {
                     validPlayers++;
                 }
            });

            // console.log(`  Table ${i}: caption="${caption}", validRows=${validPlayers}`);

            if (validPlayers > maxPlayersFound) {
                maxPlayersFound = validPlayers;
                bestTable = $table;
            }
        });

        if (!bestTable || maxPlayersFound < 11) {
             console.warn(`  ⚠️ No valid squad table found for ${teamName} (max valid players: ${maxPlayersFound})`);
             return null;
        }

        const players: Player[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bestTable!.find('tr').each((i: number, row: any) => {
            if (i === 0) return;

            const cols = $(row).find('td, th');
            let number = '';
            let position = '';
            let name = '';
            let wikiUrl: string | undefined = undefined;

            // Detect structure
            if (cols.length >= 4) {
                 number = $(cols[0]).text().trim();
                 position = $(cols[1]).text().trim();
                 const anchor = $(cols[3]).find('a').first();
                 name = anchor.text().trim() || $(cols[3]).text().trim();
                 wikiUrl = anchor.attr('href');
            } else if (cols.length === 3) {
                 position = $(cols[0]).text().trim();
                 const anchor = $(cols[2]).find('a').first();
                 name = anchor.text().trim() || $(cols[2]).text().trim();
                 wikiUrl = anchor.attr('href');
            } else {
                return;
            }

            // Cleanup name
            name = name.replace(/\[.*?\]/g, '').replace(/\(.*\)/g, '').trim();
            number = number.replace(/\[.*?\]/g, '').trim();
            if (!name) {
                 const anchor = $(row).find('th a').first();
                 name = anchor.text().trim();
                 wikiUrl = anchor.attr('href');
            }

            const normalizedPos = normalizePosition(position);

            // Filtering
            if (!isPlayerPosition(normalizedPos)) return;
            if (/manager|coach|director|chairman/i.test(name)) return;
            if (name.length > 50 || name.length < 2) return;

            players.push({
                name,
                position: mapPosition(normalizedPos),
                number: number || '-',
                wiki_url: wikiUrl,
            });
        });

        console.log(`  ✅ Extracted ${players.length} players. Fetching images...`);

        // Batch fetch images using Wikimedia API
        const playerTitles = players
            .filter(p => p.wiki_url)
            .map(p => p.wiki_url!.split('/wiki/')[1]);

        if (playerTitles.length > 0) {
            // Wikipedia API limit is 50 titles per request
            const chunks = [];
            for (let i = 0; i < playerTitles.length; i += 50) {
                chunks.push(playerTitles.slice(i, i + 50));
            }

            for (const chunk of chunks) {
                try {
                    const titlesParam = chunk.join('|');
                    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${titlesParam}&prop=pageimages&pithumbsize=200&format=json&origin=*`;
                    
                    const { data: apiData } = await scraper.get(apiUrl);
                    const pages = apiData?.query?.pages;

                    if (pages) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        Object.values(pages).forEach((page: any) => {
                            if (page.thumbnail && page.thumbnail.source) {
                                // Find player with this normalized title (decoding needed)
                                // Standardize comparison by replacing spaces/underscores
                                const player = players.find(p => {
                                    const pTitle = p.wiki_url?.split('/wiki/')[1];
                                    return decodeURIComponent(pTitle || '') === page.title ||
                                           pTitle === page.title.replace(/\s/g, '_'); 
                                });
                                
                                if (player) {
                                    player.image_url = page.thumbnail.source;
                                }
                            }
                        });
                    }
                } catch (err) {
                    console.warn(`    ⚠️ Failed to fetch images for chunk`, err);
                }
            }
        }



        return {
            name: teamName,
            league: leagueName,
            logo_url: fullLogoUrl,
            players
        };

    } catch (error) {
        console.error(`  ❌ Error scraping ${teamUrl}:`, error instanceof Error ? error.message : error);
        return null;
    }
}

async function main() {
    const allTeams: Team[] = [];
    
    for (const league of LEAGUES) {
        console.log(`\n=== Processing ${league.name} ===`);
        try {
            const { data } = await scraper.get(league.url);
            const $ = cheerio.load(data);
            
            const teamLinks: string[] = [];
            
            // Find team links from the main "Locations" or "Stadiums" table
            // This is usually the big table with team names in the first column
            let stadiumTable = $('table.wikitable.sortable').first();
            
            // Verify it's the right table by checking headers
            const tableHeaders = stadiumTable.find('th').text().toLowerCase();
            if (!tableHeaders.includes('team') && !tableHeaders.includes('location') && !tableHeaders.includes('stadium')) {
                // Try finding the right table
                $('table.wikitable').each((_i, tbl) => {
                     const txt = $(tbl).find('th').text().toLowerCase();
                     if (txt.includes('team') && (txt.includes('location') || txt.includes('stadium'))) {
                         stadiumTable = $(tbl);
                         return false; // break
                     }
                });
            }

            stadiumTable.find('tr').each((_i, row) => {
                const teamCell = $(row).find('th').first().find('a').first();
                let href = teamCell.attr('href');
                if (!href) href = $(row).find('td').first().find('a').attr('href');
                
                if (href && href.includes('/wiki/')) {
                    teamLinks.push(href);
                }
            });

            console.log(`Found ${teamLinks.length} teams in ${league.name}`);

            for (const link of teamLinks) {
                if (link.includes('Stadium') || link.includes('List_of')) continue;
                
                const teamData = await scrapeTeam(link, league.name);
                if (teamData && teamData.players.length >= 11) {
                     allTeams.push(teamData);
                }
            }

        } catch (error) {
            console.error(`Failed to process league ${league.name}:`, error);
        }
    }

    const outputPath = path.resolve(__dirname, '../../prisma/scraped_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(allTeams, null, 2));
    console.log(`\n🎉 Done! Scraped ${allTeams.length} teams. Saved to ${outputPath}`);
}

main();