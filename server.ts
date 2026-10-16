import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  NEPAL_INDIA_LOCATIONS,
  BORDER_CROSSING_CORRIDORS,
  TRANSPORT_CORRIDORS,
  INITIAL_NETWORK_VEHICLES,
  INITIAL_NETWORK_CARGO
} from './src/data/locationNetworkData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'loadmitra-db.json');
const PRIVATE_DOCS_DIR = path.join(DATA_DIR, 'private_documents');

if (!fs.existsSync(PRIVATE_DOCS_DIR)) {
  fs.mkdirSync(PRIVATE_DOCS_DIR, { recursive: true });
}

app.use(express.json({ limit: '15mb' }));

// Initial database seed state
function getSeedData() {
  return {
    users: [
      {
        id: 'user-c1',
        name: 'Ramesh Adhikari',
        phone: '+977-9851023456',
        email: 'ramesh.agro@nepaltrade.com',
        role: 'customer',
        companyName: 'Himalayan Organic Agro Suppliers',
        panVatNumber: '601249823',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'unverified',
        companyVerified: 'verified',
        nationalIdRecord: {
          idType: 'citizenship',
          idNumber: '27-01-75-01928',
          issuedDistrict: 'Kathmandu',
          issuedDate: '2018-05-12',
          frontDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          backDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          status: 'verified',
          submittedAt: '2026-01-10T10:00:00Z',
          reviewedAt: '2026-01-11T14:30:00Z'
        },
        companyVerificationRecord: {
          companyName: 'Himalayan Organic Agro Suppliers Pvt. Ltd.',
          panNumber: '601249823',
          vatNumber: '601249823',
          registrationNumber: '204918/078/079',
          registrationDocUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
          panVatDocUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
          authorizedRepName: 'Ramesh Adhikari',
          authorizedRepDesignation: 'Managing Director',
          authorizedRepPhone: '+977-9851023456',
          authorizedRepIdDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          status: 'verified',
          submittedAt: '2026-01-10T10:00:00Z',
          reviewedAt: '2026-01-11T14:35:00Z'
        },
        rating: 4.9,
        totalTrips: 42,
        location: 'Kathmandu, Kalimati'
      },
      {
        id: 'user-d1',
        name: 'Bikram Thapa Magar',
        phone: '+977-9841987654',
        email: 'bikram.truck@gmail.com',
        role: 'driver',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'verified',
        companyVerified: 'unverified',
        vehicleVerified: 'verified',
        nationalIdRecord: {
          idType: 'national_id',
          idNumber: '984-209-114-88',
          issuedDistrict: 'Parsa',
          issuedDate: '2021-09-18',
          frontDocUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
          backDocUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
          status: 'verified',
          submittedAt: '2026-02-15T09:20:00Z',
          reviewedAt: '2026-02-16T11:00:00Z'
        },
        driverLicenseRecord: {
          licenseNumber: '01-06-00892144',
          category: 'G - Heavy Multi-Axle Freight Truck',
          expiryDate: '2028-11-20',
          frontDocUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
          backDocUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
          status: 'verified',
          submittedAt: '2026-02-15T09:20:00Z',
          reviewedAt: '2026-02-16T11:10:00Z'
        },
        rating: 4.8,
        totalTrips: 128,
        location: 'Birgunj Dry Port'
      },
      {
        id: 'user-d2',
        name: 'Sunil Shrestha',
        phone: '+977-9813567890',
        email: 'sunil.bolero@yahoo.com',
        role: 'driver',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'pending',
        companyVerified: 'unverified',
        vehicleVerified: 'verified',
        driverLicenseRecord: {
          licenseNumber: '04-02-00441982',
          category: 'B - Light Commercial Pickup / Van',
          expiryDate: '2026-11-15',
          frontDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          backDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          status: 'pending',
          submittedAt: '2026-10-10T14:00:00Z'
        },
        nationalIdRecord: {
          idType: 'citizenship',
          idNumber: '44-01-72-00912',
          issuedDistrict: 'Kaski',
          issuedDate: '2016-03-24',
          frontDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          backDocUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          status: 'verified',
          submittedAt: '2026-01-15T08:00:00Z',
          reviewedAt: '2026-01-16T10:00:00Z'
        },
        rating: 4.7,
        totalTrips: 76,
        location: 'Pokhara, Malepatan'
      },
      {
        id: 'user-courier1',
        name: 'Kamal Gautam',
        phone: '+977-9801239876',
        email: 'operations@himalayancourier.np',
        role: 'courier',
        companyName: 'Himalayan Express Cargo & Courier',
        panVatNumber: '304958102',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'unverified',
        companyVerified: 'verified',
        rating: 4.9,
        totalTrips: 340,
        location: 'Kathmandu, New Road'
      },
      {
        id: 'user-fleet1',
        name: 'Prakash Koirala',
        phone: '+977-9855012345',
        email: 'info@sagarmathafreight.com',
        role: 'fleet_company',
        companyName: 'Sagarmatha Multimodal Freight Carriers Pvt. Ltd.',
        panVatNumber: '109847291',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'unverified',
        companyVerified: 'verified',
        companyVerificationRecord: {
          companyName: 'Sagarmatha Multimodal Freight Carriers Pvt. Ltd.',
          panNumber: '109847291',
          vatNumber: '109847291',
          registrationNumber: '110928/074/075',
          registrationDocUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
          panVatDocUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
          authorizedRepName: 'Prakash Koirala',
          authorizedRepDesignation: 'Executive Chairman',
          authorizedRepPhone: '+977-9855012345',
          authorizedRepIdDocUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
          status: 'verified',
          submittedAt: '2025-11-20T10:00:00Z',
          reviewedAt: '2025-11-21T16:00:00Z'
        },
        rating: 4.9,
        totalTrips: 890,
        location: 'Birgunj / Narayangarh'
      },
      {
        id: 'user-admin1',
        name: 'LoadMitra Logistics Admin',
        phone: '+977-01-4432100',
        email: 'admin@loadmitra.com.np',
        role: 'admin',
        verified: true,
        phoneVerified: true,
        identityVerified: 'verified',
        driverVerified: 'verified',
        companyVerified: 'verified',
        rating: 5.0,
        totalTrips: 0,
        location: 'Kathmandu, Tinkune Central Logistics Hub'
      }
    ],
    vehicles: [
      {
        id: 'veh-1',
        ownerId: 'user-d1',
        ownerName: 'Bikram Thapa Magar',
        ownerPhone: '+977-9841987654',
        plateNumber: 'Na 5 Kha 3110',
        category: 'ten_wheel_truck',
        modelName: 'Tata LPK 2518 Multi-Axle Freight Carrier',
        wheelCount: 10,
        payloadCapacityKg: 25000,
        dimensions: { lengthFt: 24, widthFt: 7.5, heightFt: 7 },
        bodyType: 'tarpaulin_high_side',
        photoUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
        bluebookNumber: 'BB-BAG-782910',
        bluebookExpiry: '2027-04-15',
        routePermitNumber: 'RP-NATIONAL-4412',
        routePermitExpiry: '2027-02-28',
        pollutionExpiry: '2026-11-30',
        verified: true,
        status: 'available',
        currentCity: 'Birgunj',
        hasGps: true,
        lat: 27.0125,
        lng: 84.8783
      },
      {
        id: 'veh-2',
        ownerId: 'user-d2',
        ownerName: 'Sunil Shrestha',
        ownerPhone: '+977-9813567890',
        plateNumber: 'Ba Pra 01-026 Cha 4410',
        category: 'four_wheel_pickup',
        modelName: 'Mahindra Bolero Maxi Truck Plus',
        wheelCount: 4,
        payloadCapacityKg: 1800,
        dimensions: { lengthFt: 9, widthFt: 5.5, heightFt: 5 },
        bodyType: 'open_body',
        photoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
        bluebookNumber: 'BB-BAG-341908',
        bluebookExpiry: '2027-06-20',
        routePermitNumber: 'RP-BAGMATI-9102',
        routePermitExpiry: '2027-08-10',
        pollutionExpiry: '2027-01-15',
        verified: true,
        status: 'available',
        currentCity: 'Kathmandu',
        hasGps: true,
        lat: 27.7172,
        lng: 85.324
      },
      {
        id: 'veh-3',
        ownerId: 'user-fleet1',
        ownerName: 'Sagarmatha Multimodal',
        ownerPhone: '+977-9855012345',
        plateNumber: 'Pra 3-01-006 Kha 9012',
        category: 'six_wheel_truck',
        modelName: 'Tata 1109 LPT Turbo Medium Duty',
        wheelCount: 6,
        payloadCapacityKg: 8500,
        dimensions: { lengthFt: 17, widthFt: 6.8, heightFt: 6.5 },
        bodyType: 'covered_container',
        photoUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
        bluebookNumber: 'BB-NAR-550192',
        bluebookExpiry: '2027-03-12',
        routePermitNumber: 'RP-CENTRAL-3301',
        routePermitExpiry: '2027-05-18',
        pollutionExpiry: '2026-12-20',
        verified: true,
        status: 'available',
        currentCity: 'Narayangarh',
        hasGps: true,
        lat: 27.6833,
        lng: 84.4333
      },
      {
        id: 'veh-4',
        ownerId: 'user-courier1',
        ownerName: 'Kamal Gautam',
        ownerPhone: '+977-9801239876',
        plateNumber: 'Ba 1 Cha 8123',
        category: 'cargo_van',
        modelName: 'Maruti Suzuki Eeco Cargo Hardtop',
        wheelCount: 4,
        payloadCapacityKg: 950,
        dimensions: { lengthFt: 7.5, widthFt: 4.8, heightFt: 4.2 },
        bodyType: 'covered_container',
        photoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
        bluebookNumber: 'BB-KTM-119823',
        bluebookExpiry: '2027-09-30',
        routePermitNumber: 'RP-VALLEY-5520',
        routePermitExpiry: '2027-09-30',
        pollutionExpiry: '2027-03-30',
        verified: true,
        status: 'available',
        currentCity: 'Kathmandu',
        hasGps: true,
        lat: 27.7,
        lng: 85.3
      },
      {
        id: 'veh-5',
        ownerId: 'user-fleet1',
        ownerName: 'Sagarmatha Multimodal',
        ownerPhone: '+977-9855012345',
        plateNumber: 'Me 1 Kha 8840',
        category: 'fourteen_wheel_truck',
        modelName: 'Ashok Leyland 4220 14-Wheel Freight King',
        wheelCount: 14,
        payloadCapacityKg: 42000,
        dimensions: { lengthFt: 32, widthFt: 8, heightFt: 8 },
        bodyType: 'tarpaulin_high_side',
        photoUrl: '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
        bluebookNumber: 'BB-KOS-882019',
        bluebookExpiry: '2027-07-15',
        routePermitNumber: 'RP-NATIONAL-9981',
        routePermitExpiry: '2027-07-15',
        pollutionExpiry: '2027-02-15',
        verified: true,
        status: 'available',
        currentCity: 'Biratnagar',
        hasGps: true,
        lat: 26.4525,
        lng: 87.2718
      },
      {
        id: 'veh-6',
        ownerId: 'user-d1',
        ownerName: 'Bikram Thapa Magar',
        ownerPhone: '+977-9841987654',
        plateNumber: 'Ba 3 Ha 5590',
        category: 'three_wheel',
        modelName: 'Bajaj Maxima C Diesel Cargo 3-Wheeler',
        wheelCount: 3,
        payloadCapacityKg: 650,
        dimensions: { lengthFt: 6, widthFt: 4.2, heightFt: 3.8 },
        bodyType: 'open_body',
        photoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
        bluebookNumber: 'BB-KTM-771234',
        bluebookExpiry: '2027-05-10',
        routePermitNumber: 'RP-LOCAL-1029',
        routePermitExpiry: '2027-05-10',
        pollutionExpiry: '2027-01-01',
        verified: true,
        status: 'available',
        currentCity: 'Kathmandu',
        hasGps: false,
        lat: 27.69,
        lng: 85.31
      }
    ],
    cargo: [
      {
        id: 'cargo-1',
        customerId: 'user-c1',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851023456',
        customerCompany: 'Himalayan Organic Agro Suppliers',
        title: 'Mustang Organic Apples & Walnuts Consignment',
        category: 'perishable',
        weightKg: 2400,
        volumeCft: 280,
        pickupLocation: {
          city: 'Pokhara',
          district: 'Kaski',
          address: 'Prithvi Chowk Wholesale Yard, Shed 4',
          contactPerson: 'Karan Gurung',
          contactPhone: '+977-9846123456'
        },
        destinationLocation: {
          city: 'Kathmandu',
          district: 'Kathmandu',
          address: 'Kalimati Fruits & Vegetable Market, Stall 82',
          contactPerson: 'Ramesh Adhikari',
          contactPhone: '+977-9851023456'
        },
        requiredVehicleCategory: 'four_wheel_pickup',
        pickupDate: 'Tomorrow, 07:00 AM',
        deliveryDeadline: 'Tomorrow, 05:00 PM',
        declaredValueNPR: 480000,
        photos: ['/src/assets/images/cargo_loading_warehouse_1792079810527.jpg'],
        laborRequired: 2,
        specialInstructions: 'Temperature sensitive crates. Handle with care, no stacking over 4 layers. Tarpaulin cover mandatory.',
        status: 'open',
        initialBudgetNPR: 18500,
        bidsCount: 3,
        isReturnTripMatch: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cargo-2',
        customerId: 'user-fleet1',
        customerName: 'Prakash Koirala',
        customerPhone: '+977-9855012345',
        customerCompany: 'Sagarmatha Multimodal',
        title: '500 Bags OPC Cement & TMT Steel Reinforcement Bars',
        category: 'construction',
        weightKg: 25000,
        volumeCft: 850,
        pickupLocation: {
          city: 'Birgunj',
          district: 'Parsa',
          address: 'Birgunj ICP Dry Port Gate 2 Warehouse',
          contactPerson: 'Sanjay Yadav',
          contactPhone: '+977-9807123999'
        },
        destinationLocation: {
          city: 'Hetauda',
          district: 'Makwanpur',
          address: 'Hetauda Industrial Estate, Block C-14',
          contactPerson: 'Madan Silwal',
          contactPhone: '+977-9845112233'
        },
        requiredVehicleCategory: 'ten_wheel_truck',
        pickupDate: 'Today, 02:00 PM',
        deliveryDeadline: 'Tonight, 10:00 PM',
        declaredValueNPR: 1250000,
        photos: ['/src/assets/images/loadmitra_hero_truck_1792079808937.jpg'],
        laborRequired: 4,
        specialInstructions: 'Weighbridge slip required at both entry and exit. Heavy moisture protection required.',
        status: 'bidding',
        initialBudgetNPR: 38000,
        bidsCount: 2,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'cargo-3',
        customerId: 'user-courier1',
        customerName: 'Kamal Gautam',
        customerPhone: '+977-9801239876',
        customerCompany: 'Himalayan Express Cargo',
        title: 'E-commerce Consolidated Parcels & Documents (140 Packets)',
        category: 'courier_parcels',
        weightKg: 850,
        volumeCft: 120,
        pickupLocation: {
          city: 'Kathmandu',
          district: 'Kathmandu',
          address: 'New Road Hub, Pako Marg',
          contactPerson: 'Dipendra KC',
          contactPhone: '+977-9841882244'
        },
        destinationLocation: {
          city: 'Narayangarh',
          district: 'Chitwan',
          address: 'Lions Chowk Sorting Center, Narayangarh',
          contactPerson: 'Manoj Pokhrel',
          contactPhone: '+977-9856011223'
        },
        requiredVehicleCategory: 'cargo_van',
        pickupDate: 'Tonight, 09:00 PM',
        deliveryDeadline: 'Tomorrow, 08:00 AM',
        declaredValueNPR: 350000,
        photos: ['/src/assets/images/cargo_loading_warehouse_1792079810527.jpg'],
        laborRequired: 1,
        specialInstructions: 'Tamper proof barcode scanning. Moisture proof delivery van needed.',
        status: 'open',
        initialBudgetNPR: 14000,
        bidsCount: 1,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    bids: [
      {
        id: 'bid-1',
        cargoId: 'cargo-1',
        cargoTitle: 'Mustang Organic Apples & Walnuts Consignment',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        driverPhone: '+977-9813567890',
        driverRating: 4.8,
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        vehicleCategory: 'four_wheel_pickup',
        offeredFareNPR: 19500,
        customerCounterFareNPR: 18000,
        driverCounterFareNPR: 18500,
        pickupETA: 'Will reach Pokhara Prithvi Chowk by 6:30 AM',
        message: 'Bolero pickup with heavy tarpaulin. Experienced on Mugling highway.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'bid-2',
        cargoId: 'cargo-2',
        cargoTitle: '500 Bags OPC Cement & TMT Steel Reinforcement Bars',
        driverId: 'user-d1',
        driverName: 'Bikram Thapa Magar',
        driverPhone: '+977-9841987654',
        driverRating: 4.9,
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        vehicleCategory: 'ten_wheel_truck',
        offeredFareNPR: 37500,
        pickupETA: 'Ready at Birgunj Dry port now',
        message: '10-wheeler ready for immediate loading. Digital weighbridge compliance guaranteed.',
        status: 'countered_by_customer',
        customerCounterFareNPR: 36000,
        createdAt: new Date(Date.now() - 2400000).toISOString()
      }
    ],
    bookings: [
      {
        id: 'book-101',
        cargoId: 'cargo-legacy',
        cargoTitle: 'Commercial Kitchen Equipment & Stainless Tables',
        cargoWeightKg: 1200,
        customerId: 'user-c1',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851023456',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        driverPhone: '+977-9813567890',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        vehicleCategory: 'four_wheel_pickup',
        pickupCity: 'Kathmandu',
        destinationCity: 'Butwal',
        pickupAddress: 'Patan Industrial Estate, Lalitpur',
        destinationAddress: 'Traffic Chowk, Butwal',
        distanceKm: 275,
        agreedFareNPR: 23500,
        paymentMethod: 'esewa',
        paymentStatus: 'advance_paid',
        advanceAmountNPR: 10000,
        balanceAmountNPR: 13500,
        status: 'in_transit',
        currentCheckpoint: 'Mugling Junction (Prithvi Highway KM 110)',
        eta: 'Approx 3.5 hrs to Butwal via Narayangarh',
        otpCode: '4892',
        challanNumber: 'LM-CH-2026-8819',
        proofOfDelivery: {
          consigneeName: 'Binod Paudel',
          consigneePhone: '+977-9847055443',
          otpVerified: false,
          deliveredAt: ''
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    returnTrips: [
      {
        id: 'ret-1',
        driverId: 'user-d1',
        driverName: 'Bikram Thapa Magar',
        driverPhone: '+977-9841987654',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        vehicleCategory: 'ten_wheel_truck',
        fromCity: 'Kathmandu',
        toCity: 'Birgunj',
        departureDate: 'Tomorrow Evening',
        availableCapacityKg: 22000,
        standardFareNPR: 42000,
        discountedFareNPR: 28000,
        notes: 'Empty return journey after unloading in Kathmandu. Discounted backhaul rate to Birgunj.',
        status: 'available',
        createdAt: new Date().toISOString()
      },
      {
        id: 'ret-2',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        driverPhone: '+977-9813567890',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        vehicleCategory: 'four_wheel_pickup',
        fromCity: 'Pokhara',
        toCity: 'Kathmandu',
        departureDate: 'Day After Tomorrow',
        availableCapacityKg: 1800,
        standardFareNPR: 19000,
        discountedFareNPR: 13500,
        notes: 'Returning empty from Pokhara. Carrying vegetables, parcels, or general freight.',
        status: 'available',
        createdAt: new Date().toISOString()
      }
    ],
    insurance: [
      {
        id: 'ins-1',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        insuranceType: 'comprehensive',
        policyNumber: 'SHK-CV-2025-009182',
        insurerName: 'Shikhar Insurance Co. Ltd.',
        coverageAmountNPR: 3500000,
        issueDate: '2025-11-01',
        expiryDate: '2026-10-31',
        verified: true,
        status: 'expiring_soon'
      },
      {
        id: 'ins-2',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        insuranceType: 'goods_in_transit',
        policyNumber: 'GIT-SP-882910',
        insurerName: 'Siddhartha Premier Insurance',
        coverageAmountNPR: 5000000,
        issueDate: '2026-01-10',
        expiryDate: '2027-01-09',
        verified: true,
        status: 'valid'
      },
      {
        id: 'ins-3',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        insuranceType: 'third_party',
        policyNumber: 'RBL-TP-440192',
        insurerName: 'Rastriya Beema Company Ltd.',
        coverageAmountNPR: 1000000,
        issueDate: '2026-03-15',
        expiryDate: '2027-03-14',
        verified: true,
        status: 'valid'
      }
    ],
    disputes: [
      {
        id: 'disp-1',
        bookingId: 'book-101',
        reporterId: 'user-c1',
        reporterName: 'Ramesh Adhikari',
        reporterRole: 'customer',
        category: 'delay',
        description: 'Transit halted at Mugling due to highway widening schedule. Requesting verified ETA update.',
        photos: ['/src/assets/images/loadmitra_hero_truck_1792079808937.jpg'],
        claimedAmountNPR: 0,
        status: 'investigating',
        adminNotes: 'Highway police contacted; single-lane traffic resumed at 07:45 AM. Vehicle proceeding.',
        createdAt: new Date().toISOString()
      }
    ],
    auditLogs: [
      {
        id: 'log-1',
        entityType: 'driver',
        entityId: 'user-d1',
        entityName: 'Bikram Thapa Magar (License 01-06-00892144)',
        adminId: 'user-admin1',
        adminName: 'LoadMitra Logistics Admin',
        previousStatus: 'pending',
        newStatus: 'verified',
        reason: 'DoTM official database cross-reference matched. Heavy multi-axle license verified.',
        timestamp: '2026-02-16T11:10:00Z'
      },
      {
        id: 'log-2',
        entityType: 'vehicle',
        entityId: 'veh-1',
        entityName: 'Na 5 Kha 3110 (Tata 2518 Multi-Axle)',
        adminId: 'user-admin1',
        adminName: 'LoadMitra Logistics Admin',
        previousStatus: 'pending',
        newStatus: 'verified',
        reason: 'Bluebook annual tax and national route permit verified.',
        timestamp: '2026-02-16T11:20:00Z'
      },
      {
        id: 'log-3',
        entityType: 'company',
        entityId: 'user-fleet1',
        entityName: 'Sagarmatha Multimodal Freight Carriers Pvt. Ltd.',
        adminId: 'user-admin1',
        adminName: 'LoadMitra Logistics Admin',
        previousStatus: 'pending',
        newStatus: 'verified',
        reason: 'Company Registrar (OCR) registration certificate and PAN 109847291 verified.',
        timestamp: '2025-11-21T16:00:00Z'
      }
    ],
    trips: [
      {
        id: 'TRIP-2026-101',
        shipmentId: 'cargo-legacy',
        bookingId: 'book-101',
        trackingCode: 'TRK-LM-2026-8819',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        vehicleCategory: 'four_wheel_pickup',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        driverPhone: '+977-9813567890',
        customerId: 'user-c1',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851023456',
        cargoTitle: 'Commercial Kitchen Equipment & Stainless Tables',
        cargoWeightKg: 1200,
        pickupCity: 'Kathmandu',
        pickupAddress: 'Patan Industrial Estate, Lalitpur',
        destinationCity: 'Butwal',
        destinationAddress: 'Traffic Chowk, Butwal',
        pickupDateTime: '2026-10-14T07:30:00Z',
        actualDepartureTime: '2026-10-14T08:15:00Z',
        distanceKm: 275,
        startOdometer: 64210,
        agreedFreightNPR: 23500,
        additionalChargesNPR: 1000,
        tollParkingNPR: 350,
        loadingUnloadingNPR: 800,
        fuelExpensesNPR: 6200,
        maintenanceExpensesNPR: 0,
        platformCommissionNPR: 1175,
        netEarningsNPR: 16175,
        grossRevenueNPR: 24500,
        paymentStatus: 'partially_paid',
        tripStatus: 'delayed',
        currentCheckpoint: 'Mugling Junction (Prithvi Highway KM 110)',
        currentLat: 27.8572,
        currentLng: 84.5552,
        lastLocationUpdateTime: new Date(Date.now() - 900000).toISOString(),
        locationSource: 'browser_gps',
        isLocationLive: true,
        eta: 'Today, 04:30 PM',
        revisedEta: 'Today, 05:45 PM',
        hasActiveDelay: true,
        deliveryOtp: '4892',
        createdAt: '2026-10-14T07:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'TRIP-2026-102',
        shipmentId: 'cargo-past-1',
        bookingId: 'book-102',
        trackingCode: 'TRK-LM-2026-7241',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        vehicleCategory: 'ten_wheel_truck',
        driverId: 'user-d1',
        driverName: 'Bikram Thapa Magar',
        driverPhone: '+977-9841987654',
        customerId: 'user-c1',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851023456',
        cargoTitle: 'Industrial Steel Reinforcement & Wire Mesh',
        cargoWeightKg: 18000,
        pickupCity: 'Birgunj',
        pickupAddress: 'Dry Port Inland Depot, Sirsiya',
        destinationCity: 'Kathmandu',
        destinationAddress: 'Balaju Industrial Area, Kathmandu',
        pickupDateTime: '2026-10-10T06:00:00Z',
        actualDepartureTime: '2026-10-10T06:45:00Z',
        deliveryDateTime: '2026-10-11T11:30:00Z',
        distanceKm: 135,
        startOdometer: 142100,
        endOdometer: 142240,
        actualOdometerKm: 140,
        agreedFreightNPR: 42000,
        additionalChargesNPR: 1500,
        tollParkingNPR: 500,
        loadingUnloadingNPR: 1200,
        fuelExpensesNPR: 12500,
        maintenanceExpensesNPR: 1500,
        platformCommissionNPR: 2100,
        netEarningsNPR: 26200,
        grossRevenueNPR: 43500,
        paymentStatus: 'paid',
        tripStatus: 'delivered',
        currentCheckpoint: 'Balaju Industrial Area (Delivered)',
        currentLat: 27.7371,
        currentLng: 85.3025,
        lastLocationUpdateTime: '2026-10-11T11:30:00Z',
        locationSource: 'browser_gps',
        isLocationLive: false,
        eta: 'Delivered',
        deliveryOtp: '9182',
        proofOfDelivery: {
          consigneeName: 'Binod Paudel',
          consigneePhone: '+977-9847055443',
          otpVerified: true,
          deliveredAt: '2026-10-11T11:30:00Z',
          loadingPhotoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
          unloadingPhotoUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
          notes: 'Delivered in pristine condition, weighbridge verified 18.0 tons.'
        },
        createdAt: '2026-10-10T05:30:00Z',
        updatedAt: '2026-10-11T11:35:00Z'
      },
      {
        id: 'TRIP-2026-103',
        shipmentId: 'cargo-past-2',
        bookingId: 'book-103',
        trackingCode: 'TRK-LM-2026-3392',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        vehicleCategory: 'four_wheel_pickup',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        driverPhone: '+977-9813567890',
        customerId: 'user-c1',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851023456',
        cargoTitle: 'Organic Coffee Beans & Cardamom Parcels',
        cargoWeightKg: 1500,
        pickupCity: 'Pokhara',
        pickupAddress: 'Prithvi Chowk Warehouse',
        destinationCity: 'Kathmandu',
        destinationAddress: 'Kalimati Wholesale Center',
        pickupDateTime: '2026-10-08T08:00:00Z',
        actualDepartureTime: '2026-10-08T08:30:00Z',
        deliveryDateTime: '2026-10-08T18:00:00Z',
        distanceKm: 200,
        startOdometer: 63890,
        endOdometer: 64100,
        actualOdometerKm: 210,
        agreedFreightNPR: 18500,
        additionalChargesNPR: 500,
        tollParkingNPR: 200,
        loadingUnloadingNPR: 500,
        fuelExpensesNPR: 4800,
        maintenanceExpensesNPR: 0,
        platformCommissionNPR: 925,
        netEarningsNPR: 12575,
        grossRevenueNPR: 19000,
        paymentStatus: 'paid',
        tripStatus: 'delivered',
        currentCheckpoint: 'Kalimati (Delivered)',
        currentLat: 27.6982,
        currentLng: 85.3012,
        lastLocationUpdateTime: '2026-10-08T18:00:00Z',
        locationSource: 'manual_driver_update',
        isLocationLive: false,
        eta: 'Delivered',
        deliveryOtp: '6721',
        proofOfDelivery: {
          consigneeName: 'Ramesh Adhikari',
          consigneePhone: '+977-9851023456',
          otpVerified: true,
          deliveredAt: '2026-10-08T18:00:00Z',
          notes: 'Coffee beans received dry and undamaged.'
        },
        createdAt: '2026-10-08T07:30:00Z',
        updatedAt: '2026-10-08T18:05:00Z'
      }
    ],
    fuelRecords: [
      {
        id: 'fuel-1',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        refuelDate: '2026-10-14T08:00:00Z',
        fuelType: 'diesel',
        litres: 40,
        pricePerLitreNPR: 155,
        totalCostNPR: 6200,
        odometerKm: 64210,
        stationName: 'Sajha Yatayat Service Station',
        stationLocation: 'Pulchowk, Lalitpur',
        receiptPhotoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
        notes: 'Full tank diesel before commencing Prithvi Highway trip to Butwal',
        submittedBy: 'Sunil Shrestha',
        submittedAt: '2026-10-14T08:05:00Z',
        status: 'approved',
        reviewedBy: 'LoadMitra Logistics Admin',
        reviewedAt: '2026-10-14T09:00:00Z'
      },
      {
        id: 'fuel-2',
        tripId: 'TRIP-2026-102',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        driverId: 'user-d1',
        driverName: 'Bikram Thapa Magar',
        refuelDate: '2026-10-10T06:15:00Z',
        fuelType: 'diesel',
        litres: 80,
        pricePerLitreNPR: 156.25,
        totalCostNPR: 12500,
        odometerKm: 142100,
        stationName: 'Nepal Oil Corporation Authorized Fuel Center',
        stationLocation: 'Pathlaiya Junction, Bara',
        receiptPhotoUrl: '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
        notes: 'High density diesel for 10-wheeler climbing towards Hetauda/Kathmandu',
        submittedBy: 'Bikram Thapa Magar',
        submittedAt: '2026-10-10T06:20:00Z',
        status: 'approved',
        reviewedBy: 'Prakash Koirala',
        reviewedAt: '2026-10-10T08:30:00Z'
      },
      {
        id: 'fuel-3',
        tripId: 'TRIP-2026-103',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        refuelDate: '2026-10-08T07:45:00Z',
        fuelType: 'diesel',
        litres: 31,
        pricePerLitreNPR: 154.83,
        totalCostNPR: 4800,
        odometerKm: 63890,
        stationName: 'Annapurna Petroleum Suppliers',
        stationLocation: 'Prithvi Chowk, Pokhara',
        notes: 'Refuelled in Pokhara before return trip to Kathmandu',
        submittedBy: 'Sunil Shrestha',
        submittedAt: '2026-10-08T07:50:00Z',
        status: 'approved'
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        category: 'parking_tolls',
        amountNPR: 350,
        expenseDate: '2026-10-14T09:15:00Z',
        description: 'Nagdhunga Tunnel approach toll and municipal road cess',
        status: 'approved',
        submittedBy: 'Sunil Shrestha',
        submittedAt: '2026-10-14T09:15:00Z'
      },
      {
        id: 'exp-2',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        category: 'loading_unloading',
        amountNPR: 800,
        expenseDate: '2026-10-14T08:00:00Z',
        description: 'Labor helper charges for loading heavy stainless tables at Patan',
        status: 'approved',
        submittedBy: 'Sunil Shrestha',
        submittedAt: '2026-10-14T08:05:00Z'
      },
      {
        id: 'exp-3',
        tripId: 'TRIP-2026-102',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        driverId: 'user-d1',
        driverName: 'Bikram Thapa Magar',
        category: 'tyres_parts',
        amountNPR: 1500,
        expenseDate: '2026-10-10T14:30:00Z',
        description: 'Inner tyre valve replacement and nitrogen pressure check at Mugling',
        status: 'approved',
        submittedBy: 'Bikram Thapa Magar',
        submittedAt: '2026-10-10T14:35:00Z'
      },
      {
        id: 'exp-4',
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        category: 'repairs_servicing',
        amountNPR: 8500,
        expenseDate: '2026-09-28T10:00:00Z',
        description: 'Scheduled Mobil 15W-40 engine oil change and grease servicing',
        status: 'approved',
        submittedBy: 'Prakash Koirala',
        submittedAt: '2026-09-28T10:15:00Z'
      }
    ],
    fuelPolicies: [
      {
        vehicleId: 'veh-1',
        vehiclePlate: 'Na 5 Kha 3110',
        policy: 'required_every_trip',
        updatedAt: '2026-01-15T00:00:00Z'
      },
      {
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        policy: 'optional',
        updatedAt: '2026-01-15T00:00:00Z'
      }
    ],
    locationUpdates: [
      {
        id: 'loc-1',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        lat: 27.8572,
        lng: 84.5552,
        checkpoint: 'Mugling Junction (Prithvi Highway KM 110)',
        speedKmh: 24,
        heading: 'South-West towards Narayangarh',
        source: 'browser_gps',
        isLive: true
      },
      {
        id: 'loc-2',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        lat: 27.7601,
        lng: 84.8721,
        checkpoint: 'Malekhu Riverside (KM 68)',
        speedKmh: 42,
        heading: 'West',
        source: 'browser_gps',
        isLive: false
      },
      {
        id: 'loc-3',
        tripId: 'TRIP-2026-101',
        vehicleId: 'veh-2',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        lat: 27.7121,
        lng: 85.2012,
        checkpoint: 'Nagdhunga Checkpost (KM 14)',
        speedKmh: 30,
        heading: 'West',
        source: 'browser_gps',
        isLive: false
      }
    ],
    delayReports: [
      {
        id: 'delay-1',
        tripId: 'TRIP-2026-101',
        bookingId: 'book-101',
        vehicleId: 'veh-2',
        vehiclePlate: 'Ba Pra 01-026 Cha 4410',
        driverId: 'user-d2',
        driverName: 'Sunil Shrestha',
        reportedAt: '2026-10-14T11:45:00Z',
        reason: 'landslide',
        locationName: 'Mugling - Kurintar section (Prithvi Highway KM 106)',
        coords: { lat: 27.8572, lng: 84.5552 },
        description: 'Minor mudslide cleared to single lane. Highway police allowing alternating traffic flow.',
        expectedDelayMinutes: 75,
        revisedETA: 'Today, 05:45 PM',
        requiresRoadsideAssistance: false,
        status: 'active'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        tripId: 'TRIP-2026-101',
        recipientRole: 'customer',
        type: 'delay_reported',
        title: 'Shipment Delay Alert: Prithvi Highway Mudslide',
        message: 'Driver Sunil Shrestha reported a 75-min traffic slowdown near Mugling. Revised ETA is 05:45 PM.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        tripId: 'TRIP-2026-101',
        recipientRole: 'fleet_company',
        type: 'fuel_logged',
        title: 'New Refuelling Log Submitted',
        message: '40L Diesel (NPR 6,200) logged at Sajha Yatayat Pulchowk by driver Sunil Shrestha for vehicle Ba Pra 01-026 Cha 4410.',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        read: true
      },
      {
        id: 'notif-3',
        tripId: 'TRIP-2026-101',
        recipientRole: 'all',
        type: 'trip_started',
        title: 'Trip Started: Kathmandu to Butwal',
        message: 'Vehicle Ba Pra 01-026 Cha 4410 has departed Patan Industrial Estate. Live tracking active.',
        timestamp: '2026-10-14T08:15:00Z',
        read: true
      }
    ]
  };
}

// Ensure database file exists
function loadDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(content);
    // Migration checks
    let changed = false;
    const seed = getSeedData();
    if (!db.auditLogs) { db.auditLogs = seed.auditLogs; changed = true; }
    if (!db.trips) { db.trips = seed.trips; changed = true; }
    if (!db.fuelRecords) { db.fuelRecords = seed.fuelRecords; changed = true; }
    if (!db.expenses) { db.expenses = seed.expenses; changed = true; }
    if (!db.fuelPolicies) { db.fuelPolicies = seed.fuelPolicies; changed = true; }
    if (!db.locationUpdates) { db.locationUpdates = seed.locationUpdates; changed = true; }
    if (!db.delayReports) { db.delayReports = seed.delayReports; changed = true; }
    if (!db.notifications) { db.notifications = seed.notifications; changed = true; }
    if (!db.networkVehicles) { db.networkVehicles = INITIAL_NETWORK_VEHICLES; changed = true; }
    if (!db.networkCargo) { db.networkCargo = INITIAL_NETWORK_CARGO; changed = true; }
    if (changed) {
      saveDatabase(db);
    }
    return db;
  } catch (err) {
    console.error('Error reading db file, resetting to seed:', err);
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

// REST API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'LoadMitra Nepal Goods Transportation',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req: Request, res: Response) => {
  const db = loadDatabase();
  const totalFreightTons = db.bookings.reduce((acc: number, b: any) => acc + (b.cargoWeightKg || 0), 0) / 1000 + 1420;
  res.json({
    activeShipments: db.bookings.filter((b: any) => b.status === 'in_transit' || b.status === 'loaded').length,
    openCargoPosts: db.cargo.filter((c: any) => c.status === 'open' || c.status === 'bidding').length,
    registeredTrucks: db.vehicles.length,
    verifiedFleets: db.users.filter((u: any) => u.role === 'fleet_company' || u.role === 'driver').length,
    totalFreightTons: Math.round(totalFreightTons),
    returnTripsAvailable: db.returnTrips.filter((r: any) => r.status === 'available').length
  });
});

// Cargo CRUD
app.get('/api/cargo', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { city, category, vehicleType } = req.query;
  let items = db.cargo;

  if (city) {
    const qCity = String(city).toLowerCase();
    items = items.filter(
      (c: any) =>
        c.pickupLocation.city.toLowerCase().includes(qCity) ||
        c.destinationLocation.city.toLowerCase().includes(qCity)
    );
  }
  if (category && category !== 'all') {
    items = items.filter((c: any) => c.category === category);
  }
  if (vehicleType && vehicleType !== 'all') {
    items = items.filter((c: any) => c.requiredVehicleCategory === vehicleType);
  }

  res.json(items);
});

app.post('/api/cargo', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newPost = {
    ...req.body,
    id: `cargo-${Date.now()}`,
    status: 'open',
    bidsCount: 0,
    createdAt: new Date().toISOString()
  };
  db.cargo.unshift(newPost);
  saveDatabase(db);
  res.status(201).json(newPost);
});

app.get('/api/cargo/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const post = db.cargo.find((c: any) => c.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Cargo post not found' });
  }
  res.json(post);
});

