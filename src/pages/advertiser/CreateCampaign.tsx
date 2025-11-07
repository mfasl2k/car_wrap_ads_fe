import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { advertiserService } from "../../services/advertiserService";
import type { Campaign } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<Campaign>>({
    campaignName: "",
    description: "",
    startDate: "",
    endDate: "",
    paymentPerDay: 0,
    requiredDrivers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.campaignName || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate!) >= new Date(formData.endDate!)) {
      setError("End date must be after start date");
      return;
    }

    if (!formData.paymentPerDay || formData.paymentPerDay <= 0) {
      setError("Payment per day must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const response = await advertiserService.createCampaign(formData);

      if (response.status === "success") {
        toast.success("Campaign created successfully!");
        navigate("/advertiser/campaigns");
      } else {
        setError(response.message || "Failed to create campaign");
      }
    } catch (err: any) {
      console.error("Create campaign error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create campaign";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div className="text-3xl">🎯</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Campaign
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) =>
                  setFormData({ ...formData, campaignName: e.target.value })
                }
                className="input-field"
                placeholder="e.g., Summer Campaign 2025"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                placeholder="Describe your campaign objectives and target audience..."
                rows={4}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="input-field"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="input-field"
                  required
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>

            {/* Payment and Drivers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Per Day ($) *
                </label>
                <input
                  type="number"
                  value={formData.paymentPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentPerDay: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                  placeholder="50.00"
                  step="0.01"
                  min="0.01"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount paid to each driver per day
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Drivers Needed *
                </label>
                <input
                  type="number"
                  value={formData.requiredDrivers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredDrivers: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  placeholder="10"
                  min="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many drivers do you need?
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Campaign Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                Campaign Summary
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {formData.startDate && formData.endDate
                      ? `${Math.ceil(
                          (new Date(formData.endDate).getTime() -
                            new Date(formData.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Driver Cost:</span>
                  <span className="font-medium">
                    $
                    {formData.paymentPerDay &&
                    formData.requiredDrivers &&
                    formData.startDate &&
                    formData.endDate
                      ? (
                          formData.paymentPerDay *
                          formData.requiredDrivers *
                          Math.ceil(
                            (new Date(formData.endDate).getTime() -
                              new Date(formData.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
