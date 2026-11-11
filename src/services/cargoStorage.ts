import { Shipment, Courier, FleetVehicle, ShippingRate, Customer, ServiceType, ShipmentStatus, TrackingMilestone } from '../types/cargo.ts';
import { INITIAL_COURIERS, INITIAL_CUSTOMERS, INITIAL_FLEETS, INITIAL_RATES, INITIAL_SHIPMENTS } from '../data/initialData.ts';

const STORAGE_KEYS = {
  SHIPMENTS: 'sikebut_sea_cargo_shipments_v2',
  COURIERS: 'sikebut_sea_cargo_couriers_v2',
  FLEETS: 'sikebut_sea_cargo_fleets_v2',
  CUSTOMERS: 'sikebut_sea_cargo_customers_v2',
  RATES: 'sikebut_sea_cargo_rates_v2',
};

export const cargoStorage = {
  getShipments(): Shipment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHIPMENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed reading shipments from storage', e);
    }
    return INITIAL_SHIPMENTS;
  },

  saveShipments(shipments: Shipment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments));
    } catch (e) {
      console.error('Failed writing shipments to storage', e);
    }
  },

  getCouriers(): Courier[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURIERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_COURIERS;
  },

  saveCouriers(couriers: Courier[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COURIERS, JSON.stringify(couriers));
    } catch (e) {
      console.error(e);
    }
  },

  getFleets(): FleetVehicle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLEETS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_FLEETS;
  },

  saveFleets(fleets: FleetVehicle[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FLEETS, JSON.stringify(fleets));
    } catch (e) {
      console.error(e);
    }
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_CUSTOMERS;
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  },

  getRates(): ShippingRate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RATES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_RATES;
  },

  // Perhitungan kubikasi laut standar internasional (1 CBM = 250 - 400 Kg)
  calculateWeights(weightKg: number, lengthCm: number, widthCm: number, heightCm: number) {
    const volumeCbm = (lengthCm * widthCm * heightCm) / 1000000;
    const volumetricWeight = (lengthCm * widthCm * heightCm) / 4000;
    const roundedVolume = Math.round(volumetricWeight * 10) / 10;
    const chargeable = Math.max(weightKg, roundedVolume);
    return {
      actualWeight: weightKg,
      volumetricWeight: roundedVolume,
      cbm: Math.round(volumeCbm * 100) / 100,
      chargeableWeight: Math.round(chargeable * 10) / 10,
    };
  },

  // Kalkulasi tarif kapal kargo (Hanya Kargo Laut Reguler & Kargo Laut Express)
  calculateCost(
    originCity: string,
    destinationCity: string,
    serviceType: ServiceType,
    chargeableWeight: number,
    itemValue: number = 0,
    pickupType: 'pickup' | 'dropoff' = 'dropoff'
  ) {
    const rates = this.getRates();
    const foundRate = rates.find(
      r => r.originCity.toLowerCase() === originCity.toLowerCase() &&
           r.destinationCity.toLowerCase() === destinationCity.toLowerCase() &&
           r.serviceType === serviceType
    );

    let ratePerKg = serviceType === 'Kargo Laut Express' ? 4800 : 2800;
    let estimatedDays = serviceType === 'Kargo Laut Express' ? '2-3 Hari Pelayaran' : '4-6 Hari Pelayaran';
    let minWeight = 20; // Minimal kargo laut 20 Kg

    if (foundRate) {
      ratePerKg = foundRate.baseRatePerKg;
      estimatedDays = foundRate.estimatedDays;
      minWeight = foundRate.minWeightKg;
    }

    const billableWeight = Math.max(chargeableWeight, minWeight);
    const shippingFee = billableWeight * ratePerKg;
    const insuranceFee = itemValue > 0 ? Math.round(itemValue * 0.002) : 0; // 0.2% Marine Cargo All-Risk
    const pickupFee = pickupType === 'pickup' ? (chargeableWeight > 500 ? 150000 : 75000) : 0;
    const totalFee = shippingFee + insuranceFee + pickupFee;

    return {
      ratePerKg,
      billableWeight,
      minWeight,
      shippingFee,
      insuranceFee,
      pickupFee,
      totalFee,
      estimatedDays
    };
  },

  generateTrackingNumber(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    return `SKB-${datePrefix}-${randomSuffix}`;
  },

  generateContainerNumber(): string {
    const randomSix = Math.floor(100000 + Math.random() * 900000);
    const checkDigit = Math.floor(Math.random() * 9);
    return `SKBU-${randomSix}-${checkDigit}`;
  },

  createShipment(shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'containerNumber' | 'status' | 'currentLocation' | 'logs' | 'createdAt' | 'updatedAt'>): Shipment {
    const shipments = this.getShipments();
    const trackingNumber = this.generateTrackingNumber();
    const containerNumber = this.generateContainerNumber();
    const now = new Date();
    const timeString = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const initialLog: TrackingMilestone = {
      id: `log-${Date.now()}`,
      status: 'order_created',
      title: 'Booking Kargo Kapal Laut Diterbitkan',
      description: `Pemesanan kargo layanan ${shipmentData.serviceType} berhasil diverifikasi. Kontainer ${containerNumber} dijadwalkan muat di ${shipmentData.senderCity}.`,
      location: `Dermaga ${shipmentData.senderCity}`,
      timestamp: timeString,
    };

    const newShipment: Shipment = {
      ...shipmentData,
      id: Date.now(),
      trackingNumber,
      containerNumber,
      status: 'order_created',
      currentLocation: `Gudang Lini 1 CFS ${shipmentData.senderCity}`,
      logs: [initialLog],
      createdAt: timeString,
      updatedAt: timeString,
    };

    const updated = [newShipment, ...shipments];
    this.saveShipments(updated);
    return newShipment;
  },

  updateShipmentStatus(
    trackingNumber: string,
    newStatus: ShipmentStatus,
    newLocation: string,
    logTitle: string,
    logDescription: string,
    courierId?: number,
    fleetId?: number
  ): Shipment | null {
    const shipments = this.getShipments();
    const index = shipments.findIndex(s => s.trackingNumber.toUpperCase() === trackingNumber.toUpperCase());
    if (index === -1) return null;

    const shipment = shipments[index];
    const now = new Date();
    const timeString = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const newLog: TrackingMilestone = {
      id: `log-${Date.now()}`,
      status: newStatus,
      title: logTitle,
      description: logDescription,
      location: newLocation,
      timestamp: timeString,
    };

    let courierName = shipment.courierName;
    let courierPhone = shipment.courierPhone;
    if (courierId) {
      const couriers = this.getCouriers();
      const courier = couriers.find(c => c.id === courierId);
      if (courier) {
        courierName = courier.name;
        courierPhone = courier.phone;
      }
    }

    let fleetCode = shipment.fleetCode;
    if (fleetId) {
      const fleets = this.getFleets();
      const fleet = fleets.find(f => f.id === fleetId);
      if (fleet) {
        fleetCode = `${fleet.fleetCode} (${fleet.vehicleName})`;
      }
    }

    const updatedShipment: Shipment = {
      ...shipment,
      status: newStatus,
      currentLocation: newLocation,
      courierId: courierId ?? shipment.courierId,
      courierName,
      courierPhone,
      fleetId: fleetId ?? shipment.fleetId,
      fleetCode,
      updatedAt: timeString,
      logs: [newLog, ...shipment.logs],
    };

    shipments[index] = updatedShipment;
    this.saveShipments(shipments);
    return updatedShipment;
  },

  findShipment(trackingNumber: string): Shipment | null {
    const shipments = this.getShipments();
    const query = trackingNumber.trim().toUpperCase();
    return shipments.find(s => s.trackingNumber.toUpperCase() === query) || null;
  },

  exportShipmentsToCSV(): string {
    const shipments = this.getShipments();
    const headers = [
      'No Resi',
      'No Kontainer',
      'Tanggal',
      'Pengirim',
      'Pelabuhan Asal',
      'Penerima',
      'Pelabuhan Tujuan',
      'Nama Barang',
      'Kategori',
      'Layanan Kargo Laut',
      'Berat (Kg)',
      'Biaya Total (Rp)',
      'Status',
      'Posisi Kapal / Lokasi',
      'Kapal / Nahkoda'
    ];

    const rows = shipments.map(s => [
      s.trackingNumber,
      `"${s.containerNumber || '-'}"`,
      `"${s.createdAt}"`,
      `"${s.senderName}"`,
      `"${s.senderCity}"`,
      `"${s.receiverName}"`,
      `"${s.receiverCity}"`,
      `"${s.itemName}"`,
      `"${s.itemCategory}"`,
      s.serviceType,
      s.chargeableWeightKg,
      s.totalFee,
      s.status,
      `"${s.currentLocation}"`,
      `"${s.fleetCode || s.courierName || '-'}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
