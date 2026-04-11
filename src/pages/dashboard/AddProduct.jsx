import React, { useState } from "react";
import axios from "axios";
import apis from "../../config/apis";
import { useNavigate } from "react-router-dom";
import {
  FaTag,
  FaTrademark,
  FaList,
  FaPoundSign,
  FaFileAlt,
  FaBoxes,
  FaAlignLeft,
  FaTrash,
  FaCloudUploadAlt,
  FaArrowLeft,
  FaPlusCircle,
} from "react-icons/fa";
import { successToast, errorToast } from "../../functions/toastify.js";
import { motion, AnimatePresence } from "framer-motion";

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", brand: "", category: "", price: "", description: "", subTitle: "", stock: ""
  });

  const getToken = () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      return auth.token || auth?.user?.token;
    } catch { return null; }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      errorToast("Max 10 images allowed!");
      return;
    }
    setImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleImage = async (file, token) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const { data } = await axios.post(
            `${apis.prod}/upload-image`,
            { image: reader.result },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          resolve({ url: data.url, key: data.key });
        } catch (err) { reject(err); }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = getToken();
    if (!token) { errorToast("Please login first!"); setUploading(false); return; }

    try {
      let uploadedImages = [];
      if (images.length > 0) {
        uploadedImages = await Promise.all(images.map(img => uploadSingleImage(img, token)));
      }

      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: uploadedImages,
      };

      const { data } = await axios.post(apis.prod, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.ok) {
        successToast("Product added successfully!");
        navigate("/view-products");
      } else {
        errorToast(data.error || "Failed to add product.");
      }
    } catch (error) {
      errorToast("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pt-2">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 mt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
          >
            <FaArrowLeft /> Back to List
          </button>
          <div className="text-right">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create <span className="text-indigo-600">Product</span></h1>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Inventory Management System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-slate-800 font-black text-lg mb-6 flex items-center gap-2">
                <FaTag className="text-indigo-500" /> Basic Information
              </h3>
              
              <div className="space-y-5">
                <InputField icon={<FaTag />} name="title" value={form.title} onChange={handleChange} label="Product Title" placeholder="e.g. Wireless Noise Cancelling Headphones" required />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField icon={<FaTrademark />} name="brand" value={form.brand} onChange={handleChange} label="Brand" placeholder="e.g. Sony" required />
                  <InputField icon={<FaList />} name="category" value={form.category} onChange={handleChange} label="Category" placeholder="e.g. Electronics" required />
                </div>

                <InputField icon={<FaAlignLeft />} name="subTitle" value={form.subTitle} onChange={handleChange} label="Short Tagline" placeholder="e.g. Experience pure sound without distractions" />

                <div>
                  <label className="block text-[13px] font-black text-slate-700 mb-2 uppercase tracking-tight">Full Description</label>
                  <div className="relative group">
                    <FaFileAlt className="absolute left-4 top-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[150px] text-slate-600 font-medium placeholder:text-slate-300 transition-all"
                      placeholder="Write detailed product features and specifications..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Media */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
               <h3 className="text-slate-800 font-black text-lg mb-6 flex items-center gap-2">
                <FaPoundSign className="text-indigo-500" /> Inventory & Price
              </h3>
              <div className="space-y-5">
                <InputField icon={<FaPoundSign />} name="price" type="number" value={form.price} onChange={handleChange} label="Unit Price (£)" placeholder="0.00" required />
                <InputField icon={<FaBoxes />} name="stock" type="number" min="0" value={form.stock} onChange={handleChange} label="Total Stock" placeholder="Quantity" required />
              </div>
            </div>

            {/* Media Upload Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
               <h3 className="text-slate-800 font-black text-lg mb-2 flex items-center gap-2">
                <FaCloudUploadAlt className="text-indigo-500" /> Media
              </h3>
              <p className="text-slate-400 text-[11px] font-bold mb-4 uppercase tracking-tighter">Recommended: 1080x1080px (Max 10)</p>
              
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FaCloudUploadAlt className="mx-auto text-3xl text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm font-bold tracking-tight">Drop images or <span className="text-indigo-600">Click</span></p>
              </div>

              {/* Previews */}
              <AnimatePresence>
                {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                    {previewUrls.map((url, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                            <img src={url} alt="preview" className="w-full h-20 object-cover rounded-xl border border-slate-100 shadow-sm" />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-1 -right-1 bg-rose-500 text-white p-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75"
                            >
                                <FaTrash size={10} />
                            </button>
                        </motion.div>
                    ))}
                    </div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {uploading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <FaPlusCircle />
                        <span>PUBLISH PRODUCT</span>
                    </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

// Sub-component for clean inputs
const InputField = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-[13px] font-black text-slate-700 mb-2 uppercase tracking-tight">{label}</label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </span>
      <input 
        {...props} 
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 font-bold placeholder:text-slate-300 transition-all" 
      />
    </div>
  </div>
);

export default AddProduct;