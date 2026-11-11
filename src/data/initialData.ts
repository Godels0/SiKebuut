import { Courier, FleetVehicle, ShippingRate, Shipment, Customer } from '../types/cargo.ts';

export const INDONESIA_CITIES = [
  // Pulau Jawa
  'Jakarta (Tj. Priok)',
  'Surabaya (Tj. Perak)',
  'Semarang (Tj. Emas)',
  'Cirebon (Pelabuhan Cirebon)',
  'Banten / Merak (Ciwandan)',
  'Banyuwangi (Tanjung Wangi)',
  // Sumatera
  'Medan (Belawan)',
  'Batam (Batu Ampar)',
  'Palembang (Boom Baru)',
  'Bandar Lampung (Panjang)',
  'Padang (Teluk Bayur)',
  'Pekanbaru (Siak Sri Indrapura)',
  'Banda Aceh (Malahayati)',
  'Jambi (Talang Duku)',
  'Pangkal Pinang (Pangkal Balam)',
  // Kalimantan
  'Balikpapan (Semayang)',
  'Banjarmasin (Trisakti)',
  'Pontianak (Dwikora)',
  'Samarinda (Palaran)',
  'Tarakan (Malundung)',
  'Sampit (Bagendang)',
  // Sulawesi
  'Makassar (Soekarno-Hatta)',
  'Manado / Bitung (Bitung)',
  'Kendari (Nusantara Kendari)',
  'Palu (Pantoloan)',
  'Gorontalo (Pelabuhan Gorontalo)',
  'Parepare (Nusantara Parepare)',
  // Bali & Nusa Tenggara
  'Denpasar (Benoa)',
  'Lombok / Mataram (Lembar)',
  'Kupang (Tenau)',
  'Labuan Bajo (Marina Labuan Bajo)',
  'Bima (Pelabuhan Bima)',
  // Maluku & Papua
  'Ambon (Yos Sudarso)',
  'Ternate (Ahmad Yani)',
  'Sorong (Pelabuhan Sorong)',
  'Jayapura (Yos Sudarso)',
  'Timika (Pomako)',
  'Merauke (Yos Sudarso Merauke)',
  'Manokwari (Pelabuhan Manokwari)'
];

export const ITEM_CATEGORIES = [
  'Mesin & Alat Berat Industri',
  'Material Konstruksi & Baja',
  'Komoditas Pangan & Hasil Bumi',
  'Tekstil & Pakaian Jadi (Garmen)',
  'Barang Elektronik & IT',
  'Otomotif & Suku Cadang Kendaraan',
  'Bahan Kimia Non-B3 & Pupuk',
  'Furnitur & Kayu Olahan',
  'Kargo Kontainer FCL (Full Container)',
  'Kargo Curah / LCL (Less Container Load)'
];

export const INITIAL_COURIERS: Courier[] = [
  {
    id: 11,
    name: 'Kapten Joko Prasetyo (Nahkoda)',
    phone: '0812-3456-7890',
    licensePlate: 'IMO-982134',
    vehicleType: 'KM Nusantara Container Express',
    assignedArea: 'Rute Laut: Jakarta (Tj. Priok) - Surabaya (Tj. Perak) - Makassar',
    status: 'on_duty'
  },
  {
    id: 12,
    name: 'Mualim Budi Hartanto',
    phone: '0813-8899-1234',
    licensePlate: 'IMO-991244',
    vehicleType: 'KM SiKebut Fast Freighter (Kapal Cepat)',
    assignedArea: 'Rute Laut Express: Jakarta - Balikpapan - Banjarmasin',
    status: 'active'
  },
  {
    id: 13,
    name: 'Ahmad Fauzi (Dispatcher Dermaga)',
    phone: '0821-4567-9012',
    licensePlate: 'B 9142 TUK',
    vehicleType: 'Truk Tronton Kontainer Pelabuhan',
    assignedArea: 'Terminal Petikemas Tanjung Priok Jakarta',
    status: 'active'
  },
  {
    id: 14,
    name: 'Hendra Wijaya (Officer Pelabuhan)',
    phone: '0857-1122-3344',
    licensePlate: 'L 8872 CT',
    vehicleType: 'Armada Hauling Pelabuhan Surabaya',
    assignedArea: 'Dermaga Jamrud Tanjung Perak Surabaya',
    status: 'standby'
  },
  {
    id: 15,
    name: 'Siti Rahmawati (Logistik Laut)',
    phone: '0878-9900-1122',
    licensePlate: 'B 7762 SEA',
    vehicleType: 'Inspektur Kargo & Bea Cukai Pelabuhan',
    assignedArea: 'Container Freight Station (CFS) Pelabuhan',
    status: 'active'
  }
];

