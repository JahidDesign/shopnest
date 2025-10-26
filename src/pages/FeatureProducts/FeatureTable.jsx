import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const FeatureFormProAdvancedWithBackend = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    hasDiscount: false,
    discountPrice: "",
    discountStart: "",
    discountEnd: "",
    stock: "",
    status: "published",
    featured: false,
    weight: "",
    dimensions: "",
    description: "",
    images: [],
    tags: [],
    variants: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    relatedProducts: [],
    rating: 0,
  });

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null); // track _id for editing
  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [variantInput, setVariantInput] = useState({ color: "", size: "", price: "", stock: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    fetch("https://shopnest-ecom.onrender.com/featureProducts")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Please fill required fields and add at least one image.", "warning");
      return;
    }

    try {
      let res;
      if (editId) {
        // Update existing product
        res = await fetch(`https://shopnest-ecom.onrender.com/featureProducts/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new product
        res = await fetch("https://shopnest-ecom.onrender.com/featureProducts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      Swal.fire("Success", `Product ${editId ? "updated" : "added"} successfully!`, "success");

      // Refresh product list
      const updatedProducts = await fetch("https://shopnest-ecom.onrender.com/featureProducts").then((res) => res.json());
      setProducts(updatedProducts);

      // Reset form
      setFormData({
        name: "", sku: "", brand: "", category: "", subcategory: "", price: "",
        hasDiscount: false, discountPrice: "", discountStart: "", discountEnd: "",
        stock: "", status: "published", featured: false, weight: "", dimensions: "",
        description: "", images: [], tags: [], variants: [], metaTitle: "",
        metaDescription: "", metaKeywords: "", relatedProducts: [], rating: 0,
      });
      setEditId(null);
      setImageInput(""); setTagInput(""); setVariantInput({ color: "", size: "", price: "", stock: "" }); setHoverRating(0);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Network error", "error");
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://shopnest-ecom.onrender.com${_id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setProducts(products.filter((p) => p._id !== _id));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Form */}
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border p-2 rounded"/>
          <input type="text" name="sku" placeholder="SKU / Code" value={formData.sku} onChange={handleChange} className="border p-2 rounded"/>
          <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded">
            <option value="">Category *</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home & Garden</option>
            <option value="Sports">Sports</option>
          </select>
          <input type="number" name="price" placeholder="Price (৳) *" value={formData.price} onChange={handleChange} className="border p-2 rounded"/>
          <button type="submit" className="md:col-span-2 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg p-6 rounded-lg mt-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Products List</h2>
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-orange-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.category}</td>
                  <td className="border p-2">{p.price}</td>
                  <td className="border p-2">{p.stock}</td>
                  <td className="border p-2 text-center">{p.rating} ★</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureFormProAdvancedWithBackend;
