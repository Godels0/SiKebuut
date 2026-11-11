import React, { useState } from 'react';
import { ArrowRight, Search, Calculator, Shield, Clock, MapPin, Ship, Anchor, ChevronRight } from 'lucide-react';
import { INDONESIA_CITIES } from '../data/initialData.ts';
import { cargoStorage } from '../services/cargoStorage.ts';

interface HeroSectionProps {
  onTrack: (resi: string) => void;
  onNavigateToCalculator: (origin?: string, dest?: string) => void;
  onNavigateToBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTrack,
  onNavigateToCalculator,
  onNavigateToBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'rates'>('track');
  const [quickResi, setQuickResi] = useState('');
  const [quickOrigin, setQuickOrigin] = useState('Jakarta (Tj. Priok)');
  const [quickDest, setQuickDest] = useState('Surabaya (Tj. Perak)');
  const [quickWeight, setQuickWeight] = useState(150);
  const [quickEstimate, setQuickEstimate] = useState<number | null>(null);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickResi.trim()) {
      onTrack(quickResi.trim());
    }
  };

  const handleQuickEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = cargoStorage.calculateCost(quickOrigin, quickDest, 'Kargo Laut Reguler', quickWeight, 0, 'dropoff');
    setQuickEstimate(result.totalFee);
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background subtle sea waves / grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 rounded-full px-3.5 py-1">
              <Anchor className="w-3.5 h-3.5 text-blue-400" />
              <span>Ekspedisi Kapal Kargo Laut & Kontainer Nusantara</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-2xl">
              Pengiriman Kapal Kargo Cepat & Aman ke Seluruh Pelabuhan.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              SiKebut menghadirkan armada Kapal Kontainer FCL/LCL dan Kapal Kargo Cepat dengan dua layanan unggulan: <strong>Kargo Laut Reguler</strong> dan <strong>Kargo Laut Express</strong> berjadwal rutin.
            </p>

            {/* Quick Proof Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2">
                <Ship className="w-4 h-4 text-blue-400" />
                <span>Armada Kontainer & Ro-Ro 650 Ton</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Asuransi Marine Cargo All-Risk</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Express Rute Langsung (Direct Call)</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToBooking}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Pesan Kargo Kapal Laut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateToCalculator()}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <span>Simulasi Ongkir Laut</span>
                <Calculator className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Quick Dock */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
              {/* Segmented Control Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'track'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Lacak Kargo Kapal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rates')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'rates'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>Cek Tarif Laut</span>
                </button>
              </div>

              {/* Tab 1: Quick Tracking */}
              {activeTab === 'track' && (
                <form onSubmit={handleQuickTrack} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Nomor Resi / AWB Kargo Laut
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={quickResi}
                        onChange={(e) => setQuickResi(e.target.value)}
                        placeholder="Contoh: SKB-202611-8941"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition-all uppercase placeholder:normal-case font-mono"
                      />
                      <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Lacak Posisi Kapal & Muatan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Demo resi chips for one-click testing */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">Klik contoh resi kargo laut aktif:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => onTrack('SKB-202611-8941')}
                        className="px-2 py-1 text-xs font-mono bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                      >
                        SKB-202611-8941 (Reguler - Berlayar)
                      </button>
                      <button
                        type="button"
                        onClick={() => onTrack('SKB-202611-7320')}
                        className="px-2 py-1 text-xs font-mono bg-indigo-50 text-indigo-800 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                      >
                        SKB-202611-7320 (Express - Sandar)
                      </button>
                      <button
                        type="button"
                        onClick={() => onTrack('SKB-202611-5512')}
                        className="px-2 py-1 text-xs font-mono bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                      >
                        SKB-202611-5512 (Terkirim)
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tab 2: Quick Rate Estimator */}
              {activeTab === 'rates' && (
                <form onSubmit={handleQuickEstimate} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Pelabuhan Asal</label>
                      <select
                        value={quickOrigin}
                        onChange={(e) => setQuickOrigin(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:border-blue-500 bg-white"
                      >
                        {INDONESIA_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Pelabuhan Tujuan</label>
                      <select
                        value={quickDest}
                        onChange={(e) => setQuickDest(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:border-blue-500 bg-white"
                      >
                        {INDONESIA_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Berat Kargo (Kg)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="25"
                        value={quickWeight}
                        onChange={(e) => setQuickWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold tabular-nums focus:border-blue-500"
                      />
                      <span className="text-xs font-medium text-slate-500">Kg</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Hitung Estimasi Kargo Laut
                  </button>

                  {quickEstimate !== null && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center space-y-1">
                      <span className="text-xs text-blue-700 font-medium">Estimasi Kargo Laut Reguler:</span>
                      <div className="text-lg font-bold text-blue-900 font-mono">
                        Rp {quickEstimate.toLocaleString('id-ID')}
                      </div>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onNavigateToCalculator(quickOrigin, quickDest)}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Bandingkan dengan Kargo Laut Express &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
