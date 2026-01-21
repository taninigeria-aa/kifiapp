import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2 } from 'lucide-react';

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

export default function ViewTank() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tank, setTank] = useState<Tank | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTank();
  }, [id]);

  const fetchTank = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/tanks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTank(response.data.data);
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to load tank');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading tank...</div>;
  if (!tank) return <div className="p-6">Tank not found</div>;

  const formattedDate = new Date(tank.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/tanks')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft size={20} />
        Back to Tanks
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{tank.tank_name}</h1>
        <button
          onClick={() => navigate(`/tanks/${tank.tank_id}/edit`)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Edit2 size={20} />
          Edit Tank
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Tank Code</p>
            <p className="text-xl font-semibold text-gray-900">{tank.tank_code}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Tank Type</p>
            <p className="text-xl font-semibold text-gray-900 capitalize">{tank.tank_type}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Location</p>
            <p className="text-xl font-semibold text-gray-900">{tank.location || 'Not specified'}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Capacity</p>
            <p className="text-xl font-semibold text-gray-900">{tank.capacity_liters.toLocaleString()} L</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              tank.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {tank.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-1">Created</p>
            <p className="text-xl font-semibold text-gray-900">{formattedDate}</p>
          </div>
        </div>

        {tank.notes && (
          <div className="border-t pt-6">
            <p className="text-gray-600 text-sm mb-2">Notes</p>
            <p className="text-gray-700 whitespace-pre-wrap">{tank.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
