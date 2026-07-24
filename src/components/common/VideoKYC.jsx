import { useState } from "react";
import { RiCalendarLine, RiSendPlaneLine, RiUploadCloud2Line, RiVideoChatLine } from "react-icons/ri";
import Icon from "../utils/Icon";
import Button from "../utils/Button";

const VideoKYC = () => {
  const [videoKycStatus, setVideoKycStatus] = useState("pending");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  const handleSendLink = () => {
    if (videoLink) {
      setVideoKycStatus("link_sent");
      setShowLinkInput(false);
      setVideoLink("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center">
            <Icon name={"RiVideoChatLine"} size={20} color={"blue"} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">Video KYC Status</p>
            <p className="text-sm font-semibold text-gray-800">
              {videoKycStatus === "pending" && "Pending"}
              {videoKycStatus === "link_sent" && "Link Sent to Customer"}
              {videoKycStatus === "completed" && "✅ Completed"}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {videoKycStatus === "pending" && "Send video KYC link to customer for verification"}
              {videoKycStatus === "link_sent" && "Customer has been notified. Awaiting completion."}
            </p>
          </div>
        </div>
      </div>

      {videoKycStatus === "pending" && (
        <div className="space-y-3">
          {!showLinkInput ? (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowLinkInput(true)}
                style="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition-colors text-sm"
                btnName={"Send Video KYC Link"}
                btnIcon={"RiSendPlaneLine"}
              />
                
              <Button style="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                btnName={"Upload Recorded Video"}
                btnIcon={"RiUploadCloud2Line"}
              />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Enter Video KYC Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://meet.example.com/kyc-session"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendLink}
                  disabled={!videoLink}
                  className="px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    setShowLinkInput(false);
                    setVideoLink("");
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {videoKycStatus === "link_sent" && (
        <div className="flex gap-3">
          <Button
            onClick={() => setVideoKycStatus("completed")}
            style="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            btnName="Mark as Completed"
            btnIcon={"RiCalendarLine"}
          />
          
          <Button style="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            btnName={"Resend Link"}
            btnIcon={"RiSendPlaneLine"}
          />
        </div>
      )}
    </div>
  );
};

export default VideoKYC;