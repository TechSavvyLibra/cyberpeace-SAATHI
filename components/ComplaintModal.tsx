
import React, { useState } from 'react';
import { ComplaintData } from '../types';

interface ComplaintModalProps {
  data: ComplaintData;
  onClose: () => void;
}

const ComplaintModal: React.FC<ComplaintModalProps> = ({ data, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Dummy submission logic
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-file-shield text-2xl"></i>
            <h3 className="text-xl font-bold">Complaint Summary</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {!submitted ? (
            <>
              <p className="text-slate-600 text-sm">Review your details before submitting to the national cybercrime portal.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Victim Name</p>
                  <p className="text-slate-900 font-semibold">{data.victimName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Scam Category</p>
                  <p className="text-slate-900 font-semibold">{data.scamType}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Contact Information</p>
                <p className="text-slate-900 font-semibold">{data.contactInfo}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Description</p>
                <p className="text-slate-700 text-sm italic">"{data.details}"</p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-paper-plane"></i>
                  Submit to Cybercrime Portal
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl shadow-lg shadow-green-100 animate-bounce">
                <i className="fas fa-check"></i>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Complaint Submitted!</h4>
              <p className="text-slate-600 font-bold mb-1">Complaint number: 12345</p>
              <p className="text-slate-500 mb-8 max-w-xs">Your complaint has been successfully recorded and shared with CyberPeace Foundation for support. The details have been sent to your email as well.</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Close Guardian
              </button>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-slate-50 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secured by CyberPeace Foundation</p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
