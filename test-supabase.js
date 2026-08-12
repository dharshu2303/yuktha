const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  console.log('Testing Supabase Connection to:', url);

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Connection SUCCESSFUL, but the "sites" table DOES NOT EXIST.');
      } else {
        console.log('❌ Error querying Supabase:', error);
      }
    } else {
      console.log('✅ Supabase is fully working! The "sites" table exists and is accessible.');
      console.log('Data found:', data);
    }
  } catch (err) {
    console.error('❌ Connection failed entirely:', err.message);
  }
}

testSupabase();
