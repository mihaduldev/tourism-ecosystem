// ─── SUPER ADMIN DEMO DATA ────────────────────────────────────────────────

export const adminStats = {
  totalTenants: 847,
  activeUsers: 3241,
  mrr: 4800000,
  pendingPayments: 320000,
  newRegistrations: 12,
  bookingVolume: 1284,
  mrrGrowth: 8.2,
  tenantGrowth: 12,
  userGrowth: 89,
};

export const revenueChart = [
  { month: "May", mrr: 2100000 },
  { month: "Jun", mrr: 2400000 },
  { month: "Jul", mrr: 2750000 },
  { month: "Aug", mrr: 2900000 },
  { month: "Sep", mrr: 3100000 },
  { month: "Oct", mrr: 3400000 },
  { month: "Nov", mrr: 3600000 },
  { month: "Dec", mrr: 3900000 },
  { month: "Jan", mrr: 4100000 },
  { month: "Feb", mrr: 4300000 },
  { month: "Mar", mrr: 4550000 },
  { month: "Apr", mrr: 4800000 },
];

export const moduleAdoption = [
  { module: "Accounts", count: 535, pct: 91 },
  { module: "Hotel PMS", count: 423, pct: 72 },
  { module: "Restaurant POS", count: 341, pct: 58 },
  { module: "Inventory", count: 295, pct: 50 },
  { module: "Laundry", count: 200, pct: 34 },
  { module: "Tour", count: 165, pct: 28 },
  { module: "HR & Payroll", count: 148, pct: 25 },
  { module: "Air Ticketing", count: 120, pct: 20 },
];

export const recentActivity = [
  { id: 1, text: "Diamond Hotel activated Hotel PMS module", time: "2 min ago", type: "module" },
  { id: 2, text: "ABC Restaurant paid invoice #INV-2841", time: "15 min ago", type: "payment" },
  { id: 3, text: "New signup: TourBD Agency (Growth plan)", time: "32 min ago", type: "signup" },
  { id: 4, text: "LaundryKing trial expires in 3 days", time: "1 hr ago", type: "alert" },
  { id: 5, text: "SkyTickets payment overdue by 5 days", time: "2 hr ago", type: "overdue" },
  { id: 6, text: "Grand Horizon upgraded to Enterprise plan", time: "3 hr ago", type: "upgrade" },
  { id: 7, text: "Sea Pearl Resort added HR & Payroll module", time: "5 hr ago", type: "module" },
];

export const tenants = [
  {
    id: "t1",
    name: "Diamond Hotel & Resort",
    type: "Hotel",
    plan: "Enterprise",
    modules: ["Hotel PMS", "Restaurant POS", "Laundry", "Accounts", "Inventory"],
    users: 12,
    revenue: 15000,
    status: "Active",
    city: "Dhaka",
    subdomain: "diamond",
    joined: "2026-01-15",
    lastLogin: "2 hours ago",
    logo: "DH",
    color: "#2563EB",
  },
  {
    id: "t2",
    name: "ABC Restaurant",
    type: "Restaurant",
    plan: "Growth",
    modules: ["Restaurant POS", "Inventory", "Accounts"],
    users: 5,
    revenue: 7000,
    status: "Active",
    city: "Chittagong",
    subdomain: "abcrestaurant",
    joined: "2026-01-28",
    lastLogin: "1 hour ago",
    logo: "AR",
    color: "#EA580C",
  },
  {
    id: "t3",
    name: "LaundryKing",
    type: "Laundry",
    plan: "Starter",
    modules: ["Laundry", "Accounts"],
    users: 2,
    revenue: 3000,
    status: "Trial",
    city: "Dhaka",
    subdomain: "laundryking",
    joined: "2026-04-10",
    lastLogin: "3 hours ago",
    logo: "LK",
    color: "#9333EA",
  },
  {
    id: "t4",
    name: "TourBD Agency",
    type: "Tour Agency",
    plan: "Growth",
    modules: ["Tour Management", "Air Ticketing", "Accounts", "CRM"],
    users: 8,
    revenue: 8000,
    status: "Active",
    city: "Dhaka",
    subdomain: "tourbd",
    joined: "2026-02-05",
    lastLogin: "30 min ago",
    logo: "TB",
    color: "#16A34A",
  },
  {
    id: "t5",
    name: "SkyTickets BD",
    type: "Air Ticketing",
    plan: "Starter",
    modules: ["Air Ticketing", "Accounts"],
    users: 3,
    revenue: 5000,
    status: "Overdue",
    city: "Sylhet",
    subdomain: "skytickets",
    joined: "2026-02-20",
    lastLogin: "2 days ago",
    logo: "ST",
    color: "#7C3AED",
  },
  {
    id: "t6",
    name: "Grand Horizon Resort",
    type: "Hotel",
    plan: "Enterprise",
    modules: ["Hotel PMS", "Restaurant POS", "Laundry", "Tour Management", "Accounts", "HR & Payroll"],
    users: 24,
    revenue: 28000,
    status: "Active",
    city: "Cox's Bazar",
    subdomain: "grandhorizon",
    joined: "2025-12-01",
    lastLogin: "5 min ago",
    logo: "GH",
    color: "#0891B2",
  },
  {
    id: "t7",
    name: "Sea Pearl Beach Resort",
    type: "Hotel",
    plan: "Enterprise",
    modules: ["Hotel PMS", "Restaurant POS", "Accounts", "HR & Payroll", "Inventory"],
    users: 18,
    revenue: 22000,
    status: "Active",
    city: "Cox's Bazar",
    subdomain: "seapearl",
    joined: "2026-01-01",
    lastLogin: "1 hour ago",
    logo: "SP",
    color: "#2563EB",
  },
  {
    id: "t8",
    name: "Spice Garden Restaurant",
    type: "Restaurant",
    plan: "Growth",
    modules: ["Restaurant POS", "Inventory", "Accounts"],
    users: 6,
    revenue: 7000,
    status: "Active",
    city: "Sylhet",
    subdomain: "spicegarden",
    joined: "2026-03-01",
    lastLogin: "4 hours ago",
    logo: "SG",
    color: "#EA580C",
  },
];

