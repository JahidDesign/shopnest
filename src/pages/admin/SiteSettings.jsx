// File: src/pages/SiteSettings.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Save, Upload, Globe, Phone, Mail } from "lucide-react";

// Replace with your backend API
const API_URL = "https://api.shopnest.com/settings";

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Fetch current site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching site settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const formData = new FormData();
      formData.append("storeName", settings.storeName);
      formData.append("contactEmail", settings.contactEmail);
      formData.append("contactPhone", settings.contactPhone);
      formData.append("websiteUrl", settings.websiteUrl);
      if (logoFile) formData.append("logo", logoFile);

      // Call your API to save settings
      // await fetch(API_URL, { method: "POST", body: formData });

      setStatusMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading settings...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <Helmet>
        <html lang="en" />
        <title>Site Settings | ShopNest Admin</title>
        <meta name="description" content="Manage global site settings in ShopNest admin panel including store name, logo, contact info, and website URL." />
        <meta name="keywords" content="ShopNest admin, site settings, ecommerce Bangladesh, manage site info, store settings BD" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-center">Site Settings</h1>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
            statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.type === "success" ? <Save /> : <AlertCircle />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Store Name */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Store Name</label>
          <input
            type="text"
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
            placeholder="Enter your store name"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Store Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full p-2 border border-gray-300 rounded-xl"
          />
          {settings.logoUrl && !logoFile && (
            <img src={settings.logoUrl} alt="Store Logo" className="h-20 mt-2 object-contain" />
          )}
          {logoFile && (
            <p className="text-sm text-gray-600 mt-1">{logoFile.name}</p>
          )}
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" /> Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            placeholder="support@shopnest.com"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" /> Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleChange}
            placeholder="+880 1234-567890"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" /> Website URL
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={settings.websiteUrl}
            onChange={handleChange}
            placeholder="https://shopnest.com"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Save className="w-5 h-5" /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default SiteSettings;
