import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Example mock database for auto-fill
const mockProducts = [
  {
    name: "Lipstick Rouge",
    sku: "LIP123",
    brand: "BeautyCo",
    category: "Makeup",
    subcategory: "Lips",
    price: "1200",
    stock: "50",
    weight: "0.05",
    dimensions: "5x2x1 cm",
    description: "High-quality lipstick with smooth finish.",
    images: [
      "https://example.com/lip1.jpg",
      "https://example.com/lip2.jpg"
    ],
    tags: ["lipstick", "beauty", "makeup"],
    variants: [
      { color: "Red", size: "Standard", price: "1200", stock: "20" },
      { color: "Pink", size: "Standard", price: "1200", stock: "30" },
    ],
    metaTitle: "Lipstick Rouge - BeautyCo",
    metaDescription: "Shop Lipstick Rouge by BeautyCo. Smooth and long-lasting.",
    metaKeywords: "lipstick, rouge, beauty",
    rating: 4
  },
  {
    name: "Mascara Max",
    sku: "MASC456",
    brand: "Glamour",
    category: "Makeup",
    subcategory: "Eyes",
    price: "950",
    stock: "70",
    weight: "0.07",
    dimensions: "12x3x2 cm",
    description: "Volumizing mascara for dramatic lashes.",
    images: [
      "https://example.com/mascara1.jpg",
      "https://example.com/mascara2.jpg"
    ],
    tags: ["mascara", "eyes", "beauty"],
    variants: [
      { color: "Black", size: "Standard", price: "950", stock: "50" },
      { color: "Brown", size: "Standard", price: "950", stock: "20" },
    ],
    metaTitle: "Mascara Max - Glamour",
    metaDescription: "Glamour Mascara Max for full, voluminous lashes.",
    metaKeywords: "mascara, eyes, glamour",
    rating: 5
  }
];

const MakeUpForm = () => {
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

  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [variantInput, setVariantInput] = useState({ color: "", size: "", price: "", stock: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // Auto-fill when name changes
  useEffect(() => {
    const matched = mockProducts.find(p => p.name.toLowerCase() === formData.name.toLowerCase());
    if (matched) {
      setFormData(prev => ({
        ...prev,
        ...matched
      }));
    }
  }, [formData.name]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Images
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, imageInput] }));
    setImageInput("");
  };
  const handleRemoveImage = idx =>
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  // Tags
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };
  const handleRemoveTag = idx =>
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));

  // Variants
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || !variantInput.price) {
      Swal.fire("Warning", "Fill all variant fields!", "warning");
      return;
    }
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { ...variantInput }] }));
    setVariantInput({ color: "", size: "", price: "", stock: "" });
  };
  const handleRemoveVariant = idx =>
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Please fill required fields and add at least one image.", "warning");
      return;
    }

    if (formData.hasDiscount) {
      if (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
        Swal.fire("Invalid Discount", "Discount price must be less than regular price.", "warning");
        return;
      }
    }

    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/makeUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        setFormData({
          name: "", sku: "", brand: "", category: "", subcategory: "", price: "",
          hasDiscount: false, discountPrice: "", discountStart: "", discountEnd: "",
          stock: "", status: "published", featured: false, weight: "", dimensions: "",
          description: "", images: [], tags: [], variants: [], metaTitle: "",
          metaDescription: "", metaKeywords: "", relatedProducts: [], rating: 0,
        });
        setImageInput("");
        setTagInput("");
        setVariantInput({ color: "", size: "", price: "", stock: "" });
        setHoverRating(0);
      } else {
        Swal.fire("Error", data.error || "Failed to add product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error. Please try again.", "error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white shadow-lg p-6 rounded-lg">
      <div className="text-2xl font-bold text-orange-600 mb-6 text-center">Add Beauty Product</div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

        {/* Product Info */}
        <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="sku" placeholder="SKU / Code" value={formData.sku} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none">
          <option value="">Category *</option>
          <option value="Makeup">Makeup</option>
          <option value="Skincare">Skincare</option>
          <option value="Fragrance">Fragrance</option>
        </select>
        <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="number" name="price" placeholder="Price (৳) *" value={formData.price} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>

        {/* Discount */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="hasDiscount" checked={formData.hasDiscount} onChange={handleChange} className="w-4 h-4"/>
          <span>Apply Discount</span>
        </div>
        {formData.hasDiscount && (
          <>
            <input type="number" name="discountPrice" placeholder="Discount Price" value={formData.discountPrice} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
            <input type="date" name="discountStart" value={formData.discountStart} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
            <input type="date" name="discountEnd" value={formData.discountEnd} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
          </>
        )}

        {/* Featured & Status */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4"/>
          <span>Featured Product</span>
        </div>
        <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>

        {/* Description */}
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} rows="4" className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>

        {/* Dimensions */}
        <input type="text" name="dimensions" placeholder="Dimensions (L x W x H)" value={formData.dimensions} onChange={handleChange} className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>

        {/* Images */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Product Images *</h4>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Image URL" value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="border p-2 rounded flex-1 focus:ring-2 focus:ring-orange-500 outline-none"/>
            <button type="button" onClick={handleAddImage} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition">Add Image</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {formData.images.map((img,i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Product ${i+1}`} className="h-32 w-full object-cover rounded border"/>
                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Product Variants</h4>
          <div className="flex gap-2 mb-2 flex-wrap">
            <input type="text" placeholder="Color" value={variantInput.color} onChange={(e) => setVariantInput({...variantInput, color:e.target.value})} className="border p-2 rounded flex-1 min-w-[100px]"/>
            <input type="text" placeholder="Size" value={variantInput.size} onChange={(e) => setVariantInput({...variantInput, size:e.target.value})} className="border p-2 rounded flex-1 min-w-[100px]"/>
            <input type="number" placeholder="Price" value={variantInput.price} onChange={(e) => setVariantInput({...variantInput, price:e.target.value})} className="border p-2 rounded flex-1 min-w-[100px]"/>
            <input type="number" placeholder="Stock" value={variantInput.stock} onChange={(e) => setVariantInput({...variantInput, stock:e.target.value})} className="border p-2 rounded flex-1 min-w-[100px]"/>
            <button type="button" onClick={handleAddVariant} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.variants.map((v,i) => (
              <div key={i} className="bg-orange-100 px-3 py-2 rounded flex gap-2 items-center">
                <span className="text-sm">{v.color}/{v.size} - ৳{v.price} (Stock: {v.stock})</span>
                <button type="button" onClick={() => handleRemoveVariant(i)} className="text-red-500 hover:text-red-700 font-bold text-lg">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Tags</h4>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Add tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => {if(e.key==="Enter"){e.preventDefault();handleAddTag();}}} className="border p-2 rounded flex-1 focus:ring-2 focus:ring-orange-500 outline-none"/>
            <button type="button" onClick={handleAddTag} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition">Add Tag</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t,i) => (
              <div key={i} className="bg-orange-100 px-3 py-1 rounded flex gap-2 items-center">
                <span className="text-sm">{t}</span>
                <button type="button" onClick={() => handleRemoveTag(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Rating</h4>
          <div className="flex items-center gap-1 text-xl">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                className={`transition text-2xl ${star <= (hoverRating || formData.rating) ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{formData.rating} / 5</span>
          </div>
        </div>

        {/* SEO */}
        <input type="text" name="metaTitle" placeholder="Meta Title" value={formData.metaTitle} onChange={handleChange} className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>
        <textarea name="metaDescription" placeholder="Meta Description" value={formData.metaDescription} onChange={handleChange} rows="2" className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="metaKeywords" placeholder="Meta Keywords (comma separated)" value={formData.metaKeywords} onChange={handleChange} className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>

        {/* Submit */}
        <button type="submit" className="md:col-span-2 py-3 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default MakeUpForm;
