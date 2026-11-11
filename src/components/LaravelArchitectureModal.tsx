import React, { useState } from 'react';
import { Database, Code, Copy, Check, Download, Layers, Server, Terminal, FileCode2 } from 'lucide-react';

export const LaravelArchitectureModal: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'migration' | 'model_shipment' | 'controller_shipment' | 'controller_tracking' | 'routes_api' | 'sql_ddl'>('migration');
  const [copied, setCopied] = useState(false);

  const LARAVEL_MIGRATION = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for SiKebut Cargo Express.
     */
    public function up(): void
    {
        // 1. Users & Roles (Aman jika tabel users bawaan Laravel sudah ada)
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('uid', 100)->nullable()->unique();
                $table->string('name', 150);
                $table->string('email', 150)->unique();
                $table->string('password')->nullable();
                $table->string('phone', 30)->nullable();
                $table->string('role', 30)->default('customer'); // admin, customer, courier
                $table->rememberToken();
                $table->timestamps();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'uid')) {
                    $table->string('uid', 100)->nullable()->unique();
                }
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone', 30)->nullable();
                }
                if (!Schema::hasColumn('users', 'role')) {
                    $table->string('role', 30)->default('customer');
                }
            });
        }

        // 2. Customers (Shipper B2B & Ritel)
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('company_name', 150)->nullable();
            $table->string('contact_person', 150);
            $table->string('phone', 30);
            $table->string('email', 150)->nullable();
            $table->text('address');
            $table->string('city', 80);
            $table->string('customer_type', 30)->default('corporate'); // corporate, umkm, individual
            $table->timestamps();

            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            }
        });

        // 3. Couriers & Drivers / Nahkoda & Crew
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('phone', 30);
            $table->string('license_plate', 30);
            $table->string('vehicle_type', 100);
            $table->string('assigned_area', 100);
            $table->string('status', 30)->default('active'); // active, on_duty, standby, offline
            $table->timestamps();
        });

        // 4. Fleets (Armada Kapal Kargo Laut)
        Schema::create('fleets', function (Blueprint $table) {
            $table->id();
            $table->string('fleet_code', 50)->unique();
            $table->string('vehicle_name', 150); // Nama Kapal (KM Nusantara, KM SiKebut Fast Freighter)
            $table->string('plate_number', 50); // Nomor Registrasi IMO Kapal
            $table->string('category', 100); // Kapal Kontainer, Kapal Kargo Ro-Ro, Kapal Kargo Cepat
            $table->decimal('capacity_kg', 12, 2);
            $table->string('status', 30)->default('ready'); // ready, in_transit, maintenance
            $table->string('current_route', 150)->nullable();
            $table->timestamps();
        });

        // 5. Shipping Rates & SLA Matrix (Kargo Laut Reguler & Express)
        // Panjang string dibatasi agar muat dalam batas composite index MySQL (max 767-1000 bytes)
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('origin_city', 60); // Pelabuhan Asal
            $table->string('destination_city', 60); // Pelabuhan Tujuan
            $table->string('service_type', 40); // Kargo Laut Reguler, Kargo Laut Express
            $table->decimal('base_rate_per_kg', 10, 2);
            $table->decimal('min_weight_kg', 8, 2)->default(25);
            $table->string('estimated_days', 50);
            $table->timestamps();
            
            $table->index(['origin_city', 'destination_city', 'service_type'], 'idx_shipping_rates_route');
        });

        // 6. Shipments (Core Sea Cargo Shipments)
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 50)->unique();
            $table->string('container_number', 50)->nullable();
            
            // Pengirim (Pelabuhan Asal)
            $table->string('sender_name', 150);
            $table->string('sender_phone', 30);
            $table->text('sender_address');
            $table->string('sender_city', 80);
            
            // Penerima (Pelabuhan Tujuan)
            $table->string('receiver_name', 150);
            $table->string('receiver_phone', 30);
            $table->text('receiver_address');
            $table->string('receiver_city', 80);
            
            // Barang & Dimensi
            $table->string('item_name', 150);
            $table->string('item_category', 80);
            $table->decimal('weight_kg', 10, 2);
            $table->decimal('length_cm', 8, 2);
            $table->decimal('width_cm', 8, 2);
            $table->decimal('height_cm', 8, 2);
            $table->decimal('chargeable_weight_kg', 10, 2);
            
            // Layanan Laut & Biaya
            $table->string('service_type', 40); // Kargo Laut Reguler / Kargo Laut Express
            $table->string('pickup_type', 30)->default('dropoff'); // pickup / dropoff
            $table->decimal('item_value', 14, 2)->default(0);
            $table->decimal('insurance_fee', 10, 2)->default(0);
            $table->decimal('pickup_fee', 10, 2)->default(0);
            $table->decimal('shipping_fee', 12, 2);
            $table->decimal('total_fee', 12, 2);
            
            // Status Maritim
            $table->string('status', 40)->default('order_created');
            $table->string('current_location', 150); // Koordinat Maritim / Pelabuhan
            $table->unsignedBigInteger('courier_id')->nullable();
            $table->unsignedBigInteger('fleet_id')->nullable();
            
            $table->text('notes')->nullable();
            $table->string('recipient_signature')->nullable();
            $table->timestamps();

            $table->foreign('courier_id')->references('id')->on('couriers')->nullOnDelete();
            $table->foreign('fleet_id')->references('id')->on('fleets')->nullOnDelete();
        });

        // 7. Tracking Logs
        Schema::create('tracking_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shipment_id');
            $table->string('tracking_number', 50);
            $table->string('status', 40);
            $table->string('title', 150);
            $table->text('description');
            $table->string('location', 150);
            $table->timestamps();
            
            $table->foreign('shipment_id')->references('id')->on('shipments')->cascadeOnDelete();
            $table->index('tracking_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_logs');
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('shipping_rates');
        Schema::dropIfExists('fleets');
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('users');
    }
};
`;

  const LARAVEL_MODEL_SHIPMENT = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'sender_name',
        'sender_phone',
        'sender_address',
        'sender_city',
        'receiver_name',
        'receiver_phone',
        'receiver_address',
        'receiver_city',
        'item_name',
        'item_category',
        'weight_kg',
        'length_cm',
        'width_cm',
        'height_cm',
        'chargeable_weight_kg',
        'service_type',
        'pickup_type',
        'item_value',
        'insurance_fee',
        'pickup_fee',
        'shipping_fee',
        'total_fee',
        'status',
        'current_location',
        'courier_id',
        'fleet_id',
        'notes',
        'recipient_signature',
    ];

    protected $casts = [
        'weight_kg' => 'float',
        'chargeable_weight_kg' => 'float',
        'item_value' => 'float',
        'total_fee' => 'float',
    ];

    /**
     * Hitung berat volumetrik standar logistik Indonesia:
     * - Darat/Laut: (P x L x T) / 4000
     * - Udara: (P x L x T) / 6000
     */
    public static function calculateVolumetric(float $length, float $width, float $height, string $serviceType): float
    {
        $divisor = $serviceType === 'Express Udara' ? 6000 : 4000;
        return round(($length * $width * $height) / $divisor, 2);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }

    public function trackingLogs(): HasMany
    {
        return $this->hasMany(TrackingLog::class)->orderBy('created_at', 'desc');
    }
}
`;

  const LARAVEL_CONTROLLER = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Shipment;