export const INITIAL_FLEETS: FleetVehicle[] = [
  {
    id: 11,
    fleetCode: 'KPL-KNT-01',
    vehicleName: 'KM Nusantara Container Express',
    plateNumber: 'IMO-982134 (Call Sign: YDNE)',
    category: 'Kapal Kontainer',
    capacityKg: 500000, // 500 Ton / 250 TEUs
    status: 'in_transit',
    currentRoute: 'Pelabuhan Tj. Priok (Jakarta) → Tj. Perak (Surabaya) → Makassar'
  },
  {
    id: 12,
    fleetCode: 'KPL-EXP-01',
    vehicleName: 'KM SiKebut Fast Freighter',
    plateNumber: 'IMO-991244 (Call Sign: PKBT)',
    category: 'Kapal Kargo Cepat (Fast Vessel)',
    capacityKg: 250000, // 250 Ton
    status: 'in_transit',
    currentRoute: 'Jakarta (Tj. Priok) → Balikpapan (Semayang) Direct Express'
  },
  {
    id: 13,
    fleetCode: 'KPL-RORO-01',
    vehicleName: 'KMP Maritim Jaya Ro-Ro Cargo',
    plateNumber: 'IMO-973412 (Call Sign: YBKR)',
    category: 'Kapal Kargo Ro-Ro',
    capacityKg: 350000, // 350 Ton + Kendaraan
    status: 'ready',
    currentRoute: 'Surabaya (Tj. Perak) → Banjarmasin (Trisakti)'
  },
  {
    id: 14,
    fleetCode: 'KPL-TOL-01',
    vehicleName: 'KM Tol Laut Samudera V',
    plateNumber: 'IMO-984421 (Call Sign: YTLS)',
    category: 'Kapal Tol Laut Nusantara',
    capacityKg: 650000, // 650 Ton
    status: 'ready',
    currentRoute: 'Surabaya → Makassar → Bitung → Sorong'
  },
  {
    id: 15,
    fleetCode: 'KPL-EXP-02',
    vehicleName: 'KM Baruna Express Cargo Liner',
    plateNumber: 'IMO-993810 (Call Sign: YBBR)',
    category: 'Kapal Kargo Cepat (Fast Vessel)',
    capacityKg: 180000, // 180 Ton
    status: 'ready',
    currentRoute: 'Jakarta (Tj. Priok) → Medan (Belawan) Direct'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    companyName: 'PT Mega Maritim Presisi',
    contactPerson: 'Ir. Hendro Pranoto',
    phone: '0811-2345-678',
    email: 'maritim@megapresisi.co.id',
    address: 'Kawasan Industri Maritim Tanjung Priok Kav. 12',
    city: 'Jakarta (Tj. Priok)',
    customerType: 'corporate',
    totalShipments: 48,
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    companyName: 'CV Samudera Niaga Perkasa',
    contactPerson: 'Bpk. Herman Susilo',
    phone: '0819-3344-556',
    email: 'samuderaniaga@gmail.com',
    address: 'Jl. Perak Barat No. 88, Pabean Cantian',
    city: 'Surabaya (Tj. Perak)',
    customerType: 'umkm',
    totalShipments: 24,
    createdAt: '2026-03-10'
  },
  {
    id: 3,
    companyName: 'PT Borneo Mandiri Logistik',
    contactPerson: 'Ibu Ratna Dewi',
    phone: '0812-7788-990',
    email: 'ratna@borneologistics.id',
    address: 'Kawasan Pelabuhan Semayang Blok C-4',
    city: 'Balikpapan (Semayang)',
    customerType: 'corporate',
    totalShipments: 62,
    createdAt: '2026-02-01'
  }
];

