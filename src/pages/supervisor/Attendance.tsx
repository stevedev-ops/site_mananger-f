import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

interface Site {
    id: string;
    name: string;
    location: string;
}

const Attendance: React.FC = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [selectedSite, setSelectedSite] = useState<string>('');
    const [status, setStatus] = useState<'CLOCKED_IN' | 'CLOCKED_OUT'>('CLOCKED_OUT');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSites();
        checkStatus();
        getCurrentLocation();
    }, []);

    const fetchSites = async () => {
        try {
            const response = await api.get('/sites'); // Should return assigned sites for supervisor
            if (response.data.success) {
                setSites(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedSite(response.data.data[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch sites', error);
        }
    };

    const checkStatus = async () => {
        try {
            const response = await api.get('/attendance/status');
            if (response.data.success && response.data.data) {
                setStatus('CLOCKED_IN');
                setSelectedSite(response.data.data.site.id);
            } else {
                setStatus('CLOCKED_OUT');
            }
        } catch (error) {
            console.error('Failed to check status', error);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setError(null);
                },
                (err) => {
                    setError('Location access denied. Please enable GPS.');
                    console.error(err);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const handleClockIn = async () => {
        if (!location) {
            setError('Waiting for location...');
            getCurrentLocation();
            return;
        }

        setLoading(true);
        try {
            await api.post('/attendance/clock-in', {
                siteId: selectedSite,
                gpsLocation: location,
                // selfieUrl: '...' // Implement selfie upload later
            });
            setStatus('CLOCKED_IN');
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to clock in');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            // Need to get attendance ID first, but for now let's assume backend handles active session
            // Or we fetch status again to get ID. 
            // Simplified: backend clock-out endpoint should find active session for user
            const statusRes = await api.get('/attendance/status');
            if (statusRes.data.data) {
                await api.post('/attendance/clock-out', {
                    attendanceId: statusRes.data.data.id
                });
                setStatus('CLOCKED_OUT');
                setError(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to clock out');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
                <p className="text-gray-500">Track your daily work hours</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex justify-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${status === 'CLOCKED_IN' ? 'border-green-500 text-green-500' : 'border-gray-200 text-gray-400'
                        }`}>
                        <FaClock className="text-5xl" />
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {status === 'CLOCKED_IN' ? 'You are Clocked In' : 'You are Clocked Out'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {location ? (
                            <span className="flex items-center justify-center gap-1">
                                <FaMapMarkerAlt /> Location Detected
                            </span>
                        ) : (
                            'Detecting location...'
                        )}
                    </p>
                </div>

                {status === 'CLOCKED_OUT' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Site
                        </label>
                        <select
                            value={selectedSite}
                            onChange={(e) => setSelectedSite(e.target.value)}
                            className="input-field"
                            disabled={loading}
                        >
                            <option value="" disabled>Select a site</option>
                            {sites.map((site) => (
                                <option key={site.id} value={site.id}>
                                    {site.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    onClick={status === 'CLOCKED_IN' ? handleClockOut : handleClockIn}
                    disabled={loading || (!location && status === 'CLOCKED_OUT') || (status === 'CLOCKED_OUT' && !selectedSite)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 ${status === 'CLOCKED_IN'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? 'Processing...' : status === 'CLOCKED_IN' ? 'Clock Out' : 'Clock In'}
                </button>

                {status === 'CLOCKED_OUT' && (
                    <div className="text-center text-xs text-gray-400">
                        <p>GPS location is required to clock in.</p>
                        <p>Make sure you are within the site boundaries.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
