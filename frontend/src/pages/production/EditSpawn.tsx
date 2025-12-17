import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditSpawn() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SpawnFormData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpawn = async () => {
            try {
                const response = await api.get(`/spawns/${id}`);
                if (response.data.success) {
                    const data = response.data.data;
                    // Format date and time for inputs
                    const date = new Date(data.spawn_date);
                    const dateStr = date.toISOString().split('T')[0];
                    // injection_time might be full ISO or just HH:mm depending on backend
                    // DB usually returns full ISO 8601 string for TIMESTAMP
                    let timeStr = '';
                    if (data.injection_time) {
                        const timeDate = new Date(data.injection_time);
                        // Make sure we handle timezone correctly or just strip the time part
                        const hours = timeDate.getHours().toString().padStart(2, '0');
                        const minutes = timeDate.getMinutes().toString().padStart(2, '0');
                        timeStr = `${hours}:${minutes}`;
                    }

                    reset({
                        spawn_date: dateStr,
                        female_code: data.female_code,
                        male_code: data.male_code,
                        female_weight: data.female_weight_kg,
                        male_weight: data.male_weight_kg,
                        injection_time: timeStr,
                        estimated_eggs: data.estimated_eggs // mapped from 'estimated_egg_count' in GET
                    });
                }
            } catch (error) {
                console.error('Fetch spawn error', error);
                alert('Failed to load spawn details');
                navigate('/spawns');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSpawn();
    }, [id, navigate, reset]);

    const onSubmit = async (data: SpawnFormData) => {
        try {
            const response = await api.put(`/spawns/${id}`, data);
            if (response.data.success) {
                navigate('/spawns');
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Update spawn error', error);
            const msg = error.response?.data?.message || 'Failed to update spawn.';
            alert(msg);
        }
    };

    if (loading) return (
        <AppLayout>
            <div className="flex justify-center items-center h-64">Loading...</div>
        </AppLayout>
    );

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Edit Spawn</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Spawn Date */}
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
                            {/* Female Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Code(s)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. F-001, F-002"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                                        {...register('female_code', { required: 'Female code is required' })}
                                    />
                                    {errors.female_code && <p className="text-xs text-red-500 mt-1">{errors.female_code.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        {...register('female_weight', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>

                            {/* Male Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Code</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                                        {...register('male_code', { required: 'Male code is required' })}
                                    />
                                    {errors.male_code && <p className="text-xs text-red-500 mt-1">{errors.male_code.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        {...register('male_weight', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Injection Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Injection Time</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('injection_time', { required: 'Time is required' })}
                                />
                                {errors.injection_time && <p className="text-xs text-red-500 mt-1">{errors.injection_time.message}</p>}
                            </div>

                            {/* Estimated Eggs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Eggs</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('estimated_eggs', { valueAsNumber: true })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional estimate based on weight.</p>
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
                                {isSubmitting ? 'Updating...' : 'Update Spawn'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