export const INITIAL_RATES: ShippingRate[] = [
  // Jakarta to Surabaya
  { id: 1, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Surabaya (Tj. Perak)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 1800, minWeightKg: 50, estimatedDays: '3-5 Hari' },
  { id: 2, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Surabaya (Tj. Perak)', serviceType: 'Kargo Laut Express', baseRatePerKg: 3200, minWeightKg: 25, estimatedDays: '1-2 Hari' },

  // Jakarta to Medan
  { id: 3, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Medan (Belawan)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 3500, minWeightKg: 50, estimatedDays: '5-7 Hari' },
  { id: 4, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Medan (Belawan)', serviceType: 'Kargo Laut Express', baseRatePerKg: 5800, minWeightKg: 25, estimatedDays: '3-4 Hari' },

  // Jakarta to Makassar
  { id: 5, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Makassar (Soekarno-Hatta)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 3800, minWeightKg: 50, estimatedDays: '5-7 Hari' },
  { id: 6, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Makassar (Soekarno-Hatta)', serviceType: 'Kargo Laut Express', baseRatePerKg: 6200, minWeightKg: 25, estimatedDays: '3-4 Hari' },

  // Jakarta to Balikpapan
  { id: 7, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Balikpapan (Semayang)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 4000, minWeightKg: 50, estimatedDays: '4-6 Hari' },
  { id: 8, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Balikpapan (Semayang)', serviceType: 'Kargo Laut Express', baseRatePerKg: 6500, minWeightKg: 25, estimatedDays: '2-3 Hari' },

  // Jakarta to Batam
  { id: 9, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Batam (Batu Ampar)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 2500, minWeightKg: 50, estimatedDays: '3-5 Hari' },
  { id: 10, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Batam (Batu Ampar)', serviceType: 'Kargo Laut Express', baseRatePerKg: 4500, minWeightKg: 25, estimatedDays: '2 Hari' },

  // Surabaya to Makassar
  { id: 11, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Makassar (Soekarno-Hatta)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 2800, minWeightKg: 50, estimatedDays: '3-5 Hari' },
  { id: 12, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Makassar (Soekarno-Hatta)', serviceType: 'Kargo Laut Express', baseRatePerKg: 4800, minWeightKg: 25, estimatedDays: '2 Hari' },

  // Surabaya to Banjarmasin
  { id: 13, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Banjarmasin (Trisakti)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 2400, minWeightKg: 50, estimatedDays: '2-4 Hari' },
  { id: 14, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Banjarmasin (Trisakti)', serviceType: 'Kargo Laut Express', baseRatePerKg: 4200, minWeightKg: 25, estimatedDays: '1-2 Hari' },

  // Jakarta to Pontianak
  { id: 15, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Pontianak (Dwikora)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 3200, minWeightKg: 50, estimatedDays: '3-5 Hari' },
  { id: 16, originCity: 'Jakarta (Tj. Priok)', destinationCity: 'Pontianak (Dwikora)', serviceType: 'Kargo Laut Express', baseRatePerKg: 5200, minWeightKg: 25, estimatedDays: '2-3 Hari' },

  // Surabaya to Jayapura
  { id: 17, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Jayapura (Yos Sudarso)', serviceType: 'Kargo Laut Reguler', baseRatePerKg: 7500, minWeightKg: 50, estimatedDays: '8-12 Hari' },
  { id: 18, originCity: 'Surabaya (Tj. Perak)', destinationCity: 'Jayapura (Yos Sudarso)', serviceType: 'Kargo Laut Express', baseRatePerKg: 12000, minWeightKg: 25, estimatedDays: '5-7 Hari' }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 7,
    trackingNumber: 'SKB-202611-8941',
    senderName: 'PT Mega Maritim Presisi',
    senderPhone: '0811-2345-678',
    senderAddress: 'Dermaga Samudera 02, Pelabuhan Tanjung Priok',
    senderCity: 'Jakarta (Tj. Priok)',
    receiverName: 'CV Surya Logam Surabaya',
    receiverPhone: '0812-9876-543',
    receiverAddress: 'Komplek Pergudangan Kalimas Baru Blok C-15',
    receiverCity: 'Surabaya (Tj. Perak)',
    itemName: 'Baja Profil & Sparepart Mesin Turbin Kapal',
    itemCategory: 'Mesin & Alat Berat Industri',
    weightKg: 2500,
    lengthCm: 300,
    widthCm: 150,
    heightCm: 140,
    chargeableWeightKg: 2500,
    containerNumber: 'SKBU-492104-7 (20ft Dry Container)',
    serviceType: 'Kargo Laut Reguler',
    pickupType: 'dropoff',
    itemValue: 95000000,
    insuranceFee: 190000,
    pickupFee: 0,
    shippingFee: 4500000,
    totalFee: 4690000,
    status: 'sailing_transit',
    currentLocation: 'Laut Jawa (Koordinat 05°42\'S 110°18\'E - Melintas Utara Semarang Menuju Surabaya)',
    courierId: 11,
    courierName: 'Kapten Joko Prasetyo (Nahkoda)',
    courierPhone: '0812-3456-7890',
    fleetId: 11,
    fleetCode: 'KPL-KNT-01 (KM Nusantara Container Express)',
    notes: 'Muatan kontainer ter-segel Bea Cukai & Karantina Pelabuhan. Suhu kering standar.',
    createdAt: '01 Nov 2026, 09:30 WIB',
    updatedAt: '02 Nov 2026, 20:15 WIB',
    logs: [
      {
        id: 'log-1',
        status: 'order_created',
        title: 'Booking Kargo Kapal Laut Terverifikasi',
        description: 'Pemesanan slot kontainer 20ft layanan Kargo Laut Reguler telah diverifikasi sistem SiKebut.',
        location: 'Kantor Cabang Pelabuhan Tanjung Priok, Jakarta',
        timestamp: '01 Nov 2026, 09:30 WIB'
      },
      {
        id: 'log-2',
        status: 'port_loading',
        title: 'Stuffing & Pemuatan Kontainer ke Kapal',
        description: 'Kontainer SKBU-492104-7 selesai dimuat oleh Gantry Crane ke palka kapal KM Nusantara Container Express di Dermaga 102.',
        location: 'Terminal Petikemas Tanjung Priok (TPK)',
        timestamp: '01 Nov 2026, 17:40 WIB'
      },
      {
        id: 'log-3',
        status: 'sailing_transit',
        title: 'Kapal Bertolak Berlayar (Cast Off)',
        description: 'Kapal telah lepas jangkar dari Pelabuhan Tanjung Priok menempuh jalur pelayaran Laut Jawa dengan kecepatan 14 knot.',
        location: 'Alur Pelayaran Barat Laut Jawa',
        timestamp: '02 Nov 2026, 05:00 WIB'
      },
      {
        id: 'log-4',
        status: 'sailing_transit',
        title: 'Posisi Pelayaran Laut Terkini',
        description: 'Kapal berlayar normal melintasi perairan utara Jawa Tengah (Utara Jepara/Karimunjawa) menuju Pelabuhan Tanjung Perak Surabaya.',
        location: 'Laut Jawa (Koordinat 05°42\'S 110°18\'E)',
        timestamp: '02 Nov 2026, 20:15 WIB'
      }
    ]
  },
  {
    id: 8,
    trackingNumber: 'SKB-202611-7320',
    senderName: 'PT Distributor Pangan Nusantara',
    senderPhone: '0819-3344-556',
    senderAddress: 'Kawasan Pergudangan Muara Baru Blok D-8',
    senderCity: 'Jakarta (Tj. Priok)',
    receiverName: 'CV Borneo Makmur Sejahtera',
    receiverPhone: '0852-6677-889',
    receiverAddress: 'Jl. Yos Sudarso No. 45, Pelabuhan Semayang',
    receiverCity: 'Balikpapan (Semayang)',
    itemName: 'Bahan Pangan Kemasan & Komoditas Sembako',
    itemCategory: 'Komoditas Pangan & Hasil Bumi',
    weightKg: 850,
    lengthCm: 200,
    widthCm: 120,
    heightCm: 140,
    chargeableWeightKg: 850,
    containerNumber: 'SKBU-281903-2 (LCL Prioritas)',
    serviceType: 'Kargo Laut Express',
    pickupType: 'pickup',
    itemValue: 42000000,
    insuranceFee: 84000,
    pickupFee: 50000,
    shippingFee: 5525000,
    totalFee: 5659000,
    status: 'port_arrived',
    currentLocation: 'Dermaga Jamrud Pelabuhan Semayang, Balikpapan (Sandar Siap Bongkar)',
    courierId: 12,
    courierName: 'Mualim Budi Hartanto',
    courierPhone: '0813-8899-1234',
    fleetId: 12,
    fleetCode: 'KPL-EXP-01 (KM SiKebut Fast Freighter)',
    notes: 'Layanan Express Jalur Laut Langsung (Direct Call tanpa singgah).',
    createdAt: '31 Okt 2026, 11:00 WIB',
    updatedAt: '02 Nov 2026, 18:30 WIB',
    logs: [
      {
        id: 'log-8-1',
        status: 'order_created',
        title: 'Booking Kargo Laut Express Dikonfirmasi',
        description: 'Jalur pelayaran cepat Jakarta - Balikpapan dijadwalkan keberangkatan.',
        location: 'Jakarta (Tj. Priok)',
        timestamp: '31 Okt 2026, 11:00 WIB'
      },
      {
        id: 'log-8-2',
        status: 'picked_up',
        title: 'Penjemputan Muatan oleh Armada Pelabuhan',
        description: 'Muatan diambil langsung dari gudang pengirim di Muara Baru.',
        location: 'Muara Baru, Jakarta Utara',
        timestamp: '31 Okt 2026, 14:00 WIB'
      },
      {
        id: 'log-8-3',
        status: 'port_loading',
        title: 'Pemuatan ke Kapal Fast Freighter',
        description: 'Muatan ditempatkan di dek prioritas KM SiKebut Fast Freighter.',
        location: 'Dermaga 03 Tanjung Priok',
        timestamp: '31 Okt 2026, 21:00 WIB'
      },
      {
        id: 'log-8-4',
        status: 'sailing_transit',
        title: 'Pelayaran Cepat Melintasi Selat Makassar',
        description: 'Kapal berlayar kecepatan tinggi direct route menuju Teluk Balikpapan.',
        location: 'Selat Makassar',
        timestamp: '01 Nov 2026, 23:45 WIB'
      },
      {
        id: 'log-8-5',
        status: 'port_arrived',
        title: 'Kapal Sandar di Pelabuhan Semayang Balikpapan',
        description: 'KM SiKebut Fast Freighter telah merapat di Dermaga Pelabuhan Semayang. Proses bongkar muat dimulai.',
        location: 'Dermaga Pelabuhan Semayang, Balikpapan',
        timestamp: '02 Nov 2026, 18:30 WIB'
      }
    ]
  },
  {
    id: 9,
    trackingNumber: 'SKB-202611-5512',
    senderName: 'Garmen Sentosa Nusantara',
    senderPhone: '0812-7788-990',
    senderAddress: 'Kawasan Pergudangan Tanjung Perak No. 12',
    senderCity: 'Surabaya (Tj. Perak)',
    receiverName: 'PT Makmur Bahari Makassar',
    receiverPhone: '0813-1122-445',
    receiverAddress: 'Jl. Nusantara Pelabuhan No. 104',
    receiverCity: 'Makassar (Soekarno-Hatta)',
    itemName: 'Roll Kain Tekstil & Pakaian Jadi Konveksi',
    itemCategory: 'Tekstil & Pakaian Jadi (Garmen)',
    weightKg: 620,
    lengthCm: 180,
    widthCm: 100,
    heightCm: 120,
    chargeableWeightKg: 620,
    containerNumber: 'SKBU-119280-4',
    serviceType: 'Kargo Laut Reguler',
    pickupType: 'dropoff',
    itemValue: 35000000,
    insuranceFee: 70000,
    pickupFee: 0,
    shippingFee: 1736000,
    totalFee: 1806000,
    status: 'delivered',
    currentLocation: 'Gudang Penerima PT Makmur Bahari Makassar (Telah Diterima)',
    courierId: 13,
    courierName: 'Ahmad Fauzi (Dispatcher Dermaga)',
    courierPhone: '0821-4567-9012',
    fleetId: 13,
    fleetCode: 'KPL-RORO-01 (KMP Maritim Jaya)',
    recipientSignature: 'Bpk. Daeng Rudi (Supervisor Gudang Makassar)',
    notes: 'Barang telah diperiksa fisik di dermaga tujuan dan diterima utuh.',
    createdAt: '28 Okt 2026, 14:00 WIB',
    updatedAt: '01 Nov 2026, 16:30 WIB',
    logs: [
      {
        id: 'log-9-1',
        status: 'order_created',
        title: 'Order Kargo Laut Diterbitkan',
        description: 'Drop-off kargo ke CFS Pelabuhan Tanjung Perak Surabaya.',
        location: 'Pelabuhan Tanjung Perak, Surabaya',
        timestamp: '28 Okt 2026, 14:00 WIB'
      },
      {
        id: 'log-9-2',
        status: 'port_loading',
        title: 'Muat ke Kapal Roro Kargo',
        description: 'Truk kontainer masuk ke car deck KMP Maritim Jaya.',
        location: 'Dermaga Roro Jamrud Surabaya',
        timestamp: '29 Okt 2026, 08:30 WIB'
      },
      {
        id: 'log-9-3',
        status: 'sailing_transit',
        title: 'Pelayaran Menyeberangi Laut Flores',
        description: 'Kapal berlayar aman rute Surabaya - Selat Madura - Makassar.',
        location: 'Laut Flores',
        timestamp: '30 Okt 2026, 11:00 WIB'
      },
      {
        id: 'log-9-4',
        status: 'port_arrived',
        title: 'Tiba di Pelabuhan Soekarno-Hatta Makassar',
        description: 'Bongkar muat di Pelabuhan Makassar selesai, muatan disortir di gudang lini 1.',
        location: 'Pelabuhan Soekarno-Hatta Makassar',
        timestamp: '31 Okt 2026, 19:00 WIB'
      },
      {
        id: 'log-9-5',
        status: 'delivered',
        title: 'Kargo Berhasil Diterima oleh Penerima',
        description: 'Muatan diserahkan kepada Bpk. Daeng Rudi di gudang penerima. Berita Acara Serah Terima (BAST) dan Surat Jalan telah ditandatangani.',
        location: 'Jl. Nusantara No. 104, Makassar',
        timestamp: '01 Nov 2026, 16:30 WIB'
      }
    ]
  }
];
