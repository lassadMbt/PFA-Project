/* constants.tsx */
import React from 'react';
import { Settings, ShieldCheck, PenTool, Headset } from 'lucide-react';
import { Product, Service, Project } from './types';

export const COMPANY_INFO = {
  name: "PFA - Ste Portes et fermeture automatique SARL",
  shortName: "PFA Automatisme",
  address: "20 boulevards de l'environnement Ariana, Ariana, Tunisia",
  phones: ["24 636 324", "+216 24 636 324"],
  email: "pfa.automatisem@gmail.com",
  tiktok: "@p.f.a.1",
  tiktokLink: "https://www.tiktok.com/@p.f.a.1",
  facebook: "https://www.facebook.com/profile.php?id=100066608413088&rdid=ecMJx5ruuiuCF4VD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18BnLmtnQc%2F",
};

export const PRODUCTS: Product[] = [
  {
    id: "rideaux-metalliques",
    title: "Rideaux Métalliques Premium",
     warranty: "3 ans de garantie",
    subtitle: "Technologie Silencieuse & Sécurité Maximale",
    description: "Nos rideaux métalliques de luxe sur mesure offrent une protection robuste alliée à une esthétique moderne pour vos commerces et résidences.",
    features: [
      "Technologie silencieuse avancée (glissières et joints brevetés)",
      "Lames professionnelles robustes 8/10 mm",
      "Double protection : galvanisation + peinture epoxy thermodurcissable",
      "Axe 100% galvanisé pour une durabilité exceptionnelle",
      "Motorisation européenne certifiée (Garantie 3 ans)",
      "Pack complet : Centrale de commande + 2 télécommandes HF",
      
    ],
    innovations: [
      "Kit anti-bruit nouvelle génération",
      "Design architectural flexible adaptable à tous bâtiments"
    ],
    images: [
          "/images/rideaux-metalliques.jpeg",
          "/images/rideaux-metalliques-2.jpeg"],

  },

  {
    id: "porte-sectionnelle-europeenne",
    warranty: "3 ans de garantie",
    title: "Porte Sectionnelle Européenne – Haute Gamme",
    subtitle: "Fabrication Européenne – Qualité Premium",
    images: [
      "/images/porte-sectionnelle.jpeg"
    ],
    description: "Porte sectionnelle robuste avec structure acier galvanisé, panneaux sandwich et isolation mousse polyuréthane injectée.",
    features: [
      "pour les portes sectionnelles les dimensions sont spécifiques : 250/216cm , 300/216cm , 400/216cm et 500/216cm",
      "Structure acier galvanisé haute résistance",
      "Panneaux sandwich 40 mm",
      "Isolation mousse polyuréthane injectée",
      "Peinture au four anticorrosion",
      "Rails et ressorts renforcés",
      "Compatible motorisation automatique",
      "Motorisation européenne certifiée (Garantie 3 ans)"
    ]
  },

  {
    id: "porte-entree-metallique",
    title: "Porte d'Entrée Métallique – Finition Premium",
    subtitle: "Sécurité Maximale et Finition Premium",
    images: [
      "/images/porte-entree.jpeg",
      "/images/porte-entree-2.jpeg"
    ],
    description: "Une porte d’entrée métallique premium conçue pour allier sécurité renforcée, design moderne et durabilité exceptionnelle.",
    features: [
      "Structure tubes lamellaires galvanisés",
      "Peinture thermolaquée résistante",
      "Pré-cadre 40x40 mm renforcé",
      "Verrouillage encastré haute sécurité",
      "Dimension sur mesure",
      "Couleur personnalisable RAL au choix",
      "Design au choix du client",
    ]
  },

    {
    id: "Porte-battante",
    title: "Porte battante",
    subtitle: "Sécurité Maximale et Finition Premium",
    images: [
      "/images/porte-battante.jpeg",
    ],
    description: "Porte battante galvanisée solide et résistante à la rouille. Fabrication sur mesure avec design au choix selon votre besoin. Idéale pour sécuriser et embellir votre entrée.",
    features: [
      "Structure tubes lamellaires galvanisés",
      "Peinture thermolaquée résistante",
      "Pré-cadre 40x40 mm renforcé",
      "Verrouillage encastré haute sécurité",
      "Dimension sur mesure",
      "Couleur personnalisable RAL au choix",
      "Design au choix du client",
    ]
  },

  
{
  id: "porte-coulissante-haute-performance",
  title: "Porte Coulissante Haute Performance",
  subtitle: "Fabrication Haute Qualité",
  images: [
    "/images/porte-coulissante.jpeg"
  ],
  description: "Une porte coulissante robuste et élégante conçue pour offrir performance, stabilité et finition professionnelle durable.",
  features: [
    "Double tôle micro-nervurée 10/10 galvanisée",
    "Peinture époxy thermolaquée",
    "Monorail oméga galvanisé haute stabilité",
    "Couleur personnalisable RAL au choix",
    "Dimension sur mesure",
    "Design au choix du client",
  ]
},

{
  id: "porte-basculante-tubauto",
  warranty: "3 ans de garantie",
  title: "Porte Basculante Haut de Gamme – Tubauto",
  subtitle: "Structure Acier Galvanisé Haute Résistance",
  images: [
    "/images/porte-basculante.jpeg"
  ],
  description: "Une porte basculante premium alliant technologie avancée, sécurité renforcée et fiabilité durable pour un usage résidentiel ou professionnel.",
  features: [
    "Motorisation européenne performante",
    "Sécurité intégrée anti-effraction",
    "Garantie 36 mois",
    "SAV professionnel rapide",
    "pour les portes basculantes les dimensions sont spécifiques 237/212cm , 250/212cm , 275/212cm et 300/212cm"
  ]
},



  {
    id: "store-bras-invisible-haute-performance",
    title: "Store à Bras Invisible – Haute Performance",
    subtitle: "Motorisation Premium et Durabilité",
warranty: "1 an de garantie",    
    images: [
      "/images/stores-bras-invisible.jpeg"
    ],
    description: "Un store à bras invisible motorisé combinant protection solaire optimale, discrétion architecturale et fiabilité à long terme.",
    features: [
      "Toile acrylique 100% étanche et résistante aux UV",
      "Bras aluminium anodisé ultra-léger",
      "Largeur jusqu'à 6 m sur mesure",
      "Motorisation italienne premium",
      "Structure acier galvanisé renforcé",
      "Finition thermolaquée RAL personnalisable"
    ]
  
},

{
    id: "store l'Italienne ",
    title: "Store à l'Italienne",
    subtitle: "Motorisation Premium et Durabilité",
warranty: "1 an de garantie",    
    images: [
      "/images/store-Italienne.jpeg",
      "/images/store-Italienne-2.jpeg"
    ],
    description: "Un store à bras invisible motorisé combinant protection solaire optimale, discrétion architecturale et fiabilité à long terme.",
    features: [
      "Toile acrylique 100% étanche et résistante aux UV",
      "Bras aluminium anodisé ultra-léger",
      "Motorisation italienne premium",
      "Structure acier galvanisé renforcé",
      "Finition thermolaquée RAL personnalisable"
    ]
  
},


{
  id: "moteur-porte-coulissante",
  warranty: "3 ans de garantie",
  title: "Moteur Porte Coulissante – Haute Gamme",
  subtitle: "Motorisation Européenne Professionnelle",
  images: [
    "/images/moteur-porte-coulissante-2.jpeg",
    "/images/moteur-porte-coulissante.jpeg",
  ],
  description: "Une motorisation européenne haut de gamme garantissant puissance, fluidité et sécurité pour portails coulissants résidentiels et industriels.",
  features: [
    "Capacités : 400 kg à 2000 kg",
    "230V résidentiel",
    "24V usage intensif",
    "36V brushless Speed",
    "Photocellules incluses",
    "Lampe LED",
    "2 télécommandes",
    "Crémaillère galvanisée",
    "Compatible domotique"
  ]
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
  { title: "Résidence Ariana", category: "Rideaux Métalliques", image: "/images/realisations/rideaux-metalliques.jpeg" },
  { title: "", category: "Store Invisible", image: "/images/realisations/store-invisible.jpeg" },
  { title: "", category: "Porte Coulissante", image: "/images/realisations/porte-coulissante.jpeg" },
  { title: "", category: "Porte Basculante", image: "/images/realisations/porte-basculante.jpeg" },
  { title: "", category: "Store Bras Invisible", image: "/images/realisations/store-bras-invisible.jpeg" },
  { title: "", category: "Rideau Haute Sécurité", image: "/images/realisations/moteur.jpeg" }
];
