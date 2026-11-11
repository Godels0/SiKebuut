import React, { useState } from 'react';
import { 
  LayoutDashboard, Ship, Users, FileSpreadsheet, Package, Search, 
  Plus, Edit, Download, CheckCircle2, AlertCircle, RefreshCw, X, Shield, Phone, MapPin, Anchor 
} from 'lucide-react';
import { Shipment, Courier, FleetVehicle, Customer, ShipmentStatus, ServiceType } from '../types/cargo.ts';
import { cargoStorage } from '../services/cargoStorage.ts';
import { INDONESIA_CITIES } from '../data/initialData.ts';

interface AdminDashboardProps {
  onOpenWaybill: (shipment: Shipment) => void;
  onTrack: (resi: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenWaybill,
  onTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'shipments' | 'couriers' | 'customers' | 'reports'>('shipments');
  
  const [shipments, setShipments] = useState<Shipment[]>(() => cargoStorage.getShipments());
  const [couriers, setCouriers] = useState<Courier[]>(() => cargoStorage.getCouriers());
  const [fleets, setFleets] = useState<FleetVehicle[]>(() => cargoStorage.getFleets());
  const [customers, setCustomers] = useState<Customer[]>(() => cargoStorage.getCustomers());

  const [searchShipment, setSearchShipment] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal: Update Status
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('sailing_transit');
  const [newLocation, setNewLocation] = useState('');
  const [logTitle, setLogTitle] = useState('');
  const [logDesc, setLogDesc] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState<number | undefined>(undefined);
  const [selectedFleetId, setSelectedFleetId] = useState<number | undefined>(undefined);

  // Modal: Add Courier / Nahkoda
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierPhone, setNewCourierPhone] = useState('');
  const [newCourierPlate, setNewCourierPlate] = useState('');
  const [newCourierVehicle, setNewCourierVehicle] = useState('KM Nusantara Container');
  const [newCourierArea, setNewCourierArea] = useState('Rute: Jakarta - Surabaya - Makassar');