export const invoices = [
  { id: "INV-2901", tenant: "Diamond Hotel & Resort", plan: "Enterprise", amount: 15000, due: "2026-05-01", status: "Paid" },
  { id: "INV-2902", tenant: "ABC Restaurant", plan: "Growth", amount: 7000, due: "2026-05-03", status: "Due" },
  { id: "INV-2903", tenant: "SkyTickets BD", plan: "Starter", amount: 5000, due: "2026-04-28", status: "Overdue" },
  { id: "INV-2904", tenant: "TourBD Agency", plan: "Growth", amount: 8000, due: "2026-05-05", status: "Paid" },
  { id: "INV-2905", tenant: "Grand Horizon Resort", plan: "Enterprise", amount: 28000, due: "2026-05-01", status: "Paid" },
  { id: "INV-2906", tenant: "LaundryKing", plan: "Starter", amount: 3000, due: "2026-05-10", status: "Due" },
  { id: "INV-2907", tenant: "Sea Pearl Beach Resort", plan: "Enterprise", amount: 22000, due: "2026-05-01", status: "Paid" },
];

export const allModules = [
  { id: "hotel", name: "Hotel PMS", desc: "Full property management system for hotels and resorts", tenants: 423, pct: 72, price: 2000, enabled: true },
  { id: "restaurant", name: "Restaurant POS", desc: "Point of sale, table management, and kitchen display system", tenants: 341, pct: 58, price: 1500, enabled: true },
  { id: "laundry", name: "Laundry Management", desc: "Order tracking, pickup & delivery, and invoicing", tenants: 200, pct: 34, price: 1000, enabled: true },
  { id: "tour", name: "Tour Management", desc: "Package builder, itinerary editor, and booking management", tenants: 165, pct: 28, price: 1800, enabled: true },
  { id: "ticketing", name: "Air Ticketing", desc: "Flight bookings, PNR management, and commission tracking", tenants: 120, pct: 20, price: 1500, enabled: true },
  { id: "accounts", name: "Accounts & Finance", desc: "Chart of accounts, P&L, balance sheet, and VAT reports", tenants: 535, pct: 91, price: 1500, enabled: true },
  { id: "hr", name: "HR & Payroll", desc: "Staff management, attendance, leave, and salary sheets", tenants: 148, pct: 25, price: 1200, enabled: true },
  { id: "inventory", name: "Inventory", desc: "Stock management, purchase orders, and supplier tracking", tenants: 295, pct: 50, price: 1000, enabled: true },
  { id: "booking", name: "Booking Engine", desc: "Public-facing booking widget and real-time availability", tenants: 380, pct: 64, price: 1000, enabled: true },
  { id: "crm", name: "CRM", desc: "Customer profiles, lead pipeline, and loyalty tracking", tenants: 98, pct: 17, price: 800, enabled: false },
];

// ─── HOTEL DEMO DATA ──────────────────────────────────────────────────────

export const hotelStats = {
  occupancy: 87,
  checkInsToday: 12,
  checkOutsToday: 8,
  revenueToday: 84500,
  roomsAvailable: 6,
  roomsTotal: 48,
  pendingTasks: 3,
  staffPresent: 24,
  staffTotal: 30,
  revenueTrend: 12.4,
};

