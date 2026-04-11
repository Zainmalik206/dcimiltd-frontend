import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apis from "../config/apis"; // ✅ API config
import ProductCard from "../layouts/ProductCard"; // ✅ existing styled card

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${apis.prod}?keyword=${encodeURIComponent(keyword)}`);
        console.log("🔍 Searching:", res.data);

        if (res.data.ok && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        Search results for:{" "}
        <span className="text-orange-600 capitalize">{keyword}</span>
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-600 text-lg animate-pulse">Loading results...</p>
      )}

      {/* Error State */}
      {error && <p className="text-red-600 text-lg">{error}</p>}

      {/* No Results */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-8">
          No products found for "<span className="font-semibold">{keyword}</span>"
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
