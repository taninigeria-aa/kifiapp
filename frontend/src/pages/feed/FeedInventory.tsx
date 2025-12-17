
import { useEffect, useState } from 'react';
import { Plus, Package, Pencil } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface FeedItem {
    feed_id: number;
    name: string;
    type: string;
    quantity_kg: string;
    cost_per_kg: string;
    supplier: string;
    notes: string;
}

export default function FeedInventory() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null as number | null,
        name: '',
        type: 'Pellets',
        bag_size_kg: '',
        num_bags: '',
        cost_per_bag: '',
        supplier: '',
        notes: '',
        // For editing existing items directly (simplified view)
        isEdit: false,
        cost_per_kg: ''
    });

    // Calculated values for display
    const totalKg = Number(formData.bag_size_kg) * Number(formData.num_bags);
    const totalCost = Number(formData.cost_per_bag) * Number(formData.num_bags);



    const fetchFeed = () => {
        Promise.all([
            api.get('/finance/feed'),
            api.get('/people/suppliers')
        ]).then(([feedRes, suppRes]) => {
            if (feedRes.data.success) setFeedItems(feedRes.data.data);
            if (suppRes.data.success) setSuppliers(suppRes.data.data);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to load data', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.isEdit && formData.id) {
                const finalCostPerKg = formData.bag_size_kg && formData.cost_per_bag
                    ? (Number(formData.cost_per_bag) / Number(formData.bag_size_kg)).toFixed(2)
                    : formData.cost_per_kg;

                await api.put(`/finance/feed/${formData.id}`, {
                    name: formData.name,
                    type: formData.type,
                    cost_per_kg: finalCostPerKg,
                    supplier: formData.supplier,
                    notes: formData.notes
                });
                alert('Feed item updated!');
            } else {
                await api.post('/finance/feed', formData);
                alert('Purchase recorded! (Inventory updated & Expense logged)');
            }
            setShowModal(false);
            resetForm();
            fetchFeed();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to save');
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            type: 'Pellets',
            bag_size_kg: '',
            num_bags: '',
            cost_per_bag: '',
            supplier: '',
            notes: '',
            isEdit: false,
            cost_per_kg: ''
        });
    };

    const handleEdit = (item: FeedItem) => {
        setFormData({
            id: item.feed_id,
            name: item.name,
            type: item.type,
            bag_size_kg: '', // Not needed for update
            num_bags: '', // Not needed for update
            cost_per_bag: '', // Not needed for update
            supplier: item.supplier,
            notes: item.notes,
            isEdit: true,
            cost_per_kg: item.cost_per_kg
        });
        setShowModal(true);
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Feed Inventory</h2>
                        <p className="text-gray-500">Track feed stock and purchases.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Record Purchase
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="hidden" // Helper for creating new logic if needed
                    ></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : feedItems.length === 0 ? (
                        <p className="text-gray-500">No feed items found.</p>
                    ) : (
                        feedItems.map((item) => (
                            <div key={item.feed_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <Package className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${Number(item.quantity_kg) < 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {Number(item.quantity_kg) < 50 ? 'Low Stock' : 'In Stock'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-gray-400 hover:text-blue-600 p-1"
                                            title="Edit Item"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{item.type || 'Standard'}</p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Current Stock:</span>
                                            <span className="font-medium text-gray-900">{Number(item.quantity_kg).toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Cost/kg:</span>
                                            <span className="font-medium text-gray-900">₦{Number(item.cost_per_kg).toFixed(2)} /kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Supplier:</span>
                                            <span className="font-medium text-gray-900">{item.supplier || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-8">
                        <h3 className="text-lg font-bold mb-4">{formData.isEdit ? 'Edit Feed Item' : 'Record Feed Purchase'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Feed Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. Coppens 2mm" required autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type (Category)</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="Pellets">Pellets</option>
                                    <option value="Live Feed">Live Feed</option>
                                    <option value="Supplement">Supplement</option>
                                    <option value="Plant Feed">Plant Feed</option>
                                </select>
                            </div>

                            {!formData.isEdit && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Num Bags</label>
                                        <input type="number" value={formData.num_bags} onChange={e => setFormData({ ...formData, num_bags: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. 10" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Bag Size (kg)</label>
                                        <input type="number" step="0.1" value={formData.bag_size_kg} onChange={e => setFormData({ ...formData, bag_size_kg: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. 15" required />
                                    </div>
                                </div>
                            )}

                            {!formData.isEdit ? (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cost per Bag (₦)</label>
                                    <input type="number" value={formData.cost_per_bag} onChange={e => setFormData({ ...formData, cost_per_bag: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. 15000" required />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Update Bag Size (kg)</label>
                                            <input type="number" step="0.1" value={formData.bag_size_kg} onChange={e => setFormData({ ...formData, bag_size_kg: e.target.value })} className="w-full p-2 border rounded" placeholder="Optional" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Update Cost/Bag (₦)</label>
                                            <input type="number" value={formData.cost_per_bag} onChange={e => setFormData({ ...formData, cost_per_bag: e.target.value })} className="w-full p-2 border rounded" placeholder="Optional" />
                                        </div>
                                    </div>

                                    {formData.bag_size_kg && formData.cost_per_bag && (
                                        <p className="text-sm text-blue-600">
                                            New Avg Cost: ₦{(Number(formData.cost_per_bag) / Number(formData.bag_size_kg)).toFixed(2)} /kg
                                        </p>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Or Set Avg Cost per Kg Directly (₦)</label>
                                        <input
                                            type="number"
                                            value={formData.cost_per_kg}
                                            onChange={e => setFormData({ ...formData, cost_per_kg: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            disabled={!!(formData.bag_size_kg && formData.cost_per_bag)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Live Calculation Preview (Only for Purchase) */}
                            {!formData.isEdit && (
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Quantity:</span>
                                        <span className="font-bold">{totalKg.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Cost:</span>
                                        <span className="font-bold">₦{totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-1 mt-1">
                                        <span>Effective Cost/kg:</span>
                                        <span>{totalKg > 0 ? `₦${(totalCost / totalKg).toFixed(2)}` : '-'} /kg</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Supplier</label>
                                <select
                                    value={formData.supplier}
                                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Supplier (Optional)</option>
                                    {suppliers.map(s => (
                                        <option key={s.supplier_id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded" rows={2} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{formData.isEdit ? 'Update Feed' : 'Record Purchase'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
