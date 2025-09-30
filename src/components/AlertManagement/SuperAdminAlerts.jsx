import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBell,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaExclamationCircle,
  FaBroadcastTower
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../../config/apiConfig';

const SuperAdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    duration: '',
    targetAudience: 'all',
    isGlobal: true
  });

  // Use centralized API configuration
  const API_BASE_URL = API_CONFIG.BASE_URL;

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/alerts?isGlobal=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAlerts(data.alerts || []);
        }
      } else {
        console.error('Failed to fetch alerts:', response.status);
        toast.error('Failed to load alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []); // fetchAlerts is stable, no need to include

  const alertTypes = [
    { value: 'info', label: 'Information' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'success', label: 'Success' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'admins', label: 'School Admins' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'parents', label: 'Parents' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get the actual super admin user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Debug: Log user data to see its structure
    console.log('User data from localStorage:', user);
    console.log('Available user ID fields:', {
      superAdminId: user?.superAdminId,
      _id: user?._id,
      id: user?.id
    });

    const alertData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) * 1000 : null, // Convert to milliseconds
      isActive: true,
      isGlobal: true,
      createdBy: user?.superAdminId || user?._id || user?.id || 'System' // superAdminId is the correct field for dvssuper
    };

    try {
      if (editingAlert) {
        // Update existing alert
        const response = await fetch(`${API_BASE_URL}/api/v1/alerts/${editingAlert._id || editingAlert.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(alertData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAlerts(prev => prev.map(alert =>
              (alert._id || alert.id) === (editingAlert._id || editingAlert.id) ? data.alert : alert
            ));
            toast.success('Global alert updated successfully');
          }
        } else {
          toast.error('Failed to update alert');
        }
      } else {
        // Create new alert
        const response = await fetch(`${API_BASE_URL}/api/v1/alerts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(alertData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAlerts(prev => [data.alert, ...prev]);
            toast.success('Global alert created and broadcasted');

            // Broadcast the alert
            await broadcastAlert(data.alert._id || data.alert.id);
          }
        } else {
          toast.error('Failed to create alert');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving alert:', error);
      toast.error('Error connecting to server');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      duration: '',
      targetAudience: 'all',
      isGlobal: true
    });
    setEditingAlert(null);
    setIsModalOpen(false);
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      message: alert.message,
      type: alert.type,
      priority: alert.priority,
      duration: alert.duration || '',
      targetAudience: alert.targetAudience,
      isGlobal: alert.isGlobal
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this global alert?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/alerts/${alertId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          setAlerts(prev => prev.filter(alert => (alert._id || alert.id) !== alertId));
          toast.success('Global alert deleted successfully');
        } else {
          toast.error('Failed to delete alert');
        }
      } catch (error) {
        console.error('Error deleting alert:', error);
        toast.error('Error connecting to server');
      }
    }
  };

  const toggleAlertStatus = async (alertId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/alerts/${alertId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAlerts(prev => prev.map(alert =>
            (alert._id || alert.id) === alertId
              ? { ...alert, isActive: data.alert.isActive }
              : alert
          ));
          toast.success('Alert status updated');
        }
      } else {
        toast.error('Failed to update alert status');
      }
    } catch (error) {
      console.error('Error updating alert status:', error);
      toast.error('Error connecting to server');
    }
  };

  const broadcastAlert = async (alertId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/alerts/${alertId}/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const alert = alerts.find(a => (a._id || a.id) === alertId);
        toast.success(`Alert "${alert.title}" broadcasted to all connected dashboards!`);
      } else {
        toast.error('Failed to broadcast alert');
      }
    } catch (error) {
      console.error('Error broadcasting alert:', error);
      toast.error('Error connecting to server');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info': return <FaInfoCircle className="text-blue-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error': return <FaExclamationCircle className="text-red-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 rounded-2xl p-6 mb-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">📢 Global Alert Management</h1>
            <p className="text-purple-100">Broadcast alerts across all school dashboards</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus /> Create Global Alert
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Global Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage alerts that appear across all school dashboards</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Audience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {alert.message.length > 50 
                            ? `${alert.message.substring(0, 50)}...` 
                            : alert.message
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-900 dark:text-white">
                      {alert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">
                    {alert.targetAudience}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAlertStatus(alert.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.isActive 
                          ? 'text-green-800 bg-green-100' 
                          : 'text-gray-800 bg-gray-100'
                      }`}
                    >
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => broadcastAlert(alert.id)}
                        className="text-purple-600 hover:text-purple-800 p-1"
                        title="Broadcast Now"
                      >
                        <FaBroadcastTower />
                      </button>
                      <button
                        onClick={() => handleEdit(alert)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingAlert ? 'Edit Global Alert' : 'Create Global Alert'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter alert title..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter alert message..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    {alertTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto-dismiss Duration (ms)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Leave empty for persistent alert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    {audienceOptions.map(audience => (
                      <option key={audience.value} value={audience.value}>{audience.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {editingAlert ? 'Update Alert' : 'Create & Broadcast Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAlerts;
