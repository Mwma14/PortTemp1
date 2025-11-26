/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

export interface UserRecord {
  id?: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioRecord {
  id?: string;
  user_id?: string;
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  heroText?: string;
  skills?: Array<{ id: string; name: string; level: number; color: 'cyan' | 'purple' | 'green' }>;
  stats?: Array<{ id: string; value: string; label: string }>;
  services: Array<{ id: string; name: string; description: string; icon: string }>;
  projects: Array<{ id: string; name: string; description: string; image: string; link: string; tags: string[] }>;
  modules?: Array<{ id: string; name: string; description: string; link: string; language: string }>;
  repos?: Array<{ id: string; name: string; description: string; link: string; stars: string; language: string }>;
  docs?: Array<{ id: string; title: string; content: string; category: string }>;
  socialMedia: Array<{ platform: string; url: string }>;
  faqItems?: Array<{ id: string; question: string; answer: string }>;
  templateId: number;
  createdAt?: string;
  updatedAt?: string;
}

const toDatabaseFormat = (data: PortfolioRecord) => ({
  user_id: data.user_id || null,
  slug: (data.slug || '').toLowerCase().trim(),
  title: (data.title || 'Untitled').trim(),
  subtitle: (data.subtitle || '').trim(),
  about: (data.about || '').trim(),
  email: (data.email || '').trim(),
  phone: (data.phone || '').trim(),
  location: (data.location || '').trim(),
  profileimage: data.profileImage || '',
  herotext: data.heroText || '',
  skills: data.skills || [],
  stats: data.stats || [],
  services: data.services || [],
  projects: data.projects || [],
  modules: data.modules || [],
  repos: data.repos || [],
  docs: data.docs || [],
  socialmedia: data.socialMedia || [],
  faqitems: data.faqItems || [],
  templateid: data.templateId || 1,
  updatedat: new Date().toISOString()
});

const fromDatabaseFormat = (dbData: any): PortfolioRecord => ({
  id: dbData.id,
  user_id: dbData.user_id,
  slug: dbData.slug,
  title: dbData.title,
  subtitle: dbData.subtitle,
  about: dbData.about,
  email: dbData.email,
  phone: dbData.phone,
  location: dbData.location,
  profileImage: dbData.profileimage || '',
  heroText: dbData.herotext || '',
  skills: dbData.skills || [],
  stats: dbData.stats || [],
  services: dbData.services || [],
  projects: dbData.projects || [],
  modules: dbData.modules || [],
  repos: dbData.repos || [],
  docs: dbData.docs || [],
  socialMedia: dbData.socialmedia || [],
  faqItems: dbData.faqitems || [],
  templateId: dbData.templateid || 1,
  createdAt: dbData.createdat,
  updatedAt: dbData.updatedat
});

export const createOrUpdateUser = async (userData: UserRecord) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userData.clerk_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          profile_image: userData.profile_image,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', userData.clerk_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          clerk_id: userData.clerk_id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          profile_image: userData.profile_image,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const savePortfolio = async (data: PortfolioRecord) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const dbData = toDatabaseFormat(data);
    console.log('Saving to DB:', dbData);

    const { data: result, error } = await supabase
      .from('portfolios')
      .upsert([dbData], { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('DB Error Details:', JSON.stringify(error));
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Portfolio saved!', result);
    return result;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    throw error;
  }
};

export const getPortfolioBySlug = async (slug: string) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const normalizedSlug = (slug || '').toLowerCase().trim();

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('slug', normalizedSlug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('Portfolio not found:', normalizedSlug);
        return null;
      }
      throw error;
    }

    console.log('Portfolio fetched:', data?.slug);
    return fromDatabaseFormat(data);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
};

export const checkSlugExists = async (slug: string) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const normalizedSlug = (slug || '').toLowerCase().trim();

    const { data, error } = await supabase
      .from('portfolios')
      .select('id')
      .eq('slug', normalizedSlug)
      .single();

    if (error && error.code === 'PGRST116') {
      return false;
    }

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking slug:', error);
    return true;
  }
};

export const getAllPortfolios = async (limit: number = 50) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('createdat', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(fromDatabaseFormat);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
};

export const getPortfoliosByUserId = async (userId: string) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('updatedat', { ascending: false });

    if (error) throw error;
    return (data || []).map(fromDatabaseFormat);
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    return [];
  }
};

export const deletePortfolio = async (slug: string, userId: string) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('slug', slug)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return false;
  }
};