use App\\Models\\TrackingLog;
use App\\Models\\ShippingRate;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Str;
use Illuminate\\Support\\Facades\\DB;

class ShipmentController extends Controller
{
    /**
     * Lacak resi kargo laut & koordinat kapal secara real-time.
     */
    public function track($trackingNumber)
    {
        $shipment = DB::table('shipments')->where('tracking_number', $trackingNumber)->first();

        if (!$shipment) {
            return response()->json([
                'success' => false,
                'message' => "Nomor resi {$trackingNumber} tidak ditemukan dalam manifes kapal.",
            ], 404);
        }

        $courier = $shipment->courier_id ? DB::table('couriers')->where('id', $shipment->courier_id)->first() : null;
        $fleet = $shipment->fleet_id ? DB::table('fleets')->where('id', $shipment->fleet_id)->first() : null;
        $logs = DB::table('tracking_logs')
            ->where('shipment_id', $shipment->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data pelayaran berhasil ditemukan.',
            'data' => [
                'shipment' => $shipment,
                'fleet' => $fleet,
                'courier' => $courier,
                'tracking_logs' => $logs,
            ],
        ]);
    }

    /**
     * Ambil semua daftar pengiriman kargo laut untuk portal admin.
     */
    public function index()
    {
        $shipments = DB::table('shipments')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $shipments,
        ]);
    }

    /**
     * Simpan pemesanan pengiriman kargo baru & terbitkan resi.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_name' => 'required|string',
            'sender_phone' => 'required|string',
            'sender_address' => 'required|string',
            'sender_city' => 'required|string',
            'receiver_name' => 'required|string',
            'receiver_phone' => 'required|string',
            'receiver_address' => 'required|string',
            'receiver_city' => 'required|string',
            'item_name' => 'required|string',
            'item_category' => 'required|string',
            'weight_kg' => 'required|numeric|min:0.5',
            'length_cm' => 'required|numeric|min:1',
            'width_cm' => 'required|numeric|min:1',
            'height_cm' => 'required|numeric|min:1',
            'service_type' => 'required|string',
            'pickup_type' => 'required|in:pickup,dropoff',
            'item_value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // 1. Hitung Berat Volumetrik & Chargeable
            $volumetric = Shipment::calculateVolumetric(
                $validated['length_cm'],
                $validated['width_cm'],
                $validated['height_cm'],
                $validated['service_type']
            );
            $chargeableWeight = max($validated['weight_kg'], $volumetric);

            // 2. Cari Tarif Dasar Rute
            $rate = ShippingRate::where('origin_city', $validated['sender_city'])
                ->where('destination_city', $validated['receiver_city'])
                ->where('service_type', $validated['service_type'])
                ->first();

            $baseRatePerKg = $rate ? $rate->base_rate_per_kg : 4500;
            $minWeight = $rate ? $rate->min_weight_kg : 10;
            $billableWeight = max($chargeableWeight, $minWeight);

            $shippingFee = $billableWeight * $baseRatePerKg;
            $insuranceFee = ($validated['item_value'] ?? 0) > 0 ? round($validated['item_value'] * 0.002) : 0;
            $pickupFee = $validated['pickup_type'] === 'pickup' ? ($chargeableWeight > 50 ? 50000 : 25000) : 0;
            $totalFee = $shippingFee + $insuranceFee + $pickupFee;

            // 3. Generate Tracking Number (SKB-YYYYMM-XXXX)
            $trackingNumber = 'SKB-' . date('Ym') . '-' . mt_rand(1000, 9999);

            // 4. Create Shipment Record
            $shipment = Shipment::create(array_merge($validated, [
                'tracking_number' => $trackingNumber,
                'chargeable_weight_kg' => $chargeableWeight,
                'insurance_fee' => $insuranceFee,
                'pickup_fee' => $pickupFee,
                'shipping_fee' => $shippingFee,
                'total_fee' => $totalFee,
                'status' => 'order_created',
                'current_location' => 'Hub SiKebut ' . $validated['sender_city'],
            ]));

            // 5. Create Initial Tracking Milestone Log
            TrackingLog::create([
                'shipment_id' => $shipment->id,
                'tracking_number' => $trackingNumber,
                'status' => 'order_created',
                'title' => 'Pesanan Dibuat Secara Online',
                'description' => "Booking kargo {$shipment->service_type} berhasil diverifikasi sistem SiKebut.",
                'location' => 'Hub SiKebut ' . $shipment->sender_city,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pesanan kargo berhasil dibuat.',
                'data' => $shipment->load('trackingLogs'),
            ], 201);
        });
    }

    /**
     * Update Status Pengiriman oleh Admin / Dispatcher.
     */
    public function updateStatus(Request $request, $trackingNumber)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'location' => 'required|string',
            'title' => 'required|string',
            'description' => 'required|string',
            'courier_id' => 'nullable|exists:couriers,id',
            'fleet_id' => 'nullable|exists:fleets,id',
        ]);

        $shipment = Shipment::where('tracking_number', $trackingNumber)->firstOrFail();

        DB::transaction(function () use ($shipment, $validated) {
            $shipment->update([
                'status' => $validated['status'],
                'current_location' => $validated['location'],
                'courier_id' => $validated['courier_id'] ?? $shipment->courier_id,
                'fleet_id' => $validated['fleet_id'] ?? $shipment->fleet_id,
            ]);

            TrackingLog::create([
                'shipment_id' => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'status' => $validated['status'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'location' => $validated['location'],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Status pengiriman berhasil diperbarui.',
            'data' => $shipment->fresh(['trackingLogs', 'courier', 'fleet']),
        ]);
    }
}
`;

  const LARAVEL_ROUTES = `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\ShipmentController;
use App\\Http\\Controllers\\TrackingController;
use App\\Http\\Controllers\\ShippingRateController;

/*
|--------------------------------------------------------------------------
| SiKebut Cargo Express API Routes
|--------------------------------------------------------------------------
*/

// Public Client Endpoints
Route::prefix('v1')->group(function () {
    // Estimasi Biaya & Cek Tarif
    Route::post('/rates/estimate', [ShippingRateController::class, 'estimate']);

    // Tracking Resi Real-Time
    Route::get('/track/{trackingNumber}', [TrackingController::class, 'track']);

    // Pemesanan Kargo Baru
    Route::post('/shipments', [ShipmentController::class, 'store']);

    // Admin & Operational Endpoints
    Route::prefix('admin')->group(function () {
        Route::get('/shipments', [ShipmentController::class, 'index']);
        Route::put('/shipments/{trackingNumber}/status', [ShipmentController::class, 'updateStatus']);
        Route::get('/reports/export-csv', [ShipmentController::class, 'exportCsv']);
        Route::get('/couriers', [ShipmentController::class, 'couriers']);
        Route::get('/fleets', [ShipmentController::class, 'fleets']);
    });
});
`;

  const SQL_DDL = `-- ====================================================
-- SiKebut Cargo Express - PostgreSQL / MySQL Relational Schema
-- ====================================================

CREATE TABLE IF NOT EXISTS couriers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    license_plate VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    assigned_area VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fleets (
    id SERIAL PRIMARY KEY,
    fleet_code VARCHAR(50) UNIQUE NOT NULL,
    vehicle_name VARCHAR(150) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    capacity_kg NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ready' NOT NULL,
    current_route VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipping_rates (
    id SERIAL PRIMARY KEY,
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    base_rate_per_kg NUMERIC(10,2) NOT NULL,
    min_weight_kg NUMERIC(8,2) DEFAULT 10 NOT NULL,
    estimated_days VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_phone VARCHAR(50) NOT NULL,
    sender_address TEXT NOT NULL,
    sender_city VARCHAR(100) NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(50) NOT NULL,
    receiver_address TEXT NOT NULL,
    receiver_city VARCHAR(100) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_category VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(8,2) NOT NULL,
    length_cm NUMERIC(8,2) NOT NULL,
    width_cm NUMERIC(8,2) NOT NULL,
    height_cm NUMERIC(8,2) NOT NULL,
    chargeable_weight_kg NUMERIC(8,2) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    pickup_type VARCHAR(20) DEFAULT 'pickup' NOT NULL,
    item_value NUMERIC(14,2) DEFAULT 0,
    insurance_fee NUMERIC(10,2) DEFAULT 0,
    pickup_fee NUMERIC(10,2) DEFAULT 0,
    shipping_fee NUMERIC(12,2) NOT NULL,
    total_fee NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'order_created' NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    courier_id INTEGER REFERENCES couriers(id) ON DELETE SET NULL,
    fleet_id INTEGER REFERENCES fleets(id) ON DELETE SET NULL,
    notes TEXT,
    recipient_signature VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracking_logs (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    tracking_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_logs_shipment ON tracking_logs(shipment_id);
`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'migration': return { title: 'database/migrations/create_cargo_tables.php', code: LARAVEL_MIGRATION };
      case 'model_shipment': return { title: 'app/Models/Shipment.php', code: LARAVEL_MODEL_SHIPMENT };
      case 'controller_shipment': return { title: 'app/Http/Controllers/ShipmentController.php', code: LARAVEL_CONTROLLER };
      case 'routes_api': return { title: 'routes/api.php', code: LARAVEL_ROUTES };
      case 'sql_ddl': return { title: 'schema.sql (PostgreSQL / MySQL)', code: SQL_DDL };
      default: return { title: 'migration.php', code: LARAVEL_MIGRATION };
    }
  };

  const current = getActiveCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([current.code], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', current.title.replace(/[\/\\]/g, '_'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllBundle = () => {
    const bundleContent = `================================================================================
SIKEBUT CARGO EXPRESS - LARAVEL 11/12 & SQL PRODUCTION BLUEPRINT
================================================================================
Layanan: Kargo Laut Reguler & Kargo Laut Express
Armada: Kapal Kontainer, Kapal Kargo Ro-Ro, Kapal Kargo Cepat (Fast Freighter)

================================================================================
1. FILE: database/migrations/2026_11_02_000001_create_cargo_logistics_tables.php
================================================================================
${LARAVEL_MIGRATION}

================================================================================
2. FILE: app/Models/Shipment.php
================================================================================
${LARAVEL_MODEL_SHIPMENT}

================================================================================
3. FILE: app/Http/Controllers/ShipmentController.php
================================================================================
${LARAVEL_CONTROLLER}

================================================================================
4. FILE: routes/api.php
================================================================================
${LARAVEL_ROUTES}

================================================================================
5. FILE: schema.sql (Direct SQL DDL for PostgreSQL / MySQL)
================================================================================
${SQL_DDL}
`;

    const blob = new Blob([bundleContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SiKebut_Laravel_Complete_Blueprint.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mb-1">
            Backend Architecture & Export Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Arsitektur Database SQL & Kode Produksi Laravel 11/12
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Sesuai permintaan Anda untuk pengembangan menggunakan <strong>Database SQL</strong> dan <strong>Framework Laravel</strong>, berikut adalah cetak biru (blueprint) lengkap yang siap digunakan langsung di proyek Laravel Anda.
          </p>
        </div>

        {/* 3 Architecture Pills Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Relational SQL Schema</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Struktur tabel ternormalisasi 3NF dengan foreign key constraints, index pada tracking_number, dan audit timestamp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Laravel Eloquent ORM</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Model Eloquent lengkap dengan relasi BelongsTo, HasMany, casting tipe data, dan method kalkulasi kubikasi logistik.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">RESTful API & Database Transaction</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ShipmentController dengan DB::transaction atomic untuk penerbitan resi dan log checkpoint tanpa resiko race-condition.
            </p>
          </div>
        </div>

        {/* Code Viewer Panel */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header File Switcher Tabs */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setActiveCodeTab('migration')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'migration' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Migration (create_cargo_tables.php)</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('model_shipment')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'model_shipment' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Model (Shipment.php)</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('controller_shipment')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'controller_shipment' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Controller (ShipmentController.php)</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('routes_api')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'routes_api' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>routes/api.php</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('sql_ddl')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'sql_ddl' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>schema.sql (Raw DDL)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                title="Salin kode file yang sedang aktif ke clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin File Ini'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Unduh satu file ini"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </button>
              <button
                onClick={handleDownloadAllBundle}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm"
                title="Unduh seluruh paket file Laravel sekaligus dalam 1 file blueprint"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Semua Berkas (Bundle)</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] text-xs font-mono text-slate-200 leading-relaxed bg-slate-900/90 selection:bg-indigo-600 selection:text-white">
            <pre>
              <code>{current.code}</code>
            </pre>
          </div>
        </div>

        {/* Quick Setup Instructions */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Panduan Menjalankan di Proyek Laravel Anda:
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-slate-800">
              # 1. Buat proyek Laravel baru (jika belum ada)<br />
              composer create-project laravel/laravel sikebut-cargo<br />
              cd sikebut-cargo<br /><br />
              # 2. Konfigurasi database di file .env (PostgreSQL atau MySQL)<br />
              DB_CONNECTION=pgsql<br />
              DB_HOST=127.0.0.1<br />
              DB_PORT=5432<br />
              DB_DATABASE=sikebut_cargo<br />
              DB_USERNAME=postgres<br />
              DB_PASSWORD=secret<br /><br />
              # 3. Jalankan migrasi database<br />
              php artisan migrate<br /><br />
              # 4. Jalankan dev server Laravel<br />
              php artisan serve
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
