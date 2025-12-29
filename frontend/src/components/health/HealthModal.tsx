import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';

interface HealthModalProps {
    batchId: number;
    tankId?: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface HealthFormData {
    log_date: string;
    log_time: string;
    issue_type: string;
    issue_description: string;
    severity: string;
    fish_affected: number;
    mortality_count: number;
    water_temperature_c?: number;
    water_ph?: number;
    oxygen_level_ppm?: number;
    action_taken?: string;
    notes?: string;
}

export const HealthModal: React.FC<HealthModalProps> = ({ batchId, tankId, onClose, onSuccess }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HealthFormData>({
        defaultValues: {
            log_date: new Date().toISOString().split('T')[0],
            log_time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            severity: 'Low',
            issue_type: 'Disease'
        }
    });

    const onSubmit = async (data: HealthFormData) => {
        try {
            await api.post('/health/logs', {
                ...data,
                batch_id: batchId,
                tank_id: tankId
            });
            onSuccess();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Failed to log health issue', error);
            alert(error.response?.data?.message || 'Failed to save health log');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Log Health Issue</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                {...register('log_date', { required: 'Date is required' })}
                            />
                            {errors.log_date && <p className="text-xs text-red-500 mt-1">{errors.log_date.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                type="time"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                {...register('log_time', { required: 'Time is required' })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                {...register('issue_type')}
                            >
                                <option value="Disease">Disease</option>
                                <option value="Water Quality">Water Quality</option>
                                <option value="Injury">Injury</option>
                                <option value="Parasite">Parasite</option>
                                <option value="Stress">Stress</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                {...register('severity')}
                            >
                                <option value="Low">Low (Active Monitoring)</option>
                                <option value="Medium">Medium (Treatment Required)</option>
                                <option value="High">High (Immediate Action)</option>
                                <option value="Critical">Critical (High Mortality Risk)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Describe symptoms, behavior, or water conditions..."
                            {...register('issue_description', { required: 'Description is required' })}
                        />
                        {errors.issue_description && <p className="text-xs text-red-500 mt-1">{errors.issue_description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-red-50 p-4 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-red-900 mb-1">Mortality Count</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                {...register('mortality_count', { valueAsNumber: true })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-red-900 mb-1">Fish Affected (Est.)</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                {...register('fish_affected', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 border-b pb-2">Water Parameters (Optional)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Temp (°C)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    {...register('water_temperature_c', { valueAsNumber: true })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">pH</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    {...register('water_ph', { valueAsNumber: true })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Oxygen (ppm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    {...register('oxygen_level_ppm', { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Action Taken</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Water change, stopped feeding..."
                            {...register('action_taken')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Saving...' : 'Save Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