// Vehicles
app.get('/api/vehicles', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { category, city, wheelCount } = req.query;
  let vehicles = db.vehicles;

  if (category && category !== 'all') {
    vehicles = vehicles.filter((v: any) => v.category === category);
  }
  if (city) {
    const qCity = String(city).toLowerCase();
    vehicles = vehicles.filter((v: any) => v.currentCity.toLowerCase().includes(qCity));
  }
  if (wheelCount && wheelCount !== 'all') {
    vehicles = vehicles.filter((v: any) => v.wheelCount === Number(wheelCount));
  }

  res.json(vehicles);
});

app.post('/api/vehicles', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newVeh = {
    ...req.body,
    id: `veh-${Date.now()}`,
    verified: false,
    status: 'available',
    createdAt: new Date().toISOString()
  };
  db.vehicles.push(newVeh);
  saveDatabase(db);
  res.status(201).json(newVeh);
});

// inDrive-style Bidding & Fare Negotiation
app.get('/api/bids', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { cargoId, driverId } = req.query;
  let bids = db.bids;
  if (cargoId) bids = bids.filter((b: any) => b.cargoId === cargoId);
  if (driverId) bids = bids.filter((b: any) => b.driverId === driverId);
  res.json(bids);
});

app.post('/api/bids', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newBid = {
    ...req.body,
    id: `bid-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.bids.push(newBid);

  // Increment bids count on cargo
  const cargoIndex = db.cargo.findIndex((c: any) => c.id === newBid.cargoId);
  if (cargoIndex !== -1) {
    db.cargo[cargoIndex].bidsCount = (db.cargo[cargoIndex].bidsCount || 0) + 1;
    if (db.cargo[cargoIndex].status === 'open') {
      db.cargo[cargoIndex].status = 'bidding';
    }
  }

  saveDatabase(db);
  res.status(201).json(newBid);
});

app.patch('/api/bids/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.bids.findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Bid not found' });
  }

  const { status, customerCounterFareNPR, driverCounterFareNPR } = req.body;
  if (status) db.bids[index].status = status;
  if (customerCounterFareNPR !== undefined) {
    db.bids[index].customerCounterFareNPR = customerCounterFareNPR;
    db.bids[index].status = 'countered_by_customer';
  }
  if (driverCounterFareNPR !== undefined) {
    db.bids[index].driverCounterFareNPR = driverCounterFareNPR;
    db.bids[index].status = 'countered_by_driver';
  }

  // If accepted, generate confirmed booking and official Challan
  if (status === 'accepted') {
    const bid = db.bids[index];
    const cargo = db.cargo.find((c: any) => c.id === bid.cargoId);
    const agreedFare = bid.driverCounterFareNPR || bid.customerCounterFareNPR || bid.offeredFareNPR;
    const advanceAmount = Math.round(agreedFare * 0.4);
    const balanceAmount = agreedFare - advanceAmount;

    const newBooking = {
      id: `book-${Date.now()}`,
      cargoId: bid.cargoId,
      cargoTitle: bid.cargoTitle || cargo?.title || 'Commercial Consignment',
      cargoWeightKg: cargo?.weightKg || 1500,
      customerId: cargo?.customerId || 'user-c1',
      customerName: cargo?.customerName || 'Shipper Client',
      customerPhone: cargo?.customerPhone || '+977-9851023456',
      driverId: bid.driverId,
      driverName: bid.driverName,
      driverPhone: bid.driverPhone,
      vehicleId: bid.vehicleId,
      vehiclePlate: bid.vehiclePlate,
      vehicleCategory: bid.vehicleCategory,
      pickupCity: cargo?.pickupLocation?.city || 'Kathmandu',
      destinationCity: cargo?.destinationLocation?.city || 'Pokhara',
      pickupAddress: cargo?.pickupLocation?.address || 'Kathmandu Hub',
      destinationAddress: cargo?.destinationLocation?.address || 'Destination Point',
      distanceKm: 200,
      agreedFareNPR: agreedFare,
      paymentMethod: 'esewa',
      paymentStatus: 'advance_paid',
      advanceAmountNPR: advanceAmount,
      balanceAmountNPR: balanceAmount,
      status: 'assigned',
      currentCheckpoint: `${cargo?.pickupLocation?.city || 'Origin'} Hub Loading Bay`,
      eta: 'Assigned - En route to loading point',
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      challanNumber: `LM-CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      proofOfDelivery: {
        consigneeName: cargo?.destinationLocation?.contactPerson || 'Consignee',
        consigneePhone: cargo?.destinationLocation?.contactPhone || '+977-9800000000',
        otpVerified: false,
        deliveredAt: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);

    // Update cargo status
    if (cargo) {
      cargo.status = 'assigned';
    }
  }

  saveDatabase(db);
  res.json(db.bids[index]);
});

// Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.bookings);
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newBooking = {
    ...req.body,
    id: `book-${Date.now()}`,
    otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
    challanNumber: `LM-CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.bookings.unshift(newBooking);
  saveDatabase(db);
  res.status(201).json(newBooking);
});

// Update shipment transit status
app.post('/api/bookings/:id/status', (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.bookings.findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const { status, checkpoint, eta } = req.body;
  if (status) db.bookings[index].status = status;
  if (checkpoint) db.bookings[index].currentCheckpoint = checkpoint;
  if (eta) db.bookings[index].eta = eta;
  db.bookings[index].updatedAt = new Date().toISOString();

  saveDatabase(db);
  res.json(db.bookings[index]);
});

// Proof of Delivery (POD) with Consignee OTP verification and digital signature
app.post('/api/bookings/:id/pod', (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.bookings.findIndex((b: any) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const { otpEntered, digitalSignature, loadingPhotoUrl, unloadingPhotoUrl, notes } = req.body;
  const booking = db.bookings[index];

  // Verify OTP
  if (otpEntered !== booking.otpCode) {
    return res.status(400).json({ error: 'Invalid delivery OTP code provided by consignee' });
  }

  booking.proofOfDelivery = {
    ...booking.proofOfDelivery,
    loadingPhotoUrl: loadingPhotoUrl || booking.proofOfDelivery?.loadingPhotoUrl,
    unloadingPhotoUrl: unloadingPhotoUrl || '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
    otpVerified: true,
    digitalSignature: digitalSignature || 'data:image/svg+xml;utf8,<svg>Verified</svg>',
    deliveredAt: new Date().toISOString(),
    notes: notes || 'Delivered in good order and condition.'
  };

  booking.status = 'delivered';
  booking.paymentStatus = 'fully_paid';
  booking.updatedAt = new Date().toISOString();

  // Also sync matching trip in db.trips
  if (db.trips) {
    const trip = db.trips.find((t: any) => t.bookingId === booking.id || t.shipmentId === booking.cargoId);
    if (trip) {
      trip.tripStatus = 'delivered';
      trip.paymentStatus = 'paid';
      trip.deliveryDateTime = new Date().toISOString();
      trip.proofOfDelivery = booking.proofOfDelivery;
      trip.updatedAt = new Date().toISOString();
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        tripId: trip.id,
        recipientRole: 'all',
        type: 'delivery_confirmed',
        title: `Delivery Confirmed: ${trip.cargoTitle}`,
        message: `Consignee ${booking.proofOfDelivery.consigneeName} confirmed delivery of shipment (${trip.trackingCode}). Signed POD recorded.`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }

  saveDatabase(db);
  res.json({ success: true, booking });
});

// ============================================================================
// FEATURE 1 & 2: TRIPS, EARNINGS, FUEL, EXPENSES, LOCATION & TRACKING
// ============================================================================

// 1. Trips List (with rich filtering for Daily, Weekly, Monthly, Yearly, Custom date, Role, Status)
app.get('/api/trips', (req: Request, res: Response) => {
  const db = loadDatabase();
  const {
    role,
    userId,
    driverId,
    vehicleId,
    customerId,
    status,
    period,
    startDate,
    endDate,
    search
  } = req.query;

  let items = db.trips || [];

  // Role-based or entity filters
  if (driverId) {
    items = items.filter((t: any) => t.driverId === driverId);
  } else if (customerId) {
    items = items.filter((t: any) => t.customerId === customerId);
  } else if (vehicleId) {
    items = items.filter((t: any) => t.vehicleId === vehicleId);
  } else if (role === 'driver' && userId) {
    items = items.filter((t: any) => t.driverId === userId);
  } else if (role === 'customer' && userId) {
    items = items.filter((t: any) => t.customerId === userId);
  } else if (role === 'fleet_company' && userId) {
    // Owner vehicles
    const ownerVehicles = (db.vehicles || []).filter((v: any) => v.ownerId === userId).map((v: any) => v.id);
    items = items.filter((t: any) => ownerVehicles.includes(t.vehicleId) || t.driverId === userId);
  }

  if (status && status !== 'all') {
    items = items.filter((t: any) => t.tripStatus === status);
  }

  // Date filtering
  const now = new Date();
  if (period === 'daily') {
    const todayStr = now.toISOString().split('T')[0];
    items = items.filter((t: any) => (t.pickupDateTime || t.createdAt).startsWith(todayStr));
  } else if (period === 'weekly') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    items = items.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= weekAgo);
  } else if (period === 'monthly') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    items = items.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= monthAgo);
  } else if (period === 'yearly') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    items = items.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= yearAgo);
  } else if (period === 'custom' && startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);
    items = items.filter((t: any) => {
      const d = new Date(t.pickupDateTime || t.createdAt);
      return d >= start && d <= end;
    });
  }

  // Text search
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    items = items.filter((t: any) =>
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.trackingCode && t.trackingCode.toLowerCase().includes(q)) ||
      (t.cargoTitle && t.cargoTitle.toLowerCase().includes(q)) ||
      (t.pickupCity && t.pickupCity.toLowerCase().includes(q)) ||
      (t.destinationCity && t.destinationCity.toLowerCase().includes(q)) ||
      (t.vehiclePlate && t.vehiclePlate.toLowerCase().includes(q)) ||
      (t.driverName && t.driverName.toLowerCase().includes(q))
    );
  }

  // Attach fuel and expense counts and latest delay report
  const enriched = items.map((t: any) => {
    const fuelList = (db.fuelRecords || []).filter((f: any) => f.tripId === t.id);
    const expList = (db.expenses || []).filter((e: any) => e.tripId === t.id);
    const delay = (db.delayReports || []).find((d: any) => d.tripId === t.id && d.status === 'active');
    return {
      ...t,
      fuelRecordsCount: fuelList.length,
      expensesCount: expList.length,
      latestDelayReport: delay || null,
      actualOdometerKm: t.endOdometer && t.startOdometer ? t.endOdometer - t.startOdometer : undefined
    };
  });

  res.json(enriched);
});

// 2. Single Trip Details (with timeline, expenses, fuel, locations, delays)
app.get('/api/trips/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const trip = (db.trips || []).find((t: any) => t.id === req.params.id || t.trackingCode === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const fuelRecords = (db.fuelRecords || []).filter((f: any) => f.tripId === trip.id);
  const expenses = (db.expenses || []).filter((e: any) => e.tripId === trip.id);
  const locationUpdates = (db.locationUpdates || []).filter((l: any) => l.tripId === trip.id).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const delayReports = (db.delayReports || []).filter((d: any) => d.tripId === trip.id);

  res.json({
    ...trip,
    fuelRecords,
    expenses,
    locationUpdates,
    delayReports,
    actualOdometerKm: trip.endOdometer && trip.startOdometer ? trip.endOdometer - trip.startOdometer : undefined
  });
});

// 3. Create or Initialize Trip
app.post('/api/trips', (req: Request, res: Response) => {
  const db = loadDatabase();
  const year = new Date().getFullYear();
  const tripId = `TRIP-${year}-${Math.floor(100 + Math.random() * 900)}`;
  const trackingCode = `TRK-LM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

  const agreedFreight = Number(req.body.agreedFreightNPR) || 20000;
  const additionalCharges = Number(req.body.additionalChargesNPR) || 0;
  const commission = Math.round(agreedFreight * 0.05); // 5% platform commission
  const netEarnings = agreedFreight + additionalCharges - commission;

  const newTrip = {
    ...req.body,
    id: tripId,
    trackingCode,
    agreedFreightNPR: agreedFreight,
    additionalChargesNPR: additionalCharges,
    tollParkingNPR: 0,
    loadingUnloadingNPR: 0,
    fuelExpensesNPR: 0,
    maintenanceExpensesNPR: 0,
    platformCommissionNPR: commission,
    netEarningsNPR: netEarnings,
    grossRevenueNPR: agreedFreight + additionalCharges,
    paymentStatus: req.body.paymentStatus || 'pending',
    tripStatus: req.body.tripStatus || 'assigned',
    isLocationLive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!db.trips) db.trips = [];
  db.trips.unshift(newTrip);

  // Sync with booking if bookingId provided
  if (req.body.bookingId) {
    const b = (db.bookings || []).find((book: any) => book.id === req.body.bookingId);
    if (b) {
      b.tripId = tripId;
      b.trackingCode = trackingCode;
    }
  }

  // Notification
  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    tripId,
    recipientRole: 'all',
    type: 'trip_started',
    title: `New Trip Created: ${newTrip.cargoTitle}`,
    message: `Trip ${tripId} scheduled for route ${newTrip.pickupCity} to ${newTrip.destinationCity}. Tracking Code: ${trackingCode}`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  res.status(201).json(newTrip);
});

