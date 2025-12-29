
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { ExpenseCategory } from '../../types';

export default function ExpenseCategories() {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ExpenseCategory | null>(null);
    const [formData, setFormData] = useState({
        category_name: '',
        description: '',
        is_active: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/finance/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/finance/categories/${editingItem.category_id}`, formData);
            } else {
                await api.post('/finance/categories', formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ category_name: '', description: '', is_active: true });
            fetchCategories();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category? (Only works if no expenses are linked)')) return;
        try {
            await api.delete(`/finance/categories/${id}`);
            fetchCategories();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(error.response?.data?.message || 'Failed to delete category. Note: You cannot delete categories with associated expenses.');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.href = '/expenses'}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Expense Categories</h2>
                        <p className="text-gray-500">Manage classification for operational costs.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ category_name: '', description: '', is_active: true });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-gray-500">No categories found.</p>
                    ) : (
                        categories.map((c) => (
                            <div key={c.category_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between group h-full">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{c.category_name}</h3>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(c);
                                                    setFormData({
                                                        category_name: c.category_name,
                                                        description: c.description || '',
                                                        is_active: c.is_active
                                                    });
                                                    setShowModal(true);
                                                }}
                                                className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.category_id)}
                                                className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {c.description && (
                                        <p className="text-sm text-gray-500 mb-4">{c.description}</p>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {c.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold">{editingItem ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={formData.category_name}
                                    onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="e.g. Electricity"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Optional details..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded text-blue-600"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
