import type { Customer } from "@/types/customer";

const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Gazipur", "Narayanganj", "Comilla"];

interface CustomerSeed {
  name: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  totalOrders: number;
  totalSpent: number;
  codSuccessRate: number;
  returnCount: number;
  riskLevel: Customer["riskLevel"];
  daysSinceLastOrder: number;
  daysSinceJoined: number;
}

const SEEDS: CustomerSeed[] = [
  { name: "Tanvir Ahmed", phone: "01711-223344", email: "tanvir.ahmed@gmail.com", district: "Dhaka", area: "Mirpur 10", totalOrders: 14, totalSpent: 24680, codSuccessRate: 96, returnCount: 1, riskLevel: "trusted", daysSinceLastOrder: 3, daysSinceJoined: 410 },
  { name: "Rafiul Islam", phone: "01812-556677", district: "Dhaka", area: "Uttara Sector 7", totalOrders: 6, totalSpent: 9870, codSuccessRate: 100, returnCount: 0, riskLevel: "trusted", daysSinceLastOrder: 12, daysSinceJoined: 220 },
  { name: "Shamim Reza", phone: "01918-334455", email: "shamim.reza@yahoo.com", district: "Chattogram", area: "Agrabad", totalOrders: 3, totalSpent: 5340, codSuccessRate: 67, returnCount: 1, riskLevel: "watch", daysSinceLastOrder: 45, daysSinceJoined: 190 },
  { name: "Mahmudul Hasan", phone: "01611-889900", district: "Sylhet", area: "Zindabazar", totalOrders: 9, totalSpent: 15420, codSuccessRate: 89, returnCount: 0, riskLevel: "normal", daysSinceLastOrder: 8, daysSinceJoined: 300 },
  { name: "Arif Chowdhury", phone: "01755-112233", email: "arif.c@outlook.com", district: "Dhaka", area: "Dhanmondi 27", totalOrders: 21, totalSpent: 41250, codSuccessRate: 100, returnCount: 0, riskLevel: "trusted", daysSinceLastOrder: 1, daysSinceJoined: 560 },
  { name: "Naimur Rahman", phone: "01919-667788", district: "Gazipur", area: "Tongi", totalOrders: 2, totalSpent: 2980, codSuccessRate: 50, returnCount: 1, riskLevel: "watch", daysSinceLastOrder: 60, daysSinceJoined: 75 },
  { name: "Fahim Muntasir", phone: "01611-990011", email: "fahim.m@gmail.com", district: "Khulna", area: "Khalishpur", totalOrders: 7, totalSpent: 11630, codSuccessRate: 86, returnCount: 1, riskLevel: "normal", daysSinceLastOrder: 20, daysSinceJoined: 260 },
  { name: "Rakibul Hasan", phone: "01712-445566", district: "Dhaka", area: "Bashundhara R/A", totalOrders: 11, totalSpent: 19870, codSuccessRate: 91, returnCount: 0, riskLevel: "normal", daysSinceLastOrder: 5, daysSinceJoined: 340 },
  { name: "Imran Kabir", phone: "01822-778899", email: "imran.kabir@gmail.com", district: "Narayanganj", area: "Fatullah", totalOrders: 4, totalSpent: 6720, codSuccessRate: 75, returnCount: 0, riskLevel: "normal", daysSinceLastOrder: 30, daysSinceJoined: 150 },
  { name: "Sajid Hossain", phone: "01913-221100", district: "Rajshahi", area: "Shaheb Bazar", totalOrders: 16, totalSpent: 28900, codSuccessRate: 94, returnCount: 1, riskLevel: "trusted", daysSinceLastOrder: 6, daysSinceJoined: 480 },
  { name: "Ovi Talukder", phone: "01711-556600", email: "ovi.t@gmail.com", district: "Comilla", area: "Kandirpar", totalOrders: 1, totalSpent: 1450, codSuccessRate: 0, returnCount: 1, riskLevel: "watch", daysSinceLastOrder: 90, daysSinceJoined: 92 },
  { name: "Zahidul Islam", phone: "01611-334488", district: "Dhaka", area: "Banani", totalOrders: 8, totalSpent: 17650, codSuccessRate: 100, returnCount: 0, riskLevel: "trusted", daysSinceLastOrder: 4, daysSinceJoined: 270 },
];

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const customers: Customer[] = SEEDS.map((s, i) => {
  const id = `cust_${String(i + 1).padStart(4, "0")}`;
  return {
    id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    addresses: [
      {
        id: `${id}_addr_1`,
        label: "Home",
        fullName: s.name,
        phone: s.phone,
        district: s.district,
        area: s.area,
        addressLine: `House/Flat details, Road, ${s.area}`,
        isDefault: true,
      },
    ],
    totalOrders: s.totalOrders,
    totalSpent: s.totalSpent,
    averageOrderValue: Math.round(s.totalSpent / Math.max(1, s.totalOrders)),
    lastOrderAt: s.totalOrders > 0 ? daysAgo(s.daysSinceLastOrder) : undefined,
    codSuccessRate: s.codSuccessRate,
    returnCount: s.returnCount,
    riskLevel: s.riskLevel,
    createdAt: daysAgo(s.daysSinceJoined),
  };
});

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export { DISTRICTS };
