import React from 'react';
import { Ship, Anchor, ShieldCheck, UserCheck, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'calculator' | 'tracking' | 'booking' | 'customer_portal' | 'admin_portal' | 'laravel_export';
  setActiveTab: (tab: 'home' | 'calculator' | 'tracking' | 'booking' | 'customer_portal' | 'admin_portal' | 'laravel_export') => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no pills/taglines) */}
        <button
          onClick={() => {
            setIsAdminMode(false);
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Ship className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            SiKebut<span className="text-blue-600">Marine</span>
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('home');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              !isAdminMode && activeTab === 'home' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Layanan Kargo Laut
          </button>
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('calculator');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              !isAdminMode && activeTab === 'calculator' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Cek Tarif Laut
          </button>
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('tracking');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              !isAdminMode && activeTab === 'tracking' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Lacak Kapal & Resi
          </button>
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('booking');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              !isAdminMode && activeTab === 'booking' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Pesan Kargo
          </button>
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('customer_portal');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 ${
              !isAdminMode && activeTab === 'customer_portal' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Riwayat Saya
          </button>
          <button
            onClick={() => {
              setActiveTab('laravel_export');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-indigo-600 flex items-center gap-1.5 ${
              activeTab === 'laravel_export' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <span>Arsitektur Laravel & SQL</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdminMode ? (
            <button
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab('home');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mode Shipper / Pelanggan</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdminMode(true);
                setActiveTab('admin_portal');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Portal Operasional Maritim</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav quick bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 px-2 py-2 text-xs">
        <button
          onClick={() => { setIsAdminMode(false); setActiveTab('home'); }}
          className={`py-1 px-2 rounded font-medium ${!isAdminMode && activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Beranda
        </button>
        <button
          onClick={() => { setIsAdminMode(false); setActiveTab('calculator'); }}
          className={`py-1 px-2 rounded font-medium ${!isAdminMode && activeTab === 'calculator' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Tarif Laut
        </button>
        <button
          onClick={() => { setIsAdminMode(false); setActiveTab('tracking'); }}
          className={`py-1 px-2 rounded font-medium ${!isAdminMode && activeTab === 'tracking' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Lacak
        </button>
        <button
          onClick={() => { setIsAdminMode(false); setActiveTab('booking'); }}
          className={`py-1 px-2 rounded font-medium ${!isAdminMode && activeTab === 'booking' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Pesan
        </button>
        <button
          onClick={() => { setIsAdminMode(true); setActiveTab('admin_portal'); }}
          className={`py-1 px-2 rounded font-medium ${isAdminMode ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Admin
        </button>
      </div>
    </header>
  );
};
