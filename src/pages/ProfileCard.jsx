import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaLinkedin, FaFacebook, FaTwitter, FaGlobe, FaEdit, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const ORANGE_PALETTE = {
  vivid: "#FF6600",
  bright: "#FFA500",
  deep: "#FF7F32",
  peach: "#FFDAB9",
  burnt: "#CC5500",
};

const ROLE_LABELS = {
  admin: "Admin",
  customer: "Customer",
  a: "Group A",
  b: "Group B",
  c: "Group C",
  d: "Group D",
  e: "Group E",
};

const API_BASE_URL = "https://shopnest-serveres.onrender.com";

const ProfileLinkedIn = () => {
  const { user, logout } = useContext(AuthContext);
  const email = user?.email || "";

  const [profile, setProfile] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileForm, setProfileForm] = useState({
    title: "",
    bio: "",
    location: "",
    phone: "",
    avatar: "",
    coverImage: "",
    socialLinks: { linkedin: "", facebook: "", twitter: "", website: "" },
    skills: [],
    city: "",
  });

  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", city: "", role: "customer" });
  const [skillInput, setSkillInput] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  // Collapsible states
  const [collapseProfile, setCollapseProfile] = useState(true);
  const [collapseSkills, setCollapseSkills] = useState(true);
  const [collapseSocial, setCollapseSocial] = useState(true);

  // Fetch profile + customer data
  useEffect(() => {
    if (!email) {
      setError("No email found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await axios.get(`${API_BASE_URL}/profiledesign?email=${encodeURIComponent(email)}`);
        const customerRes = await axios.get(`${API_BASE_URL}/customer?email=${encodeURIComponent(email)}`);

        const filteredProfile = Array.isArray(profileRes.data)
          ? profileRes.data.find(p => p.email === email)
          : profileRes.data?.[0] || {};

        const filteredCustomer = Array.isArray(customerRes.data)
          ? customerRes.data.find(c => c.email === email)
          : customerRes.data?.[0] || {};

        setProfile(filteredProfile);
        setCustomer(filteredCustomer);

        setProfileForm({
          title: filteredProfile?.title || "",
          bio: filteredProfile?.bio || "",
          location: filteredProfile?.location || "",
          phone: filteredProfile?.phone || filteredCustomer?.phone || "",
          avatar: filteredCustomer?.photo || filteredProfile?.avatar || "",
          coverImage: filteredProfile?.coverImage || "",
          socialLinks: filteredProfile?.socialLinks || { linkedin: "", facebook: "", twitter: "", website: "" },
          skills: filteredProfile?.skills || [],
          city: filteredCustomer?.city || filteredProfile?.city || "",
        });

        setCustomerForm({
          name: filteredCustomer?.name || "",
          phone: filteredCustomer?.phone || "",
          city: filteredCustomer?.city || "",
          role: filteredCustomer?.role || "customer",
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load profile info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  // Handlers
  const handleProfileChange = e => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setProfileForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillAdd = () => {
    if (skillInput && !profileForm.skills.includes(skillInput)) {
      setProfileForm(prev => ({ ...prev, skills: [...prev.skills, skillInput] }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = skill => {
    setProfileForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    if (!email) return toast.error("Email not found. Please log in.");
    try {
      const payload = { ...profileForm, email };
      if (profile?._id) await axios.put(`${API_BASE_URL}/profiledesign/${profile._id}`, payload);
      else await axios.post(`${API_BASE_URL}/profiledesign`, payload);
      toast.success("Profile updated!");
      setIsEditingProfile(false);
      setProfile(payload);
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile");
    }
  };

  const handleCustomerChange = e => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSubmit = async e => {
    e.preventDefault();
    if (!email) return toast.error("Email not found. Please log in.");
    try {
      const payload = { ...customerForm, email };
      if (customer?._id) await axios.put(`${API_BASE_URL}/customer/${customer._id}`, payload);
      else await axios.post(`${API_BASE_URL}/customer`, payload);
      toast.success("Customer info updated!");
      setIsEditingCustomer(false);
      setCustomer(payload);
    } catch (err) {
      console.error(err);
      toast.error("Error saving customer info");
    }
  };

  const renderSocialIcon = (type, url) => {
    if (!url) return null;
    let Icon, bgColor, hoverBg, label;
    switch (type) {
      case "linkedin": Icon = FaLinkedin; bgColor = "bg-blue-600"; hoverBg = "hover:bg-blue-700"; label = "LinkedIn"; break;
      case "facebook": Icon = FaFacebook; bgColor = "bg-blue-500"; hoverBg = "hover:bg-blue-600"; label = "Facebook"; break;
      case "twitter": Icon = FaTwitter; bgColor = "bg-sky-500"; hoverBg = "hover:bg-sky-600"; label = "Twitter"; break;
      case "website": Icon = FaGlobe; bgColor = "bg-orange-500"; hoverBg = "hover:bg-orange-600"; label = "Website"; break;
      default: return null;
    }
    return (
      <a key={type} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" title={label}
        className={`${bgColor} ${hoverBg} text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110`}>
        <Icon size={20} />
      </a>
    );
  };

  if (loading) return <p className="text-center mt-10 text-orange-600 animate-pulse font-medium">Loading profile...</p>;
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Access Error</h2>
      <p className="text-red-700 mb-6">{error}</p>
      <button onClick={logout} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Back to Login</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-10 border border-orange-100">
      <Toaster position="top-right" />

      {/* Cover */}
      <div className="relative h-56 md:h-72 bg-gradient-to-r from-orange-100 to-orange-200">
        {profileForm.coverImage
          ? <img src={profileForm.coverImage} alt="Cover" className="w-full h-full object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center text-3xl text-orange-700 font-bold">Welcome!</div>
        }
      </div>

      {/* Avatar & Basic Info */}
      <div className="relative p-6 md:p-10">
        <div className="absolute -top-16 left-6 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img src={profileForm.avatar || customer?.photo || "https://via.placeholder.com/150"} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="ml-36 space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">{customerForm.name}</h1>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-500">{ROLE_LABELS[customerForm.role]}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-3">
            <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:scale-105 transition-transform" style={{ background: `linear-gradient(90deg, ${ORANGE_PALETTE.vivid}, ${ORANGE_PALETTE.bright})` }}>
              <FaEdit /> {isEditingProfile ? "Cancel" : "Edit Profile"}
            </button>
            <button onClick={() => setIsEditingCustomer(!isEditingCustomer)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:scale-105 transition-transform bg-blue-500">
              <FaEdit /> {isEditingCustomer ? "Cancel" : "Edit Customer"}
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-transform hover:scale-105">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="p-6 space-y-4 md:p-10">
        {/* Profile Info */}
        <div className="border rounded-lg p-4 bg-orange-50">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapseProfile(!collapseProfile)}>
            <h2 className="font-bold text-lg text-orange-700">Profile Info</h2>
            {collapseProfile ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {collapseProfile && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <p><strong>Title:</strong> {profileForm.title || "N/A"}</p>
              <p><strong>Location:</strong> {profileForm.location || "N/A"}</p>
              <p><strong>City:</strong> {profileForm.city || "N/A"}</p>
              <p><strong>Phone:</strong> {profileForm.phone || "N/A"}</p>
              <p className="col-span-2"><strong>Bio:</strong> {profileForm.bio || "N/A"}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="border rounded-lg p-4 bg-orange-50">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapseSkills(!collapseSkills)}>
            <h2 className="font-bold text-lg text-orange-700">Skills</h2>
            {collapseSkills ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {collapseSkills && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profileForm.skills.length === 0 && <p className="text-gray-500">No skills added</p>}
              {profileForm.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">{skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="border rounded-lg p-4 bg-orange-50">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapseSocial(!collapseSocial)}>
            <h2 className="font-bold text-lg text-orange-700">Social Links</h2>
            {collapseSocial ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {collapseSocial && (
            <div className="mt-3 flex flex-wrap gap-3">
              {Object.entries(profileForm.socialLinks).map(([type, url]) => renderSocialIcon(type, url))}
              {Object.values(profileForm.socialLinks).every(url => !url) && <p className="text-gray-500">No social links added</p>}
            </div>
          )}
        </div>
      </div>

      {/* Edit Forms */}
      {isEditingProfile && (
        <form onSubmit={handleProfileSubmit} className="p-6 md:p-10 bg-gray-50 border-t border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={profileForm.title} onChange={handleProfileChange} placeholder="Title" className="w-full border p-2 rounded" />
          <input name="location" value={profileForm.location} onChange={handleProfileChange} placeholder="Location" className="w-full border p-2 rounded" />
          <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} placeholder="Bio" className="w-full border p-2 rounded col-span-1 md:col-span-2" />
          <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="Phone" className="w-full border p-2 rounded" />
          <input name="city" value={profileForm.city} onChange={handleProfileChange} placeholder="City" className="w-full border p-2 rounded" />
          <input name="avatar" value={profileForm.avatar} onChange={handleProfileChange} placeholder="Avatar URL" className="w-full border p-2 rounded" />
          <input name="coverImage" value={profileForm.coverImage} onChange={handleProfileChange} placeholder="Cover Image URL" className="w-full border p-2 rounded col-span-1 md:col-span-2" />
          {["linkedin", "facebook", "twitter", "website"].map(key => (
            <input key={key} name={`socialLinks.${key}`} value={profileForm.socialLinks[key]} onChange={handleProfileChange} placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`} className="w-full border p-2 rounded" />
          ))}

          <div className="col-span-1 md:col-span-2 space-y-2">
            <div className="flex gap-2">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add skill" className="border p-2 rounded flex-1" />
              <button type="button" onClick={handleSkillAdd} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileForm.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => handleSkillRemove(skill)} className="text-orange-600 hover:text-orange-800 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded mt-2 hover:bg-orange-700 transition col-span-1 md:col-span-2">Save Profile</button>
        </form>
      )}

      {isEditingCustomer && (
        <form onSubmit={handleCustomerSubmit} className="p-6 md:p-10 bg-gray-50 border-t border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={customerForm.name} onChange={handleCustomerChange} placeholder="Name" className="w-full border p-2 rounded" />
          <input name="phone" value={customerForm.phone} onChange={handleCustomerChange} placeholder="Phone" className="w-full border p-2 rounded" />
          <input name="city" value={customerForm.city} onChange={handleCustomerChange} placeholder="City" className="w-full border p-2 rounded" />
          <select name="role" value={customerForm.role} onChange={handleCustomerChange} className="w-full border p-2 rounded">
            {Object.keys(ROLE_LABELS).map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mt-2 hover:bg-blue-700 transition col-span-1 md:col-span-2">Save Customer</button>
        </form>
      )}
    </div>
  );
};

export default ProfileLinkedIn;
