import { supabase } from './config/supabase.js';

async function testConnection() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully!');
    console.log('Data:', data);
  }
}

testConnection();