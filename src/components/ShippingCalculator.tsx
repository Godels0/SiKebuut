import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, ArrowRight, Info, Check, Shield, Ship, Zap, Anchor } from 'lucide-react';
import { INDONESIA_CITIES } from '../data/initialData.ts';
import { ServiceType } from '../types/cargo.ts';
import { cargoStorage } from '../services/cargoStorage.ts';

interface ShippingCalculatorProps {
  initialOrigin?: string;
  initialDest?: string;
  onBookWithEstimate: (details: {
    origin: string;
    destination: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    service: ServiceType;
    pickupType: 'pickup' | 'dropoff';
    itemValue: number;
    totalFee: number;
  }) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  initialOrigin = 'Jakarta (Tj. Priok)',
  initialDest = 'Surabaya (Tj. Perak)',
  onBookWithEstimate,
}) => {
  const [originCity, setOriginCity] = useState(initialOrigin);
  const [destCity, setDestCity] = useState(initialDest);
  const [weightKg, setWeightKg] = useState<number>(120);
  const [lengthCm, setLengthCm] = useState<number>(100);
  const [widthCm, setWidthCm] = useState<number>(80);
  const [heightCm, setHeightCm] = useState<number>(70);
  const [itemValue, setItemValue] = useState<number>(15000000);
  const [pickupType, setPickupType] = useState<'pickup' | 'dropoff'>('dropoff');
  const [selectedService, setSelectedService] = useState<ServiceType>('Kargo Laut Reguler');

  const handleSwap = () => {
    setOriginCity(destCity);
    setDestCity(originCity);
  };

  // Sea freight volumetric calculation (1 CBM = 250 Kg)
  const volumeCbm = Math.round(((lengthCm * widthCm * heightCm) / 1000000) * 100) / 100;
  const seaVolumetricKg = Math.round(((lengthCm * widthCm * heightCm) / 4000) * 10) / 10;
  const chargeableWeight = Math.max(weightKg, seaVolumetricKg);

  // Strictly 2 services: Kargo Laut Reguler & Kargo Laut Express
  const servicesList: { type: ServiceType; icon: React.ReactNode; color: string; description: string }[] = [
    {
      type: 'Kargo Laut Reguler',
      icon: <Ship className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      description: 'Kapal Kontainer FCL/LCL & Ro-Ro berjadwal mingguan. Tarif paling ekonomis.'
    },
    {
      type: 'Kargo Laut Express',
      icon: <Zap className="w-5 h-5 text-indigo-600" />,
      color: 'indigo',
      description: 'Kapal kargo cepat direct call tanpa singgah. Prioritas sandar dermaga.'
    },
  ];

  const comparisonResults = servicesList.map((srv) => {
    const costBreakdown = cargoStorage.calculateCost(
      originCity,
      destCity,
      srv.type,
      chargeableWeight,
      itemValue,
      pickupType
    );

    return {
      serviceType: srv.type,
      icon: srv.icon,
      color: srv.color,
      description: srv.description,
      chargeableWeight,
      ...costBreakdown,
    };
  });

  const activeOption = comparisonResults.find((c) => c.serviceType === selectedService) || comparisonResults[0];

  const handleProceedToBooking = () => {
    onBookWithEstimate({
      origin: originCity,
      destination: destCity,
      weight: weightKg,
      length: lengthCm,
      width: widthCm,
      height: heightCm,
      service: selectedService,
      pickupType,
      itemValue,
      totalFee: activeOption.totalFee,
    });
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Anchor className="w-4 h-4 text-blue-600" />
            <span>Kalkulator Tarif Kapal Kargo Laut</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Estimasi Biaya Pengiriman Kapal Kargo SiKebut
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Bandingkan biaya antara layanan <strong>Kargo Laut Reguler</strong> dan <strong>Kargo Laut Express</strong> antar-pelabuhan di Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Rute Pelabuhan & Spesifikasi Kargo</span>
            </h2>

            {/* Origin & Destination Ports */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pelabuhan Asal</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:border-blue-500 bg-white"
                >
                  {INDONESIA_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors border border-slate-200"
                  title="Tukar Pelabuhan Asal & Tujuan"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pelabuhan Tujuan</label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:border-blue-500 bg-white"
                >
                  {INDONESIA_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Berat & Dimensi Kubikasi */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Berat Kargo (Kilogram)</label>
                  <span className="text-xs text-slate-400">Min. 25-50 Kg</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-bold tabular-nums focus:border-blue-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-semibold">Kg</span>
                </div>
              </div>

              {/* Dimensi P x L x T */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dimensi Fisik Kargo (Centimeter)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Panjang (P)</span>
                    <input
                      type="number"
                      min="1"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold tabular-nums focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Lebar (L)</span>
                    <input
                      type="number"
                      min="1"
                      value={widthCm}
                      onChange={(e) => setWidthCm(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold tabular-nums focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Tinggi (T)</span>
                    <input
                      type="number"
                      min="1"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold tabular-nums focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Informational Callout: CBM & Volumetrik Laut */}
              <div className="p-3 bg-blue-50/60 rounded-lg text-xs text-slate-600 border border-blue-200/80 space-y-1">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Kalkulasi Kubikasi Kapal Kargo:</span>
                </div>
                <div>Volume Kubikasi (CBM): <strong className="text-slate-900 tabular-nums">{volumeCbm} m³</strong></div>
                <div>Volumetrik Laut (P×L×T / 4000): <strong className="text-slate-900 tabular-nums">{seaVolumetricKg} Kg</strong></div>
                <div className="text-[11px] text-slate-500">
                  *Sistem menagihkan bobot terbesar antara berat timbangan vs berat kubikasi.
                </div>
              </div>
            </div>

            {/* Nilai Barang & Pickup */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nilai Barang (Asuransi Marine Cargo 0.2%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-500 font-medium">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={itemValue}
                    onChange={(e) => setItemValue(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm font-semibold tabular-nums focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Penyerahan Kargo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupType('dropoff')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors ${
                      pickupType === 'dropoff'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Drop-off Dermaga Pelabuhan
                    <span className="block text-[11px] text-slate-500 font-normal">Antar ke CFS Gudang Pelabuhan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupType('pickup')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors ${
                      pickupType === 'pickup'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Penjemputan Armada
                    <span className="block text-[11px] text-slate-500 font-normal">Truk kontainer jemput ke pabrik</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Results Comparison Matrix */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Perbandingan Layanan Kapal Kargo Laut
                  </h2>
                  <p className="text-xs text-slate-500">
                    Jalur Maritim: <strong className="text-slate-800">{originCity}</strong> &rarr; <strong className="text-slate-800">{destCity}</strong>
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Pilih layanan untuk rincian
                </div>
              </div>

              {/* 2 Service Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {comparisonResults.map((option) => {
                  const isSelected = selectedService === option.serviceType;
                  return (
                    <div
                      key={option.serviceType}
                      onClick={() => setSelectedService(option.serviceType)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            {option.icon}
                          </div>
                          {isSelected ? (
                            <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                              Dipilih
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Klik untuk Pilih</span>
                          )}
                        </div>

                        <div className="font-extrabold text-base text-slate-900 mb-1">
                          {option.serviceType}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {option.description}
                        </p>

                        <div className="text-xs text-slate-600 space-y-1 mb-4 pt-3 border-t border-slate-100">
                          <div>Estimasi Pelayaran: <strong className="text-slate-900">{option.estimatedDays}</strong></div>
                          <div>Min. Muatan: <strong className="text-slate-900 tabular-nums">{option.minWeight} Kg</strong></div>
                          <div>Tarif Dasar: <strong className="text-slate-900 font-mono">Rp {option.ratePerKg.toLocaleString('id-ID')}/Kg</strong></div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80">
                        <div className="text-xs text-slate-500">Total Estimasi:</div>
                        <div className="text-xl font-extrabold text-blue-700 font-mono">
                          Rp {option.totalFee.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Breakdown for the chosen service */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 mb-6 space-y-3 text-xs">
                <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Rincian Ongkos Kirim Kapal Kargo ({activeOption.serviceType})</span>
                  <span className="font-mono text-blue-600">{activeOption.estimatedDays}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tarif Angkut Pelayaran ({activeOption.billableWeight} Kg × Rp {activeOption.ratePerKg.toLocaleString('id-ID')}):</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    Rp {activeOption.shippingFee.toLocaleString('id-ID')}
                  </span>
                </div>

                {activeOption.insuranceFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>Premi Asuransi Marine Cargo (0.2% dari Rp {itemValue.toLocaleString('id-ID')}):</span>
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">
                      Rp {activeOption.insuranceFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {activeOption.pickupFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Hauling / Penjemputan Armada Pelabuhan:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      Rp {activeOption.pickupFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2.5">
                  <span>Total Tagihan Kapal Kargo:</span>
                  <span className="text-base text-blue-700 font-mono">
                    Rp {activeOption.totalFee.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <button
                onClick={handleProceedToBooking}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <span>Pesan Sekarang dengan {activeOption.serviceType}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
