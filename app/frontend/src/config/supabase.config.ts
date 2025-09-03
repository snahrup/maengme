// Supabase Configuration
// Add your Supabase project details here

export const supabaseConfig = {
  // TODO: Replace with your actual Supabase credentials
  url: process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL',
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  
  // Optional: Service role key for admin operations (keep secure!)
  serviceRoleKey: process.env.REACT_APP_SUPABASE_SERVICE_KEY || ''
};

// Validate configuration
export const isSupabaseConfigured = () => {
  return (
    supabaseConfig.url !== 'YOUR_SUPABASE_PROJECT_URL' &&
    supabaseConfig.anonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    supabaseConfig.url.startsWith('https://') &&
    supabaseConfig.anonKey.length > 0
  );
};

// Instructions for setup:
/*
1. Create a new Supabase project at https://app.supabase.com
2. Get your project URL and anon key from Settings > API
3. Create a .env file in /app/frontend/ with:
   
   REACT_APP_SUPABASE_URL=your-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   
4. Never commit the .env file to git (already in .gitignore)
*/