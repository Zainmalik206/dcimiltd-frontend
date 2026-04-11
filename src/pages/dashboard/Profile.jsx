import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { successToast, errorToast } from "../../functions/toastify";
import apis from "../../config/apis";
import MetaData from "../../layouts/MetaData";
import { FaCamera, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Profile() {
  const [auth, setAuth] = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(`${apis.auth}/public-profile`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (data?.ok && data.user) {
        setFormData({
          ...data.user,
          dob: data.user.dob ? new Date(data.user.dob).toISOString().split("T")[0] : "",
        });
        setPreview(data.user.profile_picture);
      }
    } catch (err) {
      errorToast("Failed to load profile");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchProfile();
  }, [auth?.token]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["mobile_number"].includes(name)) value = value.replace(/\D/g, "");
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = { ...formData };
      if (updatedData.dob) updatedData.dob = new Date(updatedData.dob);

      const { data } = await axios.put(`${apis.auth}/update-profile`, updatedData, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (data?.ok) {
        successToast("Profile updated!");
        setAuth({ ...auth, user: data.user });
        setEditMode(false);
      } else errorToast(data?.error || "Update failed");
    } catch (err) {
      errorToast("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // Uploading Starts
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const { data } = await axios.put(
          `${apis.auth}/upload-image`,
          { image: reader.result },
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );

        if (data?.ok) {
          successToast("Photo updated!");
          setPreview(data.image.url);
          setAuth({
            ...auth,
            user: { ...auth.user, profile_picture: data.image.url },
          });
        }
      };
    } catch (err) {
      errorToast("Upload failed");
    } finally {
      setUploading(false); // Uploading Ends
    }
  };

  if (fetching) return <div className="p-10"><Skeleton height={40} width={200} /><Skeleton count={5} height={60} className="mt-4" /></div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-slate-800">
      <MetaData title="Account Settings" />

      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm">Manage your profile information and preferences.</p>
        </div>
        
        <button
          onClick={() => setEditMode(!editMode)}
          className={`mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${
            editMode ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {editMode ? <FaTimes /> : <FaEdit />}
          {editMode ? "Discard Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Left Side: Avatar with Uploading State */}
        <div className="lg:w-1/4 flex flex-col items-center lg:items-start">
          <div className="relative w-40 h-40 group">
            <div className={`w-full h-full rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-sm transition-all ${uploading ? "blur-[2px]" : ""}`}>
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100"><FaUser className="text-4xl text-slate-300" /></div>
              )}
            </div>

            {/* Uploading Spinner Overlay */}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 rounded-[2.5rem] z-10">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter text-slate-900">Uploading...</span>
              </div>
            )}

            {!uploading && (
              <label className="absolute -bottom-2 -right-2 bg-white shadow-lg p-3 rounded-2xl cursor-pointer border border-slate-100 hover:bg-slate-900 hover:text-white transition-all active:scale-90">
                <FaCamera size={18} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <div className="mt-6 text-center lg:text-left">
            <h2 className="text-xl font-bold text-slate-900">{auth?.user?.first_name} {auth?.user?.last_name}</h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Member since {new Date(auth?.user?.createdAt).getFullYear()}</p>
          </div>
        </div>

        {/* Right Side: Data Fields */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!editMode ? (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <ProfileRow icon={<FaUser />} label="First Name" value={auth?.user?.first_name} />
                <ProfileRow icon={<FaUser />} label="Last Name" value={auth?.user?.last_name} />
                <ProfileRow icon={<FaEnvelope />} label="Email Address" value={auth?.user?.email} />
                <ProfileRow icon={<FaPhone />} label="Phone Number" value={auth?.user?.mobile_number || "Not added"} />
                <ProfileRow icon={<FaMapMarkerAlt />} label="Location" value={`${auth?.user?.city || "---"}, ${auth?.user?.country || "---"}`} />
                <ProfileRow icon={<FaCalendarAlt />} label="Birthday" value={auth?.user?.dob ? new Date(auth.user.dob).toLocaleDateString("en-GB") : "Not added"} />
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-50/40 p-8 rounded-[2rem] border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditInput label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                  <EditInput label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                  <EditInput label="Mobile" name="mobile_number" value={formData.mobile_number} onChange={handleChange} />
                  <EditInput label="City" name="city" value={formData.city} onChange={handleChange} />
                  <EditInput label="Country" name="country" value={formData.country} onChange={handleChange} />
                  <EditInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleSave} 
                    disabled={loading} 
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : <FaSave />}
                    {loading ? "Processing..." : "Update Settings"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Components
const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
    <div className="text-slate-300 group-hover:text-slate-600 transition-colors">{icon}</div>
    <div className="flex-1 flex flex-col md:flex-row md:items-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-36">{label}</span>
      <span className="text-slate-800 font-semibold text-lg">{value || "---"}</span>
    </div>
  </div>
);

const EditInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input {...props} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-slate-700" />
  </div>
);

export default Profile;