import React, { useState, useEffect } from 'react';
import { Search, MapPin, Ship, CheckCircle2, Phone, AlertCircle, FileText, ArrowRight, Anchor, Navigation } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/cargo.ts';
import { cargoStorage } from '../services/cargoStorage.ts';

interface TrackingSectionProps {
  initialTrackingNumber?: string;
  onOpenWaybill: (shipment: Shipment) => void;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  initialTrackingNumber = 'SKB-202611-8941',
  onOpenWaybill,
}) => {
  const [searchInput, setSearchInput] = useState(initialTrackingNumber);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);

  const performSearch = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const found = cargoStorage.findShipment(trimmed);
    setActiveShipment(found);
    setSearched(true);
    setSearchInput(trimmed);
  };

  useEffect(() => {
    if (initialTrackingNumber) {
      performSearch(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case 'order_created': return { label: 'Booking Diterbitkan', color: 'text-slate-700 bg-slate-100 border-slate-200' };
      case 'picked_up': return { label: 'Terima di CFS Dermaga', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'port_loading': return { label: 'Pemuatan ke Kapal (Stuffing)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'sailing_transit': return { label: 'Dalam Pelayaran Laut', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'port_arrived': return { label: 'Sandar di Pelabuhan Tujuan', color: 'text-cyan-800 bg-cyan-50 border-cyan-200' };
      case 'out_for_delivery': return { label: 'Pengantaran ke Alamat', color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'delivered': return { label: 'Berhasil Diterima', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'cancelled': return { label: 'Dibatalkan', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  const standardSteps: { key: ShipmentStatus; label: string }[] = [
    { key: 'order_created', label: 'Booking Resi' },
    { key: 'picked_up', label: 'Terima di CFS' },
    { key: 'port_loading', label: 'Muat ke Kapal' },
    { key: 'sailing_transit', label: 'Pelayaran Laut' },
    { key: 'port_arrived', label: 'Sandar Tujuan' },
    { key: 'out_for_delivery', label: 'Pengantaran' },
    { key: 'delivered', label: 'Tuntas Diterima' },
  ];

  const getStepProgressIndex = (status: ShipmentStatus) => {
    const order: ShipmentStatus[] = [
      'order_created',
      'picked_up',
      'port_loading',
      'sailing_transit',
      'port_arrived',
      'out_for_delivery',
      'delivered',
    ];
    return order.indexOf(status);
  };

  const currentStepIndex = activeShipment ? getStepProgressIndex(activeShipment.status) : 0;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 flex items-center justify-center gap-1.5">
            <Anchor className="w-4 h-4 text-blue-600" />
            <span>Tracking Kapal Kargo & Kontainer Laut</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Lacak Posisi Kapal & Muatan Kontainer
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Pantau pergerakan kargo mulai dari stuffing dermaga asal, koordinat kapal di laut, hingga sandar di pelabuhan tujuan.
          </p>

          <form onSubmit={handleSearch} className="relative flex items-center shadow-sm">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Masukkan Nomor Resi / Kontainer (misal: SKB-202611-8941)"
              className="w-full pl-4 pr-32 py-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-semibold tracking-wider uppercase placeholder:normal-case font-mono bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Resi</span>
            </button>
          </form>

          {/* Quick Resi Selector */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Contoh resi kargo laut:</span>
            <button
              type="button"
              onClick={() => performSearch('SKB-202611-8941')}
              className="px-2.5 py-1 rounded-md font-mono text-xs bg-white border border-slate-200 hover:border-blue-400 text-blue-700 font-semibold"
            >
              SKB-202611-8941 (Reguler - Berlayar)
            </button>
            <button
              type="button"
              onClick={() => performSearch('SKB-202611-7320')}
              className="px-2.5 py-1 rounded-md font-mono text-xs bg-white border border-slate-200 hover:border-blue-400 text-indigo-700 font-semibold"
            >
              SKB-202611-7320 (Express - Sandar)
            </button>
            <button
              type="button"
              onClick={() => performSearch('SKB-202611-5512')}
              className="px-2.5 py-1 rounded-md font-mono text-xs bg-white border border-slate-200 hover:border-blue-400 text-emerald-700 font-semibold"
            >
              SKB-202611-5512 (Tuntas Diterima)
            </button>
          </div>
        </div>

        {/* Search Result View */}
        {activeShipment ? (
          <div className="space-y-6">
            
            {/* Top Shipment Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                    <span>No. Resi:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">
                      {activeShipment.trackingNumber}
                    </span>
                    {activeShipment.containerNumber && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>Kontainer:</span>
                        <span className="font-mono font-bold text-blue-700">{activeShipment.containerNumber}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>{activeShipment.senderCity}</span>
                    <Ship className="w-5 h-5 text-blue-600 inline" />
                    <span>{activeShipment.receiverCity}</span>
                  </h2>
                  <div className="text-xs text-slate-500 mt-1">
                    Layanan: <strong className="text-blue-700">{activeShipment.serviceType}</strong> · Diterbitkan pada: {activeShipment.createdAt}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusLabel(activeShipment.status).color}`}>
                    {getStatusLabel(activeShipment.status).label}
                  </div>
                  <button
                    onClick={() => onOpenWaybill(activeShipment)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lihat Surat Jalan Laut</span>
                  </button>
                </div>
              </div>

              {/* Maritime Step Progress Tracker */}
              <div className="mb-8">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Tahapan Rute & Perjalanan Kapal Kargo
                </div>

                <div className="relative">
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStepIndex) / (standardSteps.length - 1)) * 100}%`,
                    }}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 relative z-10">
                    {standardSteps.map((step, idx) => {
                      const isPast = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPast
                                ? 'bg-blue-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] mt-2 font-medium leading-tight ${
                              isCurrent ? 'text-blue-700 font-bold' : isPast ? 'text-slate-700' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Current Location Highlight Banner */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-800">Posisi Koordinat / Pelabuhan Terkini:</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeShipment.currentLocation}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Pembaruan Sistem: {activeShipment.updatedAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Split Info: Detailed Meta & Milestone Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Vessel Specs & Nahkoda Info */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Vessel & Captain Info */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Ship className="w-4 h-4 text-blue-600" />
                    <span>Kapal Pengangkut & Nahkoda</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nama Kapal:</span>
                      <span className="font-bold text-slate-900">{activeShipment.fleetCode || 'KM SiKebut Kargo'}</span>
                    </div>
                    {activeShipment.courierName && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nahkoda / Petugas:</span>
                        <span className="font-medium text-slate-800">{activeShipment.courierName}</span>
                      </div>
                    )}
                    {activeShipment.containerNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nomor Kontainer:</span>
                        <span className="font-mono font-bold text-blue-700">{activeShipment.containerNumber}</span>
                      </div>
                    )}
                  </div>

                  {activeShipment.courierPhone && (
                    <a
                      href={`https://wa.me/${activeShipment.courierPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Kontak Petugas Dermaga / CS Pelabuhan</span>
                    </a>
                  )}
                </div>

                {/* Cargo Item Specifications */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                    Spesifikasi Muatan Laut
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deskripsi Barang:</span>
                      <span className="font-semibold text-slate-900 text-right">{activeShipment.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kategori:</span>
                      <span className="font-semibold text-slate-800">{activeShipment.itemCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Berat Timbangan:</span>
                      <span className="font-mono font-semibold text-slate-800">{activeShipment.weightKg} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensi (P×L×T):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {activeShipment.lengthCm} × {activeShipment.widthCm} × {activeShipment.heightCm} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Berat Tagih:</span>
                      <span className="font-mono font-bold text-blue-700">{activeShipment.chargeableWeightKg} Kg</span>
                    </div>
                  </div>

                  {activeShipment.notes && (
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 text-[11px] border border-slate-200/60">
                      <strong>Instruksi Palka:</strong> {activeShipment.notes}
                    </div>
                  )}
                </div>

                {/* Sender & Receiver Address Summary */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                    Rincian Pelabuhan & Alamat
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Pengirim:</span>
                    <div className="text-slate-900 font-medium">{activeShipment.senderName} ({activeShipment.senderCity})</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{activeShipment.senderAddress}</div>
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <span className="font-semibold text-slate-700 block mb-0.5">Penerima:</span>
                    <div className="text-slate-900 font-medium">{activeShipment.receiverName} ({activeShipment.receiverCity})</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{activeShipment.receiverAddress}</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Reverse-Chronological Milestone Log */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span>Log Kronologis Perjalanan Kapal & Kontainer</span>
                  <span className="text-xs font-normal text-slate-400">
                    {activeShipment.logs.length} Checkpoint Tercatat
                  </span>
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeShipment.logs.map((log, index) => {
                    const isLatest = index === 0;
                    return (
                      <div key={log.id || index} className="relative group">
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition-all ${
                            isLatest
                              ? 'bg-blue-600 border-white ring-4 ring-blue-100'
                              : 'bg-white border-slate-400'
                          }`}
                        />

                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-sm font-bold ${
                                isLatest ? 'text-blue-700' : 'text-slate-900'
                              }`}
                            >
                              {log.title}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {log.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {log.description}
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{log.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        ) : (
          searched && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Resi Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nomor resi <strong className="font-mono text-slate-700">{searchInput}</strong> belum terdaftar dalam manifest kapal SiKebut.
              </p>
              <button
                type="button"
                onClick={() => performSearch('SKB-202611-8941')}
                className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Coba Resi SKB-202611-8941
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
};
