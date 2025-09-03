import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, isSupabaseConfigured } from '../config/supabase.config';

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          created_at: string;
          updated_at: string;
          onboarding_complete: boolean;
          last_login: string | null;
        };
        Insert: {
          username: string;
          email: string;
          onboarding_complete?: boolean;
        };
        Update: {
          username?: string;
          email?: string;
          onboarding_complete?: boolean;
          last_login?: string;
        };
      };
      
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          experience: 'beginner' | 'intermediate' | 'advanced';
          goals: string[];
          concerns: string[];
          medical_considerations: string[] | null;
          preferred_strains: string[];
          typical_dose: number;
          session_frequency: string;
          personalized_tips: string[];
          risk_factors: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          experience?: 'beginner' | 'intermediate' | 'advanced';
          goals?: string[];
          concerns?: string[];
          medical_considerations?: string[];
          preferred_strains?: string[];
          typical_dose?: number;
          session_frequency?: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      
      sessions: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          product_id: string;
          start_time: number;
          end_time: number;
          total_elapsed: number;
          laps: any[];
          notes: string | null;
          peak_time: number | null;
          peak_intensity: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_name: string;
          product_id: string;
          start_time: number;
          end_time: number;
          total_elapsed: number;
          laps?: any[];
          notes?: string;
          peak_time?: number;
          peak_intensity?: number;
        };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      
      agent_conversations: {
        Row: {
          id: string;
          user_id: string;
          agent_id: 'aria' | 'sage' | 'luna';
          messages: any[];
          context: any;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          agent_id: 'aria' | 'sage' | 'luna';
          messages: any[];
          context?: any;
          session_id?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_conversations']['Insert']>;
      };
      
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'auto';
          notifications_enabled: boolean;
          voice_enabled: boolean;
          animations_enabled: boolean;
          privacy_mode: boolean;
          data_sharing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: 'light' | 'dark' | 'auto';
          notifications_enabled?: boolean;
          voice_enabled?: boolean;
          animations_enabled?: boolean;
          privacy_mode?: boolean;
          data_sharing?: boolean;
        };
        Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>;
      };
    };
  };
}

// Create Supabase client (only if configured)
export const supabase = isSupabaseConfigured() 
  ? createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey)
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
      });
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
      }).eq('id', data.user.id);
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
  
  async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Insert']>) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  }
};

// Session service
export const sessionService = {
  async saveSession(userId: string, session: Database['public']['Tables']['sessions']['Insert']) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        ...session,
        user_id: userId
      });
    
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
      });
    
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