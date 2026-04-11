import React, { useEffect, useState } from "react";
import axios from "axios";
import apis from "../../config/apis";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTag, FaTrademark, FaList, FaPoundSign, FaFileAlt,
  FaBoxes, FaAlignLeft, FaStar, FaTrash, FaImage, FaArrowLeft, FaCloudUploadAlt
} from "react-icons/fa";
import { successToast, errorToast } from "../../functions/toastify.js";
import Loader from "../../layouts/Loader"; // Agar aapke paas loader component hai

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", brand: "", category: "", price: "", description: "", subTitle: "", stock: "", ratings: ""
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getToken = () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      return auth.token || auth?.user?.token;
    } catch { return null; }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${apis.prod}/${id}`);
        if (data.ok && data.product) {
          const p = data.product;
          setForm({
            title: p.title || "", brand: p.brand || "", category: p.category || "",
            price: p.price || "", description: p.description || "", subTitle: p.subTitle || "",
            stock: p.stock || "", ratings: p.ratings || ""
          });
          setExistingImages(p.images || []);
        }
      } catch (error) {
        errorToast("Failed to fetch product!");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + newImages.length > 10) {
      errorToast("Max 10 images allowed!");
      return;
    }
    setNewImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setNewPreviews(prev => [...prev, ...urls]);
  };

  const removeExisting = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  const removeNew = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newPreviews[index]);
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleImage = async (file, token) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const { data } = await axios.post(`${apis.prod}/upload-image`, { image: reader.result }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          resolve({ url: data.url, key: data.key });
        } catch (err) { reject(err); }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = getToken();
    if (!token) { errorToast("Login first!"); setUploading(false); return; }

    try {
      let uploadedNew = [];
      if (newImages.length > 0) {
        uploadedNew = await Promise.all(newImages.map(img => uploadSingleImage(img, token)));
      }

      const finalImages = [...existingImages, ...uploadedNew];

      const updatedProduct = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        ratings: Number(form.ratings),
        images: finalImages
      };

      const { data } = await axios.put(`${apis.prod}/${id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.ok) {
        successToast("Product updated successfully!");
        navigate("/view-products");
      } else {
        errorToast(data.error || "Update failed!");
      }
    } catch (error) {
      errorToast("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit <span className="text-indigo-600">Product</span></h1>
                <p className="text-slate-500 font-medium">Update details and manage your inventory</p>
            </div>
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
            >
                <FaArrowLeft size={14}/> Back to List
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-6">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={<FaTag />} name="title" value={form.title} onChange={handleChange} label="Product Title" required placeholder="e.g. Premium Wireless Headphones" />
              <InputField icon={<FaTrademark />} name="brand" value={form.brand} onChange={handleChange} label="Brand Name" required placeholder="e.g. DC IMI LTD" />
              <InputField icon={<FaList />} name="category" value={form.category} onChange={handleChange} label="Category" required placeholder="e.g. Electronics" />
              <InputField icon={<FaPoundSign />} type="number" name="price" value={form.price} onChange={handleChange} label="Selling Price" required placeholder="0.00" />
              <InputField icon={<FaAlignLeft />} name="subTitle" value={form.subTitle} onChange={handleChange} label="Short Subtitle" placeholder="Brief tagline..." />
              <div className="grid grid-cols-2 gap-4">
                <InputField icon={<FaBoxes />} type="number" name="stock" value={form.stock} onChange={handleChange} label="Stock" required />
                <InputField icon={<FaStar />} type="number" step="0.1" name="ratings" value={form.ratings} onChange={handleChange} label="Ratings" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
              <div className="relative group">
                <FaFileAlt className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all min-h-[120px] font-medium"
                  placeholder="Write something about the product..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Media Management Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">Product Media</h3>
                <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Max 10 Images</span>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-4">Currently Published</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-100">
                      <img src={img.url} alt="current" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeExisting(i)} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-xl hover:bg-rose-500 transition-colors">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-8 transition-colors hover:border-indigo-400 bg-slate-50/50">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <FaCloudUploadAlt size={28} />
                    </div>
                    <p className="text-slate-900 font-bold">Click to upload new images</p>
                    <p className="text-slate-400 text-sm font-medium">PNG, JPG or WebP (Recommend 800x1000px)</p>
                </div>
            </div>

            {/* New Previews */}
            {newPreviews.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter mb-4">To be Uploaded</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {newPreviews.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-indigo-100 ring-4 ring-indigo-50">
                      <img src={url} alt="new" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeNew(i)} className="bg-white text-rose-500 p-3 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 h-14 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                uploading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200"
              }`}
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
              ) : (
                <>Save Changes & Update</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Custom Input Field for Premium Look
const InputField = ({ icon, label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-bold text-slate-900 placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default EditProduct;