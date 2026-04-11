import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/actions/prodActions";
import { DataGrid } from "@mui/x-data-grid";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBoxOpen,
  FaLayerGroup,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../../config/apis";
import { successToast, errorToast } from "../../functions/toastify";
import Loader from "../../layouts/Loader";
import { motion } from "framer-motion";

const ViewProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.prodSlice || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      return auth.token || auth?.user?.token;
    } catch { return null; }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const activeAndFilteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products.filter(
      (p) => p.status === "active" || p.status === undefined || !p.status
    ) : [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [products, searchTerm]);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedRows.length} products?`)) return;
    setDeleting(true);
    const token = getToken();
    if (!token) { errorToast("Login required!"); setDeleting(false); return; }

    try {
      await Promise.all(
        selectedRows.map((id) =>
          axios.delete(`${apis.prod}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      successToast(`${selectedRows.length} products deleted!`);
      dispatch(fetchProducts());
      setSelectedRows([]);
    } catch (err) { errorToast("Some products couldn't be deleted"); } 
    finally { setDeleting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    const token = getToken();
    try {
      await axios.delete(`${apis.prod}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      successToast("Product deleted!");
      dispatch(fetchProducts());
    } catch (err) { errorToast("Delete failed!"); }
  };

  const columns = [
    {
      field: "images",
      headerName: "PRODUCT",
      width: 80,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full">
          {params.value?.[0]?.url ? (
            <img
              src={params.value[0].url}
              alt=""
              className="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-100"
            />
          ) : (
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <FaBoxOpen size={18} />
            </div>
          )}
        </div>
      ),
    },
    { 
      field: "title", 
      headerName: "DETAILS", 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full py-2">
          <span className="font-bold text-slate-800 text-[14px] leading-tight truncate">{params.row.title}</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{params.row.brand || 'No Brand'}</span>
        </div>
      )
    },
    { 
        field: "category", 
        headerName: "CATEGORY", 
        width: 140,
        renderCell: (params) => (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-tight">
                {params.value || 'General'}
            </span>
        )
    },
    {
      field: "price",
      headerName: "PRICE",
      width: 110,
      renderCell: (params) => (
        <span className="font-black text-slate-900">£{params.value}</span>
      ),
    },
    {
      field: "stock",
      headerName: "INVENTORY",
      width: 130,
      renderCell: (params) => {
        const stock = params.value || 0;
        const isLow = stock <= 10 && stock > 0;
        const isOut = stock === 0;
        return (
          <div className="flex flex-col justify-center w-full pr-4">
            <span className={`text-[12px] font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isOut ? 'Out of Stock' : `${stock} Units`}
            </span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}
                />
            </div>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 140,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <div className="flex items-center gap-2 justify-end w-full">
          <Link to={`/products/${params.row._id}`} target="_blank" className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <FaEye size={14} />
          </Link>
          <button onClick={() => navigate(`/dashboard/edit-product/${params.row._id}`)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
            <FaEdit size={14} />
          </button>
          <button onClick={() => handleDelete(params.row._id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ];

  const rows = activeAndFilteredProducts.map((p) => ({ ...p, id: p._id }));

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader /></div>;

  return (
    <div className="p-4 md:p-8 pt-2 bg-[#f8fafc] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[11px] uppercase tracking-[0.2em] mb-1">
            <FaLayerGroup size={12} /> Catalogue Management
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Inventory <span className="text-slate-400 font-light">Overview</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="flex items-center gap-2.5 bg-indigo-600 hover:bg-slate-900 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
        >
          <FaPlus size={14} className="group-hover:rotate-90 transition-transform" /> 
          <span className="text-sm">ADD PRODUCT</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/60 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Quick search by title, brand or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 bg-transparent border-none rounded-xl focus:ring-0 outline-none text-slate-600 font-medium placeholder:text-slate-300 text-sm"
          />
        </div>

        {selectedRows.length > 0 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBulkDelete}
            disabled={deleting}
            className="bg-rose-50 text-rose-600 px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all mr-2"
          >
            <FaTrash size={12} /> DELETE SELECTED ({selectedRows.length})
          </motion.button>
        )}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-200/50 overflow-hidden">
        {rows.length === 0 && !loading ? (
          <div className="text-center py-24 bg-white">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FaBoxOpen className="text-slate-300 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No products found</h3>
            <p className="text-slate-400 mt-1 text-sm">Start by adding your first product to the store.</p>
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            // CRITICAL FIX: MongoDB _id ko main ID banana
            getRowId={(row) => row._id || row.id || Math.random().toString()} 
            checkboxSelection
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            rowHeight={80}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fcfcfd",
                color: "#94a3b8",
                fontWeight: "800",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f8faff" },
              "& .MuiCheckbox-root": { color: "#cbd5e1", "&.Mui-checked": { color: "#4f46e2" } }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ViewProducts;