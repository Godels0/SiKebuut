import React from 'react';
import { Ship, Zap, ArrowRight, CheckCircle2, Anchor, Compass } from 'lucide-react';
import { ServiceType } from '../types/cargo.ts';

interface ServicesSectionProps {
  onSelectService: (service: ServiceType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services: {
    id: ServiceType;
    number: string;
    title: string;
    tagline: string;
    description: string;
    sla: string;
    capacity: string;
    minWeight: string;
    features: string[];
    icon: React.ReactNode;
    accentBg: string;
    badge: string;
  }[] = [
    {
      id: 'Kargo Laut Reguler',
      number: '01',
      title: 'Kargo Laut Reguler',
      tagline: 'Kapal Kontainer FCL & LCL Berjadwal',
      description: 'Solusi pengangkutan laut paling ekonomis untuk muatan tonase besar, material proyek, komoditas pangan, dan partai besar menggunakan armada Kapal Kontainer & Ro-Ro.',
      sla: '3 - 7 Hari Pelayaran',
      capacity: 'Hingga 500 Ton / Multi-TEUs',
      minWeight: 'Min. 50 Kg',
      features: [
        'Tarif Paling Ekonomis per Kg / CBM',
        'Pilihan Kontainer 20ft, 40ft & Curah LCL',
        'Jadwal Sandar & Berlayar Rutin Mingguan',
        'Asuransi Perlindungan Marine Cargo',
        'Layanan Door-to-Door & Port-to-Port'
      ],
      icon: <Ship className="w-7 h-7 text-blue-600" />,
      accentBg: 'bg-blue-50/80',
      badge: 'Paling Hemat & Kapasitas Masif'
    },
    {
      id: 'Kargo Laut Express',
      number: '02',
      title: 'Kargo Laut Express',
      tagline: 'Kapal Kargo Cepat Jalur Langsung (Direct Call)',
      description: 'Layanan kargo laut prioritas menggunakan armada Fast Freighter berkecepatan tinggi tanpa singgah (direct route), ideal untuk barang sensitif waktu antar-pulau.',
      sla: '1 - 3 Hari Pelayaran',
      capacity: 'Hingga 250 Ton per Voyage',
      minWeight: 'Min. 25 Kg',
      features: [
        'Waktu Tempuh 2x Lebih Cepat',
        'Prioritas Sandar Dermaga Pelabuhan (Berthing Priority)',
        'Rute Langsung Tanpa Transit Pelabuhan Antara',
        'Pemuatan Cepat di Container Freight Station',
        'Pelacakan Posisi Koordinat Maritim Real-Time'
      ],
      icon: <Zap className="w-7 h-7 text-indigo-600" />,
      accentBg: 'bg-indigo-50/80',
      badge: 'Prioritas & Cepat Tiba'
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <Anchor className="w-4 h-4" />
            <span>Spesialis Ekspedisi Kapal Kargo Laut</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
            Dua Pilihan Layanan Kapal Kargo SiKebut
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Fokus penuh pada keandalan jalur maritim Indonesia dengan dua opsi layanan utama: <strong>Kargo Laut Reguler</strong> untuk efisiensi biaya maksimal, dan <strong>Kargo Laut Express</strong> untuk pengiriman kilat kapal cepat antar-pelabuhan.
          </p>
        </div>

        {/* 2 Big Distinctive Service Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl border-2 border-slate-200 hover:border-blue-500 bg-white p-8 transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header row: Number, Title, and Icon */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.accentBg} shadow-xs`}>
                      {service.icon}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-400">
                        {service.number}. {service.tagline}
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-md px-2.5 py-1 mb-4">
                  {service.badge}
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Specs metadata strip (Zero-pill discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 py-3.5 border-y border-slate-100 mb-6">
                  <span className="font-semibold text-slate-700">Estimasi Tiba:</span>
                  <span className="text-slate-900 font-bold">{service.sla}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-700">Kapasitas:</span>
                  <span className="text-slate-900 font-medium">{service.capacity}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-900 font-medium">{service.minWeight}</span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 mb-8 text-xs text-slate-700">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectService(service.id)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Cek Tarif & Pesan {service.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
