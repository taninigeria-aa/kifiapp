
import { useEffect, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import { generateSalesReport } from '../../utils/pdfGenerator';

interface Sale {
    sale_id: number;
    sale_date: string;
    customer_name: string;
    batch_code: string;
    quantity: number;
    total_amount: string;
    payment_status: string;
}

export default function SalesList() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90 days

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales/sales');
            if (response.data.success) {
                setSales(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sales', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const days = parseInt(dateRange);
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const response = await api.get(`/sales/sales/report?startDate=${startDate}&endDate=${endDate}`);
            if (response.data.success) {
                generateSalesReport(response.data.data);
            }
        } catch (error) {
            console.error('Failed to generate report', error);
            alert('Failed to generate sales report');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sales Records</h2>
                        <p className="text-gray-500">Track your revenue and transactions.</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                        <button
                            onClick={handleDownloadReport}
                            disabled={downloading}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {downloading ? 'Generating...' : 'Download Report'}
                        </button>
                        <Link
                            to="/sales/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Record Sale
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : sales.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No sales recorded yet.</td></tr>
                                ) : (
                                    sales.map((sale) => (
                                        <tr key={sale.sale_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(sale.sale_date), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {sale.customer_name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sale.batch_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {sale.quantity?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                ₦{(Number(sale.total_amount) || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {sale.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
