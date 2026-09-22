import { VehicleData, MaintenanceRecord } from '../types';

export const DEMO_VEHICLES: VehicleData[] = [
  {
    id: 'demo-1',
    vehicleNumber: 'KA-01-MJ-4029',
    vehicleModel: 'Toyota Corolla 1.8L Altis',
    vehicleAge: 3,
    currentMileage: 32450,
    lastServiceMileage: 30000,
    daysSinceLastService: 48,
    lastServiceDate: '2026-08-03',
    engineCondition: 'Good',
    batteryCondition: 'Good',
    tyreCondition: 'Good',
    oilCondition: 'Clean'
  },
  {
    id: 'demo-2',
    vehicleNumber: 'MH-12-DE-8921',
    vehicleModel: 'Honda Civic 2.0L V-TEC',
    vehicleAge: 5,
    currentMileage: 58900,
    lastServiceMileage: 51200,
    daysSinceLastService: 165,
    lastServiceDate: '2026-04-08',
    engineCondition: 'Moderate',
    batteryCondition: 'Moderate',
    tyreCondition: 'Fair',
    oilCondition: 'Degraded'
  },
  {
    id: 'demo-3',
    vehicleNumber: 'DL-04-CA-7712',
    vehicleModel: 'Ford Transit 350 Cargo Van',
    vehicleAge: 6,
    currentMileage: 114200,
    lastServiceMileage: 101800,
    daysSinceLastService: 280,
    lastServiceDate: '2025-12-14',
    engineCondition: 'Poor',
    batteryCondition: 'Weak',
    tyreCondition: 'Worn',
    oilCondition: 'Low'
  },
  {
    id: 'demo-4',
    vehicleNumber: 'TN-07-BX-3344',
    vehicleModel: 'Hyundai Creta 1.5L CRDi',
    vehicleAge: 4,
    currentMileage: 46800,
    lastServiceMileage: 39500,
    daysSinceLastService: 210,
    lastServiceDate: '2026-02-22',
    engineCondition: 'Good',
    batteryCondition: 'Weak',
    tyreCondition: 'Uneven',
    oilCondition: 'Degraded'
  }
];

export const INITIAL_MAINTENANCE_HISTORY: MaintenanceRecord[] = [
  {
    id: 'hist-1',
    vehicleId: 'demo-1',
    date: '2026-08-03',
    mileage: 30000,
    serviceType: 'Oil & Filter Change + Multi-Point Check',
    cost: 145,
    technician: 'Marcus Vance (Toyota Authorized Service)',
    status: 'Completed',
    notes: 'Synthetic 0W-20 engine oil replaced, OEM filter installed, cabin filter cleaned.'
  },
  {
    id: 'hist-2',
    vehicleId: 'demo-1',
    date: '2026-01-15',
    mileage: 20500,
    serviceType: 'Brake Fluid Flush & Tyre Rotation',
    cost: 190,
    technician: 'David Miller (Apex Auto Care)',
    status: 'Completed',
    notes: 'DOT 4 fluid flushed. All 4 tyres rotated and balanced. Front pads at 8mm.'
  },
  {
    id: 'hist-3',
    vehicleId: 'demo-2',
    date: '2026-04-08',
    mileage: 51200,
    serviceType: '50,000 km Scheduled Service',
    cost: 285,
    technician: 'Priya Sharma (City Honda Center)',
    status: 'Completed',
    notes: 'Engine oil changed, spark plugs inspected, air filter replaced, front brake pads 6mm.'
  },
  {
    id: 'hist-4',
    vehicleId: 'demo-2',
    date: '2025-09-12',
    mileage: 42000,
    serviceType: 'Wheel Alignment & Balancing',
    cost: 85,
    technician: 'Ramesh Patel (Precision Wheel Works)',
    status: 'Completed',
    notes: 'Camber adjusted on front left suspension. All tyres set to 33 PSI.'
  },
  {
    id: 'hist-5',
    vehicleId: 'demo-3',
    date: '2025-12-14',
    mileage: 101800,
    serviceType: '100,000 km Major Overhaul Service',
    cost: 650,
    technician: 'Alex Thorne (Fleet Tech Solutions)',
    status: 'Completed',
    notes: 'Drive belt replaced, heavy duty engine oil, transmission fluid drain & fill, fuel filter.'
  },
  {
    id: 'hist-6',
    vehicleId: 'demo-3',
    date: '2025-06-20',
    mileage: 89400,
    serviceType: 'Rear Brake Shoes & Drum Service',
    cost: 320,
    technician: 'Alex Thorne (Fleet Tech Solutions)',
    status: 'Completed',
    notes: 'Rear brake shoes relined, drums resurfaced, parking brake cable tension calibrated.'
  },
  {
    id: 'hist-7',
    vehicleId: 'demo-4',
    date: '2026-02-22',
    mileage: 39500,
    serviceType: 'Periodic Maintenance Service',
    cost: 210,
    technician: 'Suresh Kumar (Metro Hyundai)',
    status: 'Completed',
    notes: 'Diesel filter replaced, engine oil changed, battery terminal greased, brake bleeding.'
  },
  {
    id: 'hist-8',
    vehicleId: 'demo-4',
    date: '2025-08-10',
    mileage: 28900,
    serviceType: 'AC Disinfection & Filter Change',
    cost: 95,
    technician: 'Suresh Kumar (Metro Hyundai)',
    status: 'Completed',
    notes: 'Evaporator coil sanitized, activated carbon cabin filter installed.'
  }
];
