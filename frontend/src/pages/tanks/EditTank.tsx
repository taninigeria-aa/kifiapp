import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Tank {
  tank_id: number;
  tank_code: string;
  tank_name: string;
  tank_type: string;
  location: string;
  capacity_liters: number;
  is_active: boolean;
  notes: string;
  created_at: string;
}

export default function EditTank() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tank, setTank] = useState<Tank | null>(null);
  const [formData, setFormData] = useState({
    tank_name: '',
    tank_type: 'concrete',
    location: '',
    capacity_liters: '',
    notes: '',
    is_active: true
  });
  const token = localStorage.getItem('token');
  const tankTypes = ['Hatching', 'IBC', 'Elevated', 'Ground', 'Tarpaulin'];

  useEffect(() => {
    fetchTank();
  }, [id]);

  const fetchTank = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/tanks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tankData = response.data.data;
      setTank(tankData);
      setFormData({
        tank_name: tankData.tank_name,
        tank_type: tankData.tank_type,
        location: tankData.location,
        capacity_liters: tankData.capacity_liters.toString(),
        notes: tankData.notes || '',
        is_active: tankData.is_active
      });
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to load tank');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'capacity_liters' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.tank_name || !formData.tank_type || !formData.capacity_liters) {
      setError('Tank name, type, and capacity are required');
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`/api/v1/tanks/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/tanks');
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to update tank');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading tank...</div>;
  if (!tank) return <div className="p-6">Tank not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/tanks')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft size={20} />
        Back to Tanks
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Tank</h1>
      <p className="text-gray-600 mb-6">Tank Code: {tank.tank_code}</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tank Name *
          </label>
          <input
            type="text"
            name="tank_name"
            value={formData.tank_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tank Type *
            </label>
            <select
              name="tank_type"
              value={formData.tank_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {tankTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (Liters) *
            </label>
            <input
              type="number"
              name="capacity_liters"
              value={formData.capacity_liters}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {submitting ? 'Updating...' : 'Update Tank'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tanks')}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