export const rooms = [
  { id: "101", type: "Standard Single", floor: 1, status: "available", rate: 3500, view: "Garden", beds: "1 Single", size: "18 sqm", amenities: ["WiFi", "AC", "TV"], maxOccupancy: 1, lastCleaned: "2026-05-13 08:30" },
  { id: "102", type: "Standard Double", floor: 1, status: "occupied", rate: 4500, guest: "Rahim Ahmed", checkOut: "May 15", view: "Garden", beds: "1 Double", size: "22 sqm", amenities: ["WiFi", "AC", "TV", "Minibar"], maxOccupancy: 2, lastCleaned: "2026-05-11 09:00" },
  { id: "103", type: "Standard Double", floor: 1, status: "dirty", rate: 4500, view: "Garden", beds: "1 Double", size: "22 sqm", amenities: ["WiFi", "AC", "TV", "Minibar"], maxOccupancy: 2 },
  { id: "104", type: "Standard Single", floor: 1, status: "available", rate: 3500, view: "Pool", beds: "1 Single", size: "18 sqm", amenities: ["WiFi", "AC", "TV", "Pool Access"], maxOccupancy: 1, lastCleaned: "2026-05-13 07:45" },
  { id: "105", type: "Deluxe Double", floor: 1, status: "maintenance", rate: 5500, view: "Pool", beds: "1 King", size: "28 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Pool Access", "Balcony"], maxOccupancy: 2 },
  { id: "201", type: "Deluxe Double", floor: 2, status: "occupied", rate: 5500, guest: "Sara Islam", checkOut: "May 16", view: "Sea", beds: "1 King", size: "28 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony"], maxOccupancy: 2, lastCleaned: "2026-05-12 10:00" },
  { id: "202", type: "Deluxe Double", floor: 2, status: "occupied", rate: 5500, guest: "Karim & Family", checkOut: "May 18", view: "Sea", beds: "1 King + 1 Single", size: "32 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony"], maxOccupancy: 3, lastCleaned: "2026-05-10 09:30" },
  { id: "203", type: "Suite", floor: 2, status: "available", rate: 9500, view: "Sea", beds: "1 King", size: "45 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony", "Jacuzzi", "Lounge"], maxOccupancy: 2, lastCleaned: "2026-05-13 08:00" },
  { id: "204", type: "Deluxe Double", floor: 2, status: "occupied", rate: 5500, guest: "Nadia Begum", checkOut: "May 15", view: "Garden", beds: "1 King", size: "28 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Balcony"], maxOccupancy: 2, lastCleaned: "2026-05-11 11:00" },
  { id: "205", type: "Deluxe Double", floor: 2, status: "dirty", rate: 5500, view: "Sea", beds: "1 King", size: "28 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony"], maxOccupancy: 2 },
  { id: "301", type: "Suite", floor: 3, status: "occupied", rate: 9500, guest: "Ahmed & Wife", checkOut: "May 20", view: "Sea", beds: "1 King", size: "45 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony", "Jacuzzi", "Lounge"], maxOccupancy: 2, lastCleaned: "2026-05-09 10:00" },
  { id: "302", type: "Suite", floor: 3, status: "available", rate: 9500, view: "Sea", beds: "1 King", size: "45 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Sea View", "Balcony", "Jacuzzi"], maxOccupancy: 2, lastCleaned: "2026-05-13 09:00" },
  { id: "303", type: "Deluxe Double", floor: 3, status: "occupied", rate: 5500, guest: "Tanvir Hossain", checkOut: "May 14", view: "Garden", beds: "1 King", size: "28 sqm", amenities: ["WiFi", "AC", "TV", "Minibar"], maxOccupancy: 2, lastCleaned: "2026-05-10 08:30" },
  { id: "304", type: "Presidential Suite", floor: 3, status: "available", rate: 18000, view: "Panoramic", beds: "1 King + Living Room", size: "85 sqm", amenities: ["WiFi", "AC", "TV", "Minibar", "Panoramic View", "Jacuzzi", "Lounge", "Dining", "Butler Service"], maxOccupancy: 4, lastCleaned: "2026-05-13 07:00" },
  { id: "401", type: "Standard Single", floor: 4, status: "available", rate: 3500, view: "City", beds: "1 Single", size: "18 sqm", amenities: ["WiFi", "AC", "TV"], maxOccupancy: 1, lastCleaned: "2026-05-13 08:15" },
  { id: "402", type: "Standard Double", floor: 4, status: "occupied", rate: 4500, guest: "Rasel Khan", checkOut: "May 15", view: "City", beds: "1 Double", size: "22 sqm", amenities: ["WiFi", "AC", "TV", "Minibar"], maxOccupancy: 2, lastCleaned: "2026-05-11 10:30" },
];

export const reservations = [
  // Current stays (Checked-In)
  { id: "RES-2847", guest: "Mohammed Rahim Ahmed", phone: "01711-234567", room: "102", roomType: "Standard Double", checkIn: "2026-05-11", checkOut: "2026-05-15", nights: 4, status: "Checked-In", rate: 4500, total: 18000, source: "Direct", guests: 1, paymentStatus: "Paid", bookingDate: "2026-05-08", adults: 1, children: 0 },
  { id: "RES-2848", guest: "Sara Islam", phone: "01812-345678", room: "201", roomType: "Deluxe Double", checkIn: "2026-05-12", checkOut: "2026-05-16", nights: 4, status: "Checked-In", rate: 5500, total: 22000, source: "Booking.com", guests: 1, paymentStatus: "Partial", depositAmount: 11000, bookingDate: "2026-05-05", adults: 1, children: 0 },
  { id: "RES-2851", guest: "Karim & Family", phone: "01511-789012", room: "202", roomType: "Deluxe Double", checkIn: "2026-05-10", checkOut: "2026-05-18", nights: 8, status: "Checked-In", rate: 5500, total: 44000, source: "Direct", guests: 3, paymentStatus: "Paid", bookingDate: "2026-05-01", adults: 2, children: 1 },
  { id: "RES-2852", guest: "Nadia Begum", phone: "01312-890123", room: "204", roomType: "Deluxe Double", checkIn: "2026-05-11", checkOut: "2026-05-15", nights: 4, status: "Checked-In", rate: 5500, total: 22000, source: "Agoda", guests: 1, paymentStatus: "Paid", bookingDate: "2026-05-06", adults: 1, children: 0 },
  { id: "RES-2855", guest: "Ahmed & Wife", phone: "01711-555666", room: "301", roomType: "Suite", checkIn: "2026-05-09", checkOut: "2026-05-20", nights: 11, status: "Checked-In", rate: 9500, total: 104500, source: "Direct", guests: 2, paymentStatus: "Paid", bookingDate: "2026-04-28", adults: 2, children: 0 },
  { id: "RES-2856", guest: "Rasel Khan", phone: "01611-777888", room: "402", roomType: "Standard Double", checkIn: "2026-05-12", checkOut: "2026-05-15", nights: 3, status: "Checked-In", rate: 4500, total: 13500, source: "Walk-in", guests: 1, paymentStatus: "Pending", bookingDate: "2026-05-12", adults: 1, children: 0 },
  { id: "RES-2857", guest: "Tanvir Hossain", phone: "01912-567890", room: "303", roomType: "Deluxe Double", checkIn: "2026-05-10", checkOut: "2026-05-14", nights: 4, status: "Checked-In", rate: 5500, total: 22000, source: "Direct", guests: 1, paymentStatus: "Paid", bookingDate: "2026-05-07", adults: 1, children: 0 },

  // Upcoming (Confirmed)
  { id: "RES-2850", guest: "Fatema Khatun", phone: "01611-678901", room: "203", roomType: "Suite", checkIn: "2026-05-14", checkOut: "2026-05-17", nights: 3, status: "Confirmed", rate: 9500, total: 28500, source: "Booking.com", guests: 1, paymentStatus: "Pending", bookingDate: "2026-05-02", arrivalTime: "14:00", adults: 1, children: 0 },
  { id: "RES-2858", guest: "Rafiqul Islam", phone: "01812-111222", room: "104", roomType: "Standard Single", checkIn: "2026-05-15", checkOut: "2026-05-18", nights: 3, status: "Confirmed", rate: 3500, total: 10500, source: "Phone", guests: 1, paymentStatus: "Pending", bookingDate: "2026-05-10", arrivalTime: "12:00", adults: 1, children: 0 },
  { id: "RES-2859", guest: "Dr. Anwar Hossain", phone: "01912-333444", room: "302", roomType: "Suite", checkIn: "2026-05-16", checkOut: "2026-05-19", nights: 3, status: "Confirmed", rate: 9500, total: 28500, source: "Direct", guests: 2, paymentStatus: "Partial", depositAmount: 14250, bookingDate: "2026-05-08", arrivalTime: "15:00", adults: 2, children: 0 },
  { id: "RES-2860", guest: "Shahana Parveen", phone: "01711-444555", room: "101", roomType: "Standard Single", checkIn: "2026-05-17", checkOut: "2026-05-20", nights: 3, status: "Confirmed", rate: 3500, total: 10500, source: "Agoda", guests: 1, paymentStatus: "Pending", bookingDate: "2026-05-11", adults: 1, children: 0 },
  { id: "RES-2861", guest: "Imran Uddin", phone: "01511-666777", room: "304", roomType: "Presidential Suite", checkIn: "2026-05-20", checkOut: "2026-05-25", nights: 5, status: "Confirmed", rate: 18000, total: 90000, source: "Direct", guests: 3, paymentStatus: "Partial", depositAmount: 45000, bookingDate: "2026-05-01", arrivalTime: "16:00", adults: 2, children: 1, specialRequests: "Airport pickup, champagne on arrival" },
  { id: "RES-2862", guest: "Kamrul Hasan", phone: "01311-888999", room: "205", roomType: "Deluxe Double", checkIn: "2026-05-18", checkOut: "2026-05-22", nights: 4, status: "Confirmed", rate: 5500, total: 22000, source: "Booking.com", guests: 2, paymentStatus: "Pending", bookingDate: "2026-05-09", adults: 2, children: 0 },

  // Past (Checked-Out)
  { id: "RES-2840", guest: "Monir Ahmed", phone: "01711-100200", room: "101", roomType: "Standard Single", checkIn: "2026-05-05", checkOut: "2026-05-08", nights: 3, status: "Checked-Out", rate: 3500, total: 10500, source: "Walk-in", guests: 1, paymentStatus: "Paid", bookingDate: "2026-05-05", adults: 1, children: 0 },
  { id: "RES-2841", guest: "Farhana Akter", phone: "01812-200300", room: "203", roomType: "Suite", checkIn: "2026-05-06", checkOut: "2026-05-10", nights: 4, status: "Checked-Out", rate: 9500, total: 38000, source: "Booking.com", guests: 2, paymentStatus: "Paid", bookingDate: "2026-04-30", adults: 2, children: 0 },
  { id: "RES-2842", guest: "Jamal Uddin", phone: "01912-300400", room: "104", roomType: "Standard Single", checkIn: "2026-05-07", checkOut: "2026-05-11", nights: 4, status: "Checked-Out", rate: 3500, total: 14000, source: "Direct", guests: 1, paymentStatus: "Paid", bookingDate: "2026-05-03", adults: 1, children: 0 },

  // Cancelled
  { id: "RES-2849", guest: "Sohel Rana", phone: "01611-400500", room: "401", roomType: "Standard Single", checkIn: "2026-05-14", checkOut: "2026-05-16", nights: 2, status: "Cancelled", rate: 3500, total: 7000, source: "Agoda", guests: 1, paymentStatus: "Pending", bookingDate: "2026-05-06", adults: 1, children: 0 },
];

export const todayCheckIns = [
  { time: "10:00", guest: "Fatema Khatun", room: "Not Assigned", type: "Suite", booking: "RES-2850" },
  { time: "11:30", guest: "Rafiqul Islam", room: "Not Assigned", type: "Standard Double", booking: "RES-2853" },
  { time: "14:00", guest: "Dr. Anwar Hossain", room: "Not Assigned", type: "Deluxe Double", booking: "RES-2854" },
];

export const housekeepingTasks = [
  { room: "103", type: "Standard Double", floor: 1, task: "Clean", assignee: "Riya Akter", status: "In Progress", priority: "High", startedAt: "2026-05-13 09:15", estimatedMinutes: 30 },
  { room: "205", type: "Deluxe Double", floor: 2, task: "Clean", assignee: "Sumon Ali", status: "Pending", priority: "Normal", estimatedMinutes: 35 },
  { room: "302", type: "Suite", floor: 3, task: "Deep Clean + Turndown", assignee: "Mina Begum", status: "Pending", priority: "High", estimatedMinutes: 60 },
  { room: "105", type: "Deluxe Double", floor: 1, task: "Maintenance Check", assignee: "Maintenance Team", status: "Pending", priority: "Urgent", estimatedMinutes: 45 },
];

export const weeklyRevenue = [
  { day: "Mon", revenue: 72000 },
  { day: "Tue", revenue: 68000 },
  { day: "Wed", revenue: 81000 },
  { day: "Thu", revenue: 84500 },
  { day: "Fri", revenue: 95000 },
  { day: "Sat", revenue: 112000 },
  { day: "Sun", revenue: 88000 },
];

// ─── RESTAURANT DEMO DATA ─────────────────────────────────────────────────

export const restaurantStats = {
  ordersToday: 124,
  revenueToday: 42300,
  tablesOccupied: 8,
  tablesTotal: 15,
  kitchenQueue: 6,
  topItem: "Chicken Biryani",
  topItemCount: 34,
  avgOrderValue: 341,
  revenueTrend: 6.8,
};

export const tables = [
  { id: "T1", capacity: 4, status: "available", waiter: null, order: null },
  { id: "T2", capacity: 2, status: "occupied", waiter: "Karim", order: "ORD-841", amount: 680, minutes: 25 },
  { id: "T3", capacity: 2, status: "occupied", waiter: "Sumon", order: "ORD-842", amount: 420, minutes: 18 },
  { id: "T4", capacity: 6, status: "occupied", waiter: "Mina", order: "ORD-843", amount: 1840, minutes: 35 },
  { id: "T5", capacity: 4, status: "available", waiter: null, order: null },
  { id: "T6", capacity: 8, status: "occupied", waiter: "Riya", order: "ORD-844", amount: 2100, minutes: 12 },
  { id: "T7", capacity: 4, status: "occupied", waiter: "Karim", order: "ORD-845", amount: 890, minutes: 8 },
  { id: "T8", capacity: 4, status: "occupied", waiter: "Sumon", order: "ORD-846", amount: 1250, minutes: 42 },
  { id: "T9", capacity: 4, status: "dirty", waiter: null, order: null },
  { id: "T10", capacity: 4, status: "available", waiter: null, order: null },
  { id: "T11", capacity: 6, status: "occupied", waiter: "Mina", order: "ORD-847", amount: 1640, minutes: 20 },
  { id: "T12", capacity: 4, status: "available", waiter: null, order: null },
  { id: "T13", capacity: 2, status: "reserved", waiter: null, order: null, reservedFor: "7:00 PM" },
  { id: "T14", capacity: 4, status: "available", waiter: null, order: null },
  { id: "T15", capacity: 10, status: "occupied", waiter: "Riya", order: "ORD-848", amount: 3200, minutes: 55 },
];

export const kdsOrders = [
  {
    id: "ORD-843",
    table: "T4",
    minutes: 35,
    items: [
      { name: "Chicken Biryani", qty: 2, note: "Extra spicy" },
      { name: "Beef Kala Bhuna", qty: 1, note: "" },
      { name: "Naan", qty: 4, note: "" },
      { name: "Raita", qty: 1, note: "" },
    ],
    status: "urgent",
  },
  {
    id: "ORD-845",
    table: "T7",
    minutes: 8,
    items: [
      { name: "Fish Curry", qty: 1, note: "No chili" },
      { name: "Fried Rice", qty: 2, note: "" },
    ],
    status: "warning",
  },
  {
    id: "ORD-847",
    table: "T11",
    minutes: 20,
    items: [
      { name: "Prawn Malai Curry", qty: 2, note: "" },
      { name: "Naan", qty: 3, note: "" },
      { name: "Mixed Salad", qty: 1, note: "" },
    ],
    status: "warning",
  },
  {
    id: "ORD-846",
    table: "T8",
    minutes: 42,
    items: [
      { name: "Mutton Rezala", qty: 1, note: "" },
      { name: "Paratha", qty: 3, note: "" },
    ],
    status: "urgent",
  },
  {
    id: "ORD-844",
    table: "T6",
    minutes: 12,
    items: [
      { name: "Hilsha Fish", qty: 2, note: "Bengali style" },
      { name: "Steamed Rice", qty: 2, note: "" },
      { name: "Dal", qty: 1, note: "" },
    ],
    status: "normal",
  },
  {
    id: "TK-094",
    table: "Takeaway",
    minutes: 15,
    items: [
      { name: "Chicken Roll", qty: 2, note: "" },
      { name: "Lassi", qty: 1, note: "Sweet" },
    ],
    status: "normal",
  },
];

