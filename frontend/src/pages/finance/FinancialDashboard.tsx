import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Download } from 'lucide-react';
import { NairaSign } from '../../components/icons/NairaSign';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import { generateFinancialReport } from '../../utils/pdfGenerator';

interface Summary {
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
}

export default function FinancialDashboard() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/finance/summary');
                if (response.data.success) {
                    setSummary(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch summary', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const response = await api.get('/finance/detailed-report');
            if (response.data.success) {
                generateFinancialReport(response.data.data);
            }
        } catch (error) {
            console.error('Failed to generate report', error);
            alert('Failed to generate PDF report');
        } finally {
            setDownloading(false);
        }
    };

    const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : `₦${Number(amount).toLocaleString()}`}
            </h3>
        </div>
    );

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
                        <p className="text-gray-500">Farm profitability at a glance.</p>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {downloading ? 'Generating...' : 'Download PDF Report'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Revenue (Sales)"
                        amount={summary?.total_revenue || 0}
                        icon={NairaSign}
                        color="bg-green-100 text-green-600"
                    />
                    <StatCard
                        title="Total Expenses"
                        amount={summary?.total_expenses || 0}
                        icon={Wallet}
                        color="bg-red-100 text-red-600"
                    />
                    <StatCard
                        title="Gross Profit"
                        amount={summary?.net_profit || 0}
                        icon={NairaSign}
                        color="bg-blue-100 text-blue-600"
                    />
                </div>

                {/* Placeholder for recent transactions or charts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">More charts and analytics coming in Phase 7/8...</p>
                </div>
            </div>
        </AppLayout>
    );
}
