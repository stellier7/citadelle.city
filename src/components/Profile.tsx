import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaEdit, FaSave, FaTimes, FaCamera, FaQrcode, FaKey, FaHistory, FaCog, FaClock, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_started';
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  profileImage?: string;
}

export const Profile = () => {
  const { user, walletAddress, metamaskAddress, connectedWalletType } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock profile data - in real app, this would come from a database
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    kycStatus: 'not_started',
    twoFactorEnabled: false,
    notificationsEnabled: true,
  });
  
  const [originalData, setOriginalData] = useState(profileData);

  // Helper functions for KYC status
  const getKycStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Started';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <FaClock className="w-6 h-6 text-yellow-500" />;
      case 'rejected':
        return <FaTimesCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FaExclamationCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOriginalData(profileData);
      setIsEditing(false);
      // Here you would typically save to your backend
      console.log('Profile data saved:', profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Network Background */}
      <div className="network-background" />
      
      {/* Content */}
      <div className="relative z-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your account information and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Image & Basic Info */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                      {profileData.profileImage ? (
                        <img 
                          src={profileData.profileImage} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#ff4444] rounded-full flex items-center justify-center hover:bg-[#ff6666] transition-colors">
                      <FaCamera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-400">{connectedWalletType || 'Generated Wallet'} User</p>
                    <p className="text-sm text-gray-500 font-mono">
                      {metamaskAddress || walletAddress}
                    </p>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4444] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4444] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4444] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4444] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#ff4444] hover:bg-[#ff6666] text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FaSave className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ff4444] hover:bg-[#ff6666] text-white rounded-lg transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* KYC Status */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">KYC Verification</h3>
                  {getKycStatusIcon(profileData.kycStatus)}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 mb-1">Status</p>
                    <p className={`font-medium ${getKycStatusColor(profileData.kycStatus)}`}>
                      {getKycStatusText(profileData.kycStatus)}
                    </p>
                  </div>
                  {profileData.kycStatus === 'not_started' && (
                    <button className="px-4 py-2 bg-[#ff4444] hover:bg-[#ff6666] text-white rounded-lg transition-colors">
                      Start KYC
                    </button>
                  )}
                </div>

                {/* KYC Status Details */}
                <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Identity Verification</span>
                      <span className={`text-sm font-medium ${profileData.kycStatus === 'verified' ? 'text-green-500' : 'text-gray-500'}`}>
                        {profileData.kycStatus === 'verified' ? 'Verified' : 'Not Started'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Document Verification</span>
                      <span className={`text-sm font-medium ${profileData.kycStatus === 'verified' ? 'text-green-500' : 'text-gray-500'}`}>
                        {profileData.kycStatus === 'verified' ? 'Verified' : 'Not Started'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Address Verification</span>
                      <span className={`text-sm font-medium ${profileData.kycStatus === 'verified' ? 'text-green-500' : 'text-gray-500'}`}>
                        {profileData.kycStatus === 'verified' ? 'Verified' : 'Not Started'}
                      </span>
                    </div>
                    {profileData.kycStatus === 'pending' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Review Status</span>
                        <span className="text-sm font-medium text-yellow-500">Under Review</span>
                      </div>
                    )}
                    {profileData.kycStatus === 'rejected' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Review Status</span>
                        <span className="text-sm font-medium text-red-500">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    KYC (Know Your Customer) verification is required for:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Higher transaction limits</li>
                    <li>• Advanced trading features</li>
                    <li>• Withdrawal capabilities</li>
                    <li>• Enhanced security</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Settings */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="w-5 h-5 text-[#ff4444]" />
                  Security
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <button className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-colors">
                      {profileData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Notifications</p>
                      <p className="text-sm text-gray-400">Security alerts and updates</p>
                    </div>
                    <button className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-colors">
                      {profileData.notificationsEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <FaQrcode className="w-4 h-4 text-[#ff4444]" />
                    <span>View QR Code</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <FaKey className="w-4 h-4 text-[#ff4444]" />
                    <span>API Keys</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <FaHistory className="w-4 h-4 text-[#ff4444]" />
                    <span>Activity History</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <FaCog className="w-4 h-4 text-[#ff4444]" />
                    <span>Advanced Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 