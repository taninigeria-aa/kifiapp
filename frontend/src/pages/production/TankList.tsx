import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Tank } from '../../types';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTank, setEditingTank] = useState<Tank | null>(null);
    const [formData, setFormData] = useState({
        tank_name: '',
        tank_type: 'Hatching',
        location: '',
        capacity_liters: 0,
        notes: '',
        is_active: true
    });

    const fetchTanks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/production/tanks');
            if (response.data.success) {
                setTanks(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tanks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTanks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTank) {
                await api.put(`/production/tanks/${editingTank.tank_id}`, formData);
            } else {
                await api.post('/production/tanks', formData);
            }
            setShowModal(false);
            setEditingTank(null);
            setFormData({ tank_name: '', tank_type: 'Hatching', location: '', capacity_liters: 0, notes: '', is_active: true });
            fetchTanks();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save tank');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this tank? This action cannot be undone.')) return;
        try {
            await api.delete(`/production/tanks/${id}`);
            fetchTanks();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete tank');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tanks & Ponds</h2>
                        <p className="text-gray-500">Manage your hatchery's water bodies.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTank(null);
                            setFormData({ tank_name: '', tank_type: 'Hatching', location: '', capacity_liters: 0, notes: '', is_active: true });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tank
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (L)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : tanks.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No tanks found.</td></tr>
                                ) : (
                                    tanks.map(tank => (
                                        <tr key={tank.tank_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tank.tank_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.tank_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tank.capacity_liters.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tank.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {tank.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3 text-gray-400">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTank(tank);
                                                            setFormData({
                                                                tank_name: tank.tank_name,
                                                                tank_type: tank.tank_type,
                                                                location: tank.location || '',
                                                                capacity_liters: tank.capacity_liters,
                                                                notes: tank.notes || '',
                                                                is_active: tank.is_active
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tank.tank_id)}
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
                            <h3 className="text-lg font-bold text-gray-900">{editingTank ? 'Edit Tank' : 'Add New Tank'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tank Name</label>
                                <input
                                    type="text"
                                    value={formData.tank_name}
                                    onChange={e => setFormData({ ...formData, tank_name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={formData.tank_type}
                                        onChange={e => setFormData({ ...formData, tank_type: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Hatching">Hatching</option>
                                        <option value="IBC">IBC</option>
                                        <option value="Elevated">Elevated</option>
                                        <option value="Ground">Ground</option>
                                        <option value="Tarpaulin">Tarpaulin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (L)</label>
                                    <input
                                        type="number"
                                        value={formData.capacity_liters}
                                        onChange={e => setFormData({ ...formData, capacity_liters: parseInt(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Zone A"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active and available for stocking</label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save Tank</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
