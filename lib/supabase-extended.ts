import { supabase, PortfolioRecord } from './supabase';

// ============================================================
// PORTFOLIO VIEWS (Analytics)
// ============================================================

export interface PortfolioView {
  id?: string;
  portfolio_id: string;
  visitor_ip?: string;
  visitor_country?: string;
  visitor_city?: string;
  referrer?: string;
  user_agent?: string;
  viewed_at?: string;
}

export const recordPortfolioView = async (portfolioId: string, data: Partial<PortfolioView>) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: result, error } = await supabase
      .from('portfolio_views')
      .insert([{
        portfolio_id: portfolioId,
        ...data
      }]);
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error recording portfolio view:', error);
    throw error;
  }
};


// ============================================================
// PORTFOLIO COMMENTS (Feedback)
// ============================================================

export interface PortfolioComment {
  id?: string;
  portfolio_id: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  rating?: number;
  created_at?: string;
}

export const addPortfolioComment = async (comment: PortfolioComment) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: result, error } = await supabase
      .from('portfolio_comments')
      .insert([comment]);
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getPortfolioComments = async (portfolioId: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('portfolio_comments')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as PortfolioComment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};


// ============================================================
// PORTFOLIO ANALYTICS
// ============================================================

export interface PortfolioAnalytics {
  id?: string;
  portfolio_id: string;
  view_count: number;
  unique_visitors: number;
  total_comments: number;
  average_rating?: number;
  last_viewed_at?: string;
  month_year?: string;
}

export const getPortfolioAnalytics = async (portfolioId: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('portfolio_analytics')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('month_year', { ascending: false });
    
    if (error) throw error;
    return data as PortfolioAnalytics[];
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
};


// ============================================================
// PORTFOLIO SETTINGS
// ============================================================

export interface PortfolioSettings {
  id?: string;
  portfolio_id: string;
  custom_domain?: string;
  custom_colors?: Record<string, string>;
  custom_fonts?: Record<string, string>;
  seo_title?: string;
  seo_description?: string;
  google_analytics_id?: string;
  enable_comments?: boolean;
  enable_contact_form?: boolean;
  show_view_count?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getPortfolioSettings = async (portfolioId: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No settings exist, return defaults
      return null;
    }
    if (error) throw error;
    return data as PortfolioSettings;
  } catch (error) {
    console.error('Error fetching portfolio settings:', error);
    return null;
  }
};

export const savePortfolioSettings = async (settings: PortfolioSettings) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: result, error } = await supabase
      .from('portfolio_settings')
      .upsert([settings], { onConflict: 'portfolio_id' });
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error saving portfolio settings:', error);
    throw error;
  }
};


// ============================================================
// CONTACT MESSAGES
// ============================================================

export interface ContactMessage {
  id?: string;
  portfolio_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export const sendContactMessage = async (message: ContactMessage) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert([message]);
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};


// ============================================================
// TEMPLATES
// ============================================================

export interface Template {
  id: number;
  name: string;
  slug: string;
  description?: string;
  preview_image?: string;
  design_config?: Record<string, any>;
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getAllTemplates = async () => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });
    
    if (error) throw error;
    return data as Template[];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

export const getTemplateBySlug = async (slug: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as Template;
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
};


// ============================================================
// PORTFOLIO STATISTICS & SUMMARIES
// ============================================================

export interface PortfolioSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  total_views: number;
  comment_count: number;
  avg_rating: number;
}

export const getPortfolioSummary = async (slug: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('portfolio_summaries')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data as PortfolioSummary;
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    return null;
  }
};

export const getPopularPortfolios = async (limit: number = 10) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .rpc('get_popular_portfolios', { limit_count: limit });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching popular portfolios:', error);
    return [];
  }
};


// ============================================================
// USERS (For Future Authentication)
// ============================================================

export interface User {
  id?: string;
  email: string;
  username?: string;
  full_name?: string;
  password_hash?: string;
  profile_image?: string;
  bio?: string;
  is_active?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const createUser = async (user: User) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: result, error } = await supabase
      .from('users')
      .insert([user]);
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code === 'PGRST116') {
      return null;
    }
    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};


// ============================================================
// USER PORTFOLIOS
// ============================================================

export interface UserPortfolio {
  id?: string;
  user_id: string;
  portfolio_id: string;
  role?: 'owner' | 'editor' | 'viewer';
  created_at?: string;
}

export const getUserPortfolios = async (userId: string) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_portfolios')
      .select('*, portfolios(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return [];
  }
};
