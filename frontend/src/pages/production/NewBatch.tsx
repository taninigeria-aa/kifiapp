import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Tank, Spawn } from '../../types';

interface BatchFormData {
    // batch_code generated on backend
    start_date: string;
    initial_count: number;
    current_tank_id: number;
    spawn_id?: number;
    notes?: string;
    source: 'Spawn' | 'Purchase';
}

export default function NewBatch() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<BatchFormData>({
        defaultValues: {
            start_date: new Date().toISOString().split('T')[0],
            source: 'Spawn'
        }
    });

    const [tanks, setTanks] = useState<Tank[]>([]);
    const [spawns, setSpawns] = useState<Spawn[]>([]);
    const source = watch('source');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tanksRes, spawnsRes] = await Promise.all([
                    api.get('/production/tanks'),
                    api.get('/spawns')
                ]);

                if (tanksRes.data.success) setTanks(tanksRes.data.data);
                if (spawnsRes.data.success) setSpawns(spawnsRes.data.data);
            } catch (error) {
                console.error('Failed to fetch options', error);
            }
        };
        fetchData();
    }, []);


    // Batch code is now generated on backend to avoid collisions

    const onSubmit = async (data: BatchFormData) => {
        try {
            // If source is Purchase, ensure spawn_id is null
            const payload = {
                ...data,
                spawn_id: data.source === 'Spawn' ? data.spawn_id : null
            };

            const response = await api.post('/production/batches', payload);
            if (response.data.success) {
                navigate('/batches');
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Create batch error', error);
            alert(error.response?.data?.message || 'Failed to create batch');
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
                    <h2 className="text-xl font-bold text-gray-900">Create New Batch</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Source Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="Spawn"
                                        className="text-blue-600 focus:ring-blue-500"
                                        {...register('source')}
                                    />
                                    <span className="ml-2">From Spawn</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="Purchase"
                                        className="text-blue-600 focus:ring-blue-500"
                                        {...register('source')}
                                    />
                                    <span className="ml-2">Purchase (Fingerlings)</span>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Spawn Select */}
                        {source === 'Spawn' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Spawn</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('spawn_id', { required: source === 'Spawn' ? 'Spawn is required' : false })}
                                >
                                    <option value="">Select a spawn...</option>
                                    {spawns.map(spawn => (
                                        <option key={spawn.spawn_id} value={spawn.spawn_id}>
                                            {spawn.spawn_code} ({new Date(spawn.spawn_date).toLocaleDateString()}) - Est. {spawn.estimated_eggs} eggs
                                        </option>
                                    ))}
                                </select>
                                {errors.spawn_id && <p className="text-xs text-red-500 mt-1">{errors.spawn_id.message}</p>}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('start_date', { required: 'Date is required' })}
                                />
                                {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Initial Count */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Count (Fish)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('initial_count', { required: 'Count is required', valueAsNumber: true })}
                                />
                                {errors.initial_count && <p className="text-xs text-red-500 mt-1">{errors.initial_count.message}</p>}
                            </div>

                            {/* Tank */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stocking Tank</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('current_tank_id', { required: 'Tank is required' })}
                                >
                                    <option value="">Select a tank...</option>
                                    {tanks.map(tank => (
                                        <option key={tank.tank_id} value={tank.tank_id}>
                                            {tank.tank_name} ({tank.tank_type} - {tank.capacity_liters}L)
                                        </option>
                                    ))}
                                </select>
                                {errors.current_tank_id && <p className="text-xs text-red-500 mt-1">{errors.current_tank_id.message}</p>}
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
                                {isSubmitting ? 'Creating...' : 'Create Batch'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
