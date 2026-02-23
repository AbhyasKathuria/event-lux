// No imports needed! We use standard fetch.
const SUPABASE_URL = "https://cwnwdanmohzrfxhuygom.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY_HERE"; // PASTE YOUR KEY HERE

async function seed() {
  console.log('🚀 Starting demo data seed via REST API...');

  try {
    // 1. Create Presidency University
    const uniResp = await fetch(`${SUPABASE_URL}/rest/v1/universities`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation, resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 'presidency-uni-01',
        name: 'Presidency University, Bangalore',
        shortCode: 'PRESIDENCY-BLR',
        website: 'https://presidencyuniversity.in',
        isActive: true
      })
    });

    // 2. Create Demo Events
    await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify([
        {
          title: 'Hack-Lux 2026',
          slug: 'hack-lux-2026',
          description: 'Ultimate 24-hour hackathon.',
          category: 'HACKATHON',
          startDate: '2026-04-15T09:00:00',
          endDate: '2026-04-16T09:00:00',
          status: 'PUBLISHED',
          universityId: 'presidency-uni-01',
          isFree: true,
          venue: 'Main Seminar Hall'
        },
        {
          title: 'Cultural Night: Ethnos',
          slug: 'ethnos-2026',
          description: 'Celebration of music and arts.',
          category: 'CULTURAL',
          startDate: '2026-05-10T18:00:00',
          endDate: '2026-05-10T22:00:00',
          status: 'PUBLISHED',
          universityId: 'presidency-uni-01',
          isFree: false,
          price: 299,
          venue: 'Open Air Theater'
        }
      ])
    });

    console.log('✅ Demo data successfully injected into Supabase!');
  } catch (err) {
    console.error('❌ Error during REST seed:', err);
  }
}

seed();