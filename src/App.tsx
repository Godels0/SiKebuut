/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { AdvantagesSection } from './components/AdvantagesSection.tsx';
import { ShippingCalculator } from './components/ShippingCalculator.tsx';
import { BookingForm } from './components/BookingForm.tsx';
import { TrackingSection } from './components/TrackingSection.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { LaravelArchitectureModal } from './components/LaravelArchitectureModal.tsx';
import { WaybillModal } from './components/WaybillModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ServiceType, Shipment } from './types/cargo.ts';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'calculator' | 'tracking' | 'booking' | 'customer_portal' | 'admin_portal' | 'laravel_export'
  >('home');

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [trackingQuery, setTrackingQuery] = useState<string>('SKB-202611-8941');
  
  // Params passed from Calculator to Booking
  const [bookingPrefill, setBookingPrefill] = useState<{
    origin?: string;
    destination?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    service?: ServiceType;
    pickupType?: 'pickup' | 'dropoff';
    itemValue?: number;
  }>({});

  // Active Waybill for printing modal
  const [activeWaybill, setActiveWaybill] = useState<Shipment | null>(null);

  // Success Toast for booking creation
  const [successNotification, setSuccessNotification] = useState<Shipment | null>(null);

  // Handlers
  const handleTrackResi = (resi: string) => {
    setTrackingQuery(resi);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCalculator = (origin?: string, dest?: string) => {
    if (origin || dest) {
      setBookingPrefill(prev => ({ ...prev, origin, destination: dest }));
    }
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookWithEstimate = (details: {
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
  }) => {
    setBookingPrefill({
      origin: details.origin,
      destination: details.destination,
      weight: details.weight,
      length: details.length,
      width: details.width,
      height: details.height,
      service: details.service,
      pickupType: details.pickupType,
      itemValue: details.itemValue,
    });
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceFromLanding = (service: ServiceType) => {
    setBookingPrefill(prev => ({ ...prev, service }));
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (newShipment: Shipment) => {
    setSuccessNotification(newShipment);
    setActiveWaybill(newShipment);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar adhering to 3-zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Success Banner when a booking is created */}
        {successNotification && (
          <div className="bg-emerald-600 text-white px-4 py-3 text-xs sm:text-sm font-semibold shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Pemesanan Kargo Berhasil Diterbitkan! Resi: <strong className="font-mono">{successNotification.trackingNumber}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleTrackResi(successNotification.trackingNumber);
                    setSuccessNotification(null);
                  }}
                  className="underline hover:text-emerald-100 font-bold"
                >
                  Lacak Resi Ini &rarr;
                </button>
                <button
                  onClick={() => setSuccessNotification(null)}
                  className="text-white hover:text-emerald-200 px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Router */}
        {isAdminMode ? (
          <AdminDashboard
            onOpenWaybill={(s) => setActiveWaybill(s)}
            onTrack={handleTrackResi}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                <HeroSection
                  onTrack={handleTrackResi}
                  onNavigateToCalculator={handleNavigateToCalculator}
                  onNavigateToBooking={() => {
                    setActiveTab('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <ServicesSection
                  onSelectService={handleSelectServiceFromLanding}
                />
                <AdvantagesSection />
              </>
            )}

            {activeTab === 'calculator' && (
              <ShippingCalculator
                initialOrigin={bookingPrefill.origin || 'Jakarta (Tj. Priok)'}
                initialDest={bookingPrefill.destination || 'Surabaya (Tj. Perak)'}
                onBookWithEstimate={handleBookWithEstimate}
              />
            )}

            {activeTab === 'booking' && (
              <BookingForm
                initialDetails={bookingPrefill}
                onSuccess={handleBookingSuccess}
                onNavigateToCalculator={() => setActiveTab('calculator')}
              />
            )}

            {activeTab === 'tracking' && (
              <TrackingSection
                initialTrackingNumber={trackingQuery}
                onOpenWaybill={(s) => setActiveWaybill(s)}
              />
            )}

            {activeTab === 'customer_portal' && (
              <CustomerDashboard
                onTrack={handleTrackResi}
                onOpenWaybill={(s) => setActiveWaybill(s)}
                onNavigateToBooking={() => {
                  setActiveTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'laravel_export' && (
              <LaravelArchitectureModal />
            )}
          </>
        )}
      </main>

      {/* Printable Digital Surat Jalan & Resi Modal */}
      <WaybillModal
        shipment={activeWaybill}
        onClose={() => setActiveWaybill(null)}
      />

      {/* Corporate Logistics Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
