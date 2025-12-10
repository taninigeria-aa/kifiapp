
import { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Batch } from '../../types';

interface FeedItem {
    feed_id: number;
    name: string;
    quantity_kg: string;
}

export default function FeedLog() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        batch_id: '',
        feed_id: '',
        quantity_kg: '',
        notes: ''
    });

    useEffect(() => {
        Promise.all([
            api.get('/production/batches'),
            api.get('/finance/feed')
        ]).then(([batchRes, feedRes]) => {
            if (batchRes.data.success) {
                // Active batches only
                setBatches(batchRes.data.data.filter((b: Batch) => b.status === 'Active'));
            }
            if (feedRes.data.success) {
                setFeedItems(feedRes.data.data);
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/finance/feed/log', {
                ...formData,
                batch_id: formData.batch_id ? parseInt(formData.batch_id) : null,
                feed_id: parseInt(formData.feed_id),
                quantity_kg: parseFloat(formData.quantity_kg)
            });
            alert('Feed usage logged successfully');
            setFormData({ batch_id: '', feed_id: '', quantity_kg: '', notes: '' });
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to log usage');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Log Daily Feeding</h2>
                    <p className="text-gray-500">Record feed consumption for batches.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch (Optional)</label>
                        <select
                            value={formData.batch_id}
                            onChange={e => setFormData({ ...formData, batch_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">General Usage (No specific batch)</option>
                            {batches.map(b => (
                                <option key={b.batch_id} value={b.batch_id}>{b.batch_code} ({b.current_stage})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Feed Type</label>
                        <select
                            value={formData.feed_id}
                            onChange={e => setFormData({ ...formData, feed_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Feed</option>
                            {feedItems.map(f => (
                                <option key={f.feed_id} value={f.feed_id}>
                                    {f.name} (Stock: {Number(f.quantity_kg).toLocaleString()} kg)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Used (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.quantity_kg}
                            onChange={e => setFormData({ ...formData, quantity_kg: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? 'Logging...' : 'Record Usage'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
