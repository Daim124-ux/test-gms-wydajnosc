'use client';

import {
  ArrowLeft,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Expand,
  Headphones,
  Info,
  Layers3,
  Maximize2,
  Minimize2,
  Rotate3D,
  ScanLine,
  Share2,
  ShoppingBag,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ARModal } from './ARModal';
import styles from './CustomerConfigurator.module.css';
import { Scene3D } from './Scene3D';

type SelectionState = Record<string, string[]>;

interface Option {
  id: string;
  label: string;
  detail: string;
  price: number;
  color?: string;
}

interface Field {
  id: string;
  label: string;
  type: 'cards' | 'swatches' | 'multi';
  modelTarget: string;
  options: Option[];
}

interface Step {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  fields: Field[];
}

const BASE_PRICE = 18400;

const steps: Step[] = [
  {
    id: 'dimensions',
    eyebrow: 'Krok 01',
    title: 'Wymiary i pojemność',
    description: 'Dobierz wielkość altany do liczby pojemników i dostępnej przestrzeni.',
    fields: [
      {
        id: 'capacity',
        label: 'Liczba pojemników 1100 l',
        type: 'cards',
        modelTarget: 'konstrukcja, frame, steel, kolor',
        options: [
          { id: 'cap-4', label: '4 pojemniki', detail: '4070 × 2370 mm', price: 0 },
          { id: 'cap-5', label: '5 pojemników', detail: '5070 × 2370 mm', price: 2100 },
          { id: 'cap-6', label: '6 pojemników', detail: '6070 × 2370 mm', price: 3900 },
        ],
      },
      {
        id: 'height',
        label: 'Wysokość konstrukcji',
        type: 'cards',
        modelTarget: 'konstrukcja, frame, steel',
        options: [
          { id: 'height-2200', label: '2200 mm', detail: 'Standardowa', price: 0 },
          { id: 'height-2400', label: '2400 mm', detail: 'Podwyższona', price: 980 },
        ],
      },
    ],
  },
  {
    id: 'finish',
    eyebrow: 'Krok 02',
    title: 'Konstrukcja i kolor',
    description: 'Wybierz charakter wypełnienia oraz wykończenie stalowej konstrukcji.',
    fields: [
      {
        id: 'filling',
        label: 'Wypełnienie ścian',
        type: 'cards',
        modelTarget: 'wall, panel, wypelnienie, sciana',
        options: [
          { id: 'fill-a', label: 'GMS-A', detail: 'Ażurowe pionowe', price: 0 },
          { id: 'fill-b', label: 'GMS-B', detail: 'Pełne panelowe', price: 1350 },
          { id: 'fill-c', label: 'GMS-C', detail: 'Żaluzjowe', price: 2200 },
        ],
      },
      {
        id: 'frame-color',
        label: 'Kolor konstrukcji',
        type: 'swatches',
        modelTarget: 'konstrukcja, kolor, frame, steel, ral6020',
        options: [
          { id: 'ral-7016', label: 'RAL 7016', detail: 'Antracyt', color: '#383e42', price: 0 },
          { id: 'ral-9005', label: 'RAL 9005', detail: 'Czarny', color: '#0b0b0c', price: 0 },
          { id: 'ral-7035', label: 'RAL 7035', detail: 'Jasnoszary', color: '#c6c8c5', price: 640 },
          { id: 'ral-custom', label: 'Dowolny RAL', detail: 'Na zamówienie', color: '#8e4b35', price: 1200 },
        ],
      },
    ],
  },
  {
    id: 'access',
    eyebrow: 'Krok 03',
    title: 'Dostęp i bezpieczeństwo',
    description: 'Dopasuj wejście oraz zabezpieczenia do sposobu użytkowania obiektu.',
    fields: [
      {
        id: 'door',
        label: 'Rodzaj drzwi',
        type: 'cards',
        modelTarget: 'door, drzwi, brama',
        options: [
          { id: 'door-single', label: 'Jednoskrzydłowe', detail: 'Szerokość 1200 mm', price: 0 },
          { id: 'door-double', label: 'Dwuskrzydłowe', detail: 'Szerokość 2200 mm', price: 1900 },
          { id: 'door-sliding', label: 'Przesuwne', detail: 'Oszczędność miejsca', price: 3400 },
        ],
      },
      {
        id: 'accessories',
        label: 'Akcesoria',
        type: 'multi',
        modelTarget: 'lock, zamek, closer, samozamykacz, access',
        options: [
          { id: 'lock', label: 'Zamek na wkładkę', detail: 'Komplet z 3 kluczami', price: 260 },
          { id: 'closer', label: 'Samozamykacz', detail: 'Regulowana siła', price: 480 },
          { id: 'access-control', label: 'Kontrola dostępu', detail: 'Czytnik i elektrozaczep', price: 1850 },
        ],
      },
    ],
  },
  {
    id: 'roof',
    eyebrow: 'Krok 04',
    title: 'Dach i wyposażenie',
    description: 'Wybierz wariant zadaszenia i zamknij konfigurację.',
    fields: [
      {
        id: 'roof-type',
        label: 'Rodzaj dachu',
        type: 'cards',
        modelTarget: 'roof, dach, greenroof',
        options: [
          { id: 'roof-steel', label: 'Dach stalowy', detail: 'Trwały i bezobsługowy', price: 0 },
          { id: 'roof-green', label: 'Zielony dach', detail: 'Mata rozchodnikowa', price: 7600 },
        ],
      },
      {
        id: 'roof-extras',
        label: 'Dodatkowe wyposażenie',
        type: 'multi',
        modelTarget: 'gutter, rynna, lighting, led',
        options: [
          { id: 'gutter', label: 'System rynnowy', detail: 'Rynna i rura spustowa', price: 680 },
          { id: 'lighting', label: 'Oświetlenie LED', detail: 'Czujnik zmierzchu', price: 1250 },
        ],
      },
    ],
  },
];

