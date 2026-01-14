
import React from 'react';
import MapChart from './MapChart';

interface DashboardProps {
    onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
    const stats = [
        { label: 'Total Chats', value: '1,284', change: '+12%', icon: 'fa-comments', color: 'text-white', bg: 'bg-orange-500', iconBg: 'bg-orange-400/30' },
        { label: 'Active Sessions', value: '42', change: '+5%', icon: 'fa-user-clock', color: 'text-white', bg: 'bg-blue-600', iconBg: 'bg-blue-500/30' },
        { label: 'Avg. Response Time', value: '1.2s', change: '-8%', icon: 'fa-bolt', color: 'text-slate-700', bg: 'bg-slate-50', iconBg: 'bg-white' },
        { label: 'Security Threats Blocked', value: '156', change: '+24%', icon: 'fa-shield-virus', color: 'text-white', bg: 'bg-green-600', iconBg: 'bg-green-500/30' },
    ];

    const safetyMetrics = [
        { label: 'User Safety Score', value: 94, color: 'bg-green-500' },
        { label: 'Content Filtering Accuracy', value: 99.2, color: 'bg-blue-500' },
        { label: 'Threat Detection Rate', value: 88, color: 'bg-indigo-500' },
    ];

    const feedback = [
        { user: 'Rahul S.', rating: 5, comment: 'Very helpful in identifying a phishing link!', time: '2h ago' },
        { user: 'Priya M.', rating: 4, comment: 'The voice mode is amazing and works in Kannada.', time: '5h ago' },
        { user: 'Ankit K.', rating: 5, comment: 'Saved me from a WhatsApp scam. Thank you!', time: '1d ago' },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Dashboard</h1>
                        <p className="text-slate-500 mt-1">Nationwide Chatbot activity, safety analytics, feedback loops</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-semibold self-start md:self-center"
                    >
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-slate-100/10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.iconBg} ${stat.color} rounded-2xl flex items-center justify-center text-xl`}>
                                    <i className={`fas ${stat.icon}`}></i>
                                </div>
                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full ${stat.color === 'text-white' ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className={`${stat.color === 'text-white' ? 'text-white/80' : 'text-slate-500'} text-xs font-bold uppercase tracking-wider`}>{stat.label}</h3>
                            <p className={`text-2xl font-black ${stat.color === 'text-white' ? 'text-white' : 'text-slate-900'} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-3">
                        <MapChart />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Safety Analytics */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="fas fa-shield-halved text-blue-500"></i> Safety Analytics
                        </h3>
                        <div className="space-y-8">
                            {safetyMetrics.map((metric, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{metric.value}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${metric.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${metric.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Case Management */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <i className="fas fa-folder-open text-indigo-500"></i> Case Management
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Total Complaints Registered', value: '842', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Resolved Cases', value: '564', color: 'text-green-600', bg: 'bg-green-50' },
                                { label: 'Pending / In-Progress', value: '278', color: 'text-amber-600', bg: 'bg-amber-50' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                                        <span className={`text-xl font-extrabold ${item.color} mt-1`}>{item.value}</span>
                                    </div>
                                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                                        <i className={`fas ${i === 0 ? 'fa-plus-circle' : i === 1 ? 'fa-check-circle' : 'fa-clock'}`}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-blue-700">Real-time sync active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
