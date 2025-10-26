// File: pages/AllProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AllProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://shopnest-ecom.onrender.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#FF6600] mb-4">{product.name}</h1>
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-80 rounded-lg mb-6 shadow-md"
        />
      )}
      <p className="text-lg text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-bold text-gray-900">৳{product.price}</p>
    </div>
  );
};

export default AllProductDetails;