export const menuCategories = [
  {
    id: "cat1", name: "Starters", items: [
      { id: "m1", name: "Vegetable Samosa", price: 80, available: true, sold: 28 },
      { id: "m2", name: "Chicken Tikka", price: 320, available: true, sold: 19 },
      { id: "m3", name: "Fish Cutlet", price: 180, available: false, sold: 0 },
    ],
  },
  {
    id: "cat2", name: "Main Course", items: [
      { id: "m4", name: "Chicken Biryani", price: 280, available: true, sold: 34 },
      { id: "m5", name: "Beef Kala Bhuna", price: 420, available: true, sold: 22 },
      { id: "m6", name: "Fish Curry", price: 350, available: true, sold: 18 },
      { id: "m7", name: "Prawn Malai Curry", price: 580, available: true, sold: 12 },
      { id: "m8", name: "Mutton Rezala", price: 480, available: true, sold: 9 },
      { id: "m9", name: "Hilsha Fish", price: 650, available: true, sold: 15 },
    ],
  },
  {
    id: "cat3", name: "Breads", items: [
      { id: "m10", name: "Naan", price: 60, available: true, sold: 89 },
      { id: "m11", name: "Paratha", price: 50, available: true, sold: 64 },
      { id: "m12", name: "Fried Rice", price: 180, available: true, sold: 31 },
      { id: "m13", name: "Steamed Rice", price: 100, available: true, sold: 45 },
    ],
  },
  {
    id: "cat4", name: "Beverages", items: [
      { id: "m14", name: "Lassi (Sweet)", price: 120, available: true, sold: 42 },
      { id: "m15", name: "Fresh Lime Soda", price: 80, available: true, sold: 38 },
      { id: "m16", name: "Cold Coffee", price: 150, available: true, sold: 24 },
      { id: "m17", name: "Mineral Water", price: 30, available: true, sold: 110 },
    ],
  },
];

export const salesByCategory = [
  { name: "Main Course", value: 58 },
  { name: "Beverages", value: 24 },
  { name: "Breads", value: 12 },
  { name: "Starters", value: 6 },
];

// ─── LAUNDRY DEMO DATA ────────────────────────────────────────────────────

export const laundryStats = {
  newOrders: 8,
  processing: 15,
  readyDelivery: 6,
  revenueToday: 14200,
  pendingPickups: 4,
  overdueOrders: 2,
};

export const laundryOrders = [
  { id: "LO-291", customer: "Karim Ahmed", phone: "01711-111111", items: 5, kg: null, type: "Piece", status: "Received", amount: 650, pickup: "Today 2pm", delivery: "Apr 26", priority: "Normal" },
  { id: "LO-280", customer: "Sara Begum", phone: "01812-222222", items: null, kg: 8, type: "Weight", status: "Processing", amount: 960, pickup: "Yesterday", delivery: "Apr 25", priority: "Express" },
  { id: "LO-274", customer: "Rafiq Khan", phone: "01912-333333", items: 3, kg: null, type: "Piece", status: "Processing", amount: 420, pickup: "Apr 22", delivery: "Apr 25", priority: "Normal" },
  { id: "LO-271", customer: "Moni Ali", phone: "01611-444444", items: 4, kg: null, type: "Piece", status: "Ready", amount: 580, pickup: "Apr 22", delivery: "Apr 24", priority: "Normal" },
  { id: "LO-268", customer: "Rina Islam", phone: "01511-555555", items: null, kg: 5, type: "Weight", status: "Ready", amount: 600, pickup: "Apr 21", delivery: "Apr 24", priority: "Express" },
  { id: "LO-260", customer: "Tanvir Hossain", phone: "01312-666666", items: 2, kg: null, type: "Piece", status: "Delivered", amount: 280, pickup: "Apr 20", delivery: "Apr 23", priority: "Normal" },
  { id: "LO-292", customer: "Nasrin Akter", phone: "01211-777777", items: 7, kg: null, type: "Piece", status: "Received", amount: 980, pickup: "Today 4pm", delivery: "Apr 27", priority: "Normal" },
  { id: "LO-293", customer: "Farhan Ahmed", phone: "01911-888888", items: null, kg: 12, type: "Weight", status: "Received", amount: 1440, pickup: "Today 6pm", delivery: "Apr 27", priority: "Express" },
];

export const laundryServices = [
  { id: "ls1", name: "Wash & Fold", type: "Weight", price: 120, unit: "per kg", popular: true },
  { id: "ls2", name: "Dry Cleaning (Shirt)", type: "Piece", price: 150, unit: "per piece", popular: true },
  { id: "ls3", name: "Dry Cleaning (Suit/Coat)", type: "Piece", price: 400, unit: "per piece", popular: false },
  { id: "ls4", name: "Iron Only", type: "Piece", price: 30, unit: "per piece", popular: true },
  { id: "ls5", name: "Wash & Iron", type: "Piece", price: 100, unit: "per piece", popular: true },
  { id: "ls6", name: "Saree Wash", type: "Piece", price: 200, unit: "per piece", popular: false },
  { id: "ls7", name: "Curtain Wash", type: "Weight", price: 150, unit: "per kg", popular: false },
  { id: "ls8", name: "Bedsheet Set", type: "Piece", price: 250, unit: "per set", popular: true },
];

