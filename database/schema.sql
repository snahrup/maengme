-- MaengMe Supabase Database Schema
-- Run this in the Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    onboarding_complete BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
    goals TEXT[] DEFAULT '{}',
    concerns TEXT[] DEFAULT '{}',
    medical_considerations TEXT[],
    preferred_strains TEXT[] DEFAULT '{}',
    typical_dose DECIMAL(5,2),
    session_frequency TEXT,
    personalized_tips TEXT[] DEFAULT '{}',
    risk_factors TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_id TEXT NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT NOT NULL,
    total_elapsed BIGINT NOT NULL,
    laps JSONB DEFAULT '[]',
    notes TEXT,
    peak_time BIGINT,
    peak_intensity INTEGER CHECK (peak_intensity >= 1 AND peak_intensity <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent conversations table
CREATE TABLE IF NOT EXISTS public.agent_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    agent_id TEXT NOT NULL CHECK (agent_id IN ('aria', 'sage', 'luna')),
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent memory table (for context sharing)
CREATE TABLE IF NOT EXISTS public.agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,    memory_type TEXT NOT NULL CHECK (memory_type IN ('short', 'medium', 'long', 'joke', 'preference', 'medical', 'pattern')),
    memory_key TEXT NOT NULL,
    memory_value JSONB NOT NULL,
    agent_id TEXT CHECK (agent_id IN ('aria', 'sage', 'luna', 'shared')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    voice_enabled BOOLEAN DEFAULT TRUE,
    animations_enabled BOOLEAN DEFAULT TRUE,
    privacy_mode BOOLEAN DEFAULT FALSE,
    data_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Product presets table (user saved configurations)
CREATE TABLE IF NOT EXISTS public.product_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,    dose DECIMAL(5,2) NOT NULL,
    method TEXT NOT NULL,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX idx_agent_conversations_user_id ON public.agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_agent_id ON public.agent_conversations(agent_id);
CREATE INDEX idx_agent_memory_user_id ON public.agent_memory(user_id);
CREATE INDEX idx_agent_memory_expires_at ON public.agent_memory(expires_at);
CREATE INDEX idx_product_presets_user_id ON public.product_presets(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_presets ENABLE ROW LEVEL SECURITY;
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own user_profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversations" ON public.agent_conversations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own memory" ON public.agent_memory
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own presets" ON public.product_presets
    FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_conversations_updated_at BEFORE UPDATE ON public.agent_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_memory_updated_at BEFORE UPDATE ON public.agent_memory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_presets_updated_at BEFORE UPDATE ON public.product_presets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Memory cleanup function (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_memories()
RETURNS void AS $$
BEGIN
    DELETE FROM public.agent_memory 
    WHERE expires_at < NOW();
END;
$$ language 'plpgsql';