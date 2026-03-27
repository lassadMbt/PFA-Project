/**
 * src/lib/supabase.ts
 * Single Supabase client — credentials come from .env only.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Shared types (mirror the DB columns exactly) ──────────────

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  innovations: string[];
  images: string[];          // array of URLs — matches ImageCarousel props
  warranty: string | null;   // e.g. "3 ans de garantie" | null
  visible: boolean;
  sort_order: number;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
  updated_at?: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  short_name: string;
  address: string;
  phones: string[];
  email: string;
  tiktok: string;
  tiktok_link: string;
  facebook: string;
  hero_title: string;
  hero_subtitle: string;
  hero_stats: { value: string; label: string }[];
  about_description_1: string;
  about_description_2: string;
  years_experience: string;
  updated_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  visible: boolean;
  sort_order: number;
  updated_at?: string;
}