import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import api from '../../lib/api';
import type { Tank } from '../../types';

interface BatchFormData {
    start_date: string;
    initial_count: number;
    current_count: number;
    current_tank_id: number;
    status: 'Active' | 'Harvested' | 'Combined' | 'Sold';
    current_stage: 'Fry' | 'Fingerling' | 'Juvenile' | 'Grow-out' | 'Table Size';
    notes?: string;
}

export default function EditBatch() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BatchFormData>();
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const [batchCode, setBatchCode] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tanksRes, batchRes] = await Promise.all([
                    api.get('/production/tanks'),
                    api.get(`/production/batches/${id}`)
                ]);

                if (tanksRes.data.success) setTanks(tanksRes.data.data);

                if (batchRes.data.success) {
                    const data = batchRes.data.data;
                    setBatchCode(data.batch_code);

                    const date = new Date(data.start_date);
                    const dateStr = date.toISOString().split('T')[0];

                    reset({
                        start_date: dateStr,
                        initial_count: data.initial_count,
                        current_count: data.current_count,
                        current_tank_id: data.current_tank_id,
                        status: data.status,
                        current_stage: data.current_stage,
                        notes: data.notes
                    });
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
                alert('Failed to load batch details');
                navigate('/batches');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, navigate, reset]);

    const onSubmit = async (data: BatchFormData) => {
        try {
            const response = await api.put(`/production/batches/${id}`, data);
            if (response.data.success) {
                navigate('/batches');
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Update batch error', error);
            const msg = error.response?.data?.message || 'Failed to update batch';
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
                    <h2 className="text-xl font-bold text-gray-900">Edit Batch: {batchCode}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('status', { required: 'Status is required' })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Harvested">Harvested</option>
                                    <option value="Combined">Combined</option>
                                    <option value="Sold">Sold</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Initial Count */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Count</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('initial_count', { required: 'Count is required', valueAsNumber: true })}
                                />
                            </div>

                            {/* Current Count */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Count</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('current_count', { required: 'Current count is required', valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tank */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Tank</label>
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
                            </div>

                            {/* Stage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    {...register('current_stage', { required: 'Stage is required' })}
                                >
                                    <option value="Fry">Fry</option>
                                    <option value="Fingerling">Fingerling</option>
                                    <option value="Juvenile">Juvenile</option>
                                    <option value="Grow-out">Grow-out</option>
                                    <option value="Table Size">Table Size</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                {...register('notes')}
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors font-medium disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Updating...' : 'Update Batch'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
