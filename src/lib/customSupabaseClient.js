import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jupqevqdohixwcsrzpyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cHFldnFkb2hpeHdjc3J6cHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MDg0NjEsImV4cCI6MjA3Nzk4NDQ2MX0.ba6cT1-1yhMH7hirPkyGcyLuoFc3QaRt3NPerfyaUx8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);