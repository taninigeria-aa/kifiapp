
import { useEffect, useState } from 'react';
import { Plus, Phone, Mail, Building, Pencil } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface Supplier {
    supplier_id: number;
    name: string;
    contact_person: string;
    phone_number: string;
    email: string;
    category: string;
    notes: string;
}

export default function SuppliersList() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState({
        name: '', contact_person: '', phone: '', email: '', category: 'Feed', notes: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/people/suppliers');
            if (response.data.success) {
                setSuppliers(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await api.put(`/people/suppliers/${editingSupplier.supplier_id}`, formData);
            } else {
                await api.post('/people/suppliers', formData);
            }
            setShowModal(false);
            setFormData({ name: '', contact_person: '', phone: '', email: '', category: 'Feed', notes: '' });
            setEditingSupplier(null);
            fetchSuppliers();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to save supplier');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
                        <p className="text-gray-500">Manage vendors for feed, equipment, etc.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingSupplier(null);
                            setFormData({ name: '', contact_person: '', phone: '', email: '', category: 'Feed', notes: '' });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supplier
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : suppliers.length === 0 ? (
                        <p className="text-gray-500">No suppliers found.</p>
                    ) : (
                        suppliers.map((s) => (
                            <div key={s.supplier_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <Building className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {s.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{s.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">Contact: {s.contact_person || '-'}</p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{s.phone_number || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{s.email || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setEditingSupplier(s);
                                                setFormData({
                                                    name: s.name,
                                                    contact_person: s.contact_person,
                                                    phone: s.phone_number,
                                                    email: s.email,
                                                    category: s.category,
                                                    notes: s.notes
                                                });
                                                setShowModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </button>
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
                        <h3 className="text-lg font-bold mb-4">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded">
                                        <option value="Feed">Feed</option>
                                        <option value="Medication">Medication</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact Person</label>
                                    <input type="text" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
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
