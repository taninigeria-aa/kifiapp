
import { useEffect, useState } from 'react';
import { Plus, Package, Pencil, List, Grid } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import { format } from 'date-fns';

interface FeedItem {
    feed_id: number;
    name: string;
    type: string;
    quantity_kg: string;
    cost_per_kg: string;
    supplier: string;
    notes: string;
    last_purchase_date?: string;
}

export default function FeedInventory() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [formData, setFormData] = useState({
        id: null as number | null,
        name: '',
        type: 'Pellets',
        bag_size_kg: '',
        num_bags: '',
        cost_per_bag: '',
        supplier: '',
        notes: '',
        purchase_date: new Date().toISOString().split('T')[0],
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
            purchase_date: new Date().toISOString().split('T')[0],
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
            purchase_date: new Date().toISOString().split('T')[0], // Default to today for update if not tracked
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
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Grid View"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Record Purchase
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : feedItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No feed items found</h3>
                        <p className="text-gray-500">Get started by recording your first feed purchase.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedItems.map((item) => (
                            <div key={item.feed_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <Package className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${Number(item.quantity_kg) < 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {Number(item.quantity_kg) < 50 ? 'Low Stock' : 'In Stock'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit Details"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{item.type || 'Standard'}</p>

                                    <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between">
                                            <span>Current Stock:</span>
                                            <span className="font-medium text-gray-900">{Number(item.quantity_kg).toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Cost/kg:</span>
                                            <span className="font-medium text-gray-900">₦{Number(item.cost_per_kg).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                            <span className="font-medium text-gray-900">Total Value:</span>
                                            <span className="font-bold text-blue-600">₦{(Number(item.quantity_kg) * Number(item.cost_per_kg)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                                        <span>{item.supplier || 'No Supplier'}</span>
                                        {item.last_purchase_date && (
                                            <span>Last: {format(new Date(item.last_purchase_date), 'MMM d, yyyy')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Name</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium text-right">Stock (kg)</th>
                                        <th className="px-6 py-3 font-medium text-right">Avg Cost/kg</th>
                                        <th className="px-6 py-3 font-medium text-right">Total Value</th>
                                        <th className="px-6 py-3 font-medium">Supplier</th>
                                        <th className="px-6 py-3 font-medium">Last Purchase</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {feedItems.map((item) => (
                                        <tr key={item.feed_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{item.type}</td>
                                            <td className="px-6 py-4 text-gray-900 text-right font-medium">
                                                <span className={Number(item.quantity_kg) < 50 ? 'text-red-600' : ''}>
                                                    {Number(item.quantity_kg).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 text-right">₦{Number(item.cost_per_kg).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-blue-600 font-bold text-right">
                                                ₦{(Number(item.quantity_kg) * Number(item.cost_per_kg)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{item.supplier || '-'}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {item.last_purchase_date ? format(new Date(item.last_purchase_date), 'MMM d, yyyy') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-8 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">{formData.isEdit ? 'Edit Feed Item' : 'Record Feed Purchase'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!formData.isEdit && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Date of Purchase</label>
                                    <input
                                        type="date"
                                        value={formData.purchase_date}
                                        onChange={e => setFormData({ ...formData, purchase_date: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Feed Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Coppens 2mm"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Type (Category)</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
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
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Num Bags</label>
                                        <input
                                            type="number"
                                            value={formData.num_bags}
                                            onChange={e => setFormData({ ...formData, num_bags: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. 10"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Bag Size (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.bag_size_kg}
                                            onChange={e => setFormData({ ...formData, bag_size_kg: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. 15"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {!formData.isEdit ? (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Cost per Bag (₦)</label>
                                    <input
                                        type="number"
                                        value={formData.cost_per_bag}
                                        onChange={e => setFormData({ ...formData, cost_per_bag: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. 15000"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1 uppercase text-gray-500">Update Bag Size (kg)</label>
                                            <input type="number" step="0.1" value={formData.bag_size_kg} onChange={e => setFormData({ ...formData, bag_size_kg: e.target.value })} className="w-full p-2 border rounded" placeholder="Optional" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 uppercase text-gray-500">Update Cost/Bag (₦)</label>
                                            <input type="number" value={formData.cost_per_bag} onChange={e => setFormData({ ...formData, cost_per_bag: e.target.value })} className="w-full p-2 border rounded" placeholder="Optional" />
                                        </div>
                                    </div>

                                    {formData.bag_size_kg && formData.cost_per_bag && (
                                        <p className="text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded text-center">
                                            New Avg Cost: ₦{(Number(formData.cost_per_bag) / Number(formData.bag_size_kg)).toFixed(2)} /kg
                                        </p>
                                    )}

                                    <div>
                                        <label className="block text-xs font-medium mb-1 uppercase text-gray-500">Or Set Avg Cost per Kg Directly (₦)</label>
                                        <input
                                            type="number"
                                            value={formData.cost_per_kg}
                                            onChange={e => setFormData({ ...formData, cost_per_kg: e.target.value })}
                                            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-400"
                                            disabled={!!(formData.bag_size_kg && formData.cost_per_bag)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Live Calculation Preview (Only for Purchase) */}
                            {!formData.isEdit && (
                                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 space-y-1 border border-blue-100">
                                    <div className="flex justify-between">
                                        <span>Total Quantity:</span>
                                        <span className="font-bold">{totalKg.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Cost:</span>
                                        <span className="font-bold">₦{totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-blue-700 border-t border-blue-200 pt-1 mt-1">
                                        <span>Effective Cost/kg:</span>
                                        <span>{totalKg > 0 ? `₦${(totalCost / totalKg).toFixed(2)}` : '-'} /kg</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Supplier</label>
                                <select
                                    value={formData.supplier}
                                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="">Select Supplier (Optional)</option>
                                    {suppliers.map(s => (
                                        <option key={s.supplier_id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" rows={2} placeholder="Optional notes..." />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">{formData.isEdit ? 'Update Feed' : 'Record Purchase'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
