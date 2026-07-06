import React, { useState } from 'react';
import { 
  RiDashboardLine, 
  RiUser3Line, 
  RiMoneyDollarCircleLine,
  RiBankCardLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCalendarEventLine,
  RiNotification3Line,
  RiMore2Fill,
  RiEyeLine,
  RiDownloadLine
} from 'react-icons/ri';
import { 
  IoDocumentTextOutline, 
  IoTimeOutline,
  IoWarningOutline,
  IoStatsChart,
  IoTrendingUp,
  IoTrendingDown
} from 'react-icons/io5';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import QuickLinks from '../../components/utils/QuickLinks';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');

  // Dashboard Statistics
  const stats = [
    {
      title: 'Total Loans',
      value: '2,120',
      change: '+12.5%',
      trend: 'up',
      icon: RiMoneyDollarCircleLine,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Loans',
      value: '1,248',
      change: '+8.3%',
      trend: 'up',
      icon: RiBankCardLine,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Closed Loans',
      value: '842',
      change: '+15.7%',
      trend: 'up',
      icon: RiCheckboxCircleLine,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Customers',
      value: '3,456',
      change: '+11.2%',
      trend: 'up',
      icon: RiUser3Line,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Disbursed Amount',
      value: '₹ 25.68 Cr',
      change: '+15.7%',
      trend: 'up',
      icon: IoStatsChart,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'NPA Loans',
      value: '30',
      change: '+2.4%',
      trend: 'down',
      icon: IoWarningOutline,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  // Quick Stats
  const quickStats = [
    { label: 'Disbursement Pending', value: '8', color: 'text-yellow-600' },
    { label: 'Follow Up', value: '12', color: 'text-blue-600' },
    { label: 'Overdue Amount', value: '₹ 3.92 Cr', color: 'text-red-600' },
    { label: 'Collection Efficiency', value: '92.6%', color: 'text-emerald-600' },
  ];

  // Monthly Data
  const monthlyData = [
    { month: 'Jan', applications: 120, disbursed: 85, collections: 65 },
    { month: 'Feb', applications: 150, disbursed: 110, collections: 80 },
    { month: 'Mar', applications: 180, disbursed: 130, collections: 95 },
    { month: 'Apr', applications: 140, disbursed: 100, collections: 75 },
    { month: 'May', applications: 200, disbursed: 160, collections: 120 },
    { month: 'Jun', applications: 160, disbursed: 120, collections: 90 },
    { month: 'Jul', applications: 190, disbursed: 140, collections: 105 },
    { month: 'Aug', applications: 170, disbursed: 125, collections: 95 },
    { month: 'Sep', applications: 210, disbursed: 155, collections: 115 },
    { month: 'Oct', applications: 155, disbursed: 115, collections: 85 },
    { month: 'Nov', applications: 175, disbursed: 130, collections: 100 },
    { month: 'Dec', applications: 195, disbursed: 145, collections: 110 },
  ];

  // Loan Status Data
  const loanStatusData = [
    { name: 'Under Review', value: 320, color: '#F59E0B' },
    { name: 'Approved', value: 420, color: '#10B981' },
    { name: 'Submitted', value: 220, color: '#3B82F6' },
    { name: 'Disbursed', value: 88, color: '#8B5CF6' },
    { name: 'Rejected', value: 80, color: '#EF4444' },
  ];

  // Recent Applications
  const recentApplications = [
    { id: 'LA-2024-1250', customer: 'Rahul Sharma', product: 'Home Loan', amount: '₹ 25,00,000', status: 'Under Review', date: '20 May 2024' },
    { id: 'LA-2024-1249', customer: 'Priya Patel', product: 'Vehicle Loan', amount: '₹ 8,50,000', status: 'Approved', date: '19 May 2024' },
    { id: 'LA-2024-1248', customer: 'Amit Verma', product: 'Personal Loan', amount: '₹ 5,00,000', status: 'Approved', date: '19 May 2024' },
    { id: 'LA-2024-1247', customer: 'Sneha Reddy', product: 'Business Loan', amount: '₹ 12,00,000', status: 'Submitted', date: '19 May 2024' },
    { id: 'LA-2024-1246', customer: 'Vikram Singh', product: 'Home Loan', amount: '₹ 32,00,000', status: 'Approved', date: '18 May 2024' },
  ];

  // Notifications
  const notifications = [
    { text: 'Loan LA-2024-1248 has been approved', time: '2 min ago', type: 'success' },
    { text: 'EMI payment received for LA-2024-1187', time: '1 hour ago', type: 'info' },
    { text: 'New loan application LA-2024-1250', time: '2 hours ago', type: 'warning' },
    { text: 'Document expired for LA-2024-1122', time: '1 day ago', type: 'error' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Submitted': 'bg-blue-100 text-blue-700 border-blue-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusDot = (status) => {
    const dots = {
      'Under Review': 'bg-yellow-500',
      'Approved': 'bg-emerald-500',
      'Submitted': 'bg-blue-500',
      'Rejected': 'bg-red-500',
    };
    return dots[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening with your loan portfolio today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <RiCalendarEventLine size={20} />
          </button>
        </div>
      </div>

      <QuickLinks />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1 my-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-md border border-slate-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={stat.color} size={18} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-slate-500 text-xs font-medium">{stat.title}</p>
                <p className="text-slate-800 text-lg font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-md border border-slate-200 px-4 py-3 flex items-center justify-between hover:shadow-md transition-shadow">
            <span className="text-slate-500 text-sm">{stat.label}</span>
            <span className={`${stat.color} font-bold text-lg`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Loan Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-800 font-semibold">Loan Trend</h3>
              <p className="text-slate-500 text-xs">Monthly overview of applications, disbursements & collections</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 font-medium">This Year</button>
              {/* <button className="text-xs px-3 py-1 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">2023</button> */}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="applications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="disbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="collections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    color: '#1E293B'
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="url(#applications)" />
                <Area type="monotone" dataKey="disbursed" stroke="#10B981" fill="url(#disbursed)" />
                <Area type="monotone" dataKey="collections" stroke="#8B5CF6" fill="url(#collections)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-slate-600 text-xs">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-600 text-xs">Disbursed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span className="text-slate-600 text-xs">Collections</span>
            </div>
          </div>
        </div>

        {/* Loan Status & Calendar */}
        <div className="space-y-4">
          {/* Loan Status Pie Chart */}
          <div className="bg-white rounded-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800 font-semibold">Loan Status</h3>
              <span className="text-slate-500 text-xs">Total: 1,248</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      color: '#1E293B'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {loanStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 text-[10px]">{item.name}</span>
                  <span className="text-slate-800 text-[10px] font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-800 font-semibold">Recent Loan Applications</h3>
              <p className="text-slate-500 text-xs">Latest loan applications received</p>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-medium">
              <RiEyeLine size={14} />
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-xs border-b border-slate-200">
                  <th className="pb-3 font-medium">Application ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-blue-600 text-sm font-medium">{app.id}</td>
                    <td className="py-3 text-slate-700 text-sm">{app.customer}</td>
                    <td className="py-3 text-slate-600 text-sm">{app.product}</td>
                    <td className="py-3 text-slate-700 text-sm font-medium">{app.amount}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(app.status)} flex items-center gap-1.5 w-fit`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(app.status)}`}></span>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-sm">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold">Notifications</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const iconMap = {
                success: 'bg-emerald-100 text-emerald-600',
                info: 'bg-blue-100 text-blue-600',
                warning: 'bg-yellow-100 text-yellow-600',
                error: 'bg-red-100 text-red-600'
              };
              const bgMap = {
                success: 'hover:bg-emerald-50',
                info: 'hover:bg-blue-50',
                warning: 'hover:bg-yellow-50',
                error: 'hover:bg-red-50'
              };
              return (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${bgMap[notification.type]} transition-colors`}>
                  <div className={`p-1.5 rounded-lg ${iconMap[notification.type]}`}>
                    <RiNotification3Line size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm">{notification.text}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{notification.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;