const initialSelections: SelectionState = Object.fromEntries(
  steps.flatMap((step) => step.fields.map((field) => [field.id, field.type === 'multi' ? [] : [field.options[0].id]])),
);

const formatPrice = (price: number) => new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
}).format(price);

export function Configurator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<SelectionState>(initialSelections);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredTarget, setHoveredTarget] = useState('');
  const [notice, setNotice] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStep];
  const selectedColor = steps[1].fields[1].options.find((option) => selections['frame-color']?.includes(option.id))?.color ?? '#383e42';
  const totalPrice = useMemo(() => BASE_PRICE + steps.flatMap((step) => step.fields).reduce((sum, field) => {
    const selected = selections[field.id] ?? [];
    return sum + field.options.filter((option) => selected.includes(option.id)).reduce((optionSum, option) => optionSum + option.price, 0);
  }, 0), [selections]);

  useEffect(() => {
    document.body.classList.add('gms-configurator-active');
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => {
      document.body.classList.remove('gms-configurator-active');
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  const toggleSelection = (field: Field, optionId: string) => {
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

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await wrapperRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2300);
  };

  const startPresentation = () => {
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 7000);
  };

  return (
    <div ref={wrapperRef} className={`${styles.configurator} ${isFullscreen ? styles.fullscreen : ''}`}>
      {notice && <div className={styles.notice}><Check size={15} />{notice}</div>}

      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <button type="button" aria-label="Wróć do produktu"><ArrowLeft size={18} /></button>
          <div><span>Konfigurujesz</span><strong>Altana śmietnikowa Maxi</strong></div>
        </div>
        <div className={styles.stepIndicator}>
          {steps.map((step, index) => <button type="button" key={step.id} className={index === currentStep ? styles.stepActive : index < currentStep ? styles.stepDone : ''} onClick={() => setCurrentStep(index)}><span>{index < currentStep ? <Check size={12} /> : index + 1}</span><b>{step.title}</b></button>)}
        </div>
        <div className={styles.topActions}>
          <button type="button" onClick={() => showNotice('Link do konfiguracji skopiowany')}><Share2 size={17} /><span>Udostępnij</span></button>
          <button type="button" onClick={() => showNotice('Przywrócono wybory początkowe')}><Undo2 size={17} /></button>
          <button type="button" onClick={toggleFullscreen}>{isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
        </div>
      </header>

      <main className={styles.mainLayout}>
        <section className={styles.sceneArea}>
          <div className={styles.sceneBackdrop}>
            <Scene3D colorHex={selectedColor} isAnimating={isAnimating} highlightedTarget={hoveredTarget} />
            <div className={styles.sceneLabel}><span>Interaktywny model 3D</span><small>Kolor i wariant aktualizują się na żywo</small></div>
            <div className={styles.sceneHint}><Rotate3D size={15} /><span>Przeciągnij, aby obrócić · przewiń, aby przybliżyć</span></div>
          </div>

          <div className={styles.sceneTools}>
            <button type="button" onClick={() => setIsAROpen(true)}><ScanLine size={18} /><span>Postaw u siebie</span></button>
            <button type="button" onClick={startPresentation}><Sparkles size={18} /><span>Prezentacja</span></button>
            <button type="button" onClick={() => setCurrentStep(1)}><Layers3 size={18} /><span>Materiały</span></button>
            <button type="button" onClick={toggleFullscreen}><Expand size={18} /><span>Pełny ekran</span></button>
          </div>

          <div className={styles.dimensionBadge}>
            <Box size={16} />
            <div><span>Aktualny gabaryt</span><strong>{selections.capacity?.[0] === 'cap-6' ? '6070' : selections.capacity?.[0] === 'cap-5' ? '5070' : '4070'} × 2370 × {selections.height?.[0] === 'height-2400' ? '2400' : '2200'} mm</strong></div>
          </div>
        </section>

        <aside className={styles.configPanel}>
          <div className={styles.panelScroll}>
            <div className={styles.panelHeading}>
              <span>{activeStep.eyebrow}</span>
              <h1>{activeStep.title}</h1>
              <p>{activeStep.description}</p>
              <div className={styles.mobileProgress}><i style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
            </div>

            <div className={styles.fields}>
              {activeStep.fields.map((field) => (
                <div className={styles.field} key={field.id}>
                  <div className={styles.fieldLabel}><label>{field.label}</label><button type="button" aria-label={`Informacje: ${field.label}`}><Info size={13} /></button></div>
                  <div className={`${styles.optionGrid} ${field.type === 'swatches' ? styles.swatchGrid : ''}`}>
                    {field.options.map((option) => {
                      const selected = selections[field.id]?.includes(option.id);
                      return (
                        <button
                          type="button"
                          key={option.id}
                          className={selected ? styles.optionSelected : ''}
                          onClick={() => toggleSelection(field, option.id)}
                          onMouseEnter={() => setHoveredTarget(field.modelTarget)}
                          onMouseLeave={() => setHoveredTarget('')}
                          onFocus={() => setHoveredTarget(field.modelTarget)}
                          onBlur={() => setHoveredTarget('')}
                        >
                          {field.type === 'swatches' && <i className={styles.colorSwatch} style={{ background: option.color }} />}
                          <span><strong>{option.label}</strong><small>{option.detail}</small>{option.price > 0 && <em>+{formatPrice(option.price)}</em>}</span>
                          <i className={styles.checkmark}>{selected && <Check size={13} />}</i>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.summary}>
            <div className={styles.priceRow}><span>Cena Twojej konfiguracji<small>brutto · transport i montaż osobno</small></span><strong>{formatPrice(totalPrice)}</strong></div>
            <div className={styles.navigationButtons}>
              <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}><ChevronLeft size={17} />Wstecz</button>
              <button type="button" onClick={() => currentStep === steps.length - 1 ? showNotice('Konfiguracja dodana do koszyka') : setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}>
                {currentStep === steps.length - 1 ? <><ShoppingBag size={17} />Dodaj do koszyka</> : <>Dalej<ChevronRight size={17} /></>}
              </button>
            </div>
            <button type="button" className={styles.helpLink}><Headphones size={15} /><span>Potrzebujesz pomocy? <b>Porozmawiaj z doradcą</b></span><ChevronRight size={14} /></button>
          </div>
        </aside>
      </main>

      <button type="button" className={styles.floatingHelp}><CircleHelp size={18} /><span>Pomoc</span></button>
      <ARModal isOpen={isAROpen} onClose={() => setIsAROpen(false)} />
    </div>
  );
}
