// File: ContactManager.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Mail,
  Phone,
  AlertCircle,
  Search,
  X,
  CheckSquare,
  Square,
} from "lucide-react";

const API_URL = "https://shopnest-serveres.onrender.com/contact";

// 🔸 Orange Color Palette
const ORANGE_PALETTE = {
  vivid: "#FF6600",
  bright: "#FFA500",
  tangerine: "#FF7F32",
  peach: "#FFF2E5",
  burnt: "#CC5500",
};

// Inquiry style for card borders
const getInquiryStyle = (type) => {
  switch (type) {
    case "support":
      return "border-blue-300 bg-blue-50";
    case "sales":
      return "border-green-300 bg-green-50";
    case "general":
      return "border-purple-300 bg-purple-50";
    default:
      return "border-orange-300 bg-orange-50";
  }
};

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setContacts(json.data || []);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  // Bulk delete
  const handleDeleteSelected = async () => {
    if (!selectedContacts.length) return;
    if (!window.confirm("Delete selected contacts?")) return;
    try {
      await Promise.all(
        selectedContacts.map((id) =>
          fetch(`${API_URL}/${id}`, { method: "DELETE" })
        )
      );
      setContacts((prev) =>
        prev.filter((c) => !selectedContacts.includes(c._id))
      );
      setSelectedContacts([]);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Select / Deselect contact
  const toggleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const isSelected = (id) => selectedContacts.includes(id);

  // Select All / Deselect All
  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c._id));
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white text-gray-900">
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 text-center border-b border-gray-200">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"
        >
          Contact Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mt-3"
        >
          Stay on top of your customer inquiries ✨
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-2xl border border-orange-200 shadow">
            <h3 className="text-2xl font-bold text-orange-500">
              {contacts.length}
            </h3>
            <p className="text-gray-500 text-sm">Total Inquiries</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 shadow">
            <h3 className="text-2xl font-bold text-blue-600">
              {contacts.filter((c) => c.inquiryType === "support").length}
            </h3>
            <p className="text-gray-500 text-sm">Support</p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl border border-green-200 shadow">
            <h3 className="text-2xl font-bold text-green-600">
              {contacts.filter((c) => c.inquiryType === "sales").length}
            </h3>
            <p className="text-gray-500 text-sm">Sales</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200 shadow">
            <h3 className="text-2xl font-bold text-purple-600">
              {contacts.filter((c) => c.inquiryType === "general").length}
            </h3>
            <p className="text-gray-500 text-sm">General</p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {contacts.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSelectAll}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 rounded-xl text-white font-semibold hover:scale-105 transition"
            >
              {selectedContacts.length === contacts.length ? (
                <>
                  <Square size={16} /> Deselect All
                </>
              ) : (
                <>
                  <CheckSquare size={16} /> Select All
                </>
              )}
            </motion.button>
          )}

          {selectedContacts.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-500 px-5 py-2 rounded-xl text-white font-semibold hover:scale-105 transition"
            >
              <Trash2 size={16} /> Delete ({selectedContacts.length})
            </motion.button>
          )}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact, index) => {
          const selected = isSelected(contact._id);
          return (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className={`relative border rounded-3xl p-6 shadow-sm transition-all ${
                getInquiryStyle(contact.inquiryType)
              } ${selected ? "ring-2 ring-orange-500" : "hover:ring-1 hover:ring-orange-300"}`}
            >
              <div className="absolute top-4 left-4">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSelect(contact._id)}
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
              </div>

              <span className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-white/60 text-gray-800 border border-gray-300">
                {contact.inquiryType || "N/A"}
              </span>

              <div
                onClick={() => setActiveContact(contact)}
                className="cursor-pointer mt-4"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {contact.name}
                  {contact.inquiryType === "support" && (
                    <AlertCircle className="text-blue-500" size={18} />
                  )}
                </h3>
                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} /> {contact.email}
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Phone size={16} /> {contact.phone || "No phone"}
                </p>
                <p className="text-gray-700 font-medium">{contact.subject}</p>
                <p className="text-gray-600 italic text-sm mt-2">
                  “{contact.message.substring(0, 80)}...”
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeContact && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white text-gray-900 max-w-lg w-full p-8 rounded-2xl shadow-2xl relative border border-orange-300"
            >
              <button
                onClick={() => setActiveContact(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-orange-600"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold mb-2">{activeContact.name}</h2>
              <p className="text-gray-600 mb-2">{activeContact.email}</p>
              <p className="text-gray-600 mb-4">
                {activeContact.phone || "No phone"}
              </p>
              <h3 className="font-semibold text-lg mb-1 text-orange-600">
                {activeContact.subject}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {activeContact.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(activeContact.date).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
