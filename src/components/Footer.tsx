import React from 'react';
import { Truck, Phone, Mail, MapPin, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'calculator' | 'tracking' | 'booking' | 'customer_portal' | 'admin_portal' | 'laravel_export') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                SiKebut<span className="text-blue-500">Cargo</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Informasi Pengiriman Kargo & Logistik Terpadu Indonesia. Menyediakan solusi pengangkutan darat, laut, dan udara secara cepat, transparan, dan terpercaya.
            </p>
            <div className="text-[11px] text-slate-500">
              ISO 9001:2015 Logistics Quality Management Certified.
            </div>
          </div>

          {/* Col 2: Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Layanan Kargo</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  SiKebut Trucking Darat (Wingbox)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  SiKebut Express Udara (Air Freight)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  SiKebut Laut Kontainer (FCL/LCL)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  SiKebut Sameday Fleet (Kilat)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Akses Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Akses Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-white transition-colors">
                  Lacak Resi Pengiriman
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  Kalkulator Cek Tarif
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-white transition-colors">
                  Pemesanan Kargo Baru
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer_portal')} className="hover:text-white transition-colors">
                  Portal Riwayat Pengiriman
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('laravel_export')} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Cetak Biru Laravel & SQL
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Kantor Pusat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hub Pusat & Bantuan</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Jl. Raya Cakung Cilincing No. 88, Kawasan Logistik Terpadu, Jakarta Timur 13910</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Customer Care: (021) 8899-2345 / 0811-9876-543</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@sikebutcargo.co.id</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar (No telemetry tickers) */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SiKebut Cargo Express. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Syarat & Ketentuan Pengangkutan</span>
            <span aria-hidden="true">·</span>
            <span>Kebijakan Privasi</span>
            <span aria-hidden="true">·</span>
            <span>Standar Asuransi All-Risk</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
