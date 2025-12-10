import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const loginSchema = z.object({
    phone_number: z.string().min(11, 'Phone number must be at least 11 digits').regex(/^(070|080|081|090|091)\d{8}$/, 'Invalid Nigerian phone number format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            const response = await api.post('/auth/login', {
                phone_number: data.phone_number,
                password: data.password
            });

            if (response.data.success) {
                login(response.data.data.token, response.data.data.user);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 md:p-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        {/* Placeholder Logo Icon */}
                        <span className="text-white text-4xl font-bold">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">TaniTrack</h1>
                    <p className="text-gray-500 text-sm mt-1">Hatchery Management</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                placeholder="08012345678"
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('phone_number')}
                            />
                        </div>
                        {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            {...register('rememberMe')}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'LOGIN'
                        )}
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;
