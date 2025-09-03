-- MaengMe Supabase Database Schema
-- Run this in the Supabase SQL editor to set up your database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  medical_considerations TEXT[] DEFAULT '{}',
  preferred_strains TEXT[] DEFAULT '{}',
  typical_dose DECIMAL(5,2),
  session_frequency TEXT,
  personalized_tips TEXT[] DEFAULT '{}',
  risk_factors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  total_elapsed BIGINT NOT NULL,
  laps JSONB DEFAULT '[]',
  notes TEXT,
  peak_time BIGINT,
  peak_intensity DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Agent conversations table
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id TEXT CHECK (agent_id IN ('aria', 'sage', 'luna')) NOT NULL,
  messages JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  voice_enabled BOOLEAN DEFAULT TRUE,
  animations_enabled BOOLEAN DEFAULT TRUE,
  privacy_mode BOOLEAN DEFAULT FALSE,
  data_sharing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Agent memory table (for n8n workflow context)
CREATE TABLE IF NOT EXISTS public.agent_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL, -- 'joke', 'preference', 'concern', 'goal', etc.
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  agent_id TEXT,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX idx_agent_conversations_user_id ON public.agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_agent_id ON public.agent_conversations(agent_id);
CREATE INDEX idx_agent_memory_user_id ON public.agent_memory(user_id);
CREATE INDEX idx_agent_memory_key ON public.agent_memory(memory_key);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own user_profiles" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_profiles" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON public.agent_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.agent_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own memory" ON public.agent_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memory" ON public.agent_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_conversations_updated_at BEFORE UPDATE ON public.agent_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_memory_updated_at BEFORE UPDATE ON public.agent_memory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();