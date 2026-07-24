import React from "react";
import Icon from "../utils/Icon";

const ESignatureStatus = ({ 
  status = "completed", // pending, completed, failed, expired
  signedBy = "Rahul Sharma",
  signedOn = "2024-01-20 10:30 AM",
  className = ""
}) => {
  // Status configurations
  const statusConfig = {
    completed: {
      icon: "RiCheckboxCircleLine",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      label: "E-Signature Completed",
      subLabel: "Document signed successfully",
      dotColor: "bg-emerald-500",
      bgGradient: "from-emerald-50 to-emerald-100/50"
    },
    pending: {
      icon: "RiTimeLine",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "E-Signature Pending",
      subLabel: "Awaiting customer signature",
      dotColor: "bg-amber-500",
      bgGradient: "from-amber-50 to-amber-100/50"
    },
    failed: {
      icon: "RiCloseCircleLine",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "E-Signature Failed",
      subLabel: "Signing process incomplete",
      dotColor: "bg-red-500",
      bgGradient: "from-red-50 to-red-100/50"
    },
    expired: {
      icon: "RiErrorWarningLine",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "E-Signature Expired",
      subLabel: "Signing link has expired",
      dotColor: "bg-orange-500",
      bgGradient: "from-orange-50 to-orange-100/50"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-gradient-to-r ${config.bgGradient}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 ${config.bgColor} rounded-md`}>
            <Icon name="RiFileSignatureLine" size={16} color={config.color.replace('text-', '')} />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">E-Signature</h2>
            <p className="text-[10px] text-slate-500">Digital signing status</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${config.bgColor} ${config.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${status === 'pending' ? 'animate-pulse' : ''}`}></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}>
            <Icon name={config.icon} size={24} color={config.color.replace('text-', '')} />
          </div>

          {/* Status Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${config.color}`}>
              {config.label}
            </h3>
            <p className="text-xs text-slate-500">
              {config.subLabel}
            </p>
            
            {/* Additional Details */}
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {signedBy && (
                <div className="flex items-center gap-1">
                  <Icon name="RiUser3Line" size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-600">{signedBy}</span>
                </div>
              )}
              {signedOn && status === "completed" && (
                <div className="flex items-center gap-1">
                  <Icon name="RiCalendarCheckLine" size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-600">{formatDate(signedOn)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
            <span>
              {status === "completed" ? "Signing completed" : 
               status === "pending" ? "Awaiting signature" :
               status === "failed" ? "Signing failed" : "Link expired"}
            </span>
            <span className={status === "completed" ? "text-emerald-600 font-semibold" : 
                           status === "pending" ? "text-amber-600 font-semibold" : 
                           "text-red-600 font-semibold"}>
              {status === "completed" ? "100%" : 
               status === "pending" ? "50%" : 
               "0%"}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                status === "completed" ? "bg-emerald-500 w-full" : 
                status === "pending" ? "bg-amber-400 w-1/2" : 
                "bg-red-400 w-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Additional Info for Pending Status */}
        {status === "pending" && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
            <Icon name="RiInformationLine" size={12} />
            <span>Customer has been notified. Awaiting their signature.</span>
          </div>
        )}

        {/* Additional Info for Failed Status */}
        {status === "failed" && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-red-500">
            <Icon name="RiAlertLine" size={12} />
            <span>Signing attempt failed. Please try again.</span>
          </div>
        )}

        {/* Additional Info for Expired Status */}
        {status === "expired" && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-orange-500">
            <Icon name="RiTimeLine" size={12} />
            <span>Signing link expired. Request a new link.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESignatureStatus;