import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://jxgiffkpcvbmfqxdgvje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Z2lmZmtwY3ZibWZxeGRndmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjA2NDcsImV4cCI6MjA4NDA5NjY0N30.Gu_x_H4HSxeBKK0Vn8mu-YqnfHG5uBCJw1GjLF8ZdyM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
