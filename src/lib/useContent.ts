/**
 * src/lib/useContent.ts
 *
 * React hooks for the PUBLIC website.
 * Reads from Supabase (anon, read-only via RLS).
 * Falls back to static constants.tsx data on error.
 *
 * Usage:
 *   const { products, loading } = useProducts();
 *   // product.images  → string[]  (feeds directly into <ImageCarousel images={...} />)
 *   // product.warranty → string | null
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Product, Project, CompanyInfo } from './supabase';
import { PRODUCTS as SP, PROJECTS as SJ, COMPANY_INFO as SC } from '../../constants';

// ── Static fallbacks ──────────────────────────────────────────

const staticProducts = (): Product[] =>
  SP.map((p, i) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    features: p.features,
    innovations: p.innovations || [],
    images: p.images,            // already an array in new constants
    warranty: p.warranty || null,
    visible: true,
    sort_order: i,
  }));

const staticProjects = (): Project[] =>
  SJ.map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, image_url: p.image, visible: true, sort_order: i }));

const staticCompany = (): CompanyInfo => ({
  id: 1,
  name: SC.name, short_name: SC.shortName, address: SC.address,
  phones: SC.phones, email: SC.email, tiktok: SC.tiktok,
  tiktok_link: SC.tiktokLink, facebook: SC.facebook,
  hero_title: "L'Excellence en Automatisation",
  hero_subtitle: "Portes, rideaux métalliques et stores haut de gamme. Design italien, robustesse tunisienne.",
  hero_stats: [
    { value: "4+", label: "Ans d'Expérience" },
    { value: "1000+", label: "Projets Réalisés" },
    { value: "3 Ans", label: "Garantie Moteur" },
  ],
  about_description_1: "PFA est leader dans la fabrication et l'installation de portes et fermetures automatiques depuis plus de 15 ans. Basés à l'Ariana, nous servons tout le territoire tunisien avec un engagement sans faille pour la qualité.",
  about_description_2: "Notre expertise repose sur une sélection rigoureuse de nos partenaires, notamment pour les motorisations italiennes réputées pour leur fiabilité et leur silence de fonctionnement.",
  years_experience: "4+",
});

// ── Hooks ─────────────────────────────────────────────────────

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').eq('visible', true).order('sort_order')
      .then(({ data, error }) => {
        if (!error && data?.length) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').eq('visible', true).order('sort_order')
      .then(({ data, error }) => {
        if (!error && data?.length) setProjects(data as Project[]);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}

export function useCompanyInfo() {
  const [company, setCompany] = useState<CompanyInfo>(staticCompany);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('company_info').select('*').eq('id', 1).single()
      .then(({ data, error }) => {
        if (!error && data) setCompany(data as CompanyInfo);
        setLoading(false);
      });
  }, []);

  return { company, loading };
}


export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  visible: boolean;
  sort_order: number;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('partners')
      .select('*')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data }) => {
        setPartners((data as Partner[]) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { partners, loading };
}