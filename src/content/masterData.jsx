export const branchData = [
  {
    code: "BR001",
    address: "12 MG Road, Connaught Place",
    name: "Central Branch",
    state: "Delhi",
    mobile: "9876543210",
    city: "New Delhi",
    manager: "Amit Sharma",
    opening_date: "2022-01-15",
  },
  {
    code: "BR002",
    address: "45 Park Street",
    name: "Park Street Branch",
    state: "West Bengal",
    mobile: "9123456780",
    city: "Kolkata",
    manager: "Neha Gupta",
    opening_date: "2021-07-10",
  },
  {
    code: "BR003",
    address: "88 FC Road",
    name: "FC Road Branch",
    state: "Maharashtra",
    mobile: "9988776655",
    city: "Pune",
    manager: "Rahul Verma",
    opening_date: "2023-03-05",
  },
  {
    code: "BR004",
    address: "210 Anna Salai",
    name: "Anna Nagar Branch",
    state: "Tamil Nadu",
    mobile: "9876501234",
    city: "Chennai",
    manager: "Priya Nair",
    opening_date: "2020-11-20",
  },
];

export const financialYearData = [
  {
    year: "2025-2026",
    start_date: "2025-04-01",
    status: "Active",
  },
  {
    year: "2024-2025",
    start_date: "2024-04-01",
    status: "Closed",
  },
];

export const branchManagerData = [
  {
    name: "Amit Sharma",
    department: "Operations",
    address: "12 MG Road, New Delhi",
  },
  {
    name: "Neha Gupta",
    department: "Finance",
    address: "45 Park Street, Kolkata",
  },
  {
    name: "Rahul Verma",
    department: "Sales",
    address: "88 FC Road, Pune",
  },
  {
    name: "Priya Nair",
    department: "Human Resources",
    address: "210 Anna Salai, Chennai",
  },
  {
    name: "Vikram Singh",
    department: "Administration",
    address: "22 MI Road, Jaipur",
  },
  {
    name: "Sneha Patel",
    department: "Customer Support",
    address: "15 CG Road, Ahmedabad",
  },
  {
    name: "Rohit Kumar",
    department: "Information Technology",
    address: "Sector 62, Noida",
  },
  {
    name: "Anjali Mehta",
    department: "Compliance",
    address: "Banjara Hills, Hyderabad",
  },
];

export const relationshipData = [
  { name: "Father" },
  { name: "Mother" },
  { name: "Brother" },
  { name: "Sister" },
  { name: "Husband" },
  { name: "Wife" },
  { name: "Son" },
];

export const stateData = [
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Delhi", code: "DL" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
];

export const cityData = [
  {
    name: "New Delhi",
    code: "DEL001",
    state: "Delhi",
  },
  {
    name: "Mumbai",
    code: "MUM001",
    state: "Maharashtra",
  },
  {
    name: "Pune",
    code: "PUN001",
    state: "Maharashtra",
  },
  {
    name: "Bengaluru",
    code: "BLR001",
    state: "Karnataka",
  },
  {
    name: "Chennai",
    code: "CHE001",
    state: "Tamil Nadu",
  },
  {
    name: "Hyderabad",
    code: "HYD001",
    state: "Telangana",
  },
];

export const occupationData = [
  {
    occupation: "Government Employee",
    matrix: "1",
  },
  {
    occupation: "Private Employee",
    matrix: "4",
  },
  {
    occupation: "Business Owner",
    matrix: "4",
  },
  {
    occupation: "Self Employed",
    matrix: "9",
  },
  {
    occupation: "Professional",
    matrix: "1",
  },
  {
    occupation: "Farmer",
    matrix: "9",
  },
  {
    occupation: "Student",
    matrix: "2",
  },
  {
    occupation: "Retired",
    matrix: "9",
  },
  {
    occupation: "Homemaker",
    matrix: "3",
  },
  {
    occupation: "Daily Wage Worker",
    matrix: "2",
  },
];

export const allLoansData = [
  {
    loanId: "LN100001",
    customerName: "Rohit Sharma",
    loanAmount: 250000,
    interestAmount: 30000,
    totalPayable: 280000,
    status: "Approved",
    createdDate: "2026-07-01",
    createdBy: "Admin",
  },
  {
    loanId: "LN100002",
    customerName: "Priya Verma",
    loanAmount: 150000,
    interestAmount: 18000,
    totalPayable: 168000,
    status: "Pending",
    createdDate: "2026-07-02",
    createdBy: "Ankit Singh",
  },
  {
    loanId: "LN100003",
    customerName: "Amit Kumar",
    loanAmount: 500000,
    interestAmount: 70000,
    totalPayable: 570000,
    status: "Disbursed",
    createdDate: "2026-07-02",
    createdBy: "Admin",
  },
  {
    loanId: "LN100004",
    customerName: "Sneha Patel",
    loanAmount: 80000,
    interestAmount: 9600,
    totalPayable: 89600,
    status: "Rejected",
    createdDate: "2026-07-03",
    createdBy: "Rahul Mehta",
  },
  {
    loanId: "LN100005",
    customerName: "Vikram Singh",
    loanAmount: 350000,
    interestAmount: 42000,
    totalPayable: 392000,
    status: "Approved",
    createdDate: "2026-07-03",
    createdBy: "Admin",
  },
  {
    loanId: "LN100006",
    customerName: "Neha Gupta",
    loanAmount: 120000,
    interestAmount: 14400,
    totalPayable: 134400,
    status: "Pending",
    createdDate: "2026-07-04",
    createdBy: "Ankit Singh",
  },
  {
    loanId: "LN100007",
    customerName: "Rajesh Yadav",
    loanAmount: 600000,
    interestAmount: 90000,
    totalPayable: 690000,
    status: "Disbursed",
    createdDate: "2026-07-04",
    createdBy: "Admin",
  },
  {
    loanId: "LN100008",
    customerName: "Pooja Sharma",
    loanAmount: 100000,
    interestAmount: 12000,
    totalPayable: 112000,
    status: "Closed",
    createdDate: "2026-07-05",
    createdBy: "Rahul Mehta",
  },
  {
    loanId: "LN100009",
    customerName: "Deepak Chauhan",
    loanAmount: 275000,
    interestAmount: 33000,
    totalPayable: 308000,
    status: "Approved",
    createdDate: "2026-07-05",
    createdBy: "Admin",
  },
  {
    loanId: "LN100010",
    customerName: "Kavita Joshi",
    loanAmount: 450000,
    interestAmount: 54000,
    totalPayable: 504000,
    status: "Pending",
    createdDate: "2026-07-06",
    createdBy: "Ankit Singh",
  },
];