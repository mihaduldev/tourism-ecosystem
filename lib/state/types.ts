// ─── SHARED ENTITY TYPES FOR THE DATA STORE ─────────────────────────────────

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: "Available" | "Occupied" | "Dirty" | "Maintenance";
  rate: number;
  beds: string;
  size: string;
  guest?: string;
  guestPhone?: string;
  checkIn?: string;
  checkOut?: string;
  view?: string;
  amenities?: string[];
  maxOccupancy?: number;
  lastCleaned?: string;
}

export interface Reservation {
  id: string;
  guest: string;
  phone: string;
  email?: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rate: number;
  total: number;
  status: "Confirmed" | "Checked-In" | "Checked-Out" | "Cancelled" | "No-Show";
  source: string;
  guests: number;
  specialRequests?: string;
  arrivalTime?: string;
  depositAmount?: number;
  paymentStatus?: "Pending" | "Partial" | "Paid";
  bookingDate?: string;
  adults?: number;
  children?: number;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  nationality: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
  vip: boolean;
  preferences?: string[];
  notes?: string;
  address?: string;
}

export interface HousekeepingTask {
  id: string;
  room: string;
  type: string;
  status: "Pending" | "In Progress" | "Done";
  assignee: string;
  priority: "Normal" | "Urgent" | "Low";
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedMinutes?: number;
}

export interface KdsOrder {
  id: string;
  table: string;
  items: { name: string; qty: number; notes?: string }[];
  status: "New" | "Preparing" | "Ready";
  time: string;
  minutes: number;
  priority: "normal" | "urgent" | "warning";
  waiter: string;
}

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved" | "Dirty";
  currentOrder?: string;
  guest?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  popular: boolean;
  description?: string;
}

export interface LaundryOrder {
  id: string;
  customer: string;
  phone: string;
  items: string;
  type: string;
  status: "Received" | "Processing" | "Ready" | "Delivered";
  amount: number;
  pickupDate: string;
  deliveryDate: string;
  priority: "Normal" | "Express";
}

export interface LaundryService {
  id: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  popular: boolean;
}

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  duration: string;
  durationDays: number;
  capacity: number;
  booked: number;
  price: number;
  status: "Active" | "Paused" | "Full";
  includes: string[];
  nextDate: string;
  guide?: string;
}

export interface TourBooking {
  id: string;
  customer: string;
  phone: string;
  package: string;
  persons: number;
  departure: string;
  total: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  guide?: string;
  paid: boolean;
}

export interface TourGuide {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  experience: string;
  rating: number;
  languages: string;
  rate: number;
  status: "Available" | "On Tour" | "Unavailable";
  avatar: string;
}

export interface TicketRequest {
  id: string;
  passenger: string;
  route: string;
  travelDate: string;
  class: string;
  amount: number;
  commission: number;
  status: "New" | "Processing" | "Issued" | "Cancelled" | "Refunded";
  pnr?: string;
  airline?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Income" | "Expense";
  method: string;
  debit: number;
  credit: number;
  reference?: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  salary: number;
  joinDate: string;
  status: "Active" | "Inactive";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Late" | "Half Day";
  department: string;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPrice: number;
  lastRestocked: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  total: number;
  date: string;
  status: "Draft" | "Ordered" | "In Transit" | "Delivered" | "Cancelled";
  expectedDate?: string;
}

export interface CrmContact {
  id: string;
  name: string;
  type: "Individual" | "Corporate" | "Group";
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastContact: string;
  status: "Active" | "Inactive";
  loyaltyTier: "Platinum" | "Gold" | "Silver" | "Bronze";
}

export interface CrmDeal {
  id: string;
  name: string;
  contact: string;
  value: number;
  stage: "New Inquiry" | "Contacted" | "Proposal Sent" | "Negotiation" | "Won" | "Lost";
  priority: "High" | "Medium" | "Low";
  date: string;
  notes?: string;
}

export interface BookingChannel {
  id: string;
  name: string;
  type: "Direct" | "OTA" | "Website" | "Phone" | "Walk-in";
  enabled: boolean;
  bookings: number;
  commission: number;
}

export interface FolioCharge {
  id: string;
  reservationId: string;
  type: "Room" | "F&B" | "Laundry" | "Minibar" | "Service" | "Tax";
  description: string;
  amount: number;
  qty: number;
  date: string;
}

export interface RatePlan {
  id: string;
  name: string;
  code: string;
  type: "Rack" | "Corporate" | "OTA" | "Seasonal" | "Package";
  applicableRoomTypes: string[];
  baseDiscount: number;
  validFrom: string;
  validTo: string;
  minNights: number;
  inclusions: string[];
  status: "Active" | "Inactive" | "Expired";
}

// ─── DATA STORE STATE ────────────────────────────────────────────────────────

export interface DataStoreState {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  housekeepingTasks: HousekeepingTask[];
  kdsOrders: KdsOrder[];
  restaurantTables: RestaurantTable[];
  menuItems: MenuItem[];
  laundryOrders: LaundryOrder[];
  laundryServices: LaundryService[];
  tourPackages: TourPackage[];
  tourBookings: TourBooking[];
  tourGuides: TourGuide[];
  ticketRequests: TicketRequest[];
  transactions: Transaction[];
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  stockItems: StockItem[];
  purchaseOrders: PurchaseOrder[];
  crmContacts: CrmContact[];
  crmDeals: CrmDeal[];
  bookingChannels: BookingChannel[];
  folioCharges: FolioCharge[];
  ratePlans: RatePlan[];
}

export type EntityType = keyof DataStoreState;

// ─── ACTIONS ─────────────────────────────────────────────────────────────────

export type DataAction =
  | { type: "ADD"; entity: EntityType; item: any }
  | { type: "UPDATE"; entity: EntityType; id: string; updates: Record<string, any> }
  | { type: "DELETE"; entity: EntityType; id: string }
  | { type: "SET"; entity: EntityType; items: any[] };
