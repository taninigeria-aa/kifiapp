
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Batch } from '../../types';

interface Customer {
    customer_id: number;
    name: string;
}

export default function NewSale() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Data for dropdowns
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);

    // Form Data
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
        // Fetch Options
        Promise.all([
            api.get('/sales/customers'),
            api.get('/production/batches')
        ]).then(([custRes, batchRes]) => {
            if (custRes.data.success) setCustomers(custRes.data.data);
            if (batchRes.data.success) {
                // Filter only active batches with fish
                const activeBatches = batchRes.data.data.filter((b: Batch) => b.status === 'Active' && (b.current_count || 0) > 0);
                setBatches(activeBatches);
            }
        });
    }, []);

    // Auto-calculate total if needed, simple version for now
    useEffect(() => {
        const qty = parseFloat(formData.quantity);
        const price = parseFloat(formData.price_per_unit);
        if (!isNaN(qty) && !isNaN(price)) {
            setFormData(prev => ({ ...prev, total_amount: (qty * price).toString() }));
        }
    }, [formData.quantity, formData.price_per_unit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
            navigate('/sales');
        } catch (error) {
            console.error('Failed to create sale', error);
            alert((error as any).response?.data?.message || 'Failed to record sale. Please check your inputs.'); // eslint-disable-line @typescript-eslint/no-explicit-any
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/sales')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Record New Sale</h2>
                        <p className="text-sm text-gray-500">Sell fish from an active batch.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                            <select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Batch */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Source Batch</label>
                            <select
                                name="batch_id"
                                value={formData.batch_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Count)</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                max={currentBatch?.current_count || undefined}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${currentBatch && parseInt(formData.quantity) > (currentBatch.current_count || 0)
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300'
                                    }`}
                                placeholder="0"
                                required
                            />
                            {currentBatch && (
                                <p className={`text-xs mt-1 ${parseInt(formData.quantity) > (currentBatch.current_count || 0)
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                                    }`}>
                                    Available: {currentBatch.current_count?.toLocaleString()} fish
                                </p>
                            )}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Weight (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="weight_kg"
                                value={formData.weight_kg}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Fish (₦)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price_per_unit"
                                value={formData.price_per_unit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Total Amount (Auto-Calculated) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₦)</label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                                readOnly
                            />
                        </div>

                        {/* Payment Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                            <select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>

                        {/* Sale Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                name="sale_date"
                                value={formData.sale_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Additional details..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors
                                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
                            `}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Recording...' : 'Record Sale'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
