const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const url = "https://iphzejaxaeikmvmsxvhq.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwaHplamF4YWVpa212bXN4dmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Nzk5MDYsImV4cCI6MjA4OTU1NTkwNn0.lFXFdQnft7wc30LHRYvECdWF5Tvfd3rvlPn0nY2E0g4";
  
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
