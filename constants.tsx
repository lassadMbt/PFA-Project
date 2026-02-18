/* constants.tsx */
import React from 'react';
import { Settings, ShieldCheck, PenTool, Headset } from 'lucide-react';
import { Product, Service, Project } from './types';

export const COMPANY_INFO = {
  name: "PFA - Ste Portes et fermeture automatique SARL",
  shortName: "PFA Automatisme",
  address: "20 boulevards de l'environnement Ariana, Ariana, Tunisia",
  phones: ["46 985 975", "+216 24 636 324"],
  email: "pfa.automatisem@gmail.com",
  tiktok: "@p.f.a.1",
  tiktokLink: "https://www.tiktok.com/@p.f.a.1"
};

export const PRODUCTS: Product[] = [
  {
    id: "rideaux-metalliques",
    title: "Rideaux Métalliques Premium",
    subtitle: "Technologie Silencieuse & Sécurité Maximale",
    description: "Nos rideaux métalliques de luxe offrent une protection robuste alliée à une esthétique moderne pour vos commerces et résidences.",
    features: [
      "Technologie silencieuse avancée (glissières et joints brevetés)",
      "Lames professionnelles robustes 8/10 mm",
      "Double protection : galvanisation + peinture epoxy thermodurcissable",
      "Axe 100% galvanisé pour une durabilité exceptionnelle",
      "Motorisation italienne certifiée (Garantie 3 ans)",
      "Pack complet : Centrale de commande + 2 télécommandes HF"
    ],
    innovations: [
      "Kit anti-bruit nouvelle génération",
      "Design architectural flexible adaptable à tous bâtiments"
    ],
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "stores-bras-invisible",
    title: "Store à Bras Invisible",
    subtitle: "L'Excellence Élégante en Protection Solaire",
    description: "Le store à bras invisible allie discrétion, robustesse et design épuré pour sublimer vos terrasses et vitrines.",
    features: [
      "Toile acrylique 100% étanche et résistante aux UV",
      "Bras aluminium anodisé (Aviation), ultra-léger",
      "Sur-mesure jusqu'à 6m de largeur",
      "Mécanisme fluide et ultra-silencieux",
      "Structure galvanisée anti-corrosion",
      "Motorisation premium italienne incluse",
      "Couleurs RAL personnalisables sur demande"
    ],
    advantages: [
      "Garantie 1 an (pièces + main-d'œuvre)",
      "Entretien minimal et longévité accrue",
      "Design discret sans supports apparents"
    ],
    applications: [
      "Résidences haut de gamme",
      "Hôtels & Restaurants",
      "Bureaux & Vitrines commerciales"
    ],
    image: "https://images.unsplash.com/photo-1513584684374-8bdb7443f383?auto=format&fit=crop&q=80&w=1200"
  }
];

export const SERVICES: Service[] = [
  {
    title: "Installation Professionnelle",
    description: "Nos techniciens qualifiés assurent une pose aux normes de sécurité les plus strictes pour une fiabilité totale.",
    icon: <Settings className="w-8 h-8 text-blue-800" />
  },
  {
    title: "Maintenance et SAV",
    description: "Un service après-vente réactif pour garantir la pérennité de vos installations et interventions rapides 24/7.",
    icon: <ShieldCheck className="w-8 h-8 text-blue-800" />
  },
  {
    title: "Consultation Gratuite",
    description: "Nos experts vous accompagnent dans le choix de la solution la mieux adaptée à vos besoins techniques et esthétiques.",
    icon: <PenTool className="w-8 h-8 text-blue-800" />
  },
  {
    title: "Devis Personnalisé",
    description: "Recevez une offre détaillée et transparente sous 24h, adaptée à votre budget et aux contraintes de votre projet.",
    icon: <Headset className="w-8 h-8 text-blue-800" />
  }
];

export const PROJECTS: Project[] = [
  { title: "Résidence Ariana", category: "Rideaux Métalliques", image: "https://picsum.photos/seed/p1/600/400" },
  { title: "Boutique Tunis Centre", category: "Store Invisible", image: "https://picsum.photos/seed/p2/600/400" },
  { title: "Restaurant Gammarth", category: "Store Invisible", image: "https://picsum.photos/seed/p3/600/400" },
  { title: "Garage Villa Soukra", category: "Porte Automatique", image: "https://picsum.photos/seed/p4/600/400" },
  { title: "Entrepôt Industriel", category: "Rideau Haute Sécurité", image: "https://picsum.photos/seed/p5/600/400" },
  { title: "Showroom Luxe", category: "Store Bras Invisible", image: "https://picsum.photos/seed/p6/600/400" }
];
