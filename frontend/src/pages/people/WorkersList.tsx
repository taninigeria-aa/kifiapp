import { useEffect, useState } from 'react';
import { Plus, Phone, User, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Worker } from '../../types';

export default function WorkersList() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Worker | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        role: 'Attendant',
        phone: '',
        salary_ngn: '',
        status: 'Active' as 'Active' | 'Inactive',
        start_date: new Date().toISOString().split('T')[0]
    });

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/people/workers');
            if (response.data.success) {
                setWorkers(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch workers', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/people/workers/${editingItem.worker_id}`, formData);
            } else {
                await api.post('/people/workers', formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ full_name: '', role: 'Attendant', phone: '', salary_ngn: '', status: 'Active', start_date: new Date().toISOString().split('T')[0] });
            fetchWorkers();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to save worker');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this worker record?')) return;
        try {
            await api.delete(`/people/workers/${id}`);
            fetchWorkers();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to delete worker');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Workers</h2>
                        <p className="text-gray-500">Manage farm staff and roles.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ full_name: '', role: 'Attendant', phone: '', salary_ngn: '', status: 'Active', start_date: new Date().toISOString().split('T')[0] });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Worker
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : workers.length === 0 ? (
                        <p className="text-gray-500">No workers found.</p>
                    ) : (
                        workers.map((w) => (
                            <div key={w.worker_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <User className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${w.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {w.status}
                                            </span>
                                            <div className="hidden group-hover:flex items-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(w);
                                                        setFormData({
                                                            full_name: w.full_name,
                                                            role: w.role,
                                                            phone: w.phone_number || '',
                                                            salary_ngn: String(w.salary_ngn || ''),
                                                            status: w.status,
                                                            start_date: w.start_date ? new Date(w.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                    className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(w.worker_id)}
                                                    className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{w.full_name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{w.role}</p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{w.phone_number || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span>₦{Number(w.salary_ngn).toLocaleString()} /mo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Worker' : 'Add New Worker'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. John Doe"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Manager"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="+234..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₦/mo)</label>
                                    <input
                                        type="number"
                                        value={formData.salary_ngn}
                                        onChange={e => setFormData({ ...formData, salary_ngn: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="50000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save Worker</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
