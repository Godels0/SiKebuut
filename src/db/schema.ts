import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (Authentication & Roles: customer, admin, courier)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').default('Pengguna SiKebut'),
  role: text('role').default('customer').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customers table (B2B Companies & Retail senders)
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  companyName: text('company_name'),
  contactPerson: text('contact_person').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  customerType: text('customer_type').default('corporate').notNull(), // corporate, umkm, retail
  createdAt: timestamp('created_at').defaultNow(),
});

// Couriers & Fleet Drivers
export const couriers = pgTable('couriers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  licensePlate: text('license_plate').notNull(),
  vehicleType: text('vehicle_type').notNull(), // Blind Van, Isuzu Giga Wingbox, CDE Box, CDD Long Box
  assignedArea: text('assigned_area').notNull(),
  status: text('status').default('active').notNull(), // active, on_duty, standby, offline
  createdAt: timestamp('created_at').defaultNow(),
});

// Fleets (Trucks, Vans, Cargo Containers)
export const fleets = pgTable('fleets', {
  id: serial('id').primaryKey(),
  fleetCode: text('fleet_code').notNull().unique(),
  vehicleName: text('vehicle_name').notNull(),
  plateNumber: text('plate_number').notNull(),
  category: text('category').notNull(), // Trucking Darat, Pesawat Udara, Kapal Kontainer Laut
  capacityKg: numeric('capacity_kg').notNull(),
  status: text('status').default('ready').notNull(), // ready, in_transit, maintenance
  currentRoute: text('current_route'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Shipping Rates & Route SLA Matrix
export const shippingRates = pgTable('shipping_rates', {
  id: serial('id').primaryKey(),
  originCity: text('origin_city').notNull(),
  destinationCity: text('destination_city').notNull(),
  serviceType: text('service_type').notNull(), // Reguler Trucking, Express Udara, Kargo Laut Kontainer, Sameday Fleet
  baseRatePerKg: numeric('base_rate_per_kg').notNull(),
  minWeightKg: numeric('min_weight_kg').default('10').notNull(),
  estimatedDays: text('estimated_days').notNull(), // e.g. "1-2 Hari"
  createdAt: timestamp('created_at').defaultNow(),
});

// Shipments (The Core Cargo Shipments)
export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  trackingNumber: text('tracking_number').notNull().unique(),
  
  // Pengirim (Origin)
  senderName: text('sender_name').notNull(),
  senderPhone: text('sender_phone').notNull(),
  senderAddress: text('sender_address').notNull(),
  senderCity: text('sender_city').notNull(),
  
  // Penerima (Destination)
  receiverName: text('receiver_name').notNull(),
  receiverPhone: text('receiver_phone').notNull(),
  receiverAddress: text('receiver_address').notNull(),
  receiverCity: text('receiver_city').notNull(),
  
  // Spesifikasi Barang
  itemName: text('item_name').notNull(),
  itemCategory: text('item_category').notNull(), // Mesin Industri, Elektronik, Tekstil/Konveksi, Bahan Makanan/Bahan Baku, Otomotif, Umum
  weightKg: numeric('weight_kg').notNull(),
  lengthCm: numeric('length_cm').notNull(),
  widthCm: numeric('width_cm').notNull(),
  heightCm: numeric('height_cm').notNull(),
  chargeableWeightKg: numeric('chargeable_weight_kg').notNull(),
  
  // Layanan & Biaya
  serviceType: text('service_type').notNull(), // Reguler Trucking, Express Udara, Kargo Laut Kontainer, Sameday Fleet
  pickupType: text('pickup_type').default('pickup').notNull(), // pickup (dijemput ke alamat), dropoff (antar ke hub gudang)
  itemValue: numeric('item_value').default('0'),
  insuranceFee: numeric('insurance_fee').default('0'),
  shippingFee: numeric('shipping_fee').notNull(),
  totalFee: numeric('total_fee').notNull(),
  
  // Status & Tracking
  status: text('status').default('order_created').notNull(), 
  // order_created, picked_up, processing_hub, in_transit, arrived_dest, out_for_delivery, delivered
  currentLocation: text('current_location').notNull(),
  courierId: integer('courier_id').references(() => couriers.id),
  fleetId: integer('fleet_id').references(() => fleets.id),
  
  notes: text('notes'),
  recipientSignature: text('recipient_signature'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tracking Logs (Milestone History)
export const trackingLogs = pgTable('tracking_logs', {
  id: serial('id').primaryKey(),
  shipmentId: integer('shipment_id').references(() => shipments.id),
  trackingNumber: text('tracking_number').notNull(),
  status: text('status').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  courier: one(couriers, {
    fields: [shipments.courierId],
    references: [couriers.id],
  }),
  fleet: one(fleets, {
    fields: [shipments.fleetId],
    references: [fleets.id],
  }),
  trackingLogs: many(trackingLogs),
}));

export const trackingLogsRelations = relations(trackingLogs, ({ one }) => ({
  shipment: one(shipments, {
    fields: [trackingLogs.shipmentId],
    references: [shipments.id],
  }),
}));
