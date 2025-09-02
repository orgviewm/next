# Supabase Integration Setup

## Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://cbhocgrqesxzuhhsyjqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiaG9jZ3JxZXN4enVoaHN5anFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODc2NTYsImV4cCI6MjA3MjM2MzY1Nn0.EriQBPXUw3iuBVXFeM9omBX2v-9K6H_KA1sMrbSo68k
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Database Migration

The profiles table has already been created with the following structure:

- `id` - UUID primary key
- `email` - Unique email address
- `name` - User's display name
- `image` - Profile image URL
- `provider` - OAuth provider (google/github)
- `provider_account_id` - Provider's account ID
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp (auto-updated)
- `last_login_at` - Last login timestamp

## RLS Policies

- Service role has full access to all profiles
- Authenticated users can only read their own profile

## How It Works

1. User signs in via Google/GitHub
2. NextAuth callback automatically creates/updates profile in Supabase
3. Profile data is stored with provider information
4. Last login timestamp is updated on each sign-in
5. User is redirected to /charts

## Getting Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `service_role` key (keep it secret!)
4. Add it to your `.env.local` file
