// File: pages/AllProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const AllProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://shopnest-serveres.onrender.com/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#FF6600] mb-4">{product.name}</h1>
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-80 rounded-lg mb-6 shadow-md"
      />
      <p className="text-lg text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-bold">৳{product.price}</p>
    </div>
  );
};

export default AllProductDetails;