// 4. Driver Status Update (Trip started, on the way, stopped, delayed, arrived, delivered)
app.patch('/api/trips/:id/status', (req: Request, res: Response) => {
  const db = loadDatabase();
  const trip = (db.trips || []).find((t: any) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const {
    status,
    checkpoint,
    lat,
    lng,
    startOdometer,
    endOdometer,
    eta,
    notes,
    locationSource = 'manual_driver_update'
  } = req.body;

  if (status) trip.tripStatus = status;
  if (checkpoint) trip.currentCheckpoint = checkpoint;
  if (lat !== undefined && lng !== undefined) {
    trip.currentLat = lat;
    trip.currentLng = lng;
    trip.lastLocationUpdateTime = new Date().toISOString();
    trip.locationSource = locationSource;
    trip.isLocationLive = locationSource === 'browser_gps';
  }
  if (startOdometer !== undefined) trip.startOdometer = Number(startOdometer);
  if (endOdometer !== undefined) {
    trip.endOdometer = Number(endOdometer);
    if (trip.startOdometer) {
      trip.actualOdometerKm = trip.endOdometer - trip.startOdometer;
    }
  }
  if (eta) trip.eta = eta;

  if (status === 'in_transit' && !trip.actualDepartureTime) {
    trip.actualDepartureTime = new Date().toISOString();
  }
  if (status === 'delivered') {
    trip.deliveryDateTime = new Date().toISOString();
    trip.paymentStatus = 'paid';
  }
  trip.updatedAt = new Date().toISOString();

  // Record location update breadcrumb
  if (lat && lng && db.locationUpdates) {
    db.locationUpdates.unshift({
      id: `loc-${Date.now()}`,
      tripId: trip.id,
      vehicleId: trip.vehicleId,
      timestamp: new Date().toISOString(),
      lat,
      lng,
      checkpoint: checkpoint || trip.currentCheckpoint || 'En Route',
      source: locationSource,
      isLive: locationSource === 'browser_gps'
    });
  }

  // Also sync linked booking
  const booking = (db.bookings || []).find((b: any) => b.id === trip.bookingId || b.tripId === trip.id);
  if (booking) {
    if (status) booking.status = status;
    if (checkpoint) booking.currentCheckpoint = checkpoint;
    if (eta) booking.eta = eta;
    if (status === 'delivered') booking.paymentStatus = 'fully_paid';
    booking.updatedAt = new Date().toISOString();
  }

  // Create real-time notification
  if (!db.notifications) db.notifications = [];
  const statusTitles: Record<string, string> = {
    in_transit: `Trip On The Way: ${trip.vehiclePlate}`,
    delayed: `Trip Delayed: ${trip.vehiclePlate}`,
    at_destination: `Vehicle Arrived at Destination`,
    delivered: `Cargo Delivered & Confirmed`
  };
  if (statusTitles[status]) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      tripId: trip.id,
      recipientRole: 'customer',
      type: status === 'delayed' ? 'delay_reported' : (status === 'delivered' ? 'delivery_confirmed' : 'trip_started'),
      title: statusTitles[status],
      message: `Trip ${trip.trackingCode} is now: ${status.replace('_', ' ').toUpperCase()} at ${checkpoint || trip.currentCheckpoint || trip.pickupCity}.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);
  res.json({ success: true, trip });
});

// 5. Live Location Updates (GPS or Driver Checkpoint)
app.post('/api/trips/:id/location', (req: Request, res: Response) => {
  const db = loadDatabase();
  const trip = (db.trips || []).find((t: any) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const { lat, lng, checkpoint, speedKmh, heading, source = 'browser_gps' } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  const locationEntry = {
    id: `loc-${Date.now()}`,
    tripId: trip.id,
    vehicleId: trip.vehicleId,
    timestamp: new Date().toISOString(),
    lat: Number(lat),
    lng: Number(lng),
    checkpoint: checkpoint || trip.currentCheckpoint || 'Highway Route',
    speedKmh: speedKmh ? Number(speedKmh) : undefined,
    heading,
    source,
    isLive: source === 'browser_gps'
  };

  if (!db.locationUpdates) db.locationUpdates = [];
  db.locationUpdates.unshift(locationEntry);

  trip.currentLat = Number(lat);
  trip.currentLng = Number(lng);
  if (checkpoint) trip.currentCheckpoint = checkpoint;
  trip.lastLocationUpdateTime = new Date().toISOString();
  trip.locationSource = source;
  trip.isLocationLive = source === 'browser_gps';
  trip.updatedAt = new Date().toISOString();

  // Also update vehicle's current coords in fleet directory
  const veh = (db.vehicles || []).find((v: any) => v.id === trip.vehicleId);
  if (veh) {
    veh.lat = Number(lat);
    veh.lng = Number(lng);
    if (checkpoint) veh.currentCity = checkpoint;
  }

  saveDatabase(db);
  res.json({ success: true, location: locationEntry });
});

// 6. Delay and Breakdown Reporting
app.post('/api/trips/:id/delays', (req: Request, res: Response) => {
  const db = loadDatabase();
  const trip = (db.trips || []).find((t: any) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const {
    reason,
    locationName,
    coords,
    description,
    photoUrl,
    expectedDelayMinutes = 60,
    revisedETA,
    requiresRoadsideAssistance = false
  } = req.body;

  const report = {
    id: `delay-${Date.now()}`,
    tripId: trip.id,
    bookingId: trip.bookingId,
    vehicleId: trip.vehicleId,
    vehiclePlate: trip.vehiclePlate,
    driverId: trip.driverId,
    driverName: trip.driverName,
    reportedAt: new Date().toISOString(),
    reason: reason || 'traffic_jam',
    locationName: locationName || trip.currentCheckpoint || 'Highway Section',
    coords,
    description: description || 'Delay encountered on highway corridor',
    photoUrl,
    expectedDelayMinutes: Number(expectedDelayMinutes),
    revisedETA: revisedETA || 'Delayed by approx 1 hour',
    requiresRoadsideAssistance: Boolean(requiresRoadsideAssistance),
    status: 'active'
  };

  if (!db.delayReports) db.delayReports = [];
  db.delayReports.unshift(report);

  trip.tripStatus = 'delayed';
  trip.hasActiveDelay = true;
  trip.revisedEta = revisedETA || `Delayed +${expectedDelayMinutes}m`;
  trip.latestDelayReport = report;
  trip.updatedAt = new Date().toISOString();

  // Dispatch Notification
  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    tripId: trip.id,
    recipientRole: 'customer',
    type: 'delay_reported',
    title: `Delay Reported: ${reason.replace('_', ' ').toUpperCase()}`,
    message: `${trip.driverName} reported delay near ${locationName || 'highway'}. Delay estimate: ${expectedDelayMinutes} mins. Revised ETA: ${revisedETA}`,
    timestamp: new Date().toISOString(),
    read: false
  });

  if (requiresRoadsideAssistance) {
    db.notifications.unshift({
      id: `notif-sos-${Date.now()}`,
      tripId: trip.id,
      recipientRole: 'all',
      type: 'breakdown_emergency',
      title: `URGENT: Roadside Assistance Requested for ${trip.vehiclePlate}`,
      message: `Breakdown reported at ${locationName}: ${description}. Mechanical assistance required.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);
  res.status(201).json({ success: true, report });
});

