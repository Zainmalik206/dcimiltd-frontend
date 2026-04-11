import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import apis from "../../config/apis.js";
import { errorToast, successToast } from "../../functions/toastify.js"; // successToast add kiya
import { DataGrid } from "@mui/x-data-grid";
import { Search, Users, X, UserCheck, ShieldAlert, MoreVertical, Trash2 } from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // 1. DELETE USER FUNCTION
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
      try {
        // Backend API call (Make sure your backend has this route)
        const { data } = await axios.delete(`${apis.auth}/delete-user/${id}`);
        
        if (data.ok) {
          successToast("User removed successfully");
          // UI se user ko foran remove karna
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        } else {
          errorToast(data.error || "Failed to delete user");
        }
      } catch (error) {
        errorToast(error.response?.data?.error || "Error deleting user");
      }
    }
  };

  const fetchUsers = useCallback(async (term = "") => {
    try {
      setLoading(true);
      setMessage("");
      const url = term
        ? `${apis.auth}/all-users?search=${encodeURIComponent(term.trim())}`
        : `${apis.auth}/all-users`;

      const { data } = await axios.get(url);
      if (data.ok) {
        setUsers(data.users || []);
        setMessage(data.message || "");
      } else {
        errorToast(data.error || "Failed to fetch users");
      }
    } catch (error) {
      errorToast("Network error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const columns = [
    {
      field: "name",
      headerName: "Member Identity",
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-2 h-full">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
            {(params.row.first_name?.[0] || params.row.last_name?.[0] || "?").toUpperCase()}
          </div>
          <div className="flex flex-col justify-center leading-tight overflow-hidden">
            <p className="font-bold text-slate-900 text-sm tracking-tight truncate">
              {params.row.first_name} {params.row.last_name}
            </p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter italic">
              ID: {params.row._id?.slice(-6) || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    { 
      field: "email", 
      headerName: "Credentials", 
      flex: 1.5,
      renderCell: (p) => (
        <div className="flex items-center h-full">
          <span className="text-slate-600 font-medium text-sm truncate">{p.row.email}</span>
        </div>
      )
    },
    {
      field: "role",
      headerName: "Permission Level",
      flex: 1,
      renderCell: (params) => {
        const isAdmin = params.row.isAdmin || params.row.role?.includes("admin");
        return (
          <div className="flex items-center h-full">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border w-fit ${
              isAdmin ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-red-500" : "bg-emerald-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isAdmin ? "Authority" : "Standard"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Registered On",
      flex: 1,
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full leading-tight">
          <span className="text-slate-900 font-bold text-[13px] block">
            {new Date(params.row.createdAt).toLocaleDateString("en-GB", {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">
            System Verified
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Manage",
      flex: 0.5,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <div className="flex items-center justify-end h-full w-full gap-2">
          {/* 2. DELETE BUTTON ADDED HERE */}
          <button 
            onClick={() => handleDeleteUser(params.row._id, params.row.first_name)}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all group"
            title="Delete User"
          >
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-2">
            <MoreVertical size={16} className="text-slate-400"/>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full pt-6 pb-12 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              User <span className="text-blue-600 italic">Database</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Enterprise Management Dashboard</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0 text-right">
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{users.length}</p>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nodes Linked</span>
            </div>
          </div>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-default">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Users</p>
              <p className="text-3xl font-black text-slate-900">{users.filter(u => !u.isAdmin).length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <UserCheck size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all cursor-default">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorities</p>
              <p className="text-3xl font-black text-slate-900">{users.filter(u => u.isAdmin).length}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <ShieldAlert size={24} />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center justify-between overflow-hidden relative cursor-default">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Status</p>
              <p className="text-xl font-black text-emerald-400 uppercase italic tracking-tighter flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live System
              </p>
            </div>
            <Users size={40} className="text-white/5 absolute -right-2 -bottom-2" />
          </div>
        </div>

        {/* SEARCH & TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-2">
          <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name, identifier, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={16} />
                  </button>
                )}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:block italic">Direct Database Stream Active</p>
          </div>

          <div style={{ height: 700, width: "100%" }} className="px-2 pb-2">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 shadow-sm"></div>
              </div>
            ) : message === "User not exist" ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-red-50 text-red-400 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm"><X size={40} /></div>
                <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">Null Result Found</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Record mismatch for "{search}"</p>
              </div>
            ) : (
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row._id}
                pageSizeOptions={[10, 25, 50]}
                rowHeight={85}
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#64748b",
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f8fafc",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#fcfcfd",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "10px",
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;