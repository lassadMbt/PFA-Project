-- ============================================================
--  PFA — Supabase Schema v2 (updated for new frontend)
--  Run entirely in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── products ──────────────────────────────────────────────────
-- images = JSONB array of URL strings  (e.g. ["/images/a.jpg","/images/b.jpg"])
-- warranty = optional text             (e.g. "3 ans de garantie")
CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT '',
  subtitle      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  features      JSONB NOT NULL DEFAULT '[]',
  innovations   JSONB NOT NULL DEFAULT '[]',
  images        JSONB NOT NULL DEFAULT '[]',
  warranty      TEXT DEFAULT NULL,
  visible       BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  title         TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  visible       BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── company_info (single row) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS company_info (
  id                   INTEGER PRIMARY KEY DEFAULT 1,
  name                 TEXT NOT NULL DEFAULT '',
  short_name           TEXT NOT NULL DEFAULT '',
  address              TEXT NOT NULL DEFAULT '',
  phones               JSONB NOT NULL DEFAULT '[]',
  email                TEXT NOT NULL DEFAULT '',
  tiktok               TEXT NOT NULL DEFAULT '',
  tiktok_link          TEXT NOT NULL DEFAULT '',
  facebook             TEXT NOT NULL DEFAULT '',
  hero_title           TEXT NOT NULL DEFAULT '',
  hero_subtitle        TEXT NOT NULL DEFAULT '',
  hero_stats           JSONB NOT NULL DEFAULT '[]',
  about_description_1  TEXT NOT NULL DEFAULT '',
  about_description_2  TEXT NOT NULL DEFAULT '',
  years_experience     TEXT NOT NULL DEFAULT '4+',
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ── Auto updated_at ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS company_info_updated_at ON company_info;
CREATE TRIGGER company_info_updated_at BEFORE UPDATE ON company_info FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Public: read-only for visible rows
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (visible = true);
DROP POLICY IF EXISTS "Admin all products" ON products;
CREATE POLICY "Admin all products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (visible = true);
DROP POLICY IF EXISTS "Admin all projects" ON projects;
CREATE POLICY "Admin all projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read company" ON company_info;
CREATE POLICY "Public read company" ON company_info FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin all company" ON company_info;
CREATE POLICY "Admin all company" ON company_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Storage bucket for images ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('pfa-images', 'pfa-images', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Public view images" ON storage.objects;
CREATE POLICY "Public view images" ON storage.objects FOR SELECT USING (bucket_id = 'pfa-images');
DROP POLICY IF EXISTS "Admin manage images" ON storage.objects;
CREATE POLICY "Admin manage images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'pfa-images') WITH CHECK (bucket_id = 'pfa-images');

-- ── Seed: company_info ────────────────────────────────────────
INSERT INTO company_info (id, name, short_name, address, phones, email, tiktok, tiktok_link, facebook, hero_title, hero_subtitle, hero_stats, about_description_1, about_description_2, years_experience)
VALUES (1,
  'PFA - Ste Portes et fermeture automatique SARL', 'PFA Automatisme',
  '20 boulevards de l''environnement Ariana, Ariana, Tunisia',
  '["24 636 324", "+216 24 636 324"]', 'pfa.automatisem@gmail.com',
  '@p.f.a.1', 'https://www.tiktok.com/@p.f.a.1',
  'https://www.facebook.com/profile.php?id=100066608413088',
  'L''Excellence en Automatisation',
  'Portes, rideaux métalliques et stores haut de gamme. Design italien, robustesse tunisienne.',
  '[{"value":"4+","label":"Ans d''Expérience"},{"value":"1000+","label":"Projets Réalisés"},{"value":"3 Ans","label":"Garantie Moteur"}]',
  'PFA est leader dans la fabrication et l''installation de portes et fermetures automatiques depuis plus de 15 ans. Basés à l''Ariana, nous servons tout le territoire tunisien avec un engagement sans faille pour la qualité.',
  'Notre expertise repose sur une sélection rigoureuse de nos partenaires, notamment pour les motorisations italiennes réputées pour leur fiabilité et leur silence de fonctionnement.',
  '4+'
) ON CONFLICT (id) DO NOTHING;

-- ── Seed: products ────────────────────────────────────────────
INSERT INTO products (id, title, subtitle, description, features, innovations, images, warranty, visible, sort_order) VALUES
('rideaux-metalliques','Rideaux Métalliques Premium','Technologie Silencieuse & Sécurité Maximale',
 'Nos rideaux métalliques de luxe sur mesure offrent une protection robuste alliée à une esthétique moderne pour vos commerces et résidences.',
 '["Technologie silencieuse avancée (glissières et joints brevetés)","Lames professionnelles robustes 8/10 mm","Double protection : galvanisation + peinture epoxy thermodurcissable","Axe 100% galvanisé pour une durabilité exceptionnelle","Motorisation européenne certifiée (Garantie 3 ans)","Pack complet : Centrale de commande + 2 télécommandes HF"]',
 '["Kit anti-bruit nouvelle génération","Design architectural flexible adaptable à tous bâtiments"]',
 '["/images/rideaux-metalliques.jpeg","/images/rideaux-metalliques-2.jpeg"]',
 '3 ans de garantie',true,0),

('porte-sectionnelle-europeenne','Porte Sectionnelle Européenne – Haute Gamme','Fabrication Européenne – Qualité Premium',
 'Porte sectionnelle robuste avec structure acier galvanisé, panneaux sandwich et isolation mousse polyuréthane injectée.',
 '["pour les portes sectionnelles les dimensions sont spécifiques : 250/216cm , 300/216cm , 400/216cm et 500/216cm","Structure acier galvanisé haute résistance","Panneaux sandwich 40 mm","Isolation mousse polyuréthane injectée","Peinture au four anticorrosion","Rails et ressorts renforcés","Compatible motorisation automatique","Motorisation européenne certifiée (Garantie 3 ans)"]',
 '[]','["/images/porte-sectionnelle.jpeg"]','3 ans de garantie',true,1),

('porte-entree-metallique','Porte d''Entrée Métallique – Finition Premium','Sécurité Maximale et Finition Premium',
 'Une porte d''entrée métallique premium conçue pour allier sécurité renforcée, design moderne et durabilité exceptionnelle.',
 '["Structure tubes lamellaires galvanisés","Peinture thermolaquée résistante","Pré-cadre 40x40 mm renforcé","Verrouillage encastré haute sécurité","Dimension sur mesure","Couleur personnalisable RAL au choix","Design au choix du client"]',
 '[]','["/images/porte-entree.jpeg","/images/porte-entree-2.jpeg"]',NULL,true,2),

('Porte-battante','Porte battante','Sécurité Maximale et Finition Premium',
 'Porte battante galvanisée solide et résistante à la rouille. Fabrication sur mesure avec design au choix selon votre besoin.',
 '["Structure tubes lamellaires galvanisés","Peinture thermolaquée résistante","Pré-cadre 40x40 mm renforcé","Verrouillage encastré haute sécurité","Dimension sur mesure","Couleur personnalisable RAL au choix","Design au choix du client"]',
 '[]','["/images/porte-battante.jpeg"]',NULL,true,3),

('porte-coulissante-haute-performance','Porte Coulissante Haute Performance','Fabrication Haute Qualité',
 'Une porte coulissante robuste et élégante conçue pour offrir performance, stabilité et finition professionnelle durable.',
 '["Double tôle micro-nervurée 10/10 galvanisée","Peinture époxy thermolaquée","Monorail oméga galvanisé haute stabilité","Couleur personnalisable RAL au choix","Dimension sur mesure","Design au choix du client"]',
 '[]','["/images/porte-coulissante.jpeg"]',NULL,true,4),

('porte-basculante-tubauto','Porte Basculante Haut de Gamme – Tubauto','Structure Acier Galvanisé Haute Résistance',
 'Une porte basculante premium alliant technologie avancée, sécurité renforcée et fiabilité durable pour un usage résidentiel ou professionnel.',
 '["Motorisation européenne performante","Sécurité intégrée anti-effraction","Garantie 36 mois","SAV professionnel rapide","pour les portes basculantes les dimensions sont spécifiques 237/212cm , 250/212cm , 275/212cm et 300/212cm"]',
 '[]','["/images/porte-basculante.jpeg"]','3 ans de garantie',true,5),

('store-bras-invisible','Store à Bras Invisible – Haute Performance','Motorisation Premium et Durabilité',
 'Un store à bras invisible motorisé combinant protection solaire optimale, discrétion architecturale et fiabilité à long terme.',
 '["Toile acrylique 100% étanche et résistante aux UV","Bras aluminium anodisé ultra-léger","Largeur jusqu''à 6 m sur mesure","Motorisation italienne premium","Structure acier galvanisé renforcé","Finition thermolaquée RAL personnalisable"]',
 '[]','["/images/stores-bras-invisible.jpeg"]','1 an de garantie',true,6),

('store-italienne','Store à l''Italienne','Motorisation Premium et Durabilité',
 'Un store à bras invisible motorisé combinant protection solaire optimale, discrétion architecturale et fiabilité à long terme.',
 '["Toile acrylique 100% étanche et résistante aux UV","Bras aluminium anodisé ultra-léger","Motorisation italienne premium","Structure acier galvanisé renforcé","Finition thermolaquée RAL personnalisable"]',
 '[]','["/images/store-Italienne.jpeg","/images/store-Italienne-2.jpeg"]','1 an de garantie',true,7),

('moteur-porte-coulissante','Moteur Porte Coulissante – Haute Gamme','Motorisation Européenne Professionnelle',
 'Une motorisation européenne haut de gamme garantissant puissance, fluidité et sécurité pour portails coulissants résidentiels et industriels.',
 '["Capacités : 400 kg à 2000 kg","230V résidentiel","24V usage intensif","36V brushless Speed","Photocellules incluses","Lampe LED","2 télécommandes","Crémaillère galvanisée","Compatible domotique"]',
 '[]','["/images/moteur-porte-coulissante-2.jpeg","/images/moteur-porte-coulissante.jpeg"]','3 ans de garantie',true,8)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: projects ────────────────────────────────────────────
INSERT INTO projects (id, title, category, image_url, visible, sort_order) VALUES
  ('p1','Résidence Ariana','Rideaux Métalliques','/images/realisations/rideaux-metalliques.jpeg',true,0),
  ('p2','','Store Invisible','/images/realisations/store-invisible.jpeg',true,1),
  ('p3','','Porte Coulissante','/images/realisations/porte-coulissante.jpeg',true,2),
  ('p4','','Porte Basculante','/images/realisations/porte-basculante.jpeg',true,3),
  ('p5','','Store Bras Invisible','/images/realisations/store-bras-invisible.jpeg',true,4),
  ('p6','','Rideau Haute Sécurité','/images/realisations/moteur.jpeg',true,5)
ON CONFLICT (id) DO NOTHING;