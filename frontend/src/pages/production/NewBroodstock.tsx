import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface BroodstockFormData {
    broodstock_code: string;
    sex: 'Male' | 'Female';
    species: string;
    weight_kg: number;
    health_status: 'Active' | 'Quarantine' | 'Retired';
}

export default function NewBroodstock() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BroodstockFormData>();

    const onSubmit = async (data: BroodstockFormData) => {
        try {
            const response = await api.post('/broodstock', data);
            if (response.data.success) {
                // For now, redirect to Spawn List since we don't have Broodstock List yet, 
                // or just go back to previous page
                navigate(-1);
            }
        } catch (error: any) {
            console.error('Create broodstock error', error);
            alert(error.response?.data?.message || 'Failed to create broodstock');
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Register New Broodstock</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Broodstock Code</label>
                            <input
                                type="text"
                                placeholder="e.g., BRD-F-003"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                                {...register('broodstock_code', { required: 'Code is required' })}
                            />
                            {errors.broodstock_code && <p className="text-xs text-red-500 mt-1">{errors.broodstock_code.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sex */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('sex', { required: 'Sex is required' })}
                                >
                                    <option value="">Select Sex...</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                                {errors.sex && <p className="text-xs text-red-500 mt-1">{errors.sex.message}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('health_status')}
                                    defaultValue="Active"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Quarantine">Quarantine</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Species */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                                <input
                                    type="text"
                                    defaultValue="Clarias gariepinus"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('species')}
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('weight_kg', { valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors font-medium disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Saving...' : 'Save Record'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
