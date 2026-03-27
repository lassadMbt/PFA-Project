/**
 * src/admin/AdminPanel.tsx
 *
 * Full admin panel for PFA v2.
 * Key differences vs v1:
 *  - Products have `images: string[]` (multiple images, feeds ImageCarousel)
 *  - Products have optional `warranty` field
 *  - Image manager per product: add/remove/reorder multiple images
 *  - Live carousel preview in the editor
 */

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  Building2,
  ImageIcon,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  ChevronLeft,
  GripVertical,
  Star,
  Users,
} from "lucide-react";
import { AuthProvider, useAuth } from "./AuthContext";
import {
  fetchAllProducts,
  fetchAllProjects,
  fetchCompanyInfo,
  upsertProduct,
  deleteProduct,
  reorderProducts,
  upsertProject,
  deleteProject,
  fetchAllPartners,
  upsertPartner,
  deletePartner,
  updateCompanyInfo,
  uploadImage,
  fetchSiteStats,
} from "./adminService";
import type {
  Product,
  Project,
  CompanyInfo,
  Partner,
} from "../../lib/supabase";

// ─── Tiny helpers ─────────────────────────────────────────────

const Spinner: React.FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => (
  <Loader2
    className={`animate-spin text-gray-600 ${size === "sm" ? "w-4 h-4" : "w-6 h-6"}`}
  />
);

const Toast: React.FC<{
  message: string;
  type: "success" | "error";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white font-semibold text-sm animate-slide-up ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}> = ({ label, value, onChange, placeholder, multiline, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none bg-white"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
      />
    )}
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

const TagList: React.FC<{
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}> = ({ items, onChange, placeholder = "Ajouter (Entrée)..." }) => {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full"
          >
            {item}
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="ml-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={add}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Multi-Image Manager ──────────────────────────────────────
// Handles the `images: string[]` array — add, remove, reorder, preview

const ImageManager: React.FC<{
  images: string[];
  onChange: (images: string[]) => void;
  folder?: "products" | "projects";
}> = ({ images, onChange, folder = "products" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(0);

  // Keep preview index in bounds
  useEffect(() => {
    if (preview >= images.length) setPreview(Math.max(0, images.length - 1));
  }, [images.length]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, folder)));
      onChange([...images, ...urls]);
    } catch {
      alert("Échec upload. Vérifiez les permissions Supabase Storage.");
    } finally {
      setUploading(false);
    }
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const remove = (i: number) => onChange(images.filter((_, j) => j !== i));

  const moveLeft = (i: number) => {
    if (i === 0) return;
    const arr = [...images];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onChange(arr);
  };
  const moveRight = (i: number) => {
    if (i === images.length - 1) return;
    const arr = [...images];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
        Images du produit{" "}
        <span className="text-slate-400 font-normal normal-case">
          ({images.length} image{images.length !== 1 ? "s" : ""})
        </span>
      </label>

      {/* Carousel preview */}
      {images.length > 0 && (
        <div
          className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
          style={{ height: 200 }}
        >
          <img
            src={images[preview]}
            alt={`preview ${preview + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23e2e8f0"><rect width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%2394a3b8" font-size="12">Image introuvable</text></svg>';
            }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setPreview((p) => (p - 1 + images.length) % images.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => setPreview((p) => (p + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPreview(i)}
                    className={`rounded-full transition-all ${i === preview ? "w-4 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {preview + 1}/{images.length}
          </div>
        </div>
      )}

      {/* Thumbnail strip with controls */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === preview ? "border-gray-700" : "border-slate-200 hover:border-gray-400"}`}
              onClick={() => setPreview(i)}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.background = "#e2e8f0";
                }}
              />
              {/* First image badge */}
              {i === 0 && (
                <div className="absolute top-0.5 left-0.5 bg-gray-800 text-white text-[9px] font-bold px-1 rounded">
                  1ère
                </div>
              )}
              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLeft(i);
                  }}
                  disabled={i === 0}
                  className="p-0.5 bg-white/80 rounded text-gray-700 disabled:opacity-30 hover:bg-white text-xs"
                >
                  ◀
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(i);
                  }}
                  className="p-0.5 bg-red-500 rounded text-white hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveRight(i);
                  }}
                  disabled={i === images.length - 1}
                  className="p-0.5 bg-white/80 rounded text-gray-700 disabled:opacity-30 hover:bg-white text-xs"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add images */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-gray-500 hover:bg-gray-50 transition-all rounded-xl py-3 text-slate-500 text-sm font-medium disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Spinner size="sm" /> Upload...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" /> Uploader
            </>
          )}
        </button>
        <div className="flex gap-1">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addUrl())
            }
            placeholder="/images/photo.jpeg"
            className="flex-1 min-w-0 border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            onClick={addUrl}
            className="bg-gray-800 text-white px-2 rounded-lg text-xs font-bold hover:bg-gray-700"
          >
            OK
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <p className="text-xs text-slate-400">
        La 1ère image est affichée en premier dans le carrousel. Réorganisez
        avec ◀ ▶.
      </p>
    </div>
  );
};

// ─── Single image upload (for projects) ──────────────────────

const SingleImageUpload: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
}> = ({ value, onChange, label = "Image" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file, "projects"));
    } catch {
      alert("Échec upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      {value && (
        <div
          className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100"
          style={{ height: 180 }}
        >
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" fill="%23e2e8f0"><rect width="200" height="180"/><text x="50%" y="50%" text-anchor="middle" fill="%2394a3b8" font-size="13">Introuvable</text></svg>';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200"
            >
              Changer
            </button>
            <button
              onClick={() => onChange("")}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 border-2 border-dashed border-slate-300 hover:border-gray-500 hover:bg-gray-50 transition-all rounded-xl px-4 py-2 text-slate-500 text-sm font-medium disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Spinner size="sm" /> Upload...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" /> Uploader
            </>
          )}
        </button>
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="URL de l'image"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          onClick={() => {
            if (urlInput.trim()) {
              onChange(urlInput.trim());
              setUrlInput("");
            }
          }}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-700"
        >
          OK
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
    <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-5 pb-4 border-b border-slate-100">
      <span className="text-gray-600">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════════

const DashboardPage: React.FC<{
  products: Product[];
  projects: Project[];
  partners: Partner[];
  setPage: (p: string) => void;
}> = ({ products, projects, partners, setPage }) => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<number | null>(null);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteStats()
      .then((s) => {
        setVisits(s.total_visits);
        setLastVisit(s.updated_at);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Produits visibles",
      value: products.filter((p) => p.visible).length,
      total: products.length,
      color: "bg-gray-800",
      icon: <Package className="w-5 h-5" />,
      page: "products",
    },
    {
      label: "Réalisations",
      value: projects.filter((p) => p.visible).length,
      total: projects.length,
      color: "bg-gray-600",
      icon: <ImageIcon className="w-5 h-5" />,
      page: "portfolio",
    },
    {
      label: "Partenaires",
      value: partners.filter((p) => p.visible).length,
      total: partners.length,
      color: "bg-blue-600",
      icon: <Star className="w-5 h-5" />,
      page: "partners",
    }, // ← add this
    {
      label: "Infos société",
      value: 1,
      total: 1,
      color: "bg-emerald-600",
      icon: <Building2 className="w-5 h-5" />,
      page: "company",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
        Tableau de bord
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        Connecté :{" "}
        <span className="font-semibold text-slate-700">{user?.email}</span>
      </p>

      {/* Visit counter card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 mb-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">
              Visiteurs du site
            </p>
            <div className="text-5xl font-extrabold tracking-tight">
              {visits === null ? (
                <span className="text-gray-500 text-3xl">Chargement...</span>
              ) : (
                visits.toLocaleString("fr-FR")
              )}
            </div>
            {lastVisit && (
              <p className="text-gray-400 text-xs mt-2">
                Dernière visite : {new Date(lastVisit).toLocaleString("fr-FR")}
              </p>
            )}
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Existing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => setPage(c.page)}
            className="group text-left bg-white border-2 border-slate-100 hover:border-gray-300 rounded-2xl p-6 transition-all hover:shadow-lg"
          >
            <div
              className={`w-12 h-12 ${c.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              {c.icon}
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {c.value}
              <span className="text-slate-300 text-lg font-bold">
                /{c.total}
              </span>
            </div>
            <div className="text-slate-500 text-sm font-semibold mt-1">
              {c.label}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Notes importantes</h3>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{" "}
            Les modifications sont <strong>immédiatement visibles</strong> par
            tous les visiteurs du site.
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{" "}
            Chaque produit peut avoir <strong>plusieurs images</strong>{" "}
            (carrousel automatique).
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{" "}
            Les images uploadées sont stockées dans{" "}
            <strong>Supabase Storage</strong>.
          </p>
          <p className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />{" "}
            Ne partagez jamais l'URL de ce panneau admin.
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  PAGE: PRODUCTS
// ═══════════════════════════════════════════════════════════════

const blankProduct = (order: number): Product => ({
  id: `prod-${Date.now()}`,
  title: "",
  subtitle: "",
  description: "",
  features: [],
  innovations: [],
  images: [],
  warranty: undefined,
  visible: true,
  sort_order: order,
});

const ProductEditor: React.FC<{
  product: Product;
  onSave: (p: Product) => Promise<void>;
  onCancel: () => void;
}> = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState<Product>({ ...product });
  const [saving, setSaving] = useState(false);
  const set = (key: keyof Product, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Le titre est obligatoire.");
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-900 p-1"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {product.title || "Nouveau produit"}
          </h2>
          <p className="text-slate-500 text-sm">
            Modifier les informations du produit
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: text fields */}
        <div className="space-y-5">
          <Field
            label="Titre *"
            value={form.title}
            onChange={(v) => set("title", v)}
            placeholder="Rideaux Métalliques Premium"
          />
          <Field
            label="Sous-titre"
            value={form.subtitle}
            onChange={(v) => set("subtitle", v)}
            placeholder="Technologie Silencieuse & Sécurité Maximale"
          />
          <Field
            label="Description"
            value={form.description}
            onChange={(v) => set("description", v)}
            multiline
            placeholder="Description du produit..."
          />
          <Field
            label="Garantie (optionnel)"
            value={form.warranty || ""}
            onChange={(v) => set("warranty", v || null)}
            placeholder="Ex: 3 ans de garantie"
            hint="Laissez vide si aucune garantie à afficher."
          />

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Caractéristiques
            </label>
            <TagList
              items={form.features}
              onChange={(v) => set("features", v)}
              placeholder="Ajouter une caractéristique (Entrée)"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Innovations exclusives (optionnel)
            </label>
            <TagList
              items={form.innovations || []}
              onChange={(v) => set("innovations", v)}
              placeholder="Ajouter une innovation (Entrée)"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="vis"
              checked={form.visible}
              onChange={(e) => set("visible", e.target.checked)}
              className="w-4 h-4 accent-gray-700"
            />
            <label
              htmlFor="vis"
              className="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Afficher ce produit sur le site
            </label>
          </div>

          <Field
            label="ID slug (unique)"
            value={form.id}
            onChange={(v) => set("id", v)}
            hint="Identifiant unique en base de données. Ne pas modifier après création."
          />
        </div>

        {/* Right: image manager */}
        <div>
          <ImageManager
            images={form.images}
            onChange={(v) => set("images", v)}
            folder="products"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg disabled:opacity-60"
        >
          {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}{" "}
          Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl"
        >
          <X className="w-4 h-4" /> Annuler
        </button>
      </div>
    </div>
  );
};

const ProductsPage: React.FC<{
  toast: (msg: string, t?: "success" | "error") => void;
}> = ({ toast }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllProducts()
      .then((p) => {
        setProducts(p);
        setLoading(false);
      })
      .catch(() => {
        toast("Erreur de chargement", "error");
        setLoading(false);
      });
  }, []);

  const save = async (p: Product) => {
    try {
      const saved = await upsertProduct(p);
      setProducts((prev) =>
        prev.find((x) => x.id === saved.id)
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved],
      );
      setEditing(null);
      setCreating(false);
      toast("Produit sauvegardé !");
    } catch {
      toast("Erreur lors de la sauvegarde", "error");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast("Produit supprimé.");
    } catch {
      toast("Erreur suppression", "error");
    }
  };

  const toggleVisible = async (product: Product) => {
    try {
      const updated = await upsertProduct({
        ...product,
        visible: !product.visible,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
    } catch {
      toast("Erreur", "error");
    }
  };

  const move = async (id: string, dir: "up" | "down") => {
    const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((p) => p.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const updates = sorted.map((p, i) => {
      if (i === idx)
        return { id: p.id, sort_order: sorted[swapIdx].sort_order };
      if (i === swapIdx)
        return { id: p.id, sort_order: sorted[idx].sort_order };
      return { id: p.id, sort_order: p.sort_order };
    });
    try {
      await reorderProducts(updates);
      setProducts((prev) =>
        prev.map((p) => {
          const u = updates.find((x) => x.id === p.id);
          return u ? { ...p, sort_order: u.sort_order } : p;
        }),
      );
    } catch {
      toast("Erreur réorganisation", "error");
    }
  };

  if (editing || creating) {
    return (
      <ProductEditor
        product={editing || blankProduct(products.length)}
        onSave={save}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  const sorted = [...products].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Produits</h2>
          <p className="text-slate-500 text-sm mt-1">
            {products.length} produit(s) — utilisez ▲▼ pour réordonner
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((product, idx) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 bg-white border-2 rounded-2xl p-4 transition-all ${product.visible ? "border-slate-100 hover:border-gray-300" : "border-dashed border-slate-200 opacity-60"}`}
            >
              {/* Order */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(product.id, "up")}
                  disabled={idx === 0}
                  className="p-1 text-slate-300 hover:text-slate-700 disabled:opacity-20 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(product.id, "down")}
                  disabled={idx === sorted.length - 1}
                  className="p-1 text-slate-300 hover:text-slate-700 disabled:opacity-20 text-xs"
                >
                  ▼
                </button>
              </div>
              {/* First image thumbnail */}
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">
                  {product.title || (
                    <span className="text-slate-400 italic">Sans titre</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {product.subtitle}
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {product.images?.length || 0} image(s)
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {product.features?.length || 0} caractéristiques
                  </span>
                  {product.warranty && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {product.warranty}
                    </span>
                  )}
                  {!product.visible && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      Masqué
                    </span>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisible(product)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  {product.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditing(product)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 hover:text-gray-700"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => del(product.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════
//  PAGE: PORTFOLIO
// ═══════════════════════════════════════════════════════════════

// ── NEW: standalone editor component (fixes the illegal useState hook) ──
const ProjectEditor: React.FC<{
  project: Project;
  onSave: (p: Project) => Promise<void>;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [form, setForm] = useState<Project>({ ...project });
  const set = (k: keyof Project, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-900 p-1"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-900">
          {form.title || "Nouvelle réalisation"}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field
            label="Titre (optionnel)"
            value={form.title}
            onChange={(v) => set("title", v)}
          />
          <Field
            label="Catégorie *"
            value={form.category}
            onChange={(v) => set("category", v)}
            placeholder="Ex: Rideaux Métalliques"
          />
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="pvis"
              checked={form.visible}
              onChange={(e) => set("visible", e.target.checked)}
              className="w-4 h-4 accent-gray-700"
            />
            <label
              htmlFor="pvis"
              className="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Afficher sur le site
            </label>
          </div>
        </div>
        <SingleImageUpload
          value={form.image_url}
          onChange={(v) => set("image_url", v)}
          label="Photo de la réalisation"
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl"
        >
          <X className="w-4 h-4" /> Annuler
        </button>
      </div>
    </div>
  );
};

// ── PortfolioPage (cleaned up) ──
const PortfolioPage: React.FC<{
  toast: (msg: string, t?: "success" | "error") => void;
}> = ({ toast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllProjects()
      .then((p) => {
        setProjects(p);
        setLoading(false);
      })
      .catch(() => {
        toast("Erreur chargement", "error");
        setLoading(false);
      });
  }, []);

  const blank: Project = {
    id: `proj-${Date.now()}`,
    title: "",
    category: "",
    image_url: "",
    visible: true,
    sort_order: projects.length,
  };
  const current = editingId
    ? projects.find((p) => p.id === editingId) || blank
    : blank;

  const save = async (p: Project) => {
    try {
      const saved = await upsertProject(p);
      setProjects((prev) =>
        prev.find((x) => x.id === saved.id)
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved],
      );
      setEditingId(null);
      setCreating(false);
      toast("Réalisation sauvegardée !");
    } catch {
      toast("Erreur sauvegarde", "error");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette réalisation ?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast("Supprimé.");
    } catch {
      toast("Erreur", "error");
    }
  };

  const toggleVisible = async (p: Project) => {
    try {
      const updated = await upsertProject({ ...p, visible: !p.visible });
      setProjects((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x)),
      );
    } catch {
      toast("Erreur", "error");
    }
  };

  if (editingId || creating) {
    return (
      <ProjectEditor
        project={current}
        onSave={save}
        onCancel={() => {
          setEditingId(null);
          setCreating(false);
        }}
      />
    );
  }

  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Réalisations
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {projects.length} réalisation(s)
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4" /> Nouvelle réalisation
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((proj) => (
            <div
              key={proj.id}
              className={`group relative rounded-2xl overflow-hidden border-2 aspect-[4/3] ${proj.visible ? "border-slate-100" : "border-dashed border-slate-300 opacity-60"}`}
            >
              {proj.image_url ? (
                <img
                  src={proj.image_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => toggleVisible(proj)}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40"
                  >
                    {proj.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingId(proj.id)}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-gray-600"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => del(proj.id)}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {proj.category}
                  </span>
                  {proj.title && (
                    <div className="text-white font-bold text-sm">
                      {proj.title}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  PAGE: COMPANY
// ═══════════════════════════════════════════════════════════════

const CompanyPage: React.FC<{
  toast: (msg: string, t?: "success" | "error") => void;
}> = ({ toast }) => {
  const [form, setForm] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof CompanyInfo, v: any) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  useEffect(() => {
    fetchCompanyInfo()
      .then((c) => {
        setForm(c);
        setLoading(false);
      })
      .catch(() => {
        toast("Erreur chargement", "error");
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      setForm(await updateCompanyInfo(form));
      toast("Informations sauvegardées !");
    } catch {
      toast("Erreur sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Informations de la Société
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Modifications visibles immédiatement sur le site
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg disabled:opacity-60"
        >
          {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}{" "}
          Sauvegarder
        </button>
      </div>

      <div className="space-y-6">
        <Section title="Coordonnées" icon={<Building2 className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Nom complet"
              value={form.name}
              onChange={(v) => set("name", v)}
            />
            <Field
              label="Nom court"
              value={form.short_name}
              onChange={(v) => set("short_name", v)}
            />
            <div className="md:col-span-2">
              <Field
                label="Adresse"
                value={form.address}
                onChange={(v) => set("address", v)}
              />
            </div>
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => set("email", v)}
            />
            <Field
              label="Années d'expérience"
              value={form.years_experience}
              onChange={(v) => set("years_experience", v)}
              placeholder="4+"
            />
          </div>
          <div className="mt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Téléphones
            </label>
            <TagList
              items={form.phones}
              onChange={(v) => set("phones", v)}
              placeholder="Ajouter un numéro"
            />
          </div>
        </Section>

        <Section title="Réseaux Sociaux" icon={<Star className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="TikTok (@)"
              value={form.tiktok}
              onChange={(v) => set("tiktok", v)}
            />
            <Field
              label="TikTok (lien)"
              value={form.tiktok_link}
              onChange={(v) => set("tiktok_link", v)}
            />
            <div className="md:col-span-2">
              <Field
                label="Facebook (lien)"
                value={form.facebook}
                onChange={(v) => set("facebook", v)}
              />
            </div>
          </div>
        </Section>

        <Section
          title="Page d'Accueil (Hero)"
          icon={<Package className="w-4 h-4" />}
        >
          <div className="space-y-4">
            <Field
              label="Titre principal"
              value={form.hero_title}
              onChange={(v) => set("hero_title", v)}
            />
            <Field
              label="Sous-titre"
              value={form.hero_subtitle}
              onChange={(v) => set("hero_subtitle", v)}
              multiline
            />
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
                Statistiques affichées
              </label>
              <div className="space-y-3">
                {form.hero_stats.map((s, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input
                      value={s.value}
                      onChange={(e) =>
                        set(
                          "hero_stats",
                          form.hero_stats.map((x, j) =>
                            j === i ? { ...x, value: e.target.value } : x,
                          ),
                        )
                      }
                      placeholder="4+"
                      className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 font-bold"
                    />
                    <input
                      value={s.label}
                      onChange={(e) =>
                        set(
                          "hero_stats",
                          form.hero_stats.map((x, j) =>
                            j === i ? { ...x, label: e.target.value } : x,
                          ),
                        )
                      }
                      placeholder="Ans d'expérience"
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                      onClick={() =>
                        set(
                          "hero_stats",
                          form.hero_stats.filter((_, j) => j !== i),
                        )
                      }
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    set("hero_stats", [
                      ...form.hero_stats,
                      { value: "", label: "" },
                    ])
                  }
                  className="flex items-center gap-1 text-sm text-gray-700 font-semibold hover:text-gray-900"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter une statistique
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Section À Propos"
          icon={<Building2 className="w-4 h-4" />}
        >
          <div className="space-y-4">
            <Field
              label="Premier paragraphe"
              value={form.about_description_1}
              onChange={(v) => set("about_description_1", v)}
              multiline
            />
            <Field
              label="Deuxième paragraphe"
              value={form.about_description_2}
              onChange={(v) => set("about_description_2", v)}
              multiline
            />
          </div>
        </Section>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg disabled:opacity-60"
        >
          {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}{" "}
          Sauvegarder tout
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  PAGE: PARTNERS
// ═══════════════════════════════════════════════════════════════

const PartnerEditor: React.FC<{
  partner: Partner;
  onSave: (p: Partner) => Promise<void>;
  onCancel: () => void;
}> = ({ partner, onSave, onCancel }) => {
  const [form, setForm] = useState<Partner>({ ...partner });
  const set = (k: keyof Partner, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-900 p-1"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-900">
          {form.name || "Nouveau partenaire"}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field
            label="Nom *"
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="Ex: Beninca"
          />
          <Field
            label="ID slug (unique)"
            value={form.id}
            onChange={(v) => set("id", v)}
            hint="Identifiant unique. Ne pas modifier après création."
          />
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="pvis"
              checked={form.visible}
              onChange={(e) => set("visible", e.target.checked)}
              className="w-4 h-4 accent-gray-700"
            />
            <label
              htmlFor="pvis"
              className="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Afficher sur le site
            </label>
          </div>
        </div>
        <SingleImageUpload
          value={form.logo_url}
          onChange={(v) => set("logo_url", v)}
          label="Logo du partenaire"
        />
      </div>
      <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl"
        >
          <X className="w-4 h-4" /> Annuler
        </button>
      </div>
    </div>
  );
};

const PartnersPage: React.FC<{
  toast: (msg: string, t?: "success" | "error") => void;
}> = ({ toast }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllPartners()
      .then((p) => {
        setPartners(p);
        setLoading(false);
      })
      .catch(() => {
        toast("Erreur chargement", "error");
        setLoading(false);
      });
  }, []);

  const blank: Partner = {
    id: `partner-${Date.now()}`,
    name: "",
    logo_url: "",
    visible: true,
    sort_order: partners.length,
  };
  const current = editingId
    ? partners.find((p) => p.id === editingId) || blank
    : blank;

  const save = async (p: Partner) => {
    try {
      const saved = await upsertPartner(p);
      setPartners((prev) =>
        prev.find((x) => x.id === saved.id)
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [...prev, saved],
      );
      setEditingId(null);
      setCreating(false);
      toast("Partenaire sauvegardé !");
    } catch {
      toast("Erreur sauvegarde", "error");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    try {
      await deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      toast("Supprimé.");
    } catch {
      toast("Erreur", "error");
    }
  };

  const toggleVisible = async (p: Partner) => {
    try {
      const updated = await upsertPartner({ ...p, visible: !p.visible });
      setPartners((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x)),
      );
    } catch {
      toast("Erreur", "error");
    }
  };

  if (editingId || creating) {
    return (
      <PartnerEditor
        partner={current}
        onSave={save}
        onCancel={() => {
          setEditingId(null);
          setCreating(false);
        }}
      />
    );
  }

  const sorted = [...partners].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Partenaires
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {partners.length} partenaire(s)
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4" /> Nouveau partenaire
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sorted.map((partner) => (
            <div
              key={partner.id}
              className={`bg-white border-2 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all ${partner.visible ? "border-slate-100 hover:border-gray-300" : "border-dashed border-slate-200 opacity-60"}`}
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="h-16 w-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <span className="text-slate-400 text-xs font-bold">
                    Pas de logo
                  </span>
                </div>
              )}
              <span className="font-bold text-slate-800">{partner.name}</span>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => toggleVisible(partner)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  {partner.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditingId(partner.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 hover:text-gray-700"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => del(partner.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #2d2d2d 0%, #0a0a0a 70%)",
      }}
    >
      <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white mx-auto mb-4 shadow-2xl border border-gray-600">
            P
          </div>
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            PFA Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Accès réservé à l'administrateur
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email administrateur"
              autoFocus
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Mot de passe"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
            />
            <button
              onClick={() => setShowPw((s) => !s)}
              className="text-gray-400 hover:text-white"
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Spinner size="sm" /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </div>
        <p className="text-gray-600 text-xs text-center mt-6">
          Identifiants gérés dans Supabase Authentication
          <br />
          <span className="text-gray-700">
            Dashboard → Authentication → Users
          </span>
        </p>
      </div>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        .animate-shake{animation:shake 0.5s ease-in-out}
        @keyframes slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .animate-slide-up{animation:slide-up 0.3s ease-out}
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN SHELL
// ═══════════════════════════════════════════════════════════════

const AdminPanelInner: React.FC = () => {
  const { session, loading, signOut } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const showToast = (msg: string, type: "success" | "error" = "success") =>
    setToast({ msg, type });

  useEffect(() => {
  if (session) {
    fetchAllProducts().then(setProducts).catch(() => {});
    fetchAllProjects().then(setProjects).catch(() => {});
    fetchAllPartners().then(setPartners).catch(() => {});
  }
}, [session]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (!session) return <LoginScreen />;

  const navItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "products",
      label: "Produits",
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "portfolio",
      label: "Réalisations",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: "partners",
      label: "Partenaires",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "company",
      label: "Société",
      icon: <Building2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-600 rounded-xl flex items-center justify-center font-extrabold text-lg">
              P
            </div>
            <div>
              <div className="font-extrabold text-sm">PFA Admin</div>
              <div className="text-gray-400 text-xs">Panneau de gestion</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${page === item.id ? "bg-gray-700 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {page === "dashboard" && (
            <DashboardPage
              products={products}
              projects={projects}
              partners={partners}
              setPage={setPage}
            />
          )}
          {page === "products" && <ProductsPage toast={showToast} />}
          {page === "portfolio" && <PortfolioPage toast={showToast} />}
          {page === "partners" && <PartnersPage toast={showToast} />}
          {page === "company" && <CompanyPage toast={showToast} />}
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const AdminPanel: React.FC = () => (
  <AuthProvider>
    <AdminPanelInner />
  </AuthProvider>
);

export default AdminPanel;
