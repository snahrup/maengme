# MaengMe Backend Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Supabase Setup

1. **Create Supabase Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Create new project (free tier is fine)
   - Note your project URL and anon key

2. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy entire contents of `database/schema.sql`
   - Run the SQL script
   - All tables will be created with security policies

3. **Configure Environment**
   ```bash
   cd app/frontend
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```
   REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **Test Connection**
   ```bash
   npm run dev
   ```
   - Auth should now work!
   - Data will persist to cloud

### Step 2: n8n Setup (Optional but Recommended)

#### Option A: n8n Cloud (Easiest)
1. Sign up at [n8n.cloud](https://n8n.cloud) (free tier available)
2. Import workflows from `docs/n8n-workflows/` (coming soon)
3. Add credentials:
   - Supabase (service key)
   - Anthropic API
   - ElevenLabs API

#### Option B: Self-Hosted (Full Control)
```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Step 3: API Keys

#### Required for Agents:
- **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com)
- **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io) (optional for voice)

#### Add to n8n Credentials:
1. Open n8n at http://localhost:5678
2. Go to Credentials
3. Add:
   - HTTP Request (Anthropic)
   - HTTP Request (ElevenLabs)
   - Postgres (Supabase connection string)

## 🎯 What's Working Now

### ✅ With Supabase Connected:
- User authentication (login/signup)
- Profile management
- Session cloud storage
- Data persistence
- Row-level security

### ✅ With n8n Connected:
- AI agent conversations
- Memory persistence
- Context sharing
- Voice synthesis
- Workflow automation

## 📱 Testing the App

1. **Check Navigation Fix**
   ```
   http://localhost:5185/
   - Select product
   - Start session
   - Should see ActiveSession with animations
   ```

2. **Test Auth (when connected)**
   - Sign up with email
   - Check Supabase dashboard for user
   - Login/logout flow

3. **Test Agents (when n8n ready)**
   - Aria onboarding chat
   - Session analytics with Sage
   - Post-peak capture with Luna

## 🔧 Troubleshooting

### Navigation still broken?
- Check console for errors
- Verify App.tsx has synchronous state updates
- Try hard refresh (Ctrl+Shift+R)

### Supabase connection fails?
- Verify .env file exists
- Check URL starts with https://
- Anon key should be very long string
- Check Supabase dashboard is accessible

### n8n webhooks not working?
- Ensure webhook URLs are public
- Check CORS settings
- Verify authentication headers

## 📊 Architecture Overview

```
Frontend (React PWA)
    ↓
Supabase (Auth + Database)
    ↓
n8n (Agent Orchestration)
    ↓
External APIs (Claude, ElevenLabs)
```

## 🎨 Next Features to Build

1. **Onboarding Flow**
   - Welcome screens
   - Aria conversation
   - Profile building

2. **Agent Integration**
   - Chat UI components
   - Voice playback
   - Real-time responses

3. **Premium Features**
   - Advanced analytics
   - Export reports
   - Community insights

## 📝 Important Files

- `database/schema.sql` - Complete database structure
- `docs/n8n-architecture.md` - Agent workflow details  
- `app/frontend/.env` - Your API keys (don't commit!)
- `src/services/supabase.service.ts` - All database operations

## 🚢 Deployment

### Frontend (Netlify)
- Already configured
- Just push to master
- Auto-deploys on commit

### Database (Supabase)
- Hosted by Supabase
- Automatic backups
- SSL included

### Agents (n8n)
- Deploy to VPS or n8n.cloud
- Use environment variables
- Enable webhook authentication

## 💡 Pro Tips

1. **Development**
   - Use Supabase local development for testing
   - n8n has test mode for workflows
   - Check browser console for detailed errors

2. **Security**
   - Never commit .env file
   - Use RLS policies in Supabase
   - Authenticate n8n webhooks
   - Rate limit API calls

3. **Performance**
   - Cache agent responses
   - Batch database operations
   - Use Supabase realtime sparingly
   - Optimize images and animations

## 🆘 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **n8n Docs**: [docs.n8n.io](https://docs.n8n.io)
- **Project Issues**: Create issue on GitHub

The backend is ready to scale! Just add API keys and watch the magic happen! 🎯