import { useState, useEffect } from 'react';
import type { Advertiser, Campaign } from '../types';
import { advertiserService } from '../services/advertiserService';

export default function AdvertiserProfile() {
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  useEffect(() => {
    fetchAdvertiserData();
  }, []);

  const fetchAdvertiserData = async () => {
    try {
      setLoading(true);
      // Replace with actual advertiser ID from auth context
      const advertiserId = 'current-advertiser-id';
      
      const [advertiserResponse, campaignsResponse] = await Promise.all([
        advertiserService.getAdvertiserProfile(advertiserId),
        advertiserService.getAdvertiserCampaigns(advertiserId)
      ]);

      if (advertiserResponse.status === 'success' && advertiserResponse.data) {
        setAdvertiser(advertiserResponse.data);
      }
      if (campaignsResponse.status === 'success' && campaignsResponse.data) {
        setCampaigns(campaignsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching advertiser data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiser) return;

    try {
      const response = await advertiserService.updateAdvertiserProfile(advertiser.advertiserId, advertiser);
      if (response.status === 'success') {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!advertiser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Advertiser profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Advertiser Profile</h1>

      {/* Company Information */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Company Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={advertiser.companyName}
                onChange={(e) => setAdvertiser({ ...advertiser, companyName: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={advertiser.contactPerson || ''}
                onChange={(e) => setAdvertiser({ ...advertiser, contactPerson: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={advertiser.phoneNumber || ''}
                onChange={(e) => setAdvertiser({ ...advertiser, phoneNumber: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                value={advertiser.businessAddress || ''}
                onChange={(e) => setAdvertiser({ ...advertiser, businessAddress: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={advertiser.city || ''}
                onChange={(e) => setAdvertiser({ ...advertiser, city: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={advertiser.industry || ''}
                onChange={(e) => setAdvertiser({ ...advertiser, industry: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6">
            <span className={`px-3 py-1 rounded-full text-sm ${advertiser.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {advertiser.isVerified ? 'Verified Business' : 'Pending Verification'}
            </span>
          </div>

          {isEditing && (
            <div className="mt-6">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Campaigns Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Campaigns</h2>
          <button
            onClick={() => setShowCreateCampaign(true)}
            className="btn-primary"
          >
            + Create Campaign
          </button>
        </div>

        {campaigns.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No campaigns yet. Create your first campaign to start connecting with drivers!
          </p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.campaignId}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{campaign.campaignName}</h3>
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <p className="font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment/Day:</span>
                    <p className="font-medium text-green-600">
                      ${campaign.paymentPerDay?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Drivers Needed:</span>
                    <p className="font-medium">{campaign.requiredDrivers}</p>
                  </div>
                </div>

                {campaign.wrapDesignUrl && (
                  <div className="mt-4">
                    <img
                      src={campaign.wrapDesignUrl}
                      alt="Wrap Design"
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button className="btn-primary text-sm">View Details</button>
                  <button className="btn-secondary text-sm">Edit</button>
                  {campaign.status === 'active' && (
                    <button className="text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg text-sm">
                      Pause
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal (placeholder) */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Campaign</h3>
            <p className="text-gray-600 mb-4">Campaign form will go here...</p>
            <button
              onClick={() => setShowCreateCampaign(false)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