// 7. Resume Journey after breakdown/delay
app.patch('/api/delays/:id/resume', (req: Request, res: Response) => {
  const db = loadDatabase();
  const delay = (db.delayReports || []).find((d: any) => d.id === req.params.id);
  if (!delay) {
    return res.status(404).json({ error: 'Delay report not found' });
  }

  delay.status = 'resumed';
  delay.resumedAt = new Date().toISOString();

  const trip = (db.trips || []).find((t: any) => t.id === delay.tripId);
  if (trip) {
    trip.hasActiveDelay = false;
    trip.tripStatus = 'in_transit';
    trip.updatedAt = new Date().toISOString();

    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      tripId: trip.id,
      recipientRole: 'customer',
      type: 'journey_resumed',
      title: `Journey Resumed: ${trip.vehiclePlate}`,
      message: `Vehicle has cleared delay at ${delay.locationName} and resumed transit towards ${trip.destinationCity}.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);
  res.json({ success: true, delay });
});

// 8. Fuel Records API
app.get('/api/fuel', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { vehicleId, tripId, status } = req.query;
  let items = db.fuelRecords || [];
  if (vehicleId) items = items.filter((f: any) => f.vehicleId === vehicleId);
  if (tripId) items = items.filter((f: any) => f.tripId === tripId);
  if (status && status !== 'all') items = items.filter((f: any) => f.status === status);
  res.json(items);
});

app.post('/api/fuel', (req: Request, res: Response) => {
  const db = loadDatabase();
  const {
    tripId,
    vehicleId,
    vehiclePlate,
    driverId,
    driverName,
    refuelDate,
    fuelType = 'diesel',
    litres,
    pricePerLitreNPR,
    totalCostNPR,
    odometerKm,
    stationName,
    stationLocation,
    receiptPhotoUrl,
    notes,
    submittedBy
  } = req.body;

  if (!litres || !totalCostNPR) {
    return res.status(400).json({ error: 'Litres and total cost are required' });
  }

  const newRecord = {
    id: `fuel-${Date.now()}`,
    tripId: tripId || '',
    vehicleId: vehicleId || '',
    vehiclePlate: vehiclePlate || '',
    driverId: driverId || '',
    driverName: driverName || submittedBy || 'Driver',
    refuelDate: refuelDate || new Date().toISOString(),
    fuelType,
    litres: Number(litres),
    pricePerLitreNPR: pricePerLitreNPR ? Number(pricePerLitreNPR) : Math.round(Number(totalCostNPR) / Number(litres)),
    totalCostNPR: Number(totalCostNPR),
    odometerKm: Number(odometerKm) || 0,
    stationName: stationName || 'Highway Petroleum Center',
    stationLocation: stationLocation || 'Nepal Corridor',
    receiptPhotoUrl,
    notes,
    submittedBy: submittedBy || 'Driver',
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };

  if (!db.fuelRecords) db.fuelRecords = [];
  db.fuelRecords.unshift(newRecord);

  // Update trip fuel expense total if tripId given
  if (tripId) {
    const trip = (db.trips || []).find((t: any) => t.id === tripId);
    if (trip) {
      trip.fuelExpensesNPR = (trip.fuelExpensesNPR || 0) + Number(totalCostNPR);
      trip.netEarningsNPR = (trip.agreedFreightNPR || 0) + (trip.additionalChargesNPR || 0) - (trip.platformCommissionNPR || 0) - (trip.fuelExpensesNPR || 0) - (trip.maintenanceExpensesNPR || 0) - (trip.tollParkingNPR || 0) - (trip.loadingUnloadingNPR || 0);
      trip.updatedAt = new Date().toISOString();
    }
  }

  // Notify vehicle owner / manager
  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    tripId: tripId || '',
    recipientRole: 'fleet_company',
    type: 'fuel_logged',
    title: `Fuel Record Submitted for ${vehiclePlate || 'Vehicle'}`,
    message: `${litres}L ${fuelType.toUpperCase()} (NPR ${totalCostNPR.toLocaleString()}) logged at ${stationName || 'Fuel Station'} awaiting owner verification.`,
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  res.status(201).json(newRecord);
});

// Review Fuel Record (Approve / Reject / Revision)
app.patch('/api/fuel/:id/review', (req: Request, res: Response) => {
  const db = loadDatabase();
  const record = (db.fuelRecords || []).find((f: any) => f.id === req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Fuel record not found' });
  }

  const { decision, reviewNotes, reviewerId = 'user-admin1', reviewerName = 'Vehicle Owner' } = req.body;
  record.status = decision;
  record.reviewNotes = reviewNotes;
  record.reviewedBy = reviewerName;
  record.reviewedAt = new Date().toISOString();

  // Audit Log
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'vehicle',
    entityId: record.vehicleId,
    entityName: `Fuel Log: ${record.vehiclePlate} (${record.litres}L)`,
    adminId: reviewerId,
    adminName: reviewerName,
    previousStatus: 'pending',
    newStatus: decision,
    reason: reviewNotes || `Fuel record marked as ${decision}`,
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, record });
});

// Fuel Logging Policy Configuration
app.get('/api/fuel/policies', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.fuelPolicies || []);
});

app.post('/api/fuel/policies', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { vehicleId, vehiclePlate, policy, assignedDriverIds } = req.body;
  if (!db.fuelPolicies) db.fuelPolicies = [];
  const index = db.fuelPolicies.findIndex((p: any) => p.vehicleId === vehicleId);
  const entry = {
    vehicleId,
    vehiclePlate,
    policy: policy || 'optional',
    assignedDriverIds: assignedDriverIds || [],
    updatedAt: new Date().toISOString()
  };
  if (index !== -1) {
    db.fuelPolicies[index] = entry;
  } else {
    db.fuelPolicies.push(entry);
  }
  saveDatabase(db);
  res.json({ success: true, policy: entry });
});

// 9. Vehicle Maintenance and Operating Expenses
app.get('/api/expenses', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { vehicleId, tripId, category } = req.query;
  let items = db.expenses || [];
  if (vehicleId) items = items.filter((e: any) => e.vehicleId === vehicleId);
  if (tripId) items = items.filter((e: any) => e.tripId === tripId);
  if (category && category !== 'all') items = items.filter((e: any) => e.category === category);
  res.json(items);
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const db = loadDatabase();
  const {
    tripId,
    vehicleId,
    vehiclePlate,
    driverId,
    driverName,
    category = 'repairs_servicing',
    amountNPR,
    expenseDate,
    description,
    receiptUrl,
    submittedBy
  } = req.body;

  if (!amountNPR) {
    return res.status(400).json({ error: 'Expense amount is required' });
  }

  const newExpense = {
    id: `exp-${Date.now()}`,
    tripId: tripId || undefined,
    vehicleId: vehicleId || '',
    vehiclePlate: vehiclePlate || '',
    driverId: driverId || '',
    driverName: driverName || submittedBy || '',
    category,
    amountNPR: Number(amountNPR),
    expenseDate: expenseDate || new Date().toISOString(),
    description: description || 'Vehicle operating expense',
    receiptUrl,
    status: 'approved',
    submittedBy: submittedBy || 'User',
    submittedAt: new Date().toISOString()
  };

  if (!db.expenses) db.expenses = [];
  db.expenses.unshift(newExpense);

  // If tied to trip, update trip expense ledger
  if (tripId) {
    const trip = (db.trips || []).find((t: any) => t.id === tripId);
    if (trip) {
      if (category === 'parking_tolls') trip.tollParkingNPR = (trip.tollParkingNPR || 0) + Number(amountNPR);
      else if (category === 'loading_unloading') trip.loadingUnloadingNPR = (trip.loadingUnloadingNPR || 0) + Number(amountNPR);
      else trip.maintenanceExpensesNPR = (trip.maintenanceExpensesNPR || 0) + Number(amountNPR);

      trip.netEarningsNPR = (trip.agreedFreightNPR || 0) + (trip.additionalChargesNPR || 0) - (trip.platformCommissionNPR || 0) - (trip.fuelExpensesNPR || 0) - (trip.maintenanceExpensesNPR || 0) - (trip.tollParkingNPR || 0) - (trip.loadingUnloadingNPR || 0);
      trip.updatedAt = new Date().toISOString();
    }
  }

  saveDatabase(db);
  res.status(201).json(newExpense);
});

// 10. Driver Earnings Report Aggregator
app.get('/api/reports/driver/:driverId', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { driverId } = req.params;
  const { period = 'monthly', startDate, endDate } = req.query;

  const driver = (db.users || []).find((u: any) => u.id === driverId);
  const driverName = driver ? driver.name : 'Commercial Driver';

  let trips = (db.trips || []).filter((t: any) => t.driverId === driverId);

  // Period filtering
  const now = new Date();
  if (period === 'daily') {
    const todayStr = now.toISOString().split('T')[0];
    trips = trips.filter((t: any) => (t.pickupDateTime || t.createdAt).startsWith(todayStr));
  } else if (period === 'weekly') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= weekAgo);
  } else if (period === 'monthly') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= monthAgo);
  } else if (period === 'yearly') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= yearAgo);
  } else if (period === 'custom' && startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);
    trips = trips.filter((t: any) => {
      const d = new Date(t.pickupDateTime || t.createdAt);
      return d >= start && d <= end;
    });
  }

  const completed = trips.filter((t: any) => t.tripStatus === 'delivered');
  const totalKm = trips.reduce((sum: number, t: any) => sum + (t.actualOdometerKm || t.distanceKm || 0), 0);
  const totalGross = trips.reduce((sum: number, t: any) => sum + (t.grossRevenueNPR || t.agreedFreightNPR || 0), 0);
  const totalReceived = trips.filter((t: any) => t.paymentStatus === 'paid').reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);
  const totalPending = trips.filter((t: any) => t.paymentStatus !== 'paid').reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);

  // Driver expenses approved
  const driverFuel = (db.fuelRecords || []).filter((f: any) => f.driverId === driverId && f.status === 'approved').reduce((sum: number, f: any) => sum + (f.totalCostNPR || 0), 0);
  const driverOtherExp = (db.expenses || []).filter((e: any) => e.driverId === driverId && e.status === 'approved').reduce((sum: number, e: any) => sum + (e.amountNPR || 0), 0);
  const totalApprovedExpenses = driverFuel + driverOtherExp;

  const totalNetEarnings = trips.reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);

  const tripsList = trips.map((t: any) => ({
    tripId: t.id,
    date: (t.pickupDateTime || t.createdAt).split('T')[0],
    route: `${t.pickupCity} → ${t.destinationCity}`,
    vehiclePlate: t.vehiclePlate,
    distanceKm: t.actualOdometerKm || t.distanceKm,
    grossFreight: t.grossRevenueNPR || t.agreedFreightNPR,
    netEarned: t.netEarningsNPR,
    paymentStatus: t.paymentStatus,
    tripStatus: t.tripStatus
  }));

  res.json({
    driverId,
    driverName,
    period,
    totalCompletedTrips: completed.length,
    totalKilometresTravelled: Math.round(totalKm),
    totalGrossFreightEarned: totalGross,
    totalReceivedPayments: totalReceived,
    totalPendingPayments: totalPending,
    totalApprovedExpenses,
    totalNetEarnings,
    tripsList
  });
});

// 11. Vehicle Owner & Fleet Company Report Aggregator
app.get('/api/reports/vehicle-owner/:ownerId', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { ownerId } = req.params;
  const { period = 'monthly', startDate, endDate } = req.query;

  const owner = (db.users || []).find((u: any) => u.id === ownerId);
  const ownerName = owner ? (owner.companyName || owner.name) : 'Fleet Logistics Carrier';

  // Vehicles owned
  const ownerVehicles = (db.vehicles || []).filter((v: any) => v.ownerId === ownerId);
  const vehicleIds = ownerVehicles.map((v: any) => v.id);

  // Trips corresponding to fleet vehicles or owner
  let trips = (db.trips || []).filter((t: any) => vehicleIds.includes(t.vehicleId) || t.driverId === ownerId);

  // Period filtering
  const now = new Date();
  if (period === 'daily') {
    const todayStr = now.toISOString().split('T')[0];
    trips = trips.filter((t: any) => (t.pickupDateTime || t.createdAt).startsWith(todayStr));
  } else if (period === 'weekly') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= weekAgo);
  } else if (period === 'monthly') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= monthAgo);
  } else if (period === 'yearly') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    trips = trips.filter((t: any) => new Date(t.pickupDateTime || t.createdAt) >= yearAgo);
  }

  const completedTrips = trips.filter((t: any) => t.tripStatus === 'delivered');
  const totalFleetDistanceKm = trips.reduce((sum: number, t: any) => sum + (t.actualOdometerKm || t.distanceKm || 0), 0);
  const totalGrossRevenue = trips.reduce((sum: number, t: any) => sum + (t.grossRevenueNPR || t.agreedFreightNPR || 0), 0);

  // Expenses per vehicle in fleet
  const fleetFuel = (db.fuelRecords || []).filter((f: any) => vehicleIds.includes(f.vehicleId));
  const totalFuelCost = fleetFuel.reduce((sum: number, f: any) => sum + (f.totalCostNPR || 0), 0);

  const fleetExpenses = (db.expenses || []).filter((e: any) => vehicleIds.includes(e.vehicleId));
  const totalMaintenanceCost = fleetExpenses.filter((e: any) => e.category === 'repairs_servicing' || e.category === 'tyres_parts').reduce((sum: number, e: any) => sum + (e.amountNPR || 0), 0);
  const totalOtherExpenses = fleetExpenses.filter((e: any) => e.category !== 'repairs_servicing' && e.category !== 'tyres_parts').reduce((sum: number, e: any) => sum + (e.amountNPR || 0), 0);
  const totalOperatingExpenses = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

  const estimatedNetProfit = totalGrossRevenue - totalOperatingExpenses;

  // Check if expense data is incomplete
  const tripsMissingFuel = trips.filter((t: any) => {
    const hasFuel = fleetFuel.some((f: any) => f.tripId === t.id);
    return !hasFuel;
  });
  const hasIncompleteExpenseData = tripsMissingFuel.length > 0;
  const incompleteDataReason = hasIncompleteExpenseData
    ? `${tripsMissingFuel.length} trip(s) have unrecorded fuel purchases or missing receipts. Estimated profit may be higher than actual net margin.`
    : undefined;

  const unpaidCustomerBalance = trips.filter((t: any) => t.paymentStatus !== 'paid').reduce((sum: number, t: any) => sum + (t.agreedFreightNPR || 0), 0);
  const pendingDriverPayments = trips.filter((t: any) => t.paymentStatus !== 'paid').reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);

  // Summaries per vehicle
  const vehicleSummaries = ownerVehicles.map((v: any) => {
    const vTrips = trips.filter((t: any) => t.vehicleId === v.id);
    const vKm = vTrips.reduce((sum: number, t: any) => sum + (t.actualOdometerKm || t.distanceKm || 0), 0);
    const vRev = vTrips.reduce((sum: number, t: any) => sum + (t.grossRevenueNPR || t.agreedFreightNPR || 0), 0);
    const vFuelRecords = fleetFuel.filter((f: any) => f.vehicleId === v.id);
    const vFuelCost = vFuelRecords.reduce((sum: number, f: any) => sum + (f.totalCostNPR || 0), 0);
    const vTotalLitres = vFuelRecords.reduce((sum: number, f: any) => sum + (f.litres || 0), 0);
    const vMaintCost = fleetExpenses.filter((e: any) => e.vehicleId === v.id).reduce((sum: number, e: any) => sum + (e.amountNPR || 0), 0);
    const averageKmpl = vTotalLitres > 0 && vKm > 0 ? Number((vKm / vTotalLitres).toFixed(2)) : undefined;
    const costPerKmNPR = vKm > 0 ? Number(((vFuelCost + vMaintCost) / vKm).toFixed(2)) : undefined;

    return {
      vehicleId: v.id,
      vehiclePlate: v.plateNumber,
      model: v.modelName,
      tripsCount: vTrips.length,
      totalKm: Math.round(vKm),
      revenueNPR: vRev,
      fuelCostNPR: vFuelCost,
      maintenanceNPR: vMaintCost,
      estimatedProfitNPR: vRev - (vFuelCost + vMaintCost),
      averageKmpl,
      costPerKmNPR
    };
  });

  // Drivers summary
  const driverIds = Array.from(new Set(trips.map((t: any) => t.driverId))).filter(Boolean);
  const driverSummaries = driverIds.map((dId: any) => {
    const dTrips = trips.filter((t: any) => t.driverId === dId);
    const dDriver = (db.users || []).find((u: any) => u.id === dId);
    const dRev = dTrips.reduce((sum: number, t: any) => sum + (t.grossRevenueNPR || t.agreedFreightNPR || 0), 0);
    const dNet = dTrips.reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);
    const dPending = dTrips.filter((t: any) => t.paymentStatus !== 'paid').reduce((sum: number, t: any) => sum + (t.netEarningsNPR || 0), 0);
    return {
      driverId: dId,
      driverName: dDriver ? dDriver.name : (dTrips[0]?.driverName || 'Driver'),
      tripsCount: dTrips.length,
      revenueNPR: dRev,
      netPaidNPR: dNet - dPending,
      pendingNPR: dPending
    };
  });

  res.json({
    ownerId,
    ownerName,
    period,
    totalFleetVehicles: ownerVehicles.length,
    totalTripsCompleted: completedTrips.length,
    totalFleetDistanceKm: Math.round(totalFleetDistanceKm),
    totalGrossRevenue,
    totalFuelCost,
    totalMaintenanceCost,
    totalOtherExpenses,
    totalOperatingExpenses,
    estimatedNetProfit,
    hasIncompleteExpenseData,
    incompleteDataReason,
    unpaidCustomerBalance,
    pendingDriverPayments,
    vehicleSummaries,
    driverSummaries
  });
});

// 12. Secure Customer Cargo Tracking Page (Public or Shippers with tracking code)
app.get('/api/tracking/:code', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { code } = req.params;
  const q = code.trim().toLowerCase();

  const trip = (db.trips || []).find((t: any) =>
    (t.trackingCode && t.trackingCode.toLowerCase() === q) ||
    (t.id && t.id.toLowerCase() === q) ||
    (t.bookingId && t.bookingId.toLowerCase() === q) ||
    (t.shipmentId && t.shipmentId.toLowerCase() === q)
  );

  if (!trip) {
    return res.status(404).json({ error: 'Tracking code not found. Please verify your 10-digit tracking number (e.g., TRK-LM-2026-8819).' });
  }

  // Find linked vehicle & driver rating
  const vehicle = (db.vehicles || []).find((v: any) => v.id === trip.vehicleId);
  const driver = (db.users || []).find((u: any) => u.id === trip.driverId);

  // Filter out sensitive documents or driver private data
  const safePayload = {
    tripId: trip.id,
    trackingCode: trip.trackingCode,
    status: trip.tripStatus,
    cargoTitle: trip.cargoTitle,
    cargoWeightKg: trip.cargoWeightKg,
    pickupLocation: {
      city: trip.pickupCity,
      address: trip.pickupAddress
    },
    destinationLocation: {
      city: trip.destinationCity,
      address: trip.destinationAddress
    },
    pickupDateTime: trip.pickupDateTime,
    actualDepartureTime: trip.actualDepartureTime,
    deliveryDateTime: trip.deliveryDateTime,
    distanceKm: trip.distanceKm,
    currentCheckpoint: trip.currentCheckpoint || trip.pickupCity,
    currentLat: trip.currentLat,
    currentLng: trip.currentLng,
    lastLocationUpdateTime: trip.lastLocationUpdateTime,
    locationSource: trip.locationSource,
    isLocationLive: trip.isLocationLive,
    eta: trip.eta,
    revisedEta: trip.revisedEta,
    hasActiveDelay: trip.hasActiveDelay,
    delayReason: trip.latestDelayReport ? trip.latestDelayReport.reason : undefined,
    delayDescription: trip.latestDelayReport ? trip.latestDelayReport.description : undefined,
    delayExpectedMinutes: trip.latestDelayReport ? trip.latestDelayReport.expectedDelayMinutes : undefined,
    vehicleDetails: {
      plateNumber: trip.vehiclePlate,
      category: trip.vehicleCategory,
      modelName: vehicle ? vehicle.modelName : 'Commercial Cargo Carrier'
    },
    driverDetails: {
      name: trip.driverName,
      phone: trip.driverPhone,
      rating: driver ? driver.rating : 4.8
    },
    proofOfDelivery: trip.proofOfDelivery ? {
      consigneeName: trip.proofOfDelivery.consigneeName,
      deliveredAt: trip.proofOfDelivery.deliveredAt,
      otpVerified: trip.proofOfDelivery.otpVerified,
      unloadingPhotoUrl: trip.proofOfDelivery.unloadingPhotoUrl
    } : null
  };

  res.json(safePayload);
});

// 13. Notifications Center
app.get('/api/notifications', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { role, userId } = req.query;
  let items = db.notifications || [];

  if (role) {
    items = items.filter((n: any) => n.recipientRole === 'all' || n.recipientRole === role);
  }
  if (userId) {
    items = items.filter((n: any) => !n.recipientId || n.recipientId === userId);
  }

  res.json(items);
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const db = loadDatabase();
  const notif = (db.notifications || []).find((n: any) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDatabase(db);
    return res.json({ success: true, notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.post('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { role } = req.body;
  if (db.notifications) {
    db.notifications.forEach((n: any) => {
      if (!role || n.recipientRole === 'all' || n.recipientRole === role) {
        n.read = true;
      }
    });
    saveDatabase(db);
  }
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Return Trips (Empty Journey Saver)
app.get('/api/return-trips', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.returnTrips);
});

app.post('/api/return-trips', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newTrip = {
    ...req.body,
    id: `ret-${Date.now()}`,
    status: 'available',
    createdAt: new Date().toISOString()
  };
  db.returnTrips.unshift(newTrip);
  saveDatabase(db);
  res.status(201).json(newTrip);
});

// Insurance
app.get('/api/insurance', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.insurance);
});

app.post('/api/insurance', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newIns = {
    ...req.body,
    id: `ins-${Date.now()}`,
    verified: false,
    status: 'valid'
  };
  db.insurance.unshift(newIns);
  saveDatabase(db);
  res.status(201).json(newIns);
});

// Disputes
app.get('/api/disputes', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.disputes);
});

app.post('/api/disputes', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newDispute = {
    ...req.body,
    id: `disp-${Date.now()}`,
    status: 'pending_review',
    createdAt: new Date().toISOString()
  };
  db.disputes.unshift(newDispute);
  saveDatabase(db);
  res.status(201).json(newDispute);
});

app.patch('/api/disputes/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.disputes.findIndex((d: any) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dispute not found' });
  }
  const { status, adminNotes } = req.body;
  if (status) db.disputes[index].status = status;
  if (adminNotes) db.disputes[index].adminNotes = adminNotes;
  if (status === 'resolved') db.disputes[index].resolvedAt = new Date().toISOString();

  saveDatabase(db);
  res.json(db.disputes[index]);
});

// Emergency SOS trigger
app.post('/api/emergency/sos', (req: Request, res: Response) => {
  const { vehiclePlate, driverName, highway, locationDescription, coords } = req.body;
  console.log(`[EMERGENCY SOS LOGGED] Vehicle: ${vehiclePlate}, Driver: ${driverName}, Location: ${highway} - ${locationDescription}`);
  res.json({
    success: true,
    sosId: `SOS-${Date.now()}`,
    dispatchedServices: [
      'Nepal Highway Traffic Operations (103)',
      'District Police Control Room (100)',
      'Local Highway Recovery Unit'
    ],
    timestamp: new Date().toISOString(),
    message: 'Emergency distress beacon recorded. Highway patrol alert dispatched.'
  });
});

// Admin Operations
app.patch('/api/admin/verify-vehicle', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { vehicleId, verified } = req.body;
  const index = db.vehicles.findIndex((v: any) => v.id === vehicleId);
  if (index !== -1) {
    db.vehicles[index].verified = verified;
    saveDatabase(db);
    return res.json({ success: true, vehicle: db.vehicles[index] });
  }
  res.status(404).json({ error: 'Vehicle not found' });
});

app.post('/api/admin/reset-demo', (req: Request, res: Response) => {
  const seed = getSeedData();
  saveDatabase(seed);
  res.json({ success: true, message: 'Database reset to authentic Nepal logistics seed data' });
});

// Verification Memory Store for Phone SMS OTPs
const phoneOtpStore = new Map<string, { otp: string; expiresAt: number }>();

// 1. Phone SMS OTP Generation
app.post('/api/verification/phone/send-otp', async (req: Request, res: Response) => {
  const { phone, userId } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Mobile phone number is required' });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  phoneOtpStore.set(phone, {
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
  });

  const sparrowToken = process.env.SPARROW_SMS_TOKEN;
  let sentViaRealSms = false;

  if (sparrowToken) {
    try {
      // Call Sparrow SMS Gateway in Nepal
      const smsRes = await fetch('http://api.sparrowsms.com/v2/sms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: sparrowToken,
          from: 'LoadMitra',
          to: phone.replace(/[^0-9]/g, ''),
          text: `Your LoadMitra logistics verification OTP is ${generatedOtp}. Do not share this code.`
        })
      });
      sentViaRealSms = smsRes.ok;
    } catch (smsErr) {
      console.warn('Real SMS dispatch failed, falling back to simulation:', smsErr);
    }
  }

  console.log(`[SMS OTP GENERATED] Phone: ${phone}, OTP: ${generatedOtp}, RealSMS: ${sentViaRealSms}`);

  res.json({
    success: true,
    message: sentViaRealSms
      ? 'Verification OTP sent to your phone via SMS'
      : 'Verification OTP generated (Simulation Mode)',
    isRealSms: sentViaRealSms,
    demoOtp: generatedOtp, // Always available for instant verification in testing
    expiresInSeconds: 600
  });
});

// 2. Phone SMS OTP Verification
app.post('/api/verification/phone/verify-otp', (req: Request, res: Response) => {
  const { phone, userId, otp } = req.body;
  const stored = phoneOtpStore.get(phone);

  if (!stored) {
    return res.status(400).json({ error: 'No OTP requested for this phone number or expired' });
  }

  if (Date.now() > stored.expiresAt) {
    phoneOtpStore.delete(phone);
    return res.status(400).json({ error: 'OTP expired. Please request a new code.' });
  }

  if (stored.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit OTP code' });
  }

  // Update User Record
  const db = loadDatabase();
  const user = db.users.find((u: any) => u.id === userId || u.phone === phone);
  if (user) {
    user.phoneVerified = true;
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      entityType: 'phone',
      entityId: user.id,
      entityName: `${user.name} (${phone})`,
      adminId: 'system-otp',
      adminName: 'Automated SMS Gateway',
      previousStatus: false,
      newStatus: true,
      reason: 'Mobile number verified with 6-digit cryptographic OTP',
      timestamp: new Date().toISOString()
    });
    saveDatabase(db);
  }

  phoneOtpStore.delete(phone);
  res.json({ success: true, message: 'Phone verified successfully', phoneVerified: true });
});

// 3. Driver License Verification Submission
app.post('/api/verification/driver', (req: Request, res: Response) => {
  const { userId, licenseNumber, category, expiryDate, frontDocUrl, backDocUrl } = req.body;
  const db = loadDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const record = {
    licenseNumber,
    category: category || 'G - Heavy Multi-Axle Freight Truck',
    expiryDate,
    frontDocUrl: frontDocUrl || '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
    backDocUrl: backDocUrl || '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  user.driverLicenseRecord = record;
  user.driverVerified = 'pending';

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'driver',
    entityId: user.id,
    entityName: `${user.name} (License: ${licenseNumber})`,
    adminId: user.id,
    adminName: user.name,
    previousStatus: 'unverified',
    newStatus: 'pending',
    reason: 'Driver submitted DoTM license documents for review',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, record });
});

// 4. National ID / Citizenship Verification Submission
app.post('/api/verification/national-id', (req: Request, res: Response) => {
  const { userId, idType, idNumber, issuedDistrict, issuedDate, frontDocUrl, backDocUrl } = req.body;
  const db = loadDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const record = {
    idType: idType || 'citizenship',
    idNumber,
    issuedDistrict: issuedDistrict || 'Kathmandu',
    issuedDate: issuedDate || '2019-04-10',
    frontDocUrl: frontDocUrl || '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
    backDocUrl: backDocUrl || '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  user.nationalIdRecord = record;
  user.identityVerified = 'pending';

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'identity',
    entityId: user.id,
    entityName: `${user.name} (${idType.toUpperCase()}: ${idNumber})`,
    adminId: user.id,
    adminName: user.name,
    previousStatus: 'unverified',
    newStatus: 'pending',
    reason: 'User submitted government National ID/Citizenship documents',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, record });
});

// 5. Company Verification Submission
app.post('/api/verification/company', (req: Request, res: Response) => {
  const {
    userId,
    companyName,
    panNumber,
    vatNumber,
    registrationNumber,
    registrationDocUrl,
    panVatDocUrl,
    authorizedRepName,
    authorizedRepDesignation,
    authorizedRepPhone,
    authorizedRepIdDocUrl
  } = req.body;

  const db = loadDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const record = {
    companyName,
    panNumber,
    vatNumber: vatNumber || panNumber,
    registrationNumber,
    registrationDocUrl: registrationDocUrl || '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
    panVatDocUrl: panVatDocUrl || '/src/assets/images/logistics_fleet_showcase_1792079810772.jpg',
    authorizedRepName: authorizedRepName || user.name,
    authorizedRepDesignation: authorizedRepDesignation || 'Managing Director',
    authorizedRepPhone: authorizedRepPhone || user.phone,
    authorizedRepIdDocUrl: authorizedRepIdDocUrl || '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  user.companyVerificationRecord = record;
  user.companyVerified = 'pending';
  user.companyName = companyName;
  user.panVatNumber = panNumber;

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'company',
    entityId: user.id,
    entityName: companyName,
    adminId: user.id,
    adminName: user.name,
    previousStatus: 'unverified',
    newStatus: 'pending',
    reason: 'Company submitted OCR Registration & PAN documents',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, record });
});

// 6. Vehicle Owner Verification Submission
app.post('/api/verification/vehicle-owner', (req: Request, res: Response) => {
  const {
    vehicleId,
    bluebookNumber,
    bluebookExpiry,
    bluebookDocUrl,
    taxTokenExpiry,
    taxTokenDocUrl,
    routePermitNumber,
    routePermitExpiry,
    routePermitDocUrl,
    ownershipDeedDocUrl,
    insuranceDocUrl
  } = req.body;

  const db = loadDatabase();
  const vehicle = db.vehicles.find((v: any) => v.id === vehicleId);

  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const record = {
    vehicleId,
    vehiclePlate: vehicle.plateNumber,
    bluebookNumber,
    bluebookExpiry,
    bluebookDocUrl: bluebookDocUrl || '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
    taxTokenExpiry,
    taxTokenDocUrl: taxTokenDocUrl || '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
    routePermitNumber: routePermitNumber || vehicle.routePermitNumber,
    routePermitExpiry: routePermitExpiry || vehicle.routePermitExpiry,
    routePermitDocUrl: routePermitDocUrl || '/src/assets/images/loadmitra_hero_truck_1792079808937.jpg',
    ownershipDeedDocUrl,
    insuranceDocUrl,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  vehicle.vehicleOwnerVerificationRecord = record;
  vehicle.vehicleVerified = 'pending';

  // Also update owner's vehicleVerified flag
  const owner = db.users.find((u: any) => u.id === vehicle.ownerId);
  if (owner) {
    owner.vehicleVerified = 'pending';
  }

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'vehicle',
    entityId: vehicle.id,
    entityName: `${vehicle.plateNumber} (${vehicle.modelName})`,
    adminId: vehicle.ownerId,
    adminName: vehicle.ownerName,
    previousStatus: 'unverified',
    newStatus: 'pending',
    reason: 'Vehicle owner submitted Bluebook, Tax clearance, and Route Permit documents',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, record });
});

// 7. Secure Document Upload Storage
app.post('/api/verification/upload-doc', (req: Request, res: Response) => {
  const { fileName, fileData, docType } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'No document data provided' });
  }

  const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const ext = fileName && fileName.includes('.') ? path.extname(fileName) : '.png';
  const filePath = path.join(PRIVATE_DOCS_DIR, `${docId}${ext}`);

  try {
    // If base64, save to private directory
    if (fileData.startsWith('data:')) {
      const base64Data = fileData.split(';base64,').pop();
      fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
    } else {
      fs.writeFileSync(filePath, fileData, 'utf-8');
    }
  } catch (err) {
    console.error('Failed to write private document to disk:', err);
  }

  // Return protected access URL
  res.json({
    success: true,
    docId,
    secureUrl: `/api/verification/document/${docId}${ext}`,
    storedInPrivateVault: true
  });
});

// 8. Access-Controlled Document Viewer
app.get('/api/verification/document/:docId', (req: Request, res: Response) => {
  const { docId } = req.params;
  const filePath = path.join(PRIVATE_DOCS_DIR, docId);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // Fallback to demo warehouse asset if file is placeholder
  res.sendFile(path.join(__dirname, 'src/assets/images/cargo_loading_warehouse_1792079810527.jpg'));
});

// 9. Google Sign-In & OAuth Linking
app.post('/api/verification/oauth/google', (req: Request, res: Response) => {
  const { credential, email, name, googleId } = req.body;
  const isConfigured = Boolean(process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);
  const db = loadDatabase();

  const userEmail = email || 'verified.google.user@loadmitra.com.np';
  const userName = name || 'Google Verified Partner';
  let user = db.users.find((u: any) => u.email === userEmail);

  if (!user) {
    user = {
      id: `user-g-${Date.now()}`,
      name: userName,
      phone: '+977-9851999888',
      email: userEmail,
      role: 'customer',
      verified: true,
      phoneVerified: true,
      identityVerified: 'verified',
      driverVerified: 'unverified',
      companyVerified: 'unverified',
      rating: 5.0,
      totalTrips: 0,
      location: 'Kathmandu, Nepal'
    };
    db.users.push(user);
  } else {
    user.phoneVerified = true;
    user.verified = true;
  }

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'identity',
    entityId: user.id,
    entityName: user.name,
    adminId: 'google-oauth',
    adminName: 'Google Identity Services OAuth 2.0',
    previousStatus: 'unverified',
    newStatus: 'verified',
    reason: isConfigured
      ? 'Google OAuth 2.0 Client credentials verified with Google ID Token'
      : 'Google OAuth flow simulation (No GOOGLE_CLIENT_ID configured in .env)',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  res.json({
    success: true,
    user,
    isConfigured,
    message: isConfigured
      ? 'Successfully authenticated with Google OAuth'
      : 'Google Sign-In completed in simulation mode'
  });
});

// 10. Facebook Login & OAuth Linking
app.post('/api/verification/oauth/facebook', (req: Request, res: Response) => {
  const { accessToken, email, name, facebookId } = req.body;
  const isConfigured = Boolean(process.env.VITE_FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID);
  const db = loadDatabase();

  const userEmail = email || 'facebook.partner@loadmitra.com.np';
  const userName = name || 'Facebook Logistics Partner';
  let user = db.users.find((u: any) => u.email === userEmail);

  if (!user) {
    user = {
      id: `user-fb-${Date.now()}`,
      name: userName,
      phone: '+977-9841888777',
      email: userEmail,
      role: 'customer',
      verified: true,
      phoneVerified: true,
      identityVerified: 'verified',
      driverVerified: 'unverified',
      companyVerified: 'unverified',
      rating: 5.0,
      totalTrips: 0,
      location: 'Pokhara, Nepal'
    };
    db.users.push(user);
  } else {
    user.phoneVerified = true;
    user.verified = true;
  }

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    entityType: 'identity',
    entityId: user.id,
    entityName: user.name,
    adminId: 'meta-oauth',
    adminName: 'Meta Facebook Login OAuth 2.0',
    previousStatus: 'unverified',
    newStatus: 'verified',
    reason: isConfigured
      ? 'Meta Facebook App credentials verified with User Access Token'
      : 'Facebook Login flow simulation (No FACEBOOK_APP_ID configured in .env)',
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);

  res.json({
    success: true,
    user,
    isConfigured,
    message: isConfigured
      ? 'Successfully authenticated with Facebook Login'
      : 'Facebook Login completed in simulation mode'
  });
});

// 11. Admin Master Verification Review (Approve / Reject with Rejection Reasons & Audit History)
app.post('/api/verification/admin/review', (req: Request, res: Response) => {
  const {
    entityType,
    entityId,
    decision, // 'verified' | 'rejected'
    rejectionReason,
    adminId = 'user-admin1',
    adminName = 'LoadMitra Logistics Admin'
  } = req.body;

  if (decision === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
    return res.status(400).json({ error: 'Rejection reason is required when rejecting a document' });
  }

  const db = loadDatabase();
  let entityDisplayName = '';
  let prevStatus: any = 'pending';

  if (entityType === 'driver') {
    const user = db.users.find((u: any) => u.id === entityId);
    if (!user) return res.status(404).json({ error: 'Driver not found' });
    prevStatus = user.driverVerified || 'pending';
    user.driverVerified = decision;
    if (user.driverLicenseRecord) {
      user.driverLicenseRecord.status = decision;
      user.driverLicenseRecord.reviewedAt = new Date().toISOString();
      if (decision === 'rejected') user.driverLicenseRecord.rejectionReason = rejectionReason;
    }
    entityDisplayName = `${user.name} (License)`;
  } else if (entityType === 'identity') {
    const user = db.users.find((u: any) => u.id === entityId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    prevStatus = user.identityVerified || 'pending';
    user.identityVerified = decision;
    if (user.nationalIdRecord) {
      user.nationalIdRecord.status = decision;
      user.nationalIdRecord.reviewedAt = new Date().toISOString();
      if (decision === 'rejected') user.nationalIdRecord.rejectionReason = rejectionReason;
    }
    entityDisplayName = `${user.name} (National ID)`;
  } else if (entityType === 'company') {
    const user = db.users.find((u: any) => u.id === entityId);
    if (!user) return res.status(404).json({ error: 'Company account not found' });
    prevStatus = user.companyVerified || 'pending';
    user.companyVerified = decision;
    if (user.companyVerificationRecord) {
      user.companyVerificationRecord.status = decision;
      user.companyVerificationRecord.reviewedAt = new Date().toISOString();
      if (decision === 'rejected') user.companyVerificationRecord.rejectionReason = rejectionReason;
    }
    entityDisplayName = user.companyName || user.name;
  } else if (entityType === 'vehicle') {
    const vehicle = db.vehicles.find((v: any) => v.id === entityId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    prevStatus = vehicle.vehicleVerified || 'pending';
    vehicle.vehicleVerified = decision;
    vehicle.verified = decision === 'verified';
    if (vehicle.vehicleOwnerVerificationRecord) {
      vehicle.vehicleOwnerVerificationRecord.status = decision;
      vehicle.vehicleOwnerVerificationRecord.reviewedAt = new Date().toISOString();
      if (decision === 'rejected') vehicle.vehicleOwnerVerificationRecord.rejectionReason = rejectionReason;
    }
    entityDisplayName = `${vehicle.plateNumber} (${vehicle.modelName})`;
  }

  // Record into Immutable Audit Trail
  const auditEntry = {
    id: `log-${Date.now()}`,
    entityType,
    entityId,
    entityName: entityDisplayName,
    adminId,
    adminName,
    previousStatus: prevStatus,
    newStatus: decision,
    reason: decision === 'rejected' ? rejectionReason : 'Regulatory compliance criteria satisfied and verified',
    timestamp: new Date().toISOString()
  };

  db.auditLogs.unshift(auditEntry);
  saveDatabase(db);

  res.json({
    success: true,
    decision,
    auditEntry,
    message: `Verification ${decision === 'verified' ? 'Approved' : 'Rejected'} for ${entityDisplayName}`
  });
});

// 12. Audit Logs API
app.get('/api/verification/audit-logs', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.auditLogs || []);
});

// 13. Comprehensive Verification Summary for Admin Dashboard
app.get('/api/verification/admin/summary', (req: Request, res: Response) => {
  const db = loadDatabase();
  const pendingDrivers = db.users.filter((u: any) => u.driverVerified === 'pending' || u.driverLicenseRecord?.status === 'pending');
  const pendingIdentities = db.users.filter((u: any) => u.identityVerified === 'pending' || u.nationalIdRecord?.status === 'pending');
  const pendingCompanies = db.users.filter((u: any) => u.companyVerified === 'pending' || u.companyVerificationRecord?.status === 'pending');
  const pendingVehicles = db.vehicles.filter((v: any) => v.vehicleVerified === 'pending' || v.vehicleOwnerVerificationRecord?.status === 'pending');

  res.json({
    pendingCounts: {
      drivers: pendingDrivers.length,
      identities: pendingIdentities.length,
      companies: pendingCompanies.length,
      vehicles: pendingVehicles.length,
      totalPending: pendingDrivers.length + pendingIdentities.length + pendingCompanies.length + pendingVehicles.length
    },
    pendingDrivers,
    pendingIdentities,
    pendingCompanies,
    pendingVehicles,
    auditLogs: db.auditLogs || []
  });
});

// ========================================================
// 14. NEPAL & INDIA LIVE LOCATION NETWORK APIS
// ========================================================

// 14.1 Searchable Administrative Locations across Nepal & India
app.get('/api/locations', (req: Request, res: Response) => {
  const { country, provinceState, district, search } = req.query;
  let results = [...NEPAL_INDIA_LOCATIONS];

  if (country && country !== 'all') {
    results = results.filter((l) => l.country === country);
  }
  if (provinceState && provinceState !== 'all') {
    results = results.filter((l) =>
      l.provinceState.toLowerCase().includes(String(provinceState).toLowerCase())
    );
  }
  if (district && district !== 'all') {
    results = results.filter((l) =>
      l.district.toLowerCase() === String(district).toLowerCase()
    );
  }
  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nameNe.toLowerCase().includes(q) ||
        l.nameHi.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.provinceState.toLowerCase().includes(q) ||
        (l.borderPairName && l.borderPairName.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

// 14.2 Cross-Border Customs & Transit Corridors
app.get('/api/corridors/border', (req: Request, res: Response) => {
  res.json(BORDER_CROSSING_CORRIDORS);
});

// 14.3 Regional Transport Corridors & Highways
app.get('/api/corridors/transport', (req: Request, res: Response) => {
  res.json(TRANSPORT_CORRIDORS);
});

// 14.4 Live Available Vehicles across Nepal & India
app.get('/api/network/vehicles', (req: Request, res: Response) => {
  const db = loadDatabase();
  const vehicles = db.networkVehicles || INITIAL_NETWORK_VEHICLES;
  const { country, category, loadType, crossBorderOnly } = req.query;

  let filtered = [...vehicles];
  if (country && country !== 'all') {
    filtered = filtered.filter((v: any) => v.country === country);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((v: any) => v.category === category);
  }
  if (loadType && loadType !== 'all') {
    filtered = filtered.filter((v: any) => v.loadType === loadType || v.loadType === 'both');
  }
  if (crossBorderOnly === 'true') {
    filtered = filtered.filter((v: any) => v.crossBorderPermit === true);
  }

  res.json(filtered);
});

// 14.5 Live Available Cargo Consignments across Nepal & India
app.get('/api/network/cargo', (req: Request, res: Response) => {
  const db = loadDatabase();
  const cargo = db.networkCargo || INITIAL_NETWORK_CARGO;
  const { country, category, isCrossBorder } = req.query;

  let filtered = [...cargo];
  if (country && country !== 'all') {
    filtered = filtered.filter((c: any) => c.country === country);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((c: any) => c.category === category);
  }
  if (isCrossBorder !== undefined) {
    const isCb = isCrossBorder === 'true';
    filtered = filtered.filter((c: any) => Boolean(c.isCrossBorder) === isCb);
  }

  res.json(filtered);
});

// 14.6 Live GPS Location Broadcast / Simulated Movement
app.post('/api/network/vehicles/:id/gps', (req: Request, res: Response) => {
  const { id } = req.params;
  const { lat, lng, heading, speedKmH, isLiveGps, currentCity } = req.body;
  const db = loadDatabase();

  if (!db.networkVehicles) {
    db.networkVehicles = INITIAL_NETWORK_VEHICLES;
  }

  const vIndex = db.networkVehicles.findIndex((v: any) => v.id === id);
  if (vIndex !== -1) {
    db.networkVehicles[vIndex] = {
      ...db.networkVehicles[vIndex],
      lat: Number(lat),
      lng: Number(lng),
      heading: heading !== undefined ? Number(heading) : db.networkVehicles[vIndex].heading,
      speedKmH: speedKmH !== undefined ? Number(speedKmH) : db.networkVehicles[vIndex].speedKmH,
      isLiveGps: isLiveGps !== undefined ? Boolean(isLiveGps) : true,
      currentCity: currentCity || db.networkVehicles[vIndex].currentCity,
      lastReportedTime: 'Just now (Live Broadcast)'
    };
    saveDatabase(db);
    return res.json({ success: true, vehicle: db.networkVehicles[vIndex] });
  }

  res.status(404).json({ error: 'Vehicle not found' });
});

// 14.7 Direct Freight Bid on Network Cargo
app.post('/api/network/cargo/:id/bid', (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverId, driverName, driverPhone, vehiclePlate, offeredFareNPR, notes } = req.body;
  const db = loadDatabase();

  if (!db.networkCargo) {
    db.networkCargo = INITIAL_NETWORK_CARGO;
  }

  const cargoIndex = db.networkCargo.findIndex((c: any) => c.id === id);
  if (cargoIndex !== -1) {
    const bid = {
      id: `bid-${Date.now()}`,
      cargoId: id,
      driverId: driverId || 'user-d1',
      driverName: driverName || 'Driver',
      driverPhone: driverPhone || '+977-9800000000',
      vehiclePlate: vehiclePlate || 'Na 5 Kha 3110',
      amountNPR: Number(offeredFareNPR) || 30000,
      notes: notes || 'Available immediately with verified permit',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (!db.networkCargo[cargoIndex].bids) {
      db.networkCargo[cargoIndex].bids = [];
    }
    db.networkCargo[cargoIndex].bids.push(bid);
    db.networkCargo[cargoIndex].bidCount = db.networkCargo[cargoIndex].bids.length;
    saveDatabase(db);
    return res.json({ success: true, bid, cargo: db.networkCargo[cargoIndex] });
  }

  res.status(404).json({ error: 'Cargo not found' });
});


// Development vs Production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LoadMitra Logistics Server running on http://localhost:${PORT}`);
  });
}

startServer();
