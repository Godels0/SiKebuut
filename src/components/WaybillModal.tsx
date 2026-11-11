import React from 'react';
import { X, Printer, Ship, Anchor } from 'lucide-react';
import { Shipment } from '../types/cargo.ts';

interface WaybillModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surat Jalan Laut (Sea Waybill):</span>
            <span className="font-mono font-bold text-blue-700 text-sm">{shipment.trackingNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Surat Jalan Laut</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="border border-slate-300 rounded-xl p-6 sm:p-7 space-y-6 text-slate-900 font-sans">
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  <Ship className="w-4 h-4" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">SiKebut Marine Cargo</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                PT SiKebut Pelayaran Nusantara · Konosemen / Surat Jalan Muatan Kapal Kargo
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-sm font-extrabold text-blue-700 tracking-wider">
                {shipment.trackingNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Tgl Terbit: {shipment.createdAt}
              </div>
              <div className="text-xs font-bold uppercase text-slate-800 mt-1">
                Layanan: {shipment.serviceType}
              </div>
            </div>
          </div>

          {/* Barcode & Container Number */}
          <div className="py-2.5 px-4 border-y border-slate-200 bg-slate-50 rounded flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
            <div className="text-center sm:text-left">
              <div className="text-base tracking-[0.3em] font-extrabold text-slate-900 select-none">
                ||| | || |||| | | ||| || ||| | |||
              </div>
              <div className="text-[10px] tracking-widest text-slate-500 font-bold">
                *{shipment.trackingNumber}*
              </div>
            </div>
            {shipment.containerNumber && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">No. Kontainer:</span>
                <span className="font-bold text-blue-800 text-sm">{shipment.containerNumber}</span>
              </div>
            )}
          </div>

          {/* Ports & Address Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <div className="font-bold text-slate-800 uppercase tracking-wider mb-1 text-[11px] text-blue-700">
                PELABUHAN MUAT (PORT OF LOADING)
              </div>
              <div className="font-bold text-slate-900 text-sm mb-0.5">{shipment.senderName}</div>
              <div className="font-mono text-slate-600 mb-1">{shipment.senderPhone}</div>
              <div className="text-slate-600 text-[11px] leading-relaxed">{shipment.senderAddress}</div>
              <div className="font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-blue-600" />
                <span>Pelabuhan: {shipment.senderCity}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <div className="font-bold text-slate-800 uppercase tracking-wider mb-1 text-[11px] text-indigo-700">
                PELABUHAN BONGKAR (PORT OF DISCHARGE)
              </div>
              <div className="font-bold text-slate-900 text-sm mb-0.5">{shipment.receiverName}</div>
              <div className="font-mono text-slate-600 mb-1">{shipment.receiverPhone}</div>
              <div className="text-slate-600 text-[11px] leading-relaxed">{shipment.receiverAddress}</div>
              <div className="font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pelabuhan: {shipment.receiverCity}</span>
              </div>
            </div>
          </div>

          {/* Cargo Item Specifications Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Manifest Muatan</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5 text-center">Dimensi (P×L×T)</th>
                  <th className="p-2.5 text-right">Berat Timbangan</th>
                  <th className="p-2.5 text-right font-bold">Berat Tagih</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-medium">{shipment.itemName}</td>
                  <td className="p-2.5 text-slate-600">{shipment.itemCategory}</td>
                  <td className="p-2.5 text-center font-mono">{shipment.lengthCm}×{shipment.widthCm}×{shipment.heightCm} cm</td>
                  <td className="p-2.5 text-right font-mono">{shipment.weightKg} Kg</td>
                  <td className="p-2.5 text-right font-mono font-bold text-blue-700">{shipment.chargeableWeightKg} Kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-between items-end border-t border-slate-200 pt-4 text-xs">
            <div className="space-y-1 text-slate-500 text-[11px]">
              <div>Kapal Pengangkut: <strong>{shipment.fleetCode || 'KM Nusantara Container'}</strong></div>
              <div>Metode: <strong>{shipment.pickupType === 'pickup' ? 'Hauling Penjemputan' : 'Drop-off Dermaga Pelabuhan'}</strong></div>
              {shipment.notes && <div>Catatan Palka: <em>{shipment.notes}</em></div>}
            </div>

            <div className="w-56 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kapal:</span>
                <span className="font-mono font-semibold">Rp {shipment.shippingFee.toLocaleString('id-ID')}</span>
              </div>
              {shipment.insuranceFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Asuransi Marine:</span>
                  <span className="font-mono font-semibold">Rp {shipment.insuranceFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              {shipment.pickupFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Hauling:</span>
                  <span className="font-mono font-semibold">Rp {shipment.pickupFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-1.5">
                <span>Total Biaya:</span>
                <span className="font-mono text-blue-700">Rp {shipment.totalFee.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Signatures Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="mb-14">Pengirim (Shipper):</div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">{shipment.senderName}</div>
            </div>
            <div>
              <div className="mb-14">Nahkoda / Perwira Kapal:</div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">{shipment.courierName || 'Mualim I / Officer Pelabuhan'}</div>
            </div>
            <div>
              <div className="mb-14">Penerima (Consignee):</div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900">
                {shipment.recipientSignature || '(Tanda Tangan & Cap)'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