  // Modal: Add Customer
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustPerson, setNewCustPerson] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustCity, setNewCustCity] = useState('Jakarta (Tj. Priok)');
  const [newCustType, setNewCustType] = useState<'corporate' | 'umkm' | 'individual'>('corporate');

  const reloadData = () => {
    setShipments(cargoStorage.getShipments());
    setCouriers(cargoStorage.getCouriers());
    setFleets(cargoStorage.getFleets());
    setCustomers(cargoStorage.getCustomers());
  };

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(s => s.status === 'sailing_transit' || s.status === 'port_loading' || s.status === 'port_arrived').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const totalRevenue = shipments.reduce((acc, s) => acc + s.totalFee, 0);
  const activeFleets = fleets.filter(f => f.status === 'ready' || f.status === 'in_transit').length;

  const filteredShipments = shipments.filter((s) => {
    const matches =
      s.trackingNumber.toLowerCase().includes(searchShipment.toLowerCase()) ||
      (s.containerNumber && s.containerNumber.toLowerCase().includes(searchShipment.toLowerCase())) ||
      s.senderName.toLowerCase().includes(searchShipment.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(searchShipment.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchShipment.toLowerCase());
    if (!matches) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const openUpdateModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setNewStatus(shipment.status);
    setNewLocation(shipment.currentLocation);
    setLogTitle(
      shipment.status === 'sailing_transit' ? 'Posisi Pelayaran Laut Terkini' :
      shipment.status === 'port_arrived' ? 'Kapal Sandar di Pelabuhan Tujuan' :
      'Pembaruan Status Muatan Kapal'
    );
    setLogDesc(`Status pelayaran diperbarui di ${shipment.currentLocation}.`);
    setSelectedCourierId(shipment.courierId);
    setSelectedFleetId(shipment.fleetId);
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    cargoStorage.updateShipmentStatus(
      editingShipment.trackingNumber,
      newStatus,
      newLocation,
      logTitle,
      logDesc,
      selectedCourierId,
      selectedFleetId
    );

    setEditingShipment(null);
    reloadData();
  };

  const handleAddCourier = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCouriers = cargoStorage.getCouriers();
    const newEntry: Courier = {
      id: Date.now(),
      name: newCourierName,
      phone: newCourierPhone,
      licensePlate: newCourierPlate,
      vehicleType: newCourierVehicle,
      assignedArea: newCourierArea,
      status: 'active'
    };
    cargoStorage.saveCouriers([newEntry, ...currentCouriers]);
    setCouriers([newEntry, ...currentCouriers]);
    setShowAddCourierModal(false);
    setNewCourierName('');
    setNewCourierPhone('');
    setNewCourierPlate('');
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCusts = cargoStorage.getCustomers();
    const newEntry: Customer = {
      id: Date.now(),
      companyName: newCustCompany,
      contactPerson: newCustPerson,
      phone: newCustPhone,
      email: newCustEmail,
      address: `Area ${newCustCity}`,
      city: newCustCity,
      customerType: newCustType,
      totalShipments: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    cargoStorage.saveCustomers([newEntry, ...currentCusts]);
    setCustomers([newEntry, ...currentCusts]);
    setShowAddCustomerModal(false);
    setNewCustCompany('');
    setNewCustPerson('');
    setNewCustPhone('');
  };

  const handleDownloadCSV = () => {
    const csvContent = cargoStorage.exportShipmentsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Kargo_Laut_SiKebut_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Operational Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-blue-600" />
              <span>Marine Operations Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dashboard Operasional Kapal Kargo SiKebut
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kendali manifest pelayaran, alokasi armada kapal kontainer & kapal cepat, data pengirim, dan laporan transaksi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor Manifest CSV</span>
            </button>
            <button
              onClick={reloadData}
              className="p-2 rounded-lg text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Total Manifest Kargo</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalShipments}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Kontainer & LCL</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Pelayaran / Sandar Aktif</div>
            <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{inTransitCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Kapal di laut / dermaga</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Tuntas Bongkar (BAST)</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{deliveredCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Diterima lengkap</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Total Omzet Pelayaran</div>
            <div className="text-lg font-bold text-blue-700 font-mono tabular-nums">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Termasuk asuransi laut</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm col-span-2 sm:col-span-1">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Kapal Kargo Siap Jalan</div>
            <div className="text-2xl font-bold text-purple-700 font-mono tabular-nums">
              {activeFleets} / {fleets.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Armada aktif</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit text-xs font-semibold">
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'shipments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manajemen Kargo ({shipments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('couriers')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'couriers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Kapal & Nahkoda ({fleets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'customers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pelanggan ({customers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Laporan Laut</span>
          </button>
        </div>

        {/* TAB 1: SHIPMENTS MANAGEMENT */}
        {activeTab === 'shipments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchShipment}
                    onChange={(e) => setSearchShipment(e.target.value)}
                    placeholder="Cari resi, kontainer, barang..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                >
                  <option value="all">Semua Status Maritim</option>
                  <option value="order_created">Booking Diterbitkan</option>
                  <option value="picked_up">Terima di CFS Dermaga</option>
                  <option value="port_loading">Muat ke Kapal (Stuffing)</option>
                  <option value="sailing_transit">Dalam Pelayaran Laut</option>
                  <option value="port_arrived">Sandar Pelabuhan Tujuan</option>
                  <option value="out_for_delivery">Pengantaran ke Alamat</option>
                  <option value="delivered">Tuntas Diterima</option>
                </select>
              </div>

              <div className="text-xs text-slate-500">
                Menampilkan <strong className="text-slate-900">{filteredShipments.length}</strong> muatan kargo laut
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Resi & Kontainer</th>
                    <th className="px-4 py-3 font-semibold">Pelabuhan Asal → Tujuan</th>
                    <th className="px-4 py-3 font-semibold">Manifest & Layanan</th>
                    <th className="px-4 py-3 font-semibold text-right">Berat Tagih</th>
                    <th className="px-4 py-3 font-semibold">Posisi / Koordinat Laut</th>
                    <th className="px-4 py-3 font-semibold">Kapal Pengangkut</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-blue-700 block">{s.trackingNumber}</span>
                        <span className="text-[11px] font-mono text-slate-500">{s.containerNumber || 'LCL Cargo'}</span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{s.senderCity}</div>
                        <div className="text-[11px] text-slate-500">&rarr; {s.receiverCity}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 max-w-[180px] truncate" title={s.itemName}>{s.itemName}</div>
                        <div className="text-[11px] text-blue-700 font-bold">{s.serviceType}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-slate-800">
                        {s.chargeableWeightKg.toLocaleString('id-ID')} Kg
                      </td>

                      <td className="px-4 py-3 max-w-[180px]">
                        <div className="truncate text-slate-700" title={s.currentLocation}>
                          {s.currentLocation}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{s.fleetCode || 'KM Nusantara Container'}</div>
                        <div className="text-[11px] text-slate-400">{s.courierName || 'Kapten / Nahkoda'}</div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                          {s.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openUpdateModal(s)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            title="Update Status Perjalanan Laut"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => onOpenWaybill(s)}
                            className="p-1 text-slate-600 hover:text-blue-600 rounded"
                            title="Lihat Surat Jalan Laut"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FLEETS & COURIERS */}
        {activeTab === 'couriers' && (
          <div className="space-y-6">
            
            {/* Fleets Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-900">Armada Kapal Kargo SiKebut</h3>
                <p className="text-xs text-slate-500">Unit Kapal Kontainer, Kapal Kargo Cepat (Fast Freighter), Kapal Ro-Ro, dan Tol Laut.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fleets.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-blue-700">{f.fleetCode}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {f.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{f.vehicleName}</div>
                    <div className="text-xs text-blue-600 font-medium">{f.category}</div>
                    <div className="text-xs text-slate-500">Registrasi: <span className="font-mono font-medium">{f.plateNumber}</span></div>
                    <div className="text-xs text-slate-500">Rute: {f.currentRoute || 'Pelayaran Siap Jalan'}</div>
                    <div className="text-xs font-mono text-slate-700 pt-2 border-t border-slate-200">
                      Kapasitas Muat: <strong>{(f.capacityKg / 1000).toLocaleString('id-ID')} Ton</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nahkoda & Petugas Pelabuhan Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Nahkoda & Petugas Dermaga Pelabuhan</h3>
                  <p className="text-xs text-slate-500">Perwira kapal dan dispatcher logistik dermaga penanggung jawab.</p>
                </div>
                <button
                  onClick={() => setShowAddCourierModal(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Petugas</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Nama & Jabatan</th>
                      <th className="px-4 py-2.5">Kontak</th>
                      <th className="px-4 py-2.5">Kapal / Penugasan</th>
                      <th className="px-4 py-2.5">Area Operasi Pelabuhan</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {couriers.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{c.phone}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{c.vehicleType}</td>
                        <td className="px-4 py-3 text-slate-600">{c.assignedArea}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            c.status === 'on_duty' ? 'bg-amber-100 text-amber-800' :
                            c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Direktori Shipper & Pelanggan Kargo Laut</h3>
                <p className="text-xs text-slate-500">Perusahaan industri, distributor FMCG, dan importir/eksportir terdaftar.</p>
              </div>
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pelanggan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Perusahaan / Shipper</th>
                    <th className="px-4 py-2.5">Kontak Person</th>
                    <th className="px-4 py-2.5">Telepon & Email</th>
                    <th className="px-4 py-2.5">Pelabuhan Pangkalan</th>
                    <th className="px-4 py-2.5">Kategori</th>
                    <th className="px-4 py-2.5 text-right">Total Order Laut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.companyName || c.contactPerson}</td>
                      <td className="px-4 py-3 text-slate-700">{c.contactPerson}</td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-800">{c.phone}</div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{c.city}</td>
                      <td className="px-4 py-3 uppercase text-[10px] font-semibold tracking-wider text-slate-500">
                        {c.customerType}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">
                        {c.totalShipments} Kontainer
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Kinerja Operasional Kapal Kargo
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ketepatan Jadwal Sandar:</span>
                    <span className="font-bold text-emerald-600 font-mono">97.8% On-Time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rata-rata Waktu Berlayar:</span>
                    <span className="font-bold text-slate-800 font-mono">3.4 Hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Muatan Terangkut:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {(shipments.reduce((acc, s) => acc + s.chargeableWeightKg, 0) / 1000).toLocaleString('id-ID')} Ton
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Insiden Cuaca Buruk / Klaim:</span>
                    <span className="font-bold text-slate-800 font-mono">0 Kasus</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Distribusi Dua Layanan Laut
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="font-semibold">Kargo Laut Reguler (Kontainer & Ro-Ro)</span>
                      <span className="font-mono font-bold">72%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="w-[72%] h-full bg-blue-600 rounded-full" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Muatan tonase besar & FCL</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="font-semibold">Kargo Laut Express (Kapal Cepat)</span>
                      <span className="font-mono font-bold">28%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="w-[28%] h-full bg-indigo-600 rounded-full" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Muatan cepat prioritas sandar</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">
                    Ekspor Manifest & Laporan Transaksi
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Unduh berkas spreadsheet CSV lengkap berisi nomor resi, nomor kontainer, pelabuhan asal & tujuan, berat tonase, detail ongkir laut, nama kapal, dan riwayat status pelayaran.
                  </p>
                </div>
                <button
                  onClick={handleDownloadCSV}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Manifest CSV (.csv)</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL: UPDATE STATUS MARITIM */}
      {editingShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Status Kargo Kapal Laut</h3>
                <span className="text-xs font-mono text-blue-700 font-semibold">{editingShipment.trackingNumber}</span>
              </div>
              <button
                onClick={() => setEditingShipment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Maritim Baru *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                >
                  <option value="order_created">Booking Diterbitkan</option>
                  <option value="picked_up">Terima di CFS Dermaga</option>
                  <option value="port_loading">Pemuatan ke Kapal (Stuffing)</option>
                  <option value="sailing_transit">Dalam Pelayaran Laut (Sailing)</option>
                  <option value="port_arrived">Sandar di Pelabuhan Tujuan</option>
                  <option value="out_for_delivery">Pengantaran ke Alamat Penerima</option>
                  <option value="delivered">Berhasil Diterima oleh Penerima</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Koordinat / Pelabuhan Terkini *</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 font-medium"
                  placeholder="Contoh: Laut Jawa (05°42'S 110°18'E) / Pelabuhan Tanjung Perak"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Catatan Checkpoint *</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 font-medium"
                  placeholder="Contoh: Kapal Sandar di Dermaga Jamrud"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Detail Catatan Pelayaran</label>
                <textarea
                  rows={2}
                  value={logDesc}
                  onChange={(e) => setLogDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 font-medium"
                  placeholder="Keterangan pergerakan kapal, cuaca, atau proses bongkar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nahkoda / Officer</label>
                  <select
                    value={selectedCourierId || ''}
                    onChange={(e) => setSelectedCourierId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                  >
                    <option value="">Pilih Nahkoda/Petugas...</option>
                    {couriers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapal Kargo</label>
                  <select
                    value={selectedFleetId || ''}
                    onChange={(e) => setSelectedFleetId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                  >
                    <option value="">Pilih Kapal...</option>
                    {fleets.map((f) => (
                      <option key={f.id} value={f.id}>{f.fleetCode} - {f.vehicleName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingShipment(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURIER */}
      {showAddCourierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Nahkoda / Petugas Pelabuhan</h3>
              <button onClick={() => setShowAddCourierModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddCourier} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newCourierName}
                  onChange={(e) => setNewCourierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                  placeholder="Contoh: Mualim I Irfan Hakim"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. Kontak WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newCourierPhone}
                  onChange={(e) => setNewCourierPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 font-mono"
                  placeholder="0812-xxxx-xxxx"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kapal Kargo Bertugas</label>
                <input
                  type="text"
                  value={newCourierVehicle}
                  onChange={(e) => setNewCourierVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                  placeholder="KM Nusantara Container"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rute Pelayaran</label>
                <input
                  type="text"
                  value={newCourierArea}
                  onChange={(e) => setNewCourierArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                  placeholder="Jakarta - Surabaya - Makassar"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourierModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOMER */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Shipper / Klien Baru</h3>
              <button onClick={() => setShowAddCustomerModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan Shipper</label>
                <input
                  type="text"
                  value={newCustCompany}
                  onChange={(e) => setNewCustCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                  placeholder="PT Samudera Logistik Indonesia"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kontak Person *</label>
                <input
                  type="text"
                  required
                  value={newCustPerson}
                  onChange={(e) => setNewCustPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500"
                  placeholder="Bpk. Hendra"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / Telepon *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 font-mono"
                  placeholder="0813-xxxx-xxxx"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Pangkalan</label>
                <select
                  value={newCustCity}
                  onChange={(e) => setNewCustCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 bg-white"
                >
                  {INDONESIA_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500"
                >
                  Simpan Shipper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
