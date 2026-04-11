import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // useNavigate add kiya
import { formatInTimeZone } from "date-fns-tz";
import axios from "axios";
import apis from "../../config/apis";
import Loader from "../../layouts/Loader"; 
import { useAuth } from "../../context/auth"; // useAuth import kiya
import {
  Users, TrendingUp, Wallet, Package,
  BarChart3, Activity, LayoutDashboard
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify"; // errorToast ki jagah toast for consistency

const AdminDashboard = () => {
  const [auth, setAuth] = useAuth(); // Auth state for logout
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, growth: 0 });
  const [chartData, setChartData] = useState({ daily: [], monthly: [], yearly: [] });
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);

  // 1. Live Clock (Per Second)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pktTime = formatInTimeZone(currentTime, "Asia/Karachi", "hh:mm:ss a");
  const pktDate = formatInTimeZone(currentTime, "Asia/Karachi", "EEE, MMM dd, yyyy");

  // 2. Data Fetching with 30-Second Auto Update & Session Expiry Check
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token; // Auth context se token liya
        if (!token) {
          navigate("/login");
          return;
        }

        const [ordersRes, usersRes] = await Promise.all([
          axios.get(`${apis.orders}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${apis.auth}/all-users`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || [];
        const usersArray = usersRes.data.users || [];
        const totalUsers = usersArray.length; 
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

        const dailyMap = {}, monthlyMap = {}, yearlyMap = {};

        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const dayKey = formatInTimeZone(date, "Asia/Karachi", "yyyy-MM-dd");
          const monthKey = formatInTimeZone(date, "Asia/Karachi", "yyyy-MM");
          const yearKey = formatInTimeZone(date, "Asia/Karachi", "yyyy");

          if (!dailyMap[dayKey]) {
            dailyMap[dayKey] = { label: formatInTimeZone(date, "Asia/Karachi", "MMM dd"), revenue: 0, orders: 0, date: dayKey };
          }
          dailyMap[dayKey].revenue += Number(order.totalPrice) || 0;
          dailyMap[dayKey].orders += 1;

          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { label: formatInTimeZone(date, "Asia/Karachi", "MMM"), revenue: 0, date: monthKey };
          }
          monthlyMap[monthKey].revenue += Number(order.totalPrice) || 0;

          if (!yearlyMap[yearKey]) yearlyMap[yearKey] = { label: yearKey, revenue: 0 };
          yearlyMap[yearKey].revenue += Number(order.totalPrice) || 0;
        });

        setChartData({
          daily: Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7),
          monthly: Object.values(monthlyMap).sort((a, b) => new Date(a.date + "-01") - new Date(b.date + "-01")).slice(-12),
          yearly: Object.values(yearlyMap).sort((a, b) => a.label - b.label)
        });

        setStats({ totalOrders, totalRevenue, totalUsers, growth: 12.5 });
      } catch (err) {
        // ========== SINGLE TOAST FOR SESSION EXPIRY ==========
        if (err.response && err.response.status === 401) {
          toast.error("Admin session expired. Please login again.", { 
            toastId: "admin-session-expired",
            autoClose: 2000 
          });
          setAuth({ ...auth, user: null, token: "" });
          localStorage.removeItem("auth");
          navigate("/login");
        } else {
          console.error("Fetch Error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const liveInterval = setInterval(fetchData, 30000); 
    return () => clearInterval(liveInterval);
  }, [auth?.token, navigate, setAuth]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-sm font-bold text-indigo-600">Revenue: Rs. {payload[0].value.toLocaleString()}</p>
          {payload[1] && <p className="text-sm font-bold text-emerald-500">Orders: {payload[1].value}</p>}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-white"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PREMIUM WELCOME BANNER --- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-8 md:p-10 rounded-[2.5rem] mb-10 shadow-xl shadow-indigo-200">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
                 System Live • DC IMI LTD
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Welcome back, Admin!</h1>
              <p className="text-indigo-100/80 text-sm font-medium max-w-md">Real-time business intelligence stream is active and updating.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="text-right border-r border-white/20 pr-4">
                <p className="text-white font-black text-xl">{pktTime}</p>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-tighter">{pktDate}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users className="w-5 h-5" /></div>
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">LIVE</div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Users</p>
             <h3 className="text-2xl font-black text-slate-900">{stats.totalUsers}</h3>
          </div>

          {[
            { label: "Net Revenue", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Total Shipments", value: stats.totalOrders, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Growth Rate", value: `+${stats.growth}%`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className={`${item.bg} ${item.color} p-3 rounded-2xl`}><item.icon className="w-5 h-5" /></div>
                <Activity className="w-4 h-4 text-slate-200" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* --- MAIN CHART SECTION --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><BarChart3 className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Revenue Analytics</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 30s Refresh Cycle
                  </p>
               </div>
            </div>
            
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {["daily", "monthly", "yearly"].map((k) => (
                <button
                  key={k}
                  onClick={() => setView(k)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    view === k ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {view === "yearly" ? (
                <BarChart data={chartData.yearly}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F8FAFC" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="revenue" fill="#4F46E5" radius={[12, 12, 12, 12]} barSize={32} />
                </BarChart>
              ) : (
                <AreaChart data={chartData[view]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F8FAFC" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" activeDot={{ r: 8, strokeWidth: 0 }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;