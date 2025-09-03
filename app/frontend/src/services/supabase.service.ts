import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, isSupabaseConfigured } from '../config/supabase.config';

// Create Supabase client (only if configured)
// We use 'any' for types until Supabase is properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

// Auth helpers
export const authService = {
  async signUp(email: string, password: string, username: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (error) throw error;
    
    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        username
      } as any);
    }
    
    return data;
  },
  
  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Update last login
    if (data.user) {
      await supabase.from('users').update({
        last_login: new Date().toISOString()
      } as any).eq('id', data.user.id);
    }
    
    return data;
  },
  
  async signOut() {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  async resetPassword(email: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
  }
};

// Profile service
export const profileService = {
  async getProfile(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateProfile(userId: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      } as any);
    
    if (error) throw error;
    return data;
  }
};

// Session service
export const sessionService = {
  async saveSession(userId: string, session: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        ...session,
        user_id: userId
      } as any);
    
    if (error) throw error;
    return data;
  },
  
  async getUserSessions(userId: string, limit = 50) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Agent conversation service
export const agentService = {
  async saveConversation(
    userId: string,
    agentId: 'aria' | 'sage' | 'luna',
    messages: any[],
    context?: any,
    sessionId?: string
  ) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('agent_conversations')
      .insert({
        user_id: userId,
        agent_id: agentId,
        messages,
        context,
        session_id: sessionId
      } as any);
    
    if (error) throw error;
    return data;
  },
  
  async getRecentConversations(userId: string, agentId?: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    let query = supabase
      .from('agent_conversations')
      .select('*')
      .eq('user_id', userId);
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  }
};