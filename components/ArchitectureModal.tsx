
import React from 'react';

interface ArchitectureModalProps {
    onClose: () => void;
}

const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-sitemap text-2xl text-blue-400"></i>
                        <div>
                            <h3 className="text-xl font-bold">Architecture Documentation</h3>
                            <p className="text-slate-400 text-xs">System design and flow of CyberPeace SAATHI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50 space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            High Level Architecture
                        </div>
                        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <img
                                src="/assets/A1.png"
                                alt="Architecture Diagram 1"
                                className="w-full h-auto rounded-2xl hover:scale-[1.01] transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Architecture+Diagram+1+Pending';
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            Data Flow & Logic
                        </div>
                        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <img
                                src="/assets/A2.png"
                                alt="Architecture Diagram 2"
                                className="w-full h-auto rounded-2xl hover:scale-[1.01] transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Architecture+Diagram+2+Pending';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">CyberPeace SAATHI Framework v1.0</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Close Viewer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArchitectureModal;
