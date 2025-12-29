import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Broodstock } from '../../types';

export default function BroodstockList() {
    const [broodstock, setBroodstock] = useState<Broodstock[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Broodstock | null>(null);
    const [formData, setFormData] = useState({
        broodstock_code: '',
        sex: 'Female',
        weight_kg: 0,
        health_status: 'Active',
        notes: '',
        species: 'Catfish'
    });

    const fetchBroodstock = async () => {
        try {
            setLoading(true);
            const response = await api.get('/broodstock');
            if (response.data.success) {
                setBroodstock(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch broodstock', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBroodstock();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/broodstock/${editingItem.broodstock_id}`, {
                    ...formData,
                    current_weight_kg: formData.weight_kg
                });
            } else {
                await api.post('/broodstock', formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ broodstock_code: '', sex: 'Female', weight_kg: 0, health_status: 'Active', notes: '', species: 'Catfish' });
            fetchBroodstock();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save broodstock');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this broodstock? Spawning history may prevent deletion.')) return;
        try {
            await api.delete(`/broodstock/${id}`);
            fetchBroodstock();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete broodstock. Consider marking as Inactive.');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Broodstock</h2>
                        <p className="text-gray-500">Manage your breeding fish inventory.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ broodstock_code: '', sex: 'Female', weight_kg: 0, health_status: 'Active', notes: '', species: 'Catfish' });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Register Broodstock
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acquisition Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : broodstock.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No broodstock found.</td></tr>
                                ) : (
                                    broodstock.map((b) => (
                                        <tr key={b.broodstock_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 uppercase tracking-wider">{b.broodstock_code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${b.sex === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {b.sex}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.current_weight_kg || 0}kg</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.health_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {b.health_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {b.acquisition_date ? new Date(b.acquisition_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3 text-gray-400">
                                                    <button
                                                        onClick={() => {
                                                            setEditingItem(b);
                                                            setFormData({
                                                                broodstock_code: b.broodstock_code,
                                                                sex: b.sex as 'Female' | 'Male',
                                                                weight_kg: Number(b.current_weight_kg),
                                                                health_status: b.health_status,
                                                                notes: b.notes || '',
                                                                species: 'Catfish'
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.broodstock_id)}
                                                        className="hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight ">{editingItem ? 'Update Broodstock' : 'Register Broodstock'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors bg-white rounded-full p-1 border border-gray-100 shadow-sm">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tag/Code</label>
                                <input
                                    type="text"
                                    value={formData.broodstock_code}
                                    onChange={e => setFormData({ ...formData, broodstock_code: e.target.value.toUpperCase() })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                                    placeholder="e.g. F-101"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Sex</label>
                                    <select
                                        value={formData.sex}
                                        onChange={e => setFormData({ ...formData, sex: e.target.value as 'Female' | 'Male' })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight_kg}
                                        onChange={e => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Health Status</label>
                                <select
                                    value={formData.health_status}
                                    onChange={e => setFormData({ ...formData, health_status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Active">Active / Ready</option>
                                    <option value="Recovering">Recovering</option>
                                    <option value="Quarantined">Quarantined</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md shadow-blue-100 italic">
                                    {editingItem ? 'UPDATE RECORD' : 'SAVE BROODSTOCK'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
