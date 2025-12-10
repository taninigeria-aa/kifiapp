
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import { format } from 'date-fns';

interface Expense {
    expense_id: number;
    amount: string; // Mapped from amount_ngn
    description: string;
    expense_date: string;
}

export default function ExpensesList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ category: '', amount: '', description: '', expense_date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/finance/expenses');
            if (response.data.success) {
                setExpenses(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/expenses', formData);
            setShowModal(false);
            setFormData({ category: '', amount: '', description: '', expense_date: new Date().toISOString().split('T')[0] });
            fetchExpenses();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to record expense');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
                        <p className="text-gray-500">Track farm operational costs.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Record Expense
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : expenses.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No expenses recorded.</td></tr>
                                ) : (
                                    expenses.map((e) => (
                                        <tr key={e.expense_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(e.expense_date), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {e.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₦{Number(e.amount).toLocaleString()}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Record Expense</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (Category)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value, category: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g. Fuel for Generator"
                                    required autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                                <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input type="date" value={formData.expense_date} onChange={e => setFormData({ ...formData, expense_date: e.target.value })} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
