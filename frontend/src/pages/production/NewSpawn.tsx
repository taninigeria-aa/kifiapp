import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';

interface SpawnFormData {
    spawn_date: string;
    female_code: string;
    male_code: string;
    female_weight: number;
    male_weight: number;
    injection_time: string;
    estimated_eggs: number;
}



export default function NewSpawn() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SpawnFormData>({
        defaultValues: {
            spawn_date: new Date().toISOString().split('T')[0],
            injection_time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }
    });

    const onSubmit = async (data: SpawnFormData) => {
        try {
            const response = await api.post('/spawns', data);
            if (response.data.success) {
                navigate('/spawns');
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Create spawn error', error);
            const msg = error.response?.data?.message || 'Failed to create spawn.';
            alert(msg);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Record New Spawn</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Spawn Date</label>
                            <input
                                type="date"
                                className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                {...register('spawn_date', { required: 'Date is required' })}
                            />
                            {errors.spawn_date && <p className="text-xs text-red-500 mt-1">{errors.spawn_date.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Broodstock</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Female Code"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        {...register('female_code', { required: 'Female code is required' })}
                                    />
                                    {errors.female_code && <p className="text-xs text-red-500 mt-1">{errors.female_code.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                                        {...register('female_weight', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Broodstock</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Male Code"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        {...register('male_code', { required: 'Male code is required' })}
                                    />
                                    {errors.male_code && <p className="text-xs text-red-500 mt-1">{errors.male_code.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                                        {...register('male_weight', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Injection Time</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('injection_time', { required: 'Time is required' })}
                                />
                                {errors.injection_time && <p className="text-xs text-red-500 mt-1">{errors.injection_time.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Eggs</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('estimated_eggs', { valueAsNumber: true })}
                                />
                            </div>
                        </div>

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
