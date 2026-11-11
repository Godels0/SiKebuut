import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Search, Plus, FileText, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/cargo.ts';
import { cargoStorage } from '../services/cargoStorage.ts';

interface CustomerDashboardProps {
  onTrack: (resi: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
  onNavigateToBooking: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onTrack,
  onOpenWaybill,
  onNavigateToBooking,
}) => {
  const [shipments, setShipments] = useState<Shipment[]>(() => cargoStorage.getShipments());
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalCount = shipments.length;
  const activeCount = shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const totalSpending = shipments.reduce((acc, s) => acc + s.totalFee, 0);

  // Filter
  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiverCity.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'active') return s.status !== 'delivered' && s.status !== 'cancelled';
    if (statusFilter === 'delivered') return s.status === 'delivered';
    return true;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'order_created':
        return <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">Booking Diterbitkan</span>;
      case 'picked_up':
        return <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-semibold">Terima di CFS</span>;
      case 'port_loading':
        return <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold">Muat ke Kapal</span>;
      case 'sailing_transit':
        return <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">Dalam Pelayaran Laut</span>;
      case 'port_arrived':
        return <span className="text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded text-[11px] font-semibold">Sandar di Pelabuhan</span>;
      case 'out_for_delivery':
        return <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-semibold">Pengantaran Akhir</span>;
      case 'delivered':
        return <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">Tuntas Diterima</span>;
      case 'cancelled':
        return <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold">Dibatalkan</span>;
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1">
              Portal Pelanggan SiKebut
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Riwayat & Monitoring Pengiriman
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau seluruh aktivitas pengiriman kargo, cetak surat jalan, dan buat pesanan baru.
            </p>
          </div>

          <button
            onClick={onNavigateToBooking}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Kargo Baru</span>
          </button>
        </div>

        {/* 4 Metric Cards (Single elevation, hairline borders) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Total Pengiriman</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Seluruh rute logistik</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Sedang Dalam Perjalanan</div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">{activeCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Menuju lokasi tujuan</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Berhasil Diterima</div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">{deliveredCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Surat jalan tuntas</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Total Biaya Logistik</div>
            <div className="text-xl font-extrabold text-blue-600 font-mono tabular-nums">
              Rp {totalSpending.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Termasuk asuransi & pickup</div>
          </div>
        </div>

        {/* Filter and Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Control Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({shipments.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sedang Aktif ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  statusFilter === 'delivered'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selesai ({deliveredCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari resi, barang, kota..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">No. Resi & Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Barang & Kategori</th>
                  <th className="px-5 py-3 font-semibold">Rute (Asal → Tujuan)</th>
                  <th className="px-5 py-3 font-semibold">Layanan</th>
                  <th className="px-5 py-3 font-semibold text-right">Berat Tagih</th>
                  <th className="px-5 py-3 font-semibold text-right">Biaya (Rp)</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => onTrack(shipment.trackingNumber)}
                          className="font-mono font-bold text-blue-600 hover:underline block text-xs"
                        >
                          {shipment.trackingNumber}
                        </button>
                        <span className="text-[11px] text-slate-400">{shipment.createdAt}</span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 max-w-[200px] truncate" title={shipment.itemName}>
                          {shipment.itemName}
                        </div>
                        <div className="text-[11px] text-slate-400">{shipment.itemCategory}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-900">
                          {shipment.senderCity} → {shipment.receiverCity}
                        </div>
                        <div className="text-[11px] text-slate-400">Penerima: {shipment.receiverName}</div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-700 font-medium">
                        {shipment.serviceType}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono text-slate-800">
                        {shipment.chargeableWeightKg} Kg
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-900">
                        Rp {shipment.totalFee.toLocaleString('id-ID')}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        {getStatusBadge(shipment.status)}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onTrack(shipment.trackingNumber)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Lacak Kargo"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenWaybill(shipment)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Cetak Surat Jalan / Resi"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                      Tidak ada pengiriman yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