// ─── TOUR DEMO DATA ───────────────────────────────────────────────────────

export const tourStats = {
  toursThisWeek: 5,
  activeBookings: 47,
  pendingRequests: 8,
  revenueMonth: 320000,
  popularPackage: "Cox's Bazar 3D2N",
};

export const tourPackages = [
  {
    id: "pkg1",
    name: "Cox's Bazar 3 Days 2 Nights",
    destination: "Cox's Bazar",
    duration: "3D / 2N",
    capacity: 20,
    booked: 18,
    priceRegular: 8500,
    pricePeak: 11000,
    includes: ["Transport", "Hotel", "Breakfast"],
    nextDeparture: "Apr 26, 2026",
    bookings: 47,
    rating: 4.8,
    status: "Active",
  },
  {
    id: "pkg2",
    name: "Sundarbans Mangrove 4D3N",
    destination: "Sundarbans",
    duration: "4D / 3N",
    capacity: 15,
    booked: 12,
    priceRegular: 12000,
    pricePeak: 15000,
    includes: ["Transport", "Hotel", "All Meals", "Boat"],
    nextDeparture: "Apr 28, 2026",
    bookings: 32,
    rating: 4.9,
    status: "Active",
  },
  {
    id: "pkg3",
    name: "Sajek Valley 2D1N",
    destination: "Sajek, Rangamati",
    duration: "2D / 1N",
    capacity: 12,
    booked: 8,
    priceRegular: 6500,
    pricePeak: 8500,
    includes: ["Transport", "Cottage", "Breakfast"],
    nextDeparture: "May 02, 2026",
    bookings: 28,
    rating: 4.7,
    status: "Active",
  },
  {
    id: "pkg4",
    name: "Bandarban Hill Treks 3D2N",
    destination: "Bandarban",
    duration: "3D / 2N",
    capacity: 10,
    booked: 10,
    priceRegular: 9500,
    pricePeak: 12000,
    includes: ["Transport", "Hotel", "Breakfast", "Guide"],
    nextDeparture: "May 05, 2026",
    bookings: 22,
    rating: 4.6,
    status: "Full",
  },
];

export const tourBookings = [
  { id: "TB-4821", customer: "Rahim Ahmed", package: "Cox's Bazar 3D2N", persons: 2, total: 17000, status: "Confirmed", departure: "Apr 26", guide: "Kamal Hossain" },
  { id: "TB-4822", customer: "Sara & Husband", package: "Sundarbans 4D3N", persons: 2, total: 24000, status: "Pending", departure: "Apr 28", guide: null },
  { id: "TB-4823", customer: "Ahmed Family", package: "Cox's Bazar 3D2N", persons: 4, total: 34000, status: "Confirmed", departure: "Apr 26", guide: "Kamal Hossain" },
  { id: "TB-4824", customer: "Tanvir Hossain", package: "Sajek Valley 2D1N", persons: 2, total: 13000, status: "Confirmed", departure: "May 02", guide: "Rashed Mia" },
];

export const guides = [
  { id: "g1", name: "Kamal Hossain", phone: "01711-000001", specialization: "Beach & Coastal", tours: 12, rating: 4.9, status: "Active" },
  { id: "g2", name: "Rashed Mia", phone: "01812-000002", specialization: "Hill Treks", tours: 8, rating: 4.7, status: "Active" },
  { id: "g3", name: "Noor Islam", phone: "01912-000003", specialization: "Jungle & Wildlife", tours: 6, rating: 4.8, status: "Active" },
];

// ─── ACCOUNTS DEMO DATA ───────────────────────────────────────────────────

export const accountsStats = {
  cashInHand: 245000,
  bankBalance: 1840000,
  revenueMonth: 984000,
  expensesMonth: 412000,
  receivables: 128000,
  payables: 68000,
  profitMonth: 572000,
  profitTrend: 18.4,
};

export const recentTransactions = [
  { id: "TXN-001", date: "Apr 24", description: "Room Revenue - 12 rooms", category: "Income", amount: 84500, type: "credit" },
  { id: "TXN-002", date: "Apr 24", description: "Restaurant Revenue", category: "Income", amount: 42300, type: "credit" },
  { id: "TXN-003", date: "Apr 24", description: "Electricity Bill", category: "Utility", amount: 18500, type: "debit" },
  { id: "TXN-004", date: "Apr 23", description: "Staff Salary Advance - Riya", category: "HR", amount: 5000, type: "debit" },
  { id: "TXN-005", date: "Apr 23", description: "Food & Beverage Purchase", category: "Inventory", amount: 32000, type: "debit" },
  { id: "TXN-006", date: "Apr 23", description: "Laundry Revenue", category: "Income", amount: 14200, type: "credit" },
  { id: "TXN-007", date: "Apr 22", description: "Marketing - Social Media Ads", category: "Marketing", amount: 8000, type: "debit" },
  { id: "TXN-008", date: "Apr 22", description: "Booking.com Commission", category: "Commission", amount: 4500, type: "debit" },
];

