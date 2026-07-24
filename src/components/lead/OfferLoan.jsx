import React, { useState } from 'react';
import Icon from '../utils/Icon';
import Modal from '../utils/Modal';

const OfferLoan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    processingFee: '',
    emi: '',
    loanType: 'Personal',
    offerDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate EMI (Simple calculation - can be enhanced)
  const calculateEMI = () => {
    const { loanAmount, interestRate, tenure } = formData;
    if (loanAmount && interestRate && tenure) {
      const P = parseFloat(loanAmount);
      const r = parseFloat(interestRate) / 12 / 100;
      const n = parseFloat(tenure);
      const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      setFormData(prev => ({
        ...prev,
        emi: emi.toFixed(2)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Loan Offer Data:', formData);
      alert('Loan offer created successfully!');
      setIsSubmitting(false);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        loanAmount: '',
        interestRate: '',
        tenure: '',
        processingFee: '',
        emi: '',
        loanType: 'Personal',
        offerDate: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    }, 2000);
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      // Reset form if needed
    }
  };

  return (
    <>
      {/* Offer Loan Button */}
      <div className="py-2">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center mb-2.5 shadow-md">
              <Icon name="RiHandCoinLine" size={28} color="#FFFFFF" />
            </div>
            <h3 className="text-slate-800 font-semibold text-sm mb-0.5">
              Offer Loan
            </h3>
            <p className="text-slate-500 text-xs text-center mb-3">
              Create a new loan offer for the applicant
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 cursor-pointer transition-all flex items-center gap-2 text-sm shadow-md hover:shadow-lg w-full justify-center"
            >
              <Icon name="RiAddLine" size={16} color="#FFFFFF" />
              <span>Offer Loan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Offer Loan"
        size="lg" // or "md", "xl" based on your Modal component
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loan Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Loan Type <span className="text-red-500">*</span>
            </label>
            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              required
            >
              <option value="Personal">Personal Loan</option>
              <option value="Home">Home Loan</option>
              <option value="Auto">Auto Loan</option>
              <option value="Education">Education Loan</option>
              <option value="Business">Business Loan</option>
            </select>
          </div>

          {/* Loan Amount & Interest Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Loan Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleInputChange}
                onBlur={calculateEMI}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                required
                min="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Interest Rate (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                onBlur={calculateEMI}
                placeholder="Enter rate"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Tenure & Processing Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tenure (Months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleInputChange}
                onBlur={calculateEMI}
                placeholder="Enter months"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Processing Fee (₹)
              </label>
              <input
                type="number"
                name="processingFee"
                value={formData.processingFee}
                onChange={handleInputChange}
                placeholder="Enter fee"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                min="0"
              />
            </div>
          </div>

          {/* EMI & Offer Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                EMI (₹)
              </label>
              <input
                type="text"
                name="emi"
                value={formData.emi}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 cursor-not-allowed"
                placeholder="Auto-calculated"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Auto-calculated based on amount, rate & tenure
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Offer Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="offerDate"
                value={formData.offerDate}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="2"
              placeholder="Add any additional notes..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">
                    <Icon name="RiRefreshLine" size={16} color="#FFFFFF" />
                  </span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Icon name="RiCheckLine" size={16} color="#FFFFFF" />
                  <span>Create Offer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OfferLoan;