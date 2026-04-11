// src/pages/SinglePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, fetchProducts } from "../redux/actions/prodActions";
import { addToCart } from "../redux/slices/cartSlice";
import Loader from "../layouts/Loader";
import Rating from "../layouts/Rating";
import ProductCard from "../layouts/ProductCard";
import { toast } from "react-toastify";
import { addCommas } from "../functions/func";
import ReviewFormPro from "../layouts/ReviewFormPro";
import ReviewsList from "../layouts/ReviewsList";
import ReviewSnapshot from "../layouts/ReviewSnapshot";
import { reviewAPI } from "../api/reviewAPI";
import { wishlistAPI } from "../api/wishlistAPI";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { successToast } from "../functions/toastify";

const SinglePage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product = {}, loading } = useSelector(s => s.prodSlice);
  const { products } = useSelector(s => s.prodSlice);
  const { cartItems } = useSelector(s => s.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const images = product.images || [];
  const selectedImage = images[selectedImageIndex]?.url || "/placeholder.png";

  const cartItem = cartItems.find(i => i._id === id);
  const cartQty = cartItem?.quantity || 0;
  const availableStock = product.stock - cartQty;

  const goToPrev = () => setSelectedImageIndex(i => i === 0 ? images.length - 1 : i - 1);
  const goToNext = () => setSelectedImageIndex(i => i === images.length - 1 ? 0 : i + 1);
  const goToImage = (i) => setSelectedImageIndex(i);

  const loadReviews = async () => {
    const data = await reviewAPI.get(id);
    if (data.ok) {
      setReviews(data.reviews || []);
      setAvgRating(data.ratings || 0);
    }
  };

  const loadWishlist = async () => {
    const res = await wishlistAPI.get();
    if (res.ok) setWishlist(new Set(res.wishlist.map(p => p._id)));
    setLoadingWishlist(false);
  };

  const toggleWishlist = async (productId) => {
    const res = wishlist.has(productId)
      ? await wishlistAPI.remove(productId)
      : await wishlistAPI.add(productId);
    if (res.ok) {
      loadWishlist();
      toast.success(res.message || "Wishlist updated", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchProducts());
      loadReviews();
      loadWishlist();
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (availableStock <= 0 || addingToCart) return;
    setAddingToCart(true);
    dispatch(addToCart({ ...product, quantity }));
    await dispatch(fetchProduct(id));
    setAddingToCart(false);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p._id !== id)
    .slice(0, 4);

  if (loading || loadingWishlist) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
        
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* ========== 1. IMAGE SECTION (ORIGINAL SIZE & LOGIC) ========== */}
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-xl border border-slate-100 shadow-lg group">
              
              {/* Original Main Image with original zoom and original dimensions */}
              <div 
                className="relative cursor-zoom-in"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (!img) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = "scale(2.2)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = "scale(1)";
                    img.style.transformOrigin = "center";
                  }
                }}
              >
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.title}
                  // Original height: h-96 md:h-[520px]
                  className="w-full h-96 md:h-[520px] object-contain transition-transform duration-300 mix-blend-multiply"
                />
              </div>

              {/* Original Left/Right Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all z-10"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Original Zoom Hint */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Hover to zoom
              </div>
            </div>

            {/* Original Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar justify-center py-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => goToImage(i)}
                    className="flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className={`w-20 h-20 border-2 rounded-2xl transition-all ${
                        selectedImageIndex === i
                          ? "border-indigo-600 shadow-md ring-4 ring-indigo-50"
                          : "border-gray-200 hover:border-indigo-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS SECTION (Teri purani styling but clean details) */}
          <div className="flex-1 space-y-5">
            <div>
                <span className="text-xs font-black tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
                    {product.brand}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-2">
                  {product.title}
                </h2>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Rating rating={avgRating || product.ratings || 0} />
              <span className="text-slate-400 text-sm font-bold">({reviews.length} reviews)</span>
            </div>

            <div className="flex items-end gap-3 pt-2">
                <span className="text-4xl font-black text-slate-900">£{addCommas(product.price)}</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${
                    availableStock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                    {availableStock > 0 ? `${availableStock} in stock` : "Out of stock"}
                </span>
            </div>

            <p className="text-slate-500 leading-relaxed text-lg font-medium pt-3">
                {product.description}
            </p>

            {/* Purchase Actions */}
            <div className="flex items-center gap-4 mt-10">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 w-fit border border-slate-200">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center font-bold text-slate-600 hover:text-indigo-600">-</button>
                    <span className="w-10 text-center font-black text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(availableStock, q + 1))} className="w-12 h-12 flex items-center justify-center font-bold text-slate-600 hover:text-indigo-600" disabled={quantity >= availableStock}>+</button>
                </div>
                
                <button
                    onClick={handleAddToCart}
                    disabled={availableStock <= 0 || addingToCart}
                    className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl font-black text-white transition-all shadow-xl active:scale-95 ${
                        availableStock <= 0 || addingToCart
                        ? "bg-slate-300 cursor-not-allowed shadow-none"
                        : "bg-slate-900 hover:bg-indigo-600 shadow-slate-200"
                    }`}
                >
                    {addingToCart ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <ShoppingBag size={18} />
                            {availableStock <= 0 ? "Out of Stock" : "Add to Bag"}
                        </>
                    )}
                </button>
            </div>

            {/* ========== 2. ADD TO WISHLIST BUTTON (NEW) ========== */}
            <button
              onClick={() => toggleWishlist(id)}
              className={`w-full mt-4 flex items-center justify-center gap-3 py-3 rounded-xl border-2 font-black transition-all ${
                wishlist.has(id)
                  ? "bg-rose-50 border-rose-100 text-rose-600"
                  : "bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:text-indigo-600"
              }`}
            >
              <Heart size={18} fill={wishlist.has(id) ? "currentColor" : "none"} />
              {wishlist.has(id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>

        {/* Reviews Section (Width adjusted from original) */}
        <div className="mt-32 pt-20 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-black text-slate-900 mb-12 text-center">Customer <span className="text-indigo-600">Experience</span></h3>
            <div className="grid md:grid-cols-12 gap-16">
                <div className="md:col-span-5 lg:col-span-4">
                    <ReviewSnapshot 
                        ratingDist={reviews.reduce((acc, r) => { acc[r.rating] = (acc[r.rating] || 0) + 1; return acc; }, {})}
                        totalReviews={reviews.length}
                        avgRating={avgRating}
                    />
                </div>
                <div className="md:col-span-7 lg:col-span-8 space-y-12">
                    <ReviewFormPro productId={id} onReviewAdded={loadReviews} />
                    <ReviewsList reviews={reviews} />
                </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (Kept from original) */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-bold mb-6">Related Products</h3>
                <div className="h-px flex-1 mx-8 bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  inWishlist={wishlist.has(p._id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SinglePage;