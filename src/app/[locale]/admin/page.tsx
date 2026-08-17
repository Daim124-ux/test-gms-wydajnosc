import Link from 'next/link';
import {
  Box,
  Boxes,
  Braces,
  CheckCircle2,
  CircleDollarSign,
  DatabaseZap,
  Eye,
  GitBranch,
  Package,
  Rocket,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const stats = [
    { label: 'Produkty z konfiguracją', value: '5', icon: Package, change: '3 gotowe' },
    { label: 'Powiązania 3D', value: '18', icon: Box, change: 'model + pola' },
    { label: 'Reguły logiki', value: '12', icon: GitBranch, change: 'bez błędów' },
    { label: 'Zamówienia z konfiguratora', value: '12', icon: ShoppingBag, change: '+2 dziś' },
  ];

  const productFlow = [
    { label: 'Dane produktu', detail: 'Treść, SKU, cena bazowa, podatki', icon: Package },
    { label: 'Pola i dopłaty', detail: 'Wymiary, kolory RAL, akcesoria, dach', icon: SlidersHorizontal },
    { label: 'Model 3D', detail: 'GLB/GLTF, grupy z 3ds Max, materiały', icon: Box },
    { label: 'Logika', detail: 'Jeżeli-to, widoczność obiektów, ceny', icon: Braces },
    { label: 'AR i mobile', detail: 'Podgląd produktu w przestrzeni klienta', icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">GMS Product Command Center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">Produkty, logika i model 3D w jednym miejscu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
            Zamiast rozproszenia między WP, WooCommerce, Product Add-Ons Ultimate i Verge3D, zarządzasz produktem, konfiguracją, powiązaniami modelu i publikacją z jednego panelu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/admin/products/new`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
            <Rocket size={17} /> Otwórz studio produktu
          </Link>
          <Link href={`/${locale}/konfigurator-demo`} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#334155] transition hover:bg-[#F8FAFC]">
            <Eye size={17} /> Podgląd klienta
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF] text-indigo-600">
                <stat.icon size={19} />
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{stat.change}</span>
            </div>
            <h3 className="text-sm font-medium text-[#64748B]">{stat.label}</h3>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Pipeline produktu konfigurowalnego</h2>
              <p className="mt-1 text-xs text-[#64748B]">Ten sam ekran obejmuje produkt, opcje, ceny, logikę, 3D i AR.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Gotowe do publikacji</span>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {productFlow.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm"><item.icon size={17} /></span>
                  <CheckCircle2 className="text-emerald-600" size={17} />
                </div>
                <strong className="block text-xs text-[#0F172A]">{item.label}</strong>
                <small className="mt-1 block text-[11px] leading-4 text-[#64748B]">{item.detail}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A]">Migracja ze starego stacku</h2>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3 rounded-lg bg-[#F8FAFC] p-3">
              <DatabaseZap className="mt-0.5 text-indigo-600" size={18} />
              <div><strong className="text-xs">WooCommerce</strong><p className="mt-1 text-[11px] leading-4 text-[#64748B]">Produkty, ceny bazowe, SKU i status publikacji trafiają do jednego schematu.</p></div>
            </div>
            <div className="flex gap-3 rounded-lg bg-[#F8FAFC] p-3">
              <CircleDollarSign className="mt-0.5 text-indigo-600" size={18} />
              <div><strong className="text-xs">Product Add-Ons Ultimate</strong><p className="mt-1 text-[11px] leading-4 text-[#64748B]">Pola, dopłaty i zależności są edytowane wizualnie w studio.</p></div>
            </div>
            <div className="flex gap-3 rounded-lg bg-[#F8FAFC] p-3">
              <Boxes className="mt-0.5 text-indigo-600" size={18} />
              <div><strong className="text-xs">Verge3D / 3ds Max</strong><p className="mt-1 text-[11px] leading-4 text-[#64748B]">Nazwy grup i elementów modelu mapujesz do pól konfiguratora, z podświetleniem na hover.</p></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