export const monthlyPL = [
  { month: "Nov", income: 820000, expense: 380000 },
  { month: "Dec", income: 940000, expense: 420000 },
  { month: "Jan", income: 780000, expense: 360000 },
  { month: "Feb", income: 850000, expense: 395000 },
  { month: "Mar", income: 910000, expense: 408000 },
  { month: "Apr", income: 984000, expense: 412000 },
];

// ─── MARKETPLACE DEMO DATA ────────────────────────────────────────────────

export const featuredHotels = [
  {
    slug: "sea-pearl-beach-resort",
    name: "Sea Pearl Beach Resort",
    location: "Sugandha Beach, Cox's Bazar",
    stars: 4,
    rating: 4.7,
    reviews: 238,
    priceFrom: 3200,
    image: "🏖",
    amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Beach Access"],
    badge: "Top Rated",
    verified: true,
  },
  {
    slug: "grand-horizon-resort",
    name: "Grand Horizon Resort",
    location: "Inani Beach, Cox's Bazar",
    stars: 5,
    rating: 4.9,
    reviews: 184,
    priceFrom: 5500,
    image: "🌊",
    amenities: ["Private Beach", "Pool", "Spa", "3 Restaurants", "Gym"],
    badge: "Premium",
    verified: true,
  },
  {
    slug: "westin-dhaka",
    name: "The Westin Dhaka",
    location: "Gulshan, Dhaka",
    stars: 5,
    rating: 4.8,
    reviews: 412,
    priceFrom: 8000,
    image: "🏙",
    amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Business Center"],
    badge: "Business",
    verified: true,
  },
  {
    slug: "sajek-valley-resort",
    name: "Sajek Valley Resort",
    location: "Sajek, Rangamati",
    stars: 3,
    rating: 4.6,
    reviews: 96,
    priceFrom: 2800,
    image: "⛰",
    amenities: ["Mountain View", "WiFi", "Restaurant", "Hiking"],
    badge: "Nature",
    verified: true,
  },
];

export const popularTours = [
  {
    id: "t1",
    name: "Cox's Bazar 3D2N",
    agency: "TourBD Agency",
    duration: "3 Days / 2 Nights",
    priceFrom: 8500,
    rating: 4.8,
    reviews: 124,
    image: "🏖",
    includes: ["Transport", "Hotel", "Breakfast"],
    nextDate: "Apr 26, 2026",
  },
  {
    id: "t2",
    name: "Sundarbans 4D3N",
    agency: "TourBD Agency",
    duration: "4 Days / 3 Nights",
    priceFrom: 12000,
    rating: 4.9,
    reviews: 87,
    image: "🌿",
    includes: ["Transport", "Hotel", "All Meals", "Boat"],
    nextDate: "Apr 28, 2026",
  },
  {
    id: "t3",
    name: "Bandarban Hill Trek",
    agency: "Explore BD Tours",
    duration: "3 Days / 2 Nights",
    priceFrom: 9500,
    rating: 4.6,
    reviews: 63,
    image: "⛰",
    includes: ["Transport", "Cottage", "Breakfast", "Guide"],
    nextDate: "May 02, 2026",
  },
  {
    id: "t4",
    name: "Sajek Valley 2D1N",
    agency: "TourBD Agency",
    duration: "2 Days / 1 Night",
    priceFrom: 6500,
    rating: 4.7,
    reviews: 51,
    image: "🌄",
    includes: ["Transport", "Cottage", "Breakfast"],
    nextDate: "May 05, 2026",
  },
];

export const hotelRooms = [
  { id: "r1", type: "Superior Room", beds: "1 King Bed", size: "28 sqm", price: 3200, available: 5, amenities: ["AC", "WiFi", "TV", "Minibar"] },
  { id: "r2", type: "Deluxe Sea View", beds: "1 King Bed", size: "32 sqm", price: 4200, available: 2, amenities: ["AC", "WiFi", "TV", "Minibar", "Sea View", "Balcony"] },
  { id: "r3", type: "Family Room", beds: "2 Queen Beds", size: "45 sqm", price: 5800, available: 3, amenities: ["AC", "WiFi", "TV", "Minibar", "Sea View"] },
  { id: "r4", type: "Executive Suite", beds: "1 King Bed + Sofa", size: "65 sqm", price: 8500, available: 1, amenities: ["AC", "WiFi", "TV", "Minibar", "Sea View", "Jacuzzi", "Lounge"] },
];

export const hotelReviews = [
  { id: 1, name: "Rahim Ahmed", rating: 5, date: "Apr 10, 2026", text: "Absolutely stunning beachfront property. The rooms are spacious, clean, and the sea view is breathtaking. Staff were extremely helpful." },
  { id: 2, name: "Sara Islam", rating: 4, date: "Mar 28, 2026", text: "Great location and excellent service. The breakfast buffet was wonderful with a good variety. Only downside was the pool was a bit crowded on weekends." },
  { id: 3, name: "Tanvir H.", rating: 5, date: "Mar 15, 2026", text: "Best hotel in Cox's Bazar hands down. Stayed 4 nights and would come back. The restaurant serves amazing seafood." },
];
