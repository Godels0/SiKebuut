import React, { useState } from 'react';
import { Package, MapPin, Ship, Shield, CheckCircle2, ArrowRight, User, Phone, Anchor, Info } from 'lucide-react';
import { INDONESIA_CITIES, ITEM_CATEGORIES } from '../data/initialData.ts';
import { ServiceType, Shipment } from '../types/cargo.ts';
import { cargoStorage } from '../services/cargoStorage.ts';

interface BookingFormProps {
  initialDetails?: {
    origin?: string;
    destination?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    service?: ServiceType;
    pickupType?: 'pickup' | 'dropoff';
    itemValue?: number;
  };
  onSuccess: (shipment: Shipment) => void;
  onNavigateToCalculator: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialDetails,
  onSuccess,
  onNavigateToCalculator,
}) => {
  // Pengirim
  const [senderName, setSenderName] = useState('PT Cahaya Maritim Nusantara');
  const [senderPhone, setSenderPhone] = useState('0812-3344-5566');
  const [senderCity, setSenderCity] = useState(initialDetails?.origin || 'Jakarta (Tj. Priok)');
  const [senderAddress, setSenderAddress] = useState('Kawasan Industri Maritim Tanjung Priok Kav. 24');

  // Penerima
  const [receiverName, setReceiverName] = useState('Bpk. Daeng Rudi Prasetya');
  const [receiverPhone, setReceiverPhone] = useState('0857-8899-0011');
  const [receiverCity, setReceiverCity] = useState(initialDetails?.destination || 'Makassar (Soekarno-Hatta)');
  const [receiverAddress, setReceiverAddress] = useState('Jl. Nusantara Pelabuhan No. 104, Wajo');

  // Barang Kargo
  const [itemName, setItemName] = useState('Sparepart Turbin Mesin & Material Besi Baja');
  const [itemCategory, setItemCategory] = useState(ITEM_CATEGORIES[0]);
  const [weightKg, setWeightKg] = useState<number>(initialDetails?.weight || 450);
  const [lengthCm, setLengthCm] = useState<number>(initialDetails?.length || 150);
  const [widthCm, setWidthCm] = useState<number>(initialDetails?.width || 120);
  const [heightCm, setHeightCm] = useState<number>(initialDetails?.height || 100);
  const [itemValue, setItemValue] = useState<number>(initialDetails?.itemValue || 25000000);

  // Layanan (Hanya 2 Layanan Laut)
  const [serviceType, setServiceType] = useState<ServiceType>(initialDetails?.service || 'Kargo Laut Reguler');
  const [pickupType, setPickupType] = useState<'pickup' | 'dropoff'>(initialDetails?.pickupType || 'dropoff');
  const [notes, setNotes] = useState('Muatan kontainer packing peti kayu standar ekspor.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Volumetric & Chargeable
  const seaVolumetricKg = Math.round(((lengthCm * widthCm * heightCm) / 4000) * 10) / 10;
  const cbm = Math.round(((lengthCm * widthCm * heightCm) / 1000000) * 100) / 100;
  const chargeableWeight = Math.max(weightKg, seaVolumetricKg);

  const cost = cargoStorage.calculateCost(
    senderCity,
    receiverCity,
    serviceType,
    chargeableWeight,
    itemValue,
    pickupType
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newShipment = cargoStorage.createShipment({
        senderName,
        senderPhone,
        senderAddress,
        senderCity,
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCity,
        itemName,
        itemCategory,
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        chargeableWeightKg: chargeableWeight,
        serviceType,
        pickupType,
        itemValue,
        insuranceFee: cost.insuranceFee,
        pickupFee: cost.pickupFee,
        shippingFee: cost.shippingFee,
        totalFee: cost.totalFee,
        notes,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(newShipment);
      }, 400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-blue-600" />
              <span>Formulir Pemesanan Kapal Kargo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pemesanan Kargo Kapal Laut Baru
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pilih antara layanan <strong>Kargo Laut Reguler</strong> atau <strong>Kargo Laut Express</strong> untuk penerbitan surat jalan & nomor kontainer.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToCalculator}
            className="px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors shrink-0"
          >
            ← Simulasi Tarif Dahulu
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Data Pelabuhan Asal & Tujuan */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>1. Data Pelabuhan Asal & Tujuan</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sender Column */}
                <div className="space-y-3.5 p-4 bg-slate-50/70 rounded-xl border border-slate-200/70">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pengirim (Pelabuhan Asal)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nama Perusahaan / Pengirim *</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="PT / Nama Pengirim"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">No. WhatsApp / Telepon *</label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Pelabuhan Keberangkatan *</label>
                    <select
                      value={senderCity}
                      onChange={(e) => setSenderCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                    >
                      {INDONESIA_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Alamat Gudang Pengirim / Dermaga *</label>
                    <textarea
                      rows={2}
                      required
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="Alamat penjemputan atau lokasi gudang..."
                    />
                  </div>
                </div>

                {/* Receiver Column */}
                <div className="space-y-3.5 p-4 bg-slate-50/70 rounded-xl border border-slate-200/70">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Penerima (Pelabuhan Tujuan)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nama Kontak Penerima *</label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="Nama Penerima"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">No. WhatsApp / Telepon *</label>
                    <input
                      type="tel"
                      required
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Pelabuhan Kedatangan *</label>
                    <select
                      value={receiverCity}
                      onChange={(e) => setReceiverCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                    >
                      {INDONESIA_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Alamat Tujuan Pengantaran *</label>
                    <textarea
                      rows={2}
                      required
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                      placeholder="Alamat kantor, gudang penerima di kota tujuan..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Spesifikasi Muatan Kapal Kargo */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span>2. Deskripsi & Dimensi Muatan Kapal Kargo</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nama / Manifest Barang *</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500"
                    placeholder="Contoh: Mesin Turbin / Besi Beton / Komoditas Pangan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Kategori Kargo *</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight & Dimensi */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Berat Fisik (Kg) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:border-blue-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Panjang (cm) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:border-blue-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Lebar (cm) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={widthCm}
                    onChange={(e) => setWidthCm(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:border-blue-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tinggi (cm) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:border-blue-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nilai Kargo (Asuransi Marine Cargo 0.2%)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={itemValue}
                    onChange={(e) => setItemValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:border-blue-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Instruksi Khusus Palka / Kontainer</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:border-blue-500"
                    placeholder="Contoh: Muatan kering, jangan terkena air laut, gunakan sling"
                  />
                </div>
              </div>
            </div>

            {/* 3. Pilihan Layanan: Hanya 2 Layanan Laut */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-600" />
                <span>3. Pilih Layanan Kapal Kargo</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Reguler */}
                <button
                  type="button"
                  onClick={() => setServiceType('Kargo Laut Reguler')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    serviceType === 'Kargo Laut Reguler'
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 font-semibold text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm">Kargo Laut Reguler</span>
                    {serviceType === 'Kargo Laut Reguler' && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">Dipilih</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mb-2">Kapal Kontainer & Ro-Ro Standar Berjadwal</div>
                  <div className="text-[11px] text-slate-500 font-mono">Estimasi: 3 - 7 Hari · Tarif Paling Hemat</div>
                </button>

                {/* Option 2: Express */}
                <button
                  type="button"
                  onClick={() => setServiceType('Kargo Laut Express')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    serviceType === 'Kargo Laut Express'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 font-semibold text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm">Kargo Laut Express</span>
                    {serviceType === 'Kargo Laut Express' && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">Dipilih</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mb-2">Kapal Kargo Cepat Jalur Langsung (Direct Call)</div>
                  <div className="text-[11px] text-slate-500 font-mono">Estimasi: 1 - 3 Hari · Prioritas Sandar Dermaga</div>
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Metode Penyerahan Barang:</label>
                <div className="flex flex-col sm:flex-row gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pickup"
                      checked={pickupType === 'dropoff'}
                      onChange={() => setPickupType('dropoff')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Drop-off ke Gudang CFS Pelabuhan Keberangkatan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pickup"
                      checked={pickupType === 'pickup'}
                      onChange={() => setPickupType('pickup')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Penjemputan Armada Hauling ke Lokasi Pengirim</span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Rincian Biaya Kargo Laut</span>
                <Ship className="w-4 h-4 text-blue-600" />
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Rute Pelayaran:</span>
                  <span className="font-semibold text-slate-800 text-right">{senderCity} &rarr; {receiverCity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Layanan Dipilih:</span>
                  <span className="font-bold text-blue-700">{serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Pelayaran:</span>
                  <span className="font-semibold text-slate-800">{cost.estimatedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Berat Aktual Timbangan:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{weightKg} Kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Kubikasi (CBM):</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{cbm} m³ ({seaVolumetricKg} Kg)</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-slate-900 font-semibold">
                  <span>Berat Dikenakan Biaya:</span>
                  <span className="font-mono tabular-nums">{chargeableWeight} Kg</span>
                </div>
              </div>

              {/* Cost Lines */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tarif Pelayaran Kapal:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    Rp {cost.shippingFee.toLocaleString('id-ID')}
                  </span>
                </div>
                {cost.insuranceFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Asuransi Marine Cargo:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      Rp {cost.insuranceFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                {cost.pickupFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Hauling Pelabuhan:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      Rp {cost.pickupFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Tagihan:</span>
                  <span className="text-base text-blue-700 font-mono">
                    Rp {cost.totalFee.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Menerbitkan Surat Jalan Laut...</span>
                ) : (
                  <>
                    <span>Terbitkan Resi & Surat Jalan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Surat jalan resmi maritim dan nomor kontainer akan diterbitkan seketika.
              </p>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
