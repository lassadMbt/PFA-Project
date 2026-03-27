/**
 * src/admin/adminService.ts
 * All Supabase DB + Storage operations for the admin panel.
 */
import { supabase } from '../../lib/supabase';
import type { Product, Project, CompanyInfo, Partner } from '../../lib/supabase';

function fail(e: unknown, ctx: string): never {
  console.error(`[adminService] ${ctx}:`, e);
  throw new Error(ctx);
}

// ── Products ──────────────────────────────────────────────────

export const fetchAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').order('sort_order');
  if (error) fail(error, 'fetch products');
  return data as Product[];
};

export const upsertProduct = async (p: Partial<Product> & { id: string }): Promise<Product> => {
  const { data, error } = await supabase.from('products').upsert(p, { onConflict: 'id' }).select().single();
  if (error) fail(error, 'upsert product');
  return data as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) fail(error, 'delete product');
};

export const reorderProducts = async (updates: { id: string; sort_order: number }[]): Promise<void> => {
  await Promise.all(updates.map(({ id, sort_order }) =>
    supabase.from('products').update({ sort_order }).eq('id', id)
  ));
};

// ── Projects ──────────────────────────────────────────────────

export const fetchAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (error) fail(error, 'fetch projects');
  return data as Project[];
};

export const upsertProject = async (p: Partial<Project> & { id: string }): Promise<Project> => {
  const { data, error } = await supabase.from('projects').upsert(p, { onConflict: 'id' }).select().single();
  if (error) fail(error, 'upsert project');
  return data as Project;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) fail(error, 'delete project');
};

// ── Company ───────────────────────────────────────────────────

export const fetchCompanyInfo = async (): Promise<CompanyInfo> => {
  const { data, error } = await supabase.from('company_info').select('*').eq('id', 1).single();
  if (error) fail(error, 'fetch company');
  return data as CompanyInfo;
};

export const updateCompanyInfo = async (info: Partial<CompanyInfo>): Promise<CompanyInfo> => {
  const { data, error } = await supabase.from('company_info').update(info).eq('id', 1).select().single();
  if (error) fail(error, 'update company');
  return data as CompanyInfo;
};

// ── Partners ──────────────────────────────────────────────────

export const fetchAllPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase.from('partners').select('*').order('sort_order');
  if (error) fail(error, 'fetch partners');
  return data as Partner[];
};

export const upsertPartner = async (p: Partial<Partner> & { id: string }): Promise<Partner> => {
  const { data, error } = await supabase.from('partners').upsert(p, { onConflict: 'id' }).select().single();
  if (error) fail(error, 'upsert partner');
  return data as Partner;
};

export const deletePartner = async (id: string): Promise<void> => {
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) fail(error, 'delete partner');
};

// ── Image upload → Supabase Storage ──────────────────────────

export const uploadImage = async (
  file: File,
  folder: 'products' | 'projects' = 'products'
): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('pfa-images').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) fail(error, 'upload image');
  return supabase.storage.from('pfa-images').getPublicUrl(path).data.publicUrl;
};

export const deleteImage = async (publicUrl: string): Promise<void> => {
  try {
    const path = publicUrl.split('/pfa-images/')[1];
    if (path) await supabase.storage.from('pfa-images').remove([path]);
  } catch { /* non-critical */ }
};

export const fetchSiteStats = async (): Promise<{ total_visits: number; updated_at: string }> => {
  const { data, error } = await supabase
    .from('site_stats')
    .select('total_visits, updated_at')
    .eq('id', 1)
    .single();
  if (error) fail(error, 'fetch stats');
  return data;
};