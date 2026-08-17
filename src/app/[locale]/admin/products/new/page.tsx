'use client';

import {
  ArrowLeft,
  ArrowRight,
  Box,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CloudUpload,
  Code2,
  Copy,
  Download,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Link2,
  Maximize2,
  Monitor,
  MoreHorizontal,
  MoveDown,
  MoveUp,
  PackageCheck,
  Palette,
  Plus,
  Puzzle,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { ComponentType, CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Scene3D } from '@/components/configurator/Scene3D';
import styles from './ProductStudio.module.css';

type Workspace = 'product' | 'model' | 'options' | 'logic' | 'experience';
type FieldType = 'select' | 'swatches' | 'cards' | 'multi' | 'number' | 'text';
type PreviewDevice = 'desktop' | 'mobile';
type ProductStatus = 'draft' | 'ready' | 'published';
type ProductTemplateId = 'blank' | 'altana-maxi' | 'superstrong-2025';

interface ProductData {
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  basePrice: number;
  tax: string;
  stockMode: string;
  leadTime: string;
}

interface ConfigOption {
  id: string;
  label: string;
  value: string;
  price: number;
  color?: string;
}

interface ConfigField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  help: string;
  options: ConfigOption[];
}

interface ConfigGroup {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  fields: ConfigField[];
}

interface LogicRule {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not-equals';
  optionId: string;
  action: 'show-group' | 'hide-group' | 'set-material' | 'toggle-object' | 'add-price';
  target: string;
}

interface ModelBinding {
  id: string;
  label: string;
  source: string;
  target: string;
  action: string;
  highlight: string;
}

interface ModelFile {
  name: string;
  size: string;
  url: string;
  persistent: boolean;
}

interface ModelViewerProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  src?: string;
  alt?: string;
  poster?: string;
  exposure?: string;
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'shadow-intensity'?: string;
  'environment-image'?: string;
  ar?: boolean;
}

const ModelViewer = 'model-viewer' as unknown as ComponentType<ModelViewerProps>;

interface StoredDraft {
  templateId?: ProductTemplateId;
  product?: ProductData;
  groups?: ConfigGroup[];
  rules?: LogicRule[];
  bindings?: ModelBinding[];
  modelFile?: ModelFile;
}

interface ProductTemplate {
  id: ProductTemplateId;
  label: string;
  description: string;
  product: ProductData;
  groups: ConfigGroup[];
  rules: LogicRule[];
  bindings: ModelBinding[];
  modelFile: ModelFile;
}

const draftKey = (templateId: ProductTemplateId) => `gms-product-studio-draft:${templateId}`;

const readStoredDraft = (templateId: ProductTemplateId): StoredDraft => {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(draftKey(templateId));
  if (!raw) return {};
  try {
    return JSON.parse(raw) as StoredDraft;
  } catch {
    window.localStorage.removeItem(draftKey(templateId));
    return {};
  }
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const formatPrice = (price: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(price);
const clone = <T,>(value: T): T => structuredClone(value);
const buildSelections = (groups: ConfigGroup[]) => Object.fromEntries(groups.flatMap((group) => group.fields.map((field) => [field.id, field.options[0] ? [field.options[0].id] : []])));

const initialProduct: ProductData = {
  name: 'Altana śmietnikowa Maxi',
  slug: 'altana-smietnikowa-maxi',
  sku: 'GMS-ASM-MAXI',
  category: 'Altany śmietnikowe',
  description: 'Modułowa altana o stalowej konstrukcji, przygotowana dla maksymalnie 6 pojemników 1100 l.',
  basePrice: 18400,
  tax: '23% VAT',
  stockMode: 'Na zamówienie',
  leadTime: '4–6 tygodni',
};

const initialGroups: ConfigGroup[] = [
  {
    id: 'dimensions',
    name: 'Wymiary i pojemność',
    eyebrow: 'Krok 01',
    description: 'Dobierz wariant do liczby pojemników i dostępnego miejsca.',
    fields: [
      {
        id: 'capacity',
        label: 'Liczba pojemników 1100 l',
        type: 'cards',
        required: true,
        help: 'Wpływa na długość konstrukcji i cenę bazową.',
        options: [
          { id: 'cap-4', label: '4 pojemniki', value: '4', price: 0 },
          { id: 'cap-5', label: '5 pojemników', value: '5', price: 2100 },
          { id: 'cap-6', label: '6 pojemników', value: '6', price: 3900 },
        ],
      },
      {
        id: 'height',
        label: 'Wysokość konstrukcji',
        type: 'select',
        required: true,
        help: '',
        options: [
          { id: 'height-2200', label: '2200 mm', value: '2200', price: 0 },
          { id: 'height-2400', label: '2400 mm', value: '2400', price: 980 },
        ],
      },
    ],
  },
  {
    id: 'finish',
    name: 'Konstrukcja i kolor',
    eyebrow: 'Krok 02',
    description: 'Materiały, wypełnienie oraz wykończenie proszkowe RAL.',
    fields: [
      {
        id: 'filling',
        label: 'Rodzaj wypełnienia',
        type: 'cards',
        required: true,
        help: 'Wybór jest od razu odwzorowany na modelu 3D.',
        options: [
          { id: 'fill-a', label: 'GMS-A · ażurowe', value: 'GMS-A', price: 0 },
          { id: 'fill-b', label: 'GMS-B · pełne', value: 'GMS-B', price: 1350 },
          { id: 'fill-c', label: 'GMS-C · żaluzjowe', value: 'GMS-C', price: 2200 },
        ],
      },
      {
        id: 'frame-color',
        label: 'Kolor konstrukcji',
        type: 'swatches',
        required: true,
        help: 'Kolory zgodne z paletą RAL.',
        options: [
          { id: 'ral-7016', label: 'RAL 7016', value: '#383e42', color: '#383e42', price: 0 },
          { id: 'ral-9005', label: 'RAL 9005', value: '#0a0a0b', color: '#0a0a0b', price: 0 },
          { id: 'ral-7035', label: 'RAL 7035', value: '#c5c7c4', color: '#c5c7c4', price: 640 },
          { id: 'ral-custom', label: 'Dowolny RAL', value: '#8e4b35', color: '#8e4b35', price: 1200 },
        ],
      },
    ],
  },
  {
    id: 'access',
    name: 'Dostęp i bezpieczeństwo',
    eyebrow: 'Krok 03',
    description: 'Drzwi, zamki i kontrola dostępu do obiektu.',
    fields: [
      {
        id: 'door',
        label: 'Rodzaj drzwi',
        type: 'select',
        required: true,
        help: '',
        options: [
          { id: 'door-single', label: 'Jednoskrzydłowe', value: 'single', price: 0 },
          { id: 'door-double', label: 'Dwuskrzydłowe', value: 'double', price: 1900 },
          { id: 'door-sliding', label: 'Przesuwne', value: 'sliding', price: 3400 },
        ],
      },
      {
        id: 'accessories',
        label: 'Akcesoria',
        type: 'multi',
        required: false,
        help: 'Użytkownik może zaznaczyć kilka pozycji.',
        options: [
          { id: 'lock', label: 'Zamek na wkładkę', value: 'lock', price: 260 },
          { id: 'closer', label: 'Samozamykacz', value: 'closer', price: 480 },
          { id: 'access-control', label: 'Kontrola dostępu', value: 'access-control', price: 1850 },
        ],
      },
    ],
  },
  {
    id: 'roof',
    name: 'Dach i wyposażenie',
    eyebrow: 'Krok 04',
    description: 'Zielony dach, odwodnienie i dodatkowe wyposażenie.',
    fields: [
      {
        id: 'roof-type',
        label: 'Rodzaj dachu',
        type: 'cards',
        required: true,
        help: '',
        options: [
          { id: 'roof-steel', label: 'Stalowy', value: 'steel', price: 0 },
          { id: 'roof-green', label: 'Zielony ekstensywny', value: 'green', price: 7600 },
        ],
      },
    ],
  },
];

const initialRules: LogicRule[] = [
  {
    id: 'rule-green-roof',
    fieldId: 'roof-type',
    operator: 'equals',
    optionId: 'roof-green',
    action: 'toggle-object',
    target: 'GreenRoof_Group → pokaż',
  },
  {
    id: 'rule-sliding-door',
    fieldId: 'door',
    operator: 'equals',
    optionId: 'door-sliding',
    action: 'toggle-object',
    target: 'SlidingDoor_Group → pokaż',
  },
  {
    id: 'rule-color',
    fieldId: 'frame-color',
    operator: 'equals',
    optionId: 'ral-7016',
    action: 'set-material',
    target: 'Steel_Frame → BaseColor',
  },
];

const initialBindings: ModelBinding[] = [
  { id: 'binding-frame', label: 'Kolor konstrukcji', source: 'frame-color', target: 'konstrukcja, kolor, frame, steel, ral6020', action: 'Zmień materiał', highlight: '#1765e8' },
  { id: 'binding-fill', label: 'Wypełnienie ścian', source: 'filling', target: 'Wall_A, Wall_B, Wall_C, panel, sciana', action: 'Przełącz obiekt', highlight: '#1765e8' },
  { id: 'binding-door', label: 'Wariant drzwi', source: 'door', target: 'Door_Single, Door_Double, drzwi, brama', action: 'Przełącz obiekt', highlight: '#1765e8' },
  { id: 'binding-roof', label: 'Zielony dach', source: 'roof-type', target: 'GreenRoof_Group, roof, dach', action: 'Widoczność', highlight: '#1765e8' },
];

const blankTemplate: ProductTemplate = {
  id: 'blank',
  label: 'Pusty konfigurator',
  description: 'Start bez Altany Maxi. Dodajesz produkt, pola, reguły i model od zera.',
  product: {
    name: 'Nowy produkt konfigurowalny',
    slug: 'nowy-produkt',
    sku: 'GMS-NEW',
    category: 'Produkty konfigurowalne',
    description: 'Opis produktu, który zostanie uzupełniony przed publikacją.',
    basePrice: 0,
    tax: '23% VAT',
    stockMode: 'Na zamówienie',
    leadTime: 'Do ustalenia',
  },
  groups: [
    {
      id: 'base',
      name: 'Podstawy konfiguracji',
      eyebrow: 'Krok 01',
      description: 'Dodaj pierwsze pole wyboru klienta.',
      fields: [
        {
          id: 'variant',
          label: 'Wariant produktu',
          type: 'cards',
          required: true,
          help: 'Pierwsze pole startowe, możesz je zmienić lub usunąć.',
          options: [{ id: 'variant-basic', label: 'Wariant bazowy', value: 'basic', price: 0 }],
        },
      ],
    },
  ],
  rules: [],
  bindings: [
    { id: 'binding-base', label: 'Wariant produktu', source: 'variant', target: 'Nazwa_obiektu_z_modelu', action: 'Widoczność', highlight: '#1765e8' },
  ],
  modelFile: { name: 'Brak modelu', size: 'Wgraj GLB / GLTF', url: '/apps/verge-model/wiata_makieta.glb', persistent: true },
};

const superStrongGroups: ConfigGroup[] = [
  {
    id: 'superstrong-structure',
    name: 'Konstrukcja garażu',
    eyebrow: 'Krok 01',
    description: 'Wybór bazowego modułu konstrukcji, analogicznie do osobnych scen Verge3D.',
    fields: [
      {
        id: 'structure-type',
        label: 'Typ konstrukcji',
        type: 'cards',
        required: true,
        help: 'W paczce Verge3D odpowiada plikom konstrukcja.gltf i lekkakonstrukcja.gltf.',
        options: [
          { id: 'structure-heavy', label: 'SuperStrong', value: 'konstrukcja.gltf', price: 0 },
          { id: 'structure-light', label: 'Lekka konstrukcja', value: 'lekkakonstrukcja.gltf', price: -1200 },
        ],
      },
      {
        id: 'mounting',
        label: 'Montaż',
        type: 'cards',
        required: true,
        help: 'Odpowiada sekcji stopy/świdry w puzzlach.',
        options: [
          { id: 'mount-foundation', label: 'Do fundamentu', value: 'fundament', price: 0 },
          { id: 'mount-ground', label: 'Do gruntu', value: 'grunt', price: 640 },
        ],
      },
    ],
  },
  {
    id: 'superstrong-gate',
    name: 'Brama i dostęp',
    eyebrow: 'Krok 02',
    description: 'Reguły pokazują lub ukrywają bramę oraz jej kolorowane elementy.',
    fields: [
      {
        id: 'gate-type',
        label: 'Brama',
        type: 'cards',
        required: true,
        help: 'Verge: pewc_group_36332_36333_brak_bramy / brama_segmentowa.',
        options: [
          { id: 'gate-none', label: 'Brak bramy', value: 'brak_bramy', price: 0 },
          { id: 'gate-sectional', label: 'Brama segmentowa', value: 'brama_segmentowa', price: 3900 },
        ],
      },
      {
        id: 'gate-drive',
        label: 'Sterowanie bramy',
        type: 'select',
        required: false,
        help: 'Pola pod przyszłe sterowanie animacją/automatem.',
        options: [
          { id: 'gate-manual', label: 'Ręczna', value: 'manual', price: 0 },
          { id: 'gate-auto', label: 'Automatyczna', value: 'auto', price: 1800 },
        ],
      },
    ],
  },
  {
    id: 'superstrong-finish',
    name: 'Kolory i materiały',
    eyebrow: 'Krok 03',
    description: 'Materiały z puzzli assignMat: stal, brama, okna i powłoka.',
    fields: [
      {
        id: 'garage-color',
        label: 'Kolor garażu',
        type: 'swatches',
        required: true,
        help: 'Mapowanie na materiały RAL z visual_logic.js.',
        options: [
          { id: 'ral-7016', label: 'RAL 7016', value: '#383e42', color: '#383e42', price: 0 },
          { id: 'ral-8004', label: 'RAL 8004', value: '#8e402a', color: '#8e402a', price: 300 },
          { id: 'ral-8017', label: 'RAL 8017', value: '#452a24', color: '#452a24', price: 300 },
          { id: 'ral-9006', label: 'RAL 9006', value: '#a5a5a5', color: '#a5a5a5', price: 300 },
          { id: 'ral-9010', label: 'RAL 9010', value: '#f1efe7', color: '#f1efe7', price: 300 },
        ],
      },
    ],
  },
  {
    id: 'superstrong-openings',
    name: 'Okna i dodatki',
    eyebrow: 'Krok 04',
    description: 'Warianty okien są dociągane w Verge przez appendScene(okno*.gltf).',
    fields: [
      {
        id: 'window-position',
        label: 'Okno',
        type: 'cards',
        required: false,
        help: 'Odpowiada obiektom Okno 9, Okno 10 i Okno 11 oraz ścianom ukrywanym przy wyborze.',
        options: [
          { id: 'window-none', label: 'Bez okna', value: 'none', price: 0 },
          { id: 'window-9', label: 'Okno pozycja 9', value: 'okno9.gltf', price: 950 },
          { id: 'window-10', label: 'Okno pozycja 10', value: 'okno10.gltf', price: 950 },
          { id: 'window-11', label: 'Okno pozycja 11', value: 'okno11.gltf', price: 950 },
        ],
      },
      {
        id: 'anchors',
        label: 'Kotwienie',
        type: 'multi',
        required: false,
        help: 'Świdry i mocowania w puzzlach są przełączane widocznością.',
        options: [
          { id: 'anchors-ground', label: 'Zestaw kotew do gruntu', value: 'swidry.gltf', price: 720 },
          { id: 'anchors-feet', label: 'Mocowanie 1', value: 'stopy', price: 520 },
        ],
      },
    ],
  },
];

const superStrongRules: LogicRule[] = [
  { id: 'ss-rule-gate-none', fieldId: 'gate-type', operator: 'equals', optionId: 'gate-none', action: 'toggle-object', target: 'Brama, Kolor bramy → ukryj' },
  { id: 'ss-rule-gate-sectional', fieldId: 'gate-type', operator: 'equals', optionId: 'gate-sectional', action: 'toggle-object', target: 'Brama, Kolor bramy → pokaż' },
  { id: 'ss-rule-window-9', fieldId: 'window-position', operator: 'equals', optionId: 'window-9', action: 'toggle-object', target: 'Okno 9, Okno 9 tyl, Okno 9 sciana → pokaż; Sciana 9 → ukryj' },
  { id: 'ss-rule-window-10', fieldId: 'window-position', operator: 'equals', optionId: 'window-10', action: 'toggle-object', target: 'Okno 10, Okno 10 tyl, Okno 10 sciana → pokaż; Sciana 10 → ukryj' },
  { id: 'ss-rule-window-11', fieldId: 'window-position', operator: 'equals', optionId: 'window-11', action: 'toggle-object', target: 'Okno 11, Okno 11 tyl, Okno 11 sciana → pokaż; Sciana 11 → ukryj' },
  { id: 'ss-rule-color', fieldId: 'garage-color', operator: 'equals', optionId: 'ral-7016', action: 'set-material', target: 'Stal / Brama / Okna → RAL7016' },
];

const superStrongBindings: ModelBinding[] = [
  { id: 'ss-binding-structure', label: 'Typ konstrukcji', source: 'structure-type', target: 'Konstrukcja, Lekka konstrukcja, konstrukcja.gltf, lekkakonstrukcja.gltf', action: 'Przełącz scenę', highlight: '#1765e8' },
  { id: 'ss-binding-gate', label: 'Brama', source: 'gate-type', target: 'Brama, Kolor bramy, Kamera_brama', action: 'Widoczność', highlight: '#1765e8' },
  { id: 'ss-binding-color', label: 'Kolor garażu', source: 'garage-color', target: 'Stal, RAL7016, RAL8004, RAL8017, RAL9006, RAL9010', action: 'Zmień materiał', highlight: '#1765e8' },
  { id: 'ss-binding-window', label: 'Okno', source: 'window-position', target: 'Okno 9, Okno 10, Okno 11, Sciana 9, Sciana 10, Sciana 11', action: 'Append / widoczność', highlight: '#1765e8' },
  { id: 'ss-binding-anchors', label: 'Kotwienie', source: 'anchors', target: 'Świdry, Mocowanie 1, Kamera_stopy, Kamera_stopy001', action: 'Widoczność', highlight: '#1765e8' },
];

const productTemplates: ProductTemplate[] = [
  blankTemplate,
  {
    id: 'superstrong-2025',
    label: 'Garaż SuperStrong 2025',
    description: 'Schemat oparty o paczkę Verge3D SuperStrong_2025: appendScene, changeVis, assignMat i ID pól Product Add-Ons.',
    product: {
      name: 'Garaż SuperStrong 2025',
      slug: 'garaz-superstrong-2025',
      sku: 'GMS-SS-2025',
      category: 'Garaże modułowe',
      description: 'Konfigurowalny garaż SuperStrong z bramą, oknami, kotwieniem i kolorami RAL.',
      basePrice: 9500,
      tax: '23% VAT',
      stockMode: 'Na zamówienie',
      leadTime: '4-8 tygodni',
    },
    groups: superStrongGroups,
    rules: superStrongRules,
    bindings: superStrongBindings,
    modelFile: { name: 'SuperStrong_2025.gltf', size: 'Paczka Verge3D', url: '/apps/verge-model/wiata_makieta.glb', persistent: true },
  },
  {
    id: 'altana-maxi',
    label: 'Altana śmietnikowa Maxi',
    description: 'Dotychczasowy szablon altany śmietnikowej.',
    product: initialProduct,
    groups: initialGroups,
    rules: initialRules,
    bindings: initialBindings,
    modelFile: { name: 'wiata_makieta.glb', size: '7,1 MB', url: '/apps/verge-model/wiata_makieta.glb', persistent: true },
  },
];

const getTemplate = (id: string | null): ProductTemplate => productTemplates.find((template) => template.id === id) ?? blankTemplate;

const workspaceItems: Array<{ id: Workspace; label: string; description: string; icon: ComponentType<{ size?: number; strokeWidth?: number }> }> = [
  { id: 'product', label: 'Produkt', description: 'Treść i sprzedaż', icon: PackageCheck },
  { id: 'model', label: 'Model 3D', description: 'Scena i materiały', icon: Box },
  { id: 'options', label: 'Pola i ceny', description: 'Opcje klienta', icon: SlidersIcon },
  { id: 'logic', label: 'Logika', description: 'Reguły i zależności', icon: Puzzle },
  { id: 'experience', label: 'Doświadczenie', description: 'UI i publikacja', icon: Sparkles },
];

function SlidersIcon({ size = 20, strokeWidth = 1.8 }: { size?: number; strokeWidth?: number }) {
  return <Settings2 size={size} strokeWidth={strokeWidth} />;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button type="button" className={`${styles.toggle} ${checked ? styles.toggleActive : ''}`} onClick={() => onChange(!checked)} aria-pressed={checked} aria-label={label}>
      <span />
    </button>
  );
}

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const initialTemplate = useMemo(() => getTemplate(searchParams.get('template')), [searchParams]);
  const [templateId, setTemplateId] = useState<ProductTemplateId>(initialTemplate.id);
  const [initialDraft] = useState<StoredDraft>(() => readStoredDraft(initialTemplate.id));
  const baseTemplate = getTemplate(templateId);
  const [workspace, setWorkspace] = useState<Workspace>('options');
  const [product, setProduct] = useState<ProductData>(() => initialDraft.product ?? clone(initialTemplate.product));
  const [groups, setGroups] = useState<ConfigGroup[]>(() => initialDraft.groups?.length ? initialDraft.groups : clone(initialTemplate.groups));
  const [rules, setRules] = useState<LogicRule[]>(() => initialDraft.rules ?? clone(initialTemplate.rules));
  const [bindings, setBindings] = useState<ModelBinding[]>(() => initialDraft.bindings ?? clone(initialTemplate.bindings));
  const [activeGroupId, setActiveGroupId] = useState(() => initialDraft.groups?.[0]?.id ?? initialTemplate.groups[0]?.id ?? '');
  const [selections, setSelections] = useState<Record<string, string[]>>(() =>
    buildSelections(initialDraft.groups?.length ? initialDraft.groups : initialTemplate.groups),
  );
  const [modelFile, setModelFile] = useState<ModelFile>(() => initialDraft.modelFile ?? clone(initialTemplate.modelFile));
  const [activeBindingId, setActiveBindingId] = useState(() => initialDraft.bindings?.[0]?.id ?? initialTemplate.bindings[0]?.id ?? '');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [savedAt, setSavedAt] = useState('przed chwilą');
  const [notice, setNotice] = useState('');
  const [autoRotate, setAutoRotate] = useState(true);
  const [arEnabled, setArEnabled] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [stickySummary, setStickySummary] = useState(true);
  const [previewStep, setPreviewStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allFields = useMemo(() => groups.flatMap((group) => group.fields), [groups]);
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const currentPreviewGroup = groups[previewStep] ?? groups[0];
  const colorField = allFields.find((field) => ['frame-color', 'garage-color'].includes(field.id));
  const selectedColor = colorField?.options.find((option) => selections[colorField.id]?.includes(option.id))?.color ?? '#383e42';
  const activeBinding = bindings.find((binding) => binding.id === activeBindingId);

  const totalPrice = useMemo(() => {
    return product.basePrice + allFields.reduce((sum, field) => {
      const selected = selections[field.id] ?? [];
      return sum + field.options.filter((option) => selected.includes(option.id)).reduce((optionSum, option) => optionSum + option.price, 0);
    }, 0);
  }, [allFields, product.basePrice, selections]);

  const completion = useMemo(() => {
    const checks = [product.name, product.sku, modelFile.url, groups.length > 0, rules.length > 0];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [groups.length, modelFile.url, product.name, product.sku, rules.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftKey(templateId), JSON.stringify({ templateId, product, groups, rules, bindings, modelFile }));
      setSavedAt(new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [bindings, groups, modelFile, product, rules, templateId]);

  useEffect(() => () => {
    if (!modelFile.persistent && modelFile.url.startsWith('blob:')) URL.revokeObjectURL(modelFile.url);
  }, [modelFile]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const applyTemplate = (nextTemplateId: ProductTemplateId) => {
    const nextTemplate = getTemplate(nextTemplateId);
    setTemplateId(nextTemplate.id);
    setProduct(clone(nextTemplate.product));
    setGroups(clone(nextTemplate.groups));
    setRules(clone(nextTemplate.rules));
    setBindings(clone(nextTemplate.bindings));
    setModelFile(clone(nextTemplate.modelFile));
    setSelections(buildSelections(nextTemplate.groups));
    setActiveGroupId(nextTemplate.groups[0]?.id ?? '');
    setActiveBindingId(nextTemplate.bindings[0]?.id ?? '');
    setPreviewStep(0);
    setWorkspace('product');
    setSavedAt('teraz');
    flash(`Wczytano szablon: ${nextTemplate.label}`);
  };

  const saveDraft = () => {
    window.localStorage.setItem(draftKey(templateId), JSON.stringify({ templateId, product, groups, rules, bindings, modelFile }));
    setStatus('draft');
    setSavedAt('teraz');
    flash('Szkic zapisany');
  };

  const publish = () => {
    setStatus('published');
    flash('Produkt opublikowany w sklepie');
  };

  const handleModelUpload = (file?: File) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['glb', 'gltf'].includes(extension)) {
      flash('Wybierz plik .glb lub .gltf');
      return;
    }
    const url = URL.createObjectURL(file);
    setModelFile({ name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB`, url, persistent: false });
    setWorkspace('model');
    flash('Model wczytany do podglądu');
  };

  const updateGroup = (groupId: string, patch: Partial<ConfigGroup>) => {
    setGroups((current) => current.map((group) => (group.id === groupId ? { ...group, ...patch } : group)));
  };

  const updateField = (groupId: string, fieldId: string, patch: Partial<ConfigField>) => {
    setGroups((current) => current.map((group) => group.id === groupId
      ? { ...group, fields: group.fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field)) }
      : group));
  };

  const updateOption = (groupId: string, fieldId: string, optionId: string, patch: Partial<ConfigOption>) => {
    setGroups((current) => current.map((group) => group.id === groupId
      ? {
          ...group,
          fields: group.fields.map((field) => field.id === fieldId
            ? { ...field, options: field.options.map((option) => (option.id === optionId ? { ...option, ...patch } : option)) }
            : field),
        }
      : group));
  };

  const addGroup = () => {
    const id = createId('group');
    setGroups((current) => [...current, { id, name: 'Nowy krok', eyebrow: `Krok ${String(current.length + 1).padStart(2, '0')}`, description: 'Dodaj krótki opis tego etapu.', fields: [] }]);
    setActiveGroupId(id);
  };

  const addField = () => {
    if (!activeGroup) return;
    const field: ConfigField = {
      id: createId('field'),
      label: 'Nowe pole',
      type: 'select',
      required: false,
      help: '',
      options: [{ id: createId('option'), label: 'Opcja 1', value: 'option-1', price: 0 }],
    };
    updateGroup(activeGroup.id, { fields: [...activeGroup.fields, field] });
  };

  const removeField = (fieldId: string) => {
    if (!activeGroup) return;
    updateGroup(activeGroup.id, { fields: activeGroup.fields.filter((field) => field.id !== fieldId) });
  };

  const addOption = (field: ConfigField) => {
    if (!activeGroup) return;
    updateField(activeGroup.id, field.id, {
      options: [...field.options, { id: createId('option'), label: `Opcja ${field.options.length + 1}`, value: `option-${field.options.length + 1}`, price: 0, color: field.type === 'swatches' ? '#6b7280' : undefined }],
    });
  };

  const moveGroup = (groupId: string, direction: -1 | 1) => {
    setGroups((current) => {
      const index = current.findIndex((group) => group.id === groupId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const addRule = () => {
    const field = allFields[0];
    if (!field) return;
    setRules((current) => [...current, {
      id: createId('rule'),
      fieldId: field.id,
      operator: 'equals',
      optionId: field.options[0]?.id ?? '',
      action: 'show-group',
      target: groups[0]?.name ?? 'Krok konfiguratora',
    }]);
  };

  const addBinding = () => {
    const field = allFields[0];
    const id = createId('binding');
    setBindings((current) => [...current, {
      id,
      label: field?.label ?? 'Nowe powiązanie',
      source: field?.id ?? '',
      target: 'Nazwa_obiektu_z_3ds_max',
      action: 'Widoczność',
      highlight: '#1765e8',
    }]);
    setActiveBindingId(id);
  };

  const updateRule = (ruleId: string, patch: Partial<LogicRule>) => {
    setRules((current) => current.map((rule) => (rule.id === ruleId ? { ...rule, ...patch } : rule)));
  };

  const handleSelection = (field: ConfigField, optionId: string) => {
    setSelections((current) => {
      const selected = current[field.id] ?? [];
      return {
        ...current,
        [field.id]: field.type === 'multi'
          ? selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]
          : [optionId],
      };
    });
  };

  const exportSchema = () => {
    const blob = new Blob([JSON.stringify({ version: 1, templateId, product, model: modelFile, configurator: { groups, rules, bindings } }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.slug || 'produkt'}-configurator.json`;
    link.click();
    URL.revokeObjectURL(url);
    flash('Schemat JSON wyeksportowany');
  };

  return (
    <div className={styles.studio}>
      {notice && <div className={styles.toast}><Check size={16} />{notice}</div>}

      <header className={styles.pageHeader}>
        <div className={styles.headerIdentity}>
          <button type="button" className={styles.iconButton} aria-label="Wróć do produktów"><ArrowLeft size={18} /></button>
          <div>
            <div className={styles.breadcrumb}>Produkty <ChevronRight size={13} /> Nowy produkt</div>
            <div className={styles.titleRow}>
              <h1>{product.name || 'Produkt bez nazwy'}</h1>
              <span className={`${styles.status} ${status === 'published' ? styles.statusLive : ''}`}><span />{status === 'published' ? 'Opublikowany' : 'Szkic'}</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.historyActions}>
            <button type="button" className={styles.iconButton} aria-label="Cofnij"><Undo2 size={17} /></button>
            <button type="button" className={styles.iconButton} aria-label="Ponów"><Redo2 size={17} /></button>
          </div>
          <span className={styles.savedState}><CloudUpload size={15} /> Zapisano {savedAt}</span>
          <button type="button" className={styles.secondaryButton} onClick={saveDraft}><Save size={16} />Zapisz</button>
          <button type="button" className={styles.primaryButton} onClick={publish}><Rocket size={16} />Opublikuj</button>
          <button type="button" className={styles.iconButton} aria-label="Więcej opcji"><MoreHorizontal size={18} /></button>
        </div>
      </header>

      <section className={styles.templateBar} aria-label="Typ konfiguratora">
        <div>
          <span>Typ produktu</span>
          <strong>{baseTemplate.label}</strong>
          <small>{baseTemplate.description}</small>
        </div>
        <div className={styles.templateOptions}>
          {productTemplates.map((template) => (
            <button type="button" key={template.id} className={templateId === template.id ? styles.templateActive : ''} onClick={() => applyTemplate(template.id)}>
              <span>{template.label}</span>
              <small>{template.id === 'superstrong-2025' ? 'Verge3D style' : template.id === 'blank' ? 'Od zera' : 'Szablon'}</small>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.healthBar}>
        <div className={styles.healthScore}><span className={styles.healthRing} style={{ '--progress': `${completion * 3.6}deg` } as CSSProperties}><b>{completion}</b></span><div><strong>Produkt gotowy do sprzedaży</strong><small>Model, ceny i logika są zsynchronizowane</small></div></div>
        <div className={styles.healthItems}>
          <span><Check size={14} /> Model 3D</span>
          <span><Check size={14} /> {allFields.length} pól</span>
          <span><Check size={14} /> {rules.length} reguły</span>
          <button type="button" onClick={() => setWorkspace('experience')}>Sprawdź publikację <ArrowRight size={14} /></button>
        </div>
      </div>

      <nav className={styles.workspaceNav} aria-label="Etapy budowy produktu">
        {workspaceItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button type="button" key={item.id} className={workspace === item.id ? styles.workspaceActive : ''} onClick={() => setWorkspace(item.id)}>
              <span className={styles.workspaceIndex}>{workspace === item.id ? <Icon size={17} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
            </button>
          );
        })}
      </nav>

      <div className={styles.workspaceLayout}>
        <main className={styles.workbench}>
          {workspace === 'product' && (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeading}><div><span>Podstawy</span><h2>Produkt, który rozumie klient.</h2><p>W jednym miejscu zarządzasz treścią, ceną, logistyką i widocznością w sklepie.</p></div><WandSparkles size={30} /></div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><div><span className={styles.cardIcon}><PackageCheck size={18} /></span><div><h3>Informacje o produkcie</h3><p>To zobaczy klient na karcie i w konfiguratorze.</p></div></div><span className={styles.requiredHint}>Pola wymagane</span></div>
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nazwa produktu</span><input value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} /></label>
                  <label><span>SKU</span><input value={product.sku} onChange={(event) => setProduct({ ...product, sku: event.target.value })} /></label>
                  <label><span>Kategoria</span><select value={product.category} onChange={(event) => setProduct({ ...product, category: event.target.value })}><option>Altany śmietnikowe</option><option>Wiaty rowerowe</option><option>Garaże stalowe</option><option>Bramy garażowe</option></select></label>
                  <label className={styles.fieldWide}><span>Adres produktu</span><div className={styles.inputPrefix}><small>gms-system.com/produkt/</small><input value={product.slug} onChange={(event) => setProduct({ ...product, slug: event.target.value })} /></div></label>
                  <label className={styles.fieldWide}><span>Krótki opis</span><textarea rows={4} value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} /></label>
                </div>
              </div>
              <div className={styles.twoCards}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}><div><span className={styles.cardIcon}><CircleDollarSign size={18} /></span><div><h3>Sprzedaż</h3><p>Cena startowa i podatki.</p></div></div></div>
                  <div className={styles.formGridCompact}>
                    <label><span>Cena bazowa</span><div className={styles.priceInput}><input type="number" value={product.basePrice} onChange={(event) => setProduct({ ...product, basePrice: Number(event.target.value) })} /><small>PLN</small></div></label>
                    <label><span>Podatek</span><select value={product.tax} onChange={(event) => setProduct({ ...product, tax: event.target.value })}><option>23% VAT</option><option>8% VAT</option><option>Bez VAT</option></select></label>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHeader}><div><span className={styles.cardIcon}><Boxes size={18} /></span><div><h3>Realizacja</h3><p>Dostępność i termin.</p></div></div></div>
                  <div className={styles.formGridCompact}>
                    <label><span>Dostępność</span><select value={product.stockMode} onChange={(event) => setProduct({ ...product, stockMode: event.target.value })}><option>Na zamówienie</option><option>W magazynie</option><option>Zapytaj o dostępność</option></select></label>
                    <label><span>Czas realizacji</span><input value={product.leadTime} onChange={(event) => setProduct({ ...product, leadTime: event.target.value })} /></label>
                  </div>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><div><span className={styles.cardIcon}><ImageIcon size={18} /></span><div><h3>Media produktu</h3><p>Zdjęcie główne, galeria oraz materiały techniczne.</p></div></div><button type="button" className={styles.textButton}><Plus size={15} />Dodaj z biblioteki</button></div>
                <div className={styles.mediaGrid}>
                  <button type="button" className={styles.mediaFeatured}><ImageIcon size={28} /><strong>Zdjęcie główne</strong><span>Upuść JPG, PNG lub WebP</span></button>
                  <button type="button" className={styles.mediaAdd}><Plus size={22} /><span>Dodaj galerię</span></button>
                  <button type="button" className={styles.mediaAdd}><Upload size={22} /><span>Karta PDF</span></button>
                </div>
              </div>
            </section>
          )}

          {workspace === 'model' && (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeading}><div><span>Scena 3D</span><h2>Model podłączony do produktu.</h2><p>Wgraj GLB lub GLTF, sprawdź scenę i połącz elementy modelu z opcjami klienta.</p></div><Box size={30} /></div>
              <div className={styles.modelStage}>
                <div className={styles.modelToolbar}>
                  <div><span className={styles.liveDot} /> Podgląd na żywo</div>
                  <div><button type="button" onClick={() => setAutoRotate(!autoRotate)}><RotateCcw size={16} />{autoRotate ? 'Autoobrót wł.' : 'Autoobrót wył.'}</button><button type="button"><Maximize2 size={16} /></button></div>
                </div>
                <Scene3D colorHex={selectedColor} modelUrl={modelFile.url} isAnimating={autoRotate} highlightedTarget={activeBinding?.target} />
                <div className={styles.modelMeta}><span><Box size={15} />{modelFile.name}</span><span>{modelFile.size}</span><span>GLB / GLTF</span></div>
              </div>
              <input ref={fileInputRef} type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" hidden onChange={(event) => handleModelUpload(event.target.files?.[0])} />
              <button type="button" className={styles.uploadZone} onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleModelUpload(event.dataTransfer.files?.[0]); }}>
                <span><Upload size={22} /></span><div><strong>Wgraj nową wersję modelu</strong><small>GLB lub GLTF · model zostanie od razu otwarty w podglądzie</small></div><b>Wybierz plik</b>
              </button>
              {templateId === 'superstrong-2025' && (
                <div className={styles.vergeMap}>
                  <div><strong>Wzorzec z SuperStrong_2025</strong><small>C:\Users\admin\Documents\verge3d_apps\SuperStrong_2025</small></div>
                  <div className={styles.vergeMapGrid}>
                    <span><b>Scena bazowa</b><small>SuperStrong_2025.gltf</small></span>
                    <span><b>Konstrukcja</b><small>konstrukcja.gltf / lekkakonstrukcja.gltf</small></span>
                    <span><b>Brama</b><small>brama.gltf · Brama · Kolor bramy</small></span>
                    <span><b>Okna</b><small>okno9.gltf / okno10.gltf / okno11.gltf</small></span>
                    <span><b>Kotwienie</b><small>swidry.gltf · stopydol/gora.gltf</small></span>
                    <span><b>Materiały</b><small>Stal · RAL7016 · RAL8004 · RAL8017 · RAL9006</small></span>
                  </div>
                </div>
              )}
              <div className={styles.card}>
                <div className={styles.cardHeader}><div><span className={styles.cardIcon}><Link2 size={18} /></span><div><h3>Powiązania z konfiguracją</h3><p>Odpowiednik logiki materiałów i obiektów z Verge3D.</p></div></div><button type="button" className={styles.textButton} onClick={addBinding}><Plus size={15} />Dodaj</button></div>
                <div className={styles.bindingHelp}>
                  <strong>Jak mapować model:</strong>
                  <span>Wpisz nazwę grupy, obiektu albo materiału z pliku 3D, np. konstrukcja, Steel_Frame, Door_Single. Kilka celów rozdziel przecinkiem.</span>
                </div>
                <div className={styles.bindingTable}>
                  <div className={styles.bindingHead}><span>Opcja produktu</span><span>Obiekt / materiał w modelu</span><span>Akcja</span><span /></div>
                  {bindings.map((binding) => (
                    <div className={`${styles.bindingRow} ${activeBindingId === binding.id ? styles.bindingRowActive : ''}`} key={binding.id} onMouseEnter={() => setActiveBindingId(binding.id)} onFocus={() => setActiveBindingId(binding.id)}>
                      <select value={binding.source} onChange={(event) => setBindings((current) => current.map((item) => item.id === binding.id ? { ...item, source: event.target.value, label: allFields.find((field) => field.id === event.target.value)?.label ?? item.label } : item))}>{allFields.map((field) => <option value={field.id} key={field.id}>{field.label}</option>)}</select>
                      <input value={binding.target} placeholder="np. konstrukcja, Steel_Frame, Door_Single" onChange={(event) => setBindings((current) => current.map((item) => item.id === binding.id ? { ...item, target: event.target.value } : item))} />
                      <select value={binding.action} onChange={(event) => setBindings((current) => current.map((item) => item.id === binding.id ? { ...item, action: event.target.value } : item))}><option>Zmień materiał</option><option>Przełącz obiekt</option><option>Przełącz scenę</option><option>Append / widoczność</option><option>Widoczność</option><option>Uruchom animację</option></select>
                      <button type="button" onClick={() => setBindings((current) => current.filter((item) => item.id !== binding.id))} aria-label="Usuń powiązanie"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {workspace === 'options' && (
            <section className={styles.optionsBuilder}>
              <div className={styles.sectionHeading}><div><span>Pola i dopłaty</span><h2>Konfigurator bez formularzowego chaosu.</h2><p>Buduj krótkie, zrozumiałe kroki. Każda opcja może zmieniać cenę i model 3D.</p></div><button type="button" className={styles.softButton} onClick={addGroup}><Plus size={16} />Nowy krok</button></div>
              <div className={styles.builderGrid}>
                <aside className={styles.stepsPanel}>
                  <div className={styles.stepsTitle}><span>Ścieżka klienta</span><small>{groups.length} kroki · {allFields.length} pól</small></div>
                  <div className={styles.stepsList}>
                    {groups.map((group, index) => (
                      <button type="button" key={group.id} className={activeGroup?.id === group.id ? styles.stepActive : ''} onClick={() => setActiveGroupId(group.id)}>
                        <GripVertical size={15} /><span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span><span><strong>{group.name}</strong><small>{group.fields.length} {group.fields.length === 1 ? 'pole' : 'pola'}</small></span><ChevronRight size={15} />
                      </button>
                    ))}
                  </div>
                  <button type="button" className={styles.addStepButton} onClick={addGroup}><Plus size={16} />Dodaj kolejny krok</button>
                </aside>

                {activeGroup && (
                  <div className={styles.groupEditor}>
                    <div className={styles.groupEditorHeader}>
                      <div className={styles.groupOrder}><span>{activeGroup.eyebrow}</span><button type="button" onClick={() => moveGroup(activeGroup.id, -1)} aria-label="Przesuń wyżej"><MoveUp size={15} /></button><button type="button" onClick={() => moveGroup(activeGroup.id, 1)} aria-label="Przesuń niżej"><MoveDown size={15} /></button></div>
                      <div className={styles.groupActions}><button type="button" aria-label="Duplikuj krok"><Copy size={16} /></button><button type="button" aria-label="Usuń krok" onClick={() => { setGroups((current) => current.filter((group) => group.id !== activeGroup.id)); setActiveGroupId(groups.find((group) => group.id !== activeGroup.id)?.id ?? ''); }}><Trash2 size={16} /></button></div>
                    </div>
                    <div className={styles.groupIntroFields}>
                      <label><span>Nazwa kroku</span><input value={activeGroup.name} onChange={(event) => updateGroup(activeGroup.id, { name: event.target.value })} /></label>
                      <label><span>Opis dla klienta</span><input value={activeGroup.description} onChange={(event) => updateGroup(activeGroup.id, { description: event.target.value })} /></label>
                    </div>

                    <div className={styles.fieldsList}>
                      {activeGroup.fields.map((field, fieldIndex) => (
                        <article className={styles.fieldCard} key={field.id}>
                          <div className={styles.fieldCardHeader}>
                            <div><GripVertical size={16} /><span>{fieldIndex + 1}</span><input value={field.label} onChange={(event) => updateField(activeGroup.id, field.id, { label: event.target.value })} /></div>
                            <div><select value={field.type} onChange={(event) => updateField(activeGroup.id, field.id, { type: event.target.value as FieldType })}><option value="select">Lista wyboru</option><option value="cards">Karty wizualne</option><option value="swatches">Próbki kolorów</option><option value="multi">Wielokrotny wybór</option><option value="number">Liczba</option><option value="text">Tekst</option></select><button type="button" onClick={() => removeField(field.id)} aria-label="Usuń pole"><Trash2 size={16} /></button></div>
                          </div>
                          <div className={styles.fieldSettings}>
                            <label className={styles.inlineToggle}><Toggle checked={field.required} onChange={(checked) => updateField(activeGroup.id, field.id, { required: checked })} label="Pole wymagane" /><span>Pole wymagane</span></label>
                            <label><span>Podpowiedź</span><input value={field.help} placeholder="Opcjonalna pomoc dla klienta" onChange={(event) => updateField(activeGroup.id, field.id, { help: event.target.value })} /></label>
                          </div>
                          {!['number', 'text'].includes(field.type) && (
                            <div className={styles.optionsTable}>
                              <div className={styles.optionHead}><span>Opcja</span><span>Wartość techniczna</span><span>Dopłata</span><span /></div>
                              {field.options.map((option) => (
                                <div className={styles.optionRow} key={option.id}>
                                  <div className={styles.optionLabel}>{field.type === 'swatches' && <input type="color" value={option.color ?? '#6b7280'} onChange={(event) => updateOption(activeGroup.id, field.id, option.id, { color: event.target.value, value: event.target.value })} />}<input value={option.label} onChange={(event) => updateOption(activeGroup.id, field.id, option.id, { label: event.target.value })} /></div>
                                  <input value={option.value} onChange={(event) => updateOption(activeGroup.id, field.id, option.id, { value: event.target.value })} />
                                  <div className={styles.optionPrice}><span>+</span><input type="number" value={option.price} onChange={(event) => updateOption(activeGroup.id, field.id, option.id, { price: Number(event.target.value) })} /><small>zł</small></div>
                                  <button type="button" onClick={() => updateField(activeGroup.id, field.id, { options: field.options.filter((item) => item.id !== option.id) })} aria-label="Usuń opcję"><X size={15} /></button>
                                </div>
                              ))}
                              <button type="button" className={styles.addOption} onClick={() => addOption(field)}><Plus size={15} />Dodaj opcję</button>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                    <button type="button" className={styles.addFieldButton} onClick={addField}><Plus size={18} /><span><strong>Dodaj pole do tego kroku</strong><small>Lista, próbki, karty, checkboxy lub własna wartość</small></span></button>
                  </div>
                )}
              </div>
            </section>
          )}

          {workspace === 'logic' && (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeading}><div><span>Logika typu puzzle</span><h2>Jeżeli to — wtedy tamto.</h2><p>Reguły sterują widocznością pól, ceną oraz materiałami i obiektami w modelu.</p></div><button type="button" className={styles.softButton} onClick={addRule}><Plus size={16} />Nowa reguła</button></div>
              <div className={styles.logicSummary}>
                <div><Zap size={18} /><span><strong>{rules.length} aktywne reguły</strong><small>Wszystkie zależności są poprawne</small></span></div>
                <button type="button"><Eye size={15} />Testuj scenariusz</button>
              </div>
              <div className={styles.rulesList}>
                {rules.map((rule, index) => {
                  const sourceField = allFields.find((field) => field.id === rule.fieldId) ?? allFields[0];
                  return (
                    <article className={styles.ruleCard} key={rule.id}>
                      <div className={styles.ruleMeta}><span>{String(index + 1).padStart(2, '0')}</span><GripVertical size={17} /></div>
                      <div className={styles.ruleCanvas}>
                        <div className={`${styles.logicBlock} ${styles.ifBlock}`}><b>JEŻELI</b><select value={rule.fieldId} onChange={(event) => { const field = allFields.find((item) => item.id === event.target.value); updateRule(rule.id, { fieldId: event.target.value, optionId: field?.options[0]?.id ?? '' }); }}>{allFields.map((field) => <option value={field.id} key={field.id}>{field.label}</option>)}</select></div>
                        <span className={styles.logicConnector}><i /><ChevronRight size={16} /></span>
                        <div className={`${styles.logicBlock} ${styles.operatorBlock}`}><b>JEST</b><select value={rule.operator} onChange={(event) => updateRule(rule.id, { operator: event.target.value as LogicRule['operator'] })}><option value="equals">równe</option><option value="not-equals">inne niż</option></select></div>
                        <span className={styles.logicConnector}><i /><ChevronRight size={16} /></span>
                        <div className={`${styles.logicBlock} ${styles.valueBlock}`}><b>WARTOŚĆ</b><select value={rule.optionId} onChange={(event) => updateRule(rule.id, { optionId: event.target.value })}>{sourceField?.options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></div>
                        <span className={`${styles.logicConnector} ${styles.connectorAccent}`}><i /><ChevronRight size={16} /></span>
                        <div className={`${styles.logicBlock} ${styles.thenBlock}`}><b>WTEDY</b><select value={rule.action} onChange={(event) => updateRule(rule.id, { action: event.target.value as LogicRule['action'] })}><option value="show-group">Pokaż krok</option><option value="hide-group">Ukryj krok</option><option value="set-material">Zmień materiał</option><option value="toggle-object">Przełącz obiekt 3D</option><option value="add-price">Dodaj do ceny</option></select></div>
                        <span className={styles.logicConnector}><i /><ChevronRight size={16} /></span>
                        <div className={`${styles.logicBlock} ${styles.targetBlock}`}><b>CEL / WARTOŚĆ</b><input value={rule.target} onChange={(event) => updateRule(rule.id, { target: event.target.value })} /></div>
                      </div>
                      <button type="button" className={styles.ruleDelete} onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))} aria-label="Usuń regułę"><Trash2 size={16} /></button>
                    </article>
                  );
                })}
              </div>
              <button type="button" className={styles.addRuleCanvas} onClick={addRule}><Plus size={19} /><span><strong>Dodaj kolejną zależność</strong><small>Możesz łączyć pola, ceny i obiekty modelu</small></span></button>
            </section>
          )}

          {workspace === 'experience' && (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeading}><div><span>Doświadczenie klienta</span><h2>Sklepowe UI gotowe na każdy ekran.</h2><p>Ustal zachowanie konfiguratora, sposób prezentacji ceny i kanały publikacji.</p></div><Sparkles size={30} /></div>
              <div className={styles.experienceGrid}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}><div><span className={styles.cardIcon}><Palette size={18} /></span><div><h3>Wygląd konfiguratora</h3><p>Ustawienia współdzielone przez desktop i mobile.</p></div></div></div>
                  <div className={styles.settingRows}>
                    <div><span><strong>Cena na żywo</strong><small>Aktualizuj podsumowanie po każdym wyborze</small></span><Toggle checked={showPrice} onChange={setShowPrice} label="Cena na żywo" /></div>
                    <div><span><strong>Przyklejone podsumowanie</strong><small>CTA pozostaje dostępne podczas przewijania</small></span><Toggle checked={stickySummary} onChange={setStickySummary} label="Przyklejone podsumowanie" /></div>
                    <div><span><strong>Automatyczny obrót 3D</strong><small>Zatrzymaj po pierwszej interakcji użytkownika</small></span><Toggle checked={autoRotate} onChange={setAutoRotate} label="Automatyczny obrót" /></div>
                    <div><span><strong>Rozszerzona rzeczywistość</strong><small>Przycisk AR na kompatybilnych urządzeniach</small></span><Toggle checked={arEnabled} onChange={setArEnabled} label="Rozszerzona rzeczywistość" /></div>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHeader}><div><span className={styles.cardIcon}><ShieldCheck size={18} /></span><div><h3>Gotowość publikacji</h3><p>Kontrola jakości przed uruchomieniem.</p></div></div></div>
                  <div className={styles.checklist}>
                    <div><Check size={15} /><span><strong>Produkt i cena</strong><small>Komplet danych podstawowych</small></span></div>
                    <div><Check size={15} /><span><strong>Model 3D</strong><small>{modelFile.name} · {modelFile.size}</small></span></div>
                    <div><Check size={15} /><span><strong>Konfigurator</strong><small>{groups.length} kroków, {allFields.length} pól, {rules.length} reguły</small></span></div>
                    <div><Check size={15} /><span><strong>Mobile UX</strong><small>Układ i CTA są responsywne</small></span></div>
                  </div>
                  <button type="button" className={styles.publishWide} onClick={publish}><Rocket size={17} />Opublikuj produkt</button>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><div><span className={styles.cardIcon}><Code2 size={18} /></span><div><h3>Dane i integracje</h3><p>Jeden schemat zamiast rozproszonych ustawień WP, Woo i Verge3D.</p></div></div></div>
                <div className={styles.integrationGrid}>
                  <button type="button" onClick={exportSchema}><span><Download size={19} /></span><strong>Eksportuj schemat JSON</strong><small>Produkt, pola, dopłaty i logika</small></button>
                  <button type="button"><span><Link2 size={19} /></span><strong>Webhook zamówienia</strong><small>Połącz ERP lub CRM</small></button>
                  <button type="button"><span><Boxes size={19} /></span><strong>Mapowanie WooCommerce</strong><small>Import istniejących wariantów</small></button>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <div><span className={styles.liveDot} /><strong>Podgląd klienta</strong></div>
            <div className={styles.deviceSwitch}><button type="button" className={previewDevice === 'desktop' ? styles.deviceActive : ''} onClick={() => setPreviewDevice('desktop')} aria-label="Podgląd desktop"><Monitor size={15} /></button><button type="button" className={previewDevice === 'mobile' ? styles.deviceActive : ''} onClick={() => setPreviewDevice('mobile')} aria-label="Podgląd mobile"><Smartphone size={15} /></button></div>
          </div>
          <div className={`${styles.previewViewport} ${previewDevice === 'mobile' ? styles.previewMobile : ''}`}>
            <div className={styles.previewScene}>
              <Scene3D colorHex={selectedColor} modelUrl={modelFile.url} isAnimating={autoRotate} highlightedTarget={activeBinding?.target} />
              <div className={styles.previewSceneTop}><span>Interaktywny model 3D</span><button type="button"><Maximize2 size={14} /></button></div>
              <div className={styles.previewSceneHint}><RotateCcw size={13} /> Przeciągnij, aby obrócić</div>
              {arEnabled && <ModelViewer className={styles.arBridge} src={modelFile.url} alt={`AR ${product.name}`} ar camera-controls />}
            </div>
            <div className={styles.customerPanel}>
              <div className={styles.customerTop}><div><small>{product.category}</small><h3>{product.name}</h3></div><span>{previewStep + 1}/{groups.length}</span></div>
              <div className={styles.progressTrack}><i style={{ width: `${((previewStep + 1) / Math.max(groups.length, 1)) * 100}%` }} /></div>
              {currentPreviewGroup && (
                <div className={styles.previewOptions}>
                  <span>{currentPreviewGroup.eyebrow}</span>
                  <h4>{currentPreviewGroup.name}</h4>
                  <p>{currentPreviewGroup.description}</p>
                  {currentPreviewGroup.fields.map((field) => (
                    <div className={styles.previewField} key={field.id}>
                      <label>{field.label}{field.required && <b>*</b>}</label>
                      <div className={`${styles.previewChoices} ${field.type === 'swatches' ? styles.previewSwatches : ''}`}>
                        {field.options.map((option) => {
                          const selected = (selections[field.id] ?? []).includes(option.id);
                          return (
                            <button
                              type="button"
                              key={option.id}
                              className={selected ? styles.choiceSelected : ''}
                              onClick={() => handleSelection(field, option.id)}
                              onMouseEnter={() => setActiveBindingId(bindings.find((binding) => binding.source === field.id)?.id ?? activeBindingId)}
                              onFocus={() => setActiveBindingId(bindings.find((binding) => binding.source === field.id)?.id ?? activeBindingId)}
                            >
                              {field.type === 'swatches' && <i style={{ background: option.color }} />}
                              <span>{option.label}<small>{option.price ? `+${formatPrice(option.price)}` : 'W cenie'}</small></span>
                              {selected && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className={`${styles.previewSummary} ${stickySummary ? styles.previewSummarySticky : ''}`}>
                {showPrice && <div><span>Cena konfiguracji<small>brutto · montaż osobno</small></span><strong>{formatPrice(totalPrice)}</strong></div>}
                <div className={styles.previewNavButtons}><button type="button" disabled={previewStep === 0} onClick={() => setPreviewStep((current) => Math.max(0, current - 1))}><ChevronLeft size={16} />Wstecz</button><button type="button" onClick={() => setPreviewStep((current) => Math.min(groups.length - 1, current + 1))}>{previewStep === groups.length - 1 ? 'Do koszyka' : 'Dalej'}<ChevronRight size={16} /></button></div>
              </div>
            </div>
          </div>
          <button type="button" className={styles.openPreview}><Eye size={16} />Otwórz pełny podgląd</button>
        </aside>
      </div>
    </div>
  );
}
