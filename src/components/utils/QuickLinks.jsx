// components/QuickLinks.jsx
import React, { useRef } from 'react';
import { 
  RiAddLine, 
  RiFileListLine, 
  RiMoneyDollarCircleLine,
  RiUserAddLine,
  RiBankCardLine,
  RiPieChartLine,
  RiSettings4Line,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  const scrollRef = useRef(null);

  const quickLinks = [
    { title: 'Apply Loan', icon: RiAddLine, path: '/apply-loan', color: 'text-blue-600' },
    { title: 'Approval', icon: RiFileListLine, path: '/loan-approval', color: 'text-emerald-600' },
    { title: 'Disburse', icon: RiMoneyDollarCircleLine, path: '/disbursement', color: 'text-purple-600' },
    { title: 'Add Customer', icon: RiUserAddLine, path: '/customers/add', color: 'text-orange-600' },
    { title: 'Collection', icon: RiBankCardLine, path: '/emi-collection', color: 'text-cyan-600' },
    { title: 'Reports', icon: RiPieChartLine, path: '/loan-reports', color: 'text-pink-600' },
    { title: 'Settings', icon: RiSettings4Line, path: '/settings', color: 'text-gray-600' },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
      <span className="text-slate-700 text-xs font-semibold whitespace-nowrap">⚡Quick Links</span>
      
      <div className="relative flex-1 overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                to={link.path}
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-all duration-200 whitespace-nowrap"
              >
                <Icon className={`${link.color} text-sm`} />
                <span className="text-slate-600 text-xs font-semibold group-hover:text-slate-800 transition-colors">
                  {link.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {quickLinks.length > 4 && (
        <>
          <button 
            onClick={() => scroll('left')}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <RiArrowLeftSLine size={14} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <RiArrowRightSLine size={14} />
          </button>
        </>
      )}
    </div>
  );
};

export default QuickLinks;