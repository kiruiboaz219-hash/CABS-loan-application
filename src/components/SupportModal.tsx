import React, { useState } from 'react';
import { X, MessageSquare, PhoneCall, Mail, Send, CheckCircle2, Building, Shield } from 'lucide-react';
import { CABSLogo } from './CABSLogo';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [userMsg, setUserMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    setSent(true);
    setTimeout(() => {
      setUserMsg('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header with CABS Blue */}
        <div className="bg-[#0A2960] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <CABSLogo size="sm" variant="light" />
          </div>
          <h3 className="text-xl font-black text-white">Message CABS Finance Specialist</h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Connect directly with a dedicated personal and business loan consultant.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Contact Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#65B32E] text-white flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0A2960]">WhatsApp Banking</div>
                <div className="text-[11px] text-slate-600 font-mono">+263 777 222 227</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0A2960] text-white flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0A2960]">Direct Helpline</div>
                <div className="text-[11px] text-slate-600 font-mono">+263 242 883822</div>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#65B32E] mx-auto" />
              <div className="font-bold text-sm text-[#0A2960]">Message Received!</div>
              <p className="text-xs text-slate-600">
                A CABS loan consultant will message or call you back within 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 text-xs font-bold text-[#65B32E] hover:underline cursor-pointer"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Quick Message / Question</label>
                <textarea
                  rows={3}
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder="Ask about interest rates, documentation required, or status of an existing loan application..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#65B32E] transition-all resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confidential Banking Communication</span>
                </div>

                <button
                  type="submit"
                  className="bg-[#65B32E] hover:bg-[#589d28] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Send Message</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}

          {/* Branch & Old Mutual Footer Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              <span>CABS Centre, Northridge Park, Harare</span>
            </div>
            <span>A member of Old Mutual</span>
          </div>

        </div>
      </div>
    </div>
  );
};
