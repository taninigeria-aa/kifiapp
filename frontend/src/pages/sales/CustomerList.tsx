
import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, MapPin } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface Customer {
    customer_id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
}

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', notes: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/sales/customers');
            if (response.data.success) {
                setCustomers(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/sales/customers', formData);
            setShowModal(false);
            setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
            fetchCustomers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create customer');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
                        <p className="text-gray-500">Manage your client database.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : customers.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No customers found.</td></tr>
                                ) : (
                                    customers.map((c) => (
                                        <tr key={c.customer_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex flex-col gap-1">
                                                    {c.phone && <div className="flex items-center"><Phone className="w-3 h-3 mr-1" />{c.phone}</div>}
                                                    {c.email && <div className="flex items-center"><Mail className="w-3 h-3 mr-1" />{c.email}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{c.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{c.notes}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add Customer</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 border rounded" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded" rows={2} />
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
