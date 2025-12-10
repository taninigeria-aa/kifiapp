
import { useEffect, useState } from 'react';
import { Plus, Phone, User, DollarSign, Calendar } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface Worker {
    worker_id: number;
    full_name: string;
    role: string;
    phone_number: string;
    salary_ngn: string;
    status: string;
    start_date: string;
}

export default function WorkersList() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '', role: 'Attendant', phone: '', salary_ngn: '', status: 'Active', start_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/people/workers', formData);
            setShowModal(false);
            setFormData({ full_name: '', role: 'Attendant', phone: '', salary_ngn: '', status: 'Active', start_date: new Date().toISOString().split('T')[0] });
            fetchWorkers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to add worker');
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
                        onClick={() => setShowModal(true)}
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
                            <div key={w.worker_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <User className="w-6 h-6 text-green-600" />
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${w.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {w.status}
                                        </span>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Worker</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full p-2 border rounded" required autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Salary (₦/mo)</label>
                                    <input type="number" value={formData.salary_ngn} onChange={e => setFormData({ ...formData, salary_ngn: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full p-2 border rounded" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
