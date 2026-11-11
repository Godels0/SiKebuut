import React from 'react';
import { ShieldCheck, Anchor, Clock, DollarSign, Headphones, Ship, Navigation } from 'lucide-react';
import { INITIAL_FLEETS } from '../data/initialData.ts';

export const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      title: 'Pelacakan Posisi Kapal & Kontainer',
      desc: 'Setiap kontainer dipantau mulai dari proses stuffing di dermaga asal, posisi koordinat kapal di laut lepas, hingga stripping di pelabuhan tujuan.',
      icon: <Navigation className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Pilihan Layanan Reguler & Express',
      desc: 'Pilih Kargo Laut Reguler untuk efisiensi ongkos kirim maksimal, atau Kargo Laut Express dengan kapal cepat rute langsung (direct call).',
      icon: <Ship className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Kapasitas Muat Masif Ratusan Ton',
      desc: 'Mendukung pengiriman FCL (Full Container Load 20ft & 40ft) maupun LCL (Less Container Load) untuk material industri, komoditas, dan alat berat.',
      icon: <Anchor className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Asuransi Marine Cargo All-Risk',
      desc: 'Perlindungan menyeluruh terhadap resiko perjalanan laut, cuaca buruk, basah air asin, dan kerusakan fisik kontainer.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Tarif Paling Ekonomis per Kg & CBM',
      desc: 'Struktur tarif transparan per kilogram atau kubikasi (CBM), jauh lebih hemat dibandingkan moda kargo lainnya untuk muatan partai besar.',
      icon: <DollarSign className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Jadwal Sandar & Berlayar Teratur',
      desc: 'Kerjasama dengan operator pelabuhan utama di seluruh Indonesia untuk kepastian jadwal sandar dan prioritas bongkar muat kargo.',
      icon: <Clock className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-2">
            Keunggulan Layanan Maritim SiKebut
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
            Mengapa Memilih Ekspedisi Kapal Kargo Laut SiKebut
          </h2>
          <p className="text-base text-slate-600">
            Kombinasi armada kapal kargo modern, kepastian jadwal pelayaran, dan sistem informasi pelacakan kontainer terpadu.
          </p>
        </div>

        {/* 6 Grid Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {adv.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {adv.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {adv.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Fleet Showcase: Kapal Kargo SiKebut */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <div className="text-xs font-mono text-blue-400 font-semibold mb-1 flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-blue-400" />
                <span>Armada Kapal Kargo & Jalur Pelayaran Maritim</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Daftar Kapal Kargo Aktif SiKebut
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              Terhubung dengan Sistem Automatic Identification System (AIS)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_FLEETS.map((fleet) => (
              <div
                key={fleet.id}
                className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 hover:border-blue-500 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400">{fleet.fleetCode}</span>
                  <span className="text-[11px] font-mono text-slate-400">{fleet.plateNumber.split(' ')[0]}</span>
                </div>
                <div className="font-bold text-base text-slate-100">{fleet.vehicleName}</div>
                <div className="text-xs text-blue-300 font-medium">{fleet.category}</div>
                <div className="text-xs text-slate-400">{fleet.currentRoute || 'Jalur Pelayaran Aktif'}</div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60 font-mono">
                  <span>Kapasitas: <strong className="text-slate-200">{(fleet.capacityKg / 1000).toLocaleString('id-ID')} Ton</strong></span>
                  <span className="text-emerald-400 font-medium">● Siap Berlayar</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
