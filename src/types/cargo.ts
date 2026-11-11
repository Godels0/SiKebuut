export type ServiceType = 
  | 'Kargo Laut Reguler' 
  | 'Kargo Laut Express';

export type ShipmentStatus = 
  | 'order_created' 
  | 'picked_up' 
  | 'port_loading' 
  | 'sailing_transit' 
  | 'port_arrived' 
  | 'out_for_delivery' 
  | 'delivered'
  | 'cancelled';

export interface TrackingMilestone {
  id: string;
  status: ShipmentStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface Courier {
  id: number;
  name: string;
  phone: string;
  licensePlate: string;
  vehicleType: string;
  assignedArea: string;
  status: 'active' | 'on_duty' | 'standby' | 'offline';
  photo?: string;
}

export interface FleetVehicle {
  id: number;
  fleetCode: string;
  vehicleName: string;
  plateNumber: string; // IMO / Registrasi Kapal
  category: 'Kapal Kontainer' | 'Kapal Kargo Ro-Ro' | 'Kapal Kargo Cepat (Fast Vessel)' | 'Kapal Tol Laut Nusantara';
  capacityKg: number; // Kapasitas muat ton/kg
  status: 'ready' | 'in_transit' | 'maintenance';
  currentRoute?: string;
}

export interface ShippingRate {
  id: number;
  originCity: string;
  destinationCity: string;
  serviceType: ServiceType;
  baseRatePerKg: number;
  minWeightKg: number;
  estimatedDays: string;
}

export interface Customer {
  id: number;
  companyName?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  customerType: 'corporate' | 'umkm' | 'individual';
  totalShipments: number;
  createdAt: string;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  
  // Pengirim
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  
  // Penerima
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  
  // Barang & Kontainer
  itemName: string;
  itemCategory: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  chargeableWeightKg: number;
  containerNumber?: string;
  
  // Layanan & Biaya (Kargo Laut Reguler & Express)
  serviceType: ServiceType;
  pickupType: 'pickup' | 'dropoff';
  itemValue: number;
  insuranceFee: number;
  pickupFee: number;
  shippingFee: number;
  totalFee: number;
  
  // Operasional Maritim
  status: ShipmentStatus;
  currentLocation: string;
  courierId?: number;
  courierName?: string;
  courierPhone?: string;
  fleetId?: number;
  fleetCode?: string;
  
  notes?: string;
  recipientSignature?: string;
  logs: TrackingMilestone[];
  createdAt: string;
  updatedAt: string;
}
