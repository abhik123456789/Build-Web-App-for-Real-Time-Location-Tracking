import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jiqfzrgedvujbzvzqhmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWZ6cmdlZHZ1amJ6dnpxaG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzIxODAsImV4cCI6MjA1ODE0ODE4MH0.3ea3sSy9FA0juAKh9FJls7ReIGBZZE_cBOZCOKzWC6M';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
