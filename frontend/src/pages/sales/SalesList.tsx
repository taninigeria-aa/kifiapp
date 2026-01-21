
import { useEffect, useState } from 'react';
import { Plus, Download, Save } from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '../../components/layout/AppLayout';
import { Modal } from '../../components/common/Modal';
import api from '../../lib/api';
import { generateSalesReport } from '../../utils/pdfGenerator';
import type { Batch } from '../../types';

interface Sale {
    sale_id: number;
    sale_date: string;
    customer_name: string;
    batch_code: string;
    quantity: number;
    total_amount: string;
    payment_status: string;
}

interface Customer {
    customer_id: number;
    name: string;
}

export default function SalesList() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90 days

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [formData, setFormData] = useState({
        customer_id: '',
        batch_id: '',
        sale_date: new Date().toISOString().split('T')[0],
        quantity: '',
        weight_kg: '',
        price_per_unit: '',
        total_amount: '',
        payment_status: 'Pending',
        notes: ''
    });

    const currentBatch = batches.find(b => b.batch_id === Number(formData.batch_id));

    useEffect(() => {
        fetchSales();
        fetchFormOptions();
    }, []);

    // Auto-calculate total
    useEffect(() => {
        const qty = parseFloat(formData.quantity);
        const price = parseFloat(formData.price_per_unit);
        if (!isNaN(qty) && !price) {
            // do nothing
        } else if (!isNaN(qty) && !isNaN(price)) {
            setFormData(prev => ({ ...prev, total_amount: (qty * price).toString() }));
        }
    }, [formData.quantity, formData.price_per_unit]);

    const fetchSales = async () => {
        try {
            setLoading(true);
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

    const fetchFormOptions = async () => {
        try {
            const [custRes, batchRes] = await Promise.all([
                api.get('/sales/customers'),
                api.get('/production/batches')
            ]);
            if (custRes.data.success) setCustomers(custRes.data.data);
            if (batchRes.data.success) {
                const activeBatches = batchRes.data.data.filter((b: Batch) => b.status === 'Active' && (b.current_count || 0) > 0);
                setBatches(activeBatches);
            }
        } catch (error) {
            console.error('Failed to fetch form options', error);
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

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/sales/sales', {
                ...formData,
                customer_id: parseInt(formData.customer_id),
                batch_id: parseInt(formData.batch_id),
                quantity: parseInt(formData.quantity),
                weight_kg: parseFloat(formData.weight_kg) || 0,
                price_per_unit: parseFloat(formData.price_per_unit),
                total_amount: parseFloat(formData.total_amount)
            });
            setShowModal(false);
            setFormData({
                customer_id: '',
                batch_id: '',
                sale_date: new Date().toISOString().split('T')[0],
                quantity: '',
                weight_kg: '',
                price_per_unit: '',
                total_amount: '',
                payment_status: 'Pending',
                notes: ''
            });
            fetchSales();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Failed to create sale', error);
            alert(error.response?.data?.message || 'Failed to record sale. Please check your inputs.');
        } finally {
            setFormLoading(false);
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
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Record Sale
                        </button>
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

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Record New Sale"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source Batch</label>
                            <select
                                name="batch_id"
                                value={formData.batch_id}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Batch (Available Count)</option>
                                {batches.map(b => (
                                    <option key={b.batch_id} value={b.batch_id}>
                                        {b.batch_code} ({b.current_count?.toLocaleString()} fish)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Count)</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleFormChange}
                                max={currentBatch?.current_count || undefined}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${currentBatch && parseInt(formData.quantity) > (currentBatch.current_count || 0) ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="0"
                                required
                            />
                            {currentBatch && (
                                <p className={`text-xs mt-1 ${parseInt(formData.quantity) > (currentBatch.current_count || 0) ? 'text-red-600' : 'text-gray-500'}`}>
                                    Available: {currentBatch.current_count?.toLocaleString()} fish
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="weight_kg"
                                value={formData.weight_kg}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Fish (₦)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price_per_unit"
                                value={formData.price_per_unit}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₦)</label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                            <select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="sale_date"
                                value={formData.sale_date}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                rows={2}
                                value={formData.notes}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Additional details..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className={`inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors ${formLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {formLoading ? 'Recording...' : 'Record Sale'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
