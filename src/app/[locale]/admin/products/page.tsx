'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  Edit,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'SuperStrong', sku: 'GMS-SS-001', price: 9500, stock: 12, status: 'published', category: 'Garaże modułowe', date: '2026-06-28', template: 'superstrong-2025' },
  { id: 2, name: 'Sunrise Nitrum', sku: 'GMS-SN-002', price: 4500, stock: 5, status: 'published', category: 'Wiaty śmietnikowe', date: '2026-06-24', template: 'blank' },
  { id: 3, name: 'Standardowa Wiata', sku: 'GMS-ST-003', price: 3200, stock: 0, status: 'draft', category: 'Wiaty rowerowe', date: '2026-06-19', template: 'blank' },
  { id: 4, name: 'Altana A-2', sku: 'GMS-A2-004', price: 12500, stock: 2, status: 'published', category: 'Altany', date: '2026-06-12', template: 'altana-maxi' },
  { id: 5, name: 'Zadaszenie Eco', sku: 'GMS-ECO-005', price: 2100, stock: 45, status: 'published', category: 'Zadaszenia', date: '2026-06-10', template: 'blank' },
];

export default function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <div className="mx-auto max-w-7xl pb-24">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Produkty</h1>
          <p className="mt-1 text-sm text-[#64748B]">Zarządzaj produktami, konfiguratorami i mapowaniem modeli 3D.</p>
        </div>
        <Link
          href={`/${locale}/admin/products/new?template=blank`}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          Dodaj nowy
        </Link>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-t-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row">
        <div className="flex w-full gap-2 text-sm sm:w-auto">
          <button className="border-b-2 border-indigo-600 px-3 py-1.5 font-semibold text-[#0F172A]">Wszystkie (5)</button>
          <button className="px-3 py-1.5 font-medium text-[#64748B] hover:text-[#0F172A]">Opublikowane (4)</button>
          <button className="px-3 py-1.5 font-medium text-[#64748B] hover:text-[#0F172A]">Szkice (1)</button>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC]">
            <Filter size={16} />
            Filtry
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-xl border-x border-b border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input type="checkbox" className="rounded border-[#CBD5E1] text-indigo-600 focus:ring-indigo-500" />
                </th>
                <th className="px-6 py-4 font-semibold">Produkt</th>
                <th className="px-6 py-4 font-semibold">SKU</th>
                <th className="px-6 py-4 font-semibold">Stan magazynowy</th>
                <th className="px-6 py-4 font-semibold">Cena</th>
                <th className="px-6 py-4 font-semibold">Konfigurator</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 text-right font-semibold">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {mockProducts.map((product) => {
                const studioHref = `/${locale}/admin/products/new?template=${product.template}&product=${product.id}`;
                return (
                  <tr key={product.id} className="group transition-colors hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-[#CBD5E1] text-indigo-600 focus:ring-indigo-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8]">
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <Link href={studioHref} className="font-bold text-indigo-600 hover:underline">
                            {product.name}
                          </Link>
                          <div className="mt-1 flex gap-2 text-xs font-medium">
                            {product.status === 'published' ? <span className="text-emerald-600">Opublikowano</span> : <span className="text-[#94A3B8]">Szkic</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{product.sku}</td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? <span className="font-medium text-emerald-600">W magazynie ({product.stock})</span> : <span className="font-medium text-red-500">Brak w magazynie</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{product.price.toLocaleString('pl-PL')} zł</td>
                    <td className="px-6 py-4 text-[#475569]">
                      <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{product.template}</span>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {product.status === 'published' ? 'Opublikowano' : 'Ostatnia modyfikacja'}<br />
                      <span className="font-medium text-[#0F172A]">{product.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link href={studioHref} className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-indigo-50 hover:text-indigo-600" title="Edytuj">
                          <Edit size={16} />
                        </Link>
                        <Link href={`/${locale}/konfigurator-demo`} target="_blank" className="flex items-center justify-center rounded-lg p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]" title="Zobacz produkt w sklepie">
                          <ExternalLink size={16} />
                        </Link>
                        <button className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-red-50 hover:text-red-600" title="Przenieś do kosza">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="inline-block p-2 text-[#94A3B8] group-hover:hidden">
                        <MoreHorizontal size={16} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E2E8F0] p-4 text-sm text-[#64748B]">
          <div>Pokazano 1-5 z 5 produktów</div>
          <div className="flex gap-1">
            <button className="cursor-not-allowed rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[#94A3B8]">Poprzednia</button>
            <button className="rounded-md border border-indigo-600 bg-indigo-50 px-3 py-1 font-medium text-indigo-700">1</button>
            <button className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1 hover:bg-[#F8FAFC]">Następna</button>
          </div>
        </div>
      </div>
    </div>
  );
}
