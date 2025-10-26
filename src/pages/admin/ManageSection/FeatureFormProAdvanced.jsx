import React, { useState } from "react";
import Swal from "sweetalert2";

const collections = [
  "smartphones",
  "sportsproducts",
  "newproducts",
  "menproducts",
  "hotproducts",
  "womentproducts",
  "glosoryproducts",
];

const FeatureFormProAdvanced = () => {
  const [collection, setCollection] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    images: [],
    tags: [],
    variants: [],
    rating: 0,
  });

  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [variantInput, setVariantInput] = useState({ color: "", size: "", price: "", stock: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Images
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput] }));
    setImageInput("");
  };

  // Tags
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };

  // Variants
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || !variantInput.price) {
      Swal.fire("Warning", "Fill all variant fields!", "warning");
      return;
    }
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, { ...variantInput }] }));
    setVariantInput({ color: "", size: "", price: "", stock: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collection) {
      Swal.fire("Select Collection", "Please select a product collection", "warning");
      return;
    }
    if (!formData.name || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Name, price, and at least one image are required.", "warning");
      return;
    }

    try {
      const res = await fetch(`https://shopnest-ecom.onrender.com/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", `Product added to ${collection} successfully!`, "success");
        setFormData({
          name: "",
          sku: "",
          brand: "",
          category: "",
          subcategory: "",
          price: "",
          stock: "",
          images: [],
          tags: [],
          variants: [],
          rating: 0,
        });
        setImageInput("");
        setTagInput("");
        setVariantInput({ color: "", size: "", price: "", stock: "" });
      } else {
        Swal.fire("Error", data.error || "Failed to add product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error. Try again.", "error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Add Product</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Collection Selection */}
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="">Select Collection *</option>
          {collections.map((col) => (
            <option key={col} value={col}>
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </option>
          ))}
        </select>

        {/* Basic Product Info */}
        <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border p-2 rounded outline-none"/>
        <input type="number" name="price" placeholder="Price *" value={formData.price} onChange={handleChange} className="border p-2 rounded outline-none"/>
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="border p-2 rounded outline-none"/>

        {/* Images */}
        <div className="md:col-span-2">
          <div className="flex gap-2">
            <input type="text" placeholder="Image URL" value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="border p-2 rounded flex-1"/>
            <button type="button" onClick={handleAddImage} className="bg-orange-500 text-white px-3 rounded">Add Image</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="h-20 w-20 object-cover rounded border"/>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-2 flex gap-2">
          <input type="text" placeholder="Add Tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="border p-2 rounded flex-1"/>
          <button type="button" onClick={handleAddTag} className="bg-orange-500 text-white px-3 rounded">Add Tag</button>
        </div>

        {/* Variants */}
        <div className="md:col-span-2 flex gap-2 flex-wrap">
          <input type="text" placeholder="Color" value={variantInput.color} onChange={(e) => setVariantInput({ ...variantInput, color: e.target.value })} className="border p-2 rounded"/>
          <input type="text" placeholder="Size" value={variantInput.size} onChange={(e) => setVariantInput({ ...variantInput, size: e.target.value })} className="border p-2 rounded"/>
          <input type="number" placeholder="Price" value={variantInput.price} onChange={(e) => setVariantInput({ ...variantInput, price: e.target.value })} className="border p-2 rounded"/>
          <input type="number" placeholder="Stock" value={variantInput.stock} onChange={(e) => setVariantInput({ ...variantInput, stock: e.target.value })} className="border p-2 rounded"/>
          <button type="button" onClick={handleAddVariant} className="bg-orange-500 text-white px-3 rounded">Add Variant</button>
        </div>

        {/* Submit */}
        <button type="submit" className="md:col-span-2 py-3 mt-4 bg-orange-500 text-white font-semibold rounded-lg">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default FeatureFormProAdvanced;
