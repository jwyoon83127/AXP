import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Users, ClipboardCheck, AlertCircle, 
  Calendar, LayoutDashboard, Database, BookOpen, Settings,
  ChevronRight, Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AX Planner</h1>
        </div>

        <nav className="space-y-2 flex-grow">
          <a href="#" className="nav-link active flex items-center gap-3">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="nav-link flex items-center gap-3 text-slate-400">
            <Calendar size={18} /> Timeline
          </a>
          <a href="#" className="nav-link flex items-center gap-3 text-slate-400">
            <Database size={18} /> Tasks
          </a>
          <a href="#" className="nav-link flex items-center gap-3 text-slate-400">
            <BookOpen size={18} /> Wiki
          </a>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <a href="#" className="nav-link flex items-center gap-3 text-slate-400">
            <Settings size={18} /> Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-sm font-medium text-slate-400 mb-1">Welcome back, AX Team</h2>
            <h3 className="text-3xl font-bold">Project Overview</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-background border-2 border-background"></div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Tasks', value: data?.project_info.total_tasks, icon: ClipboardCheck, color: 'from-blue-500 to-indigo-600' },
            { label: 'Target Teams', value: data?.project_info.target_teams, icon: Users, color: 'from-teal-400 to-emerald-600' },
            { label: 'Participants', value: data?.project_info.target_participants, icon: Calendar, color: 'from-purple-500 to-pink-600' },
            { label: 'Pending Issues', value: '14', icon: AlertCircle, color: 'from-orange-400 to-red-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-current/10`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                  +12.5% <ChevronRight size={12} />
                </span>
              </div>
              <h4 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h4>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 lg:col-span-2 h-[400px]"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg">Team Progress by Tasks</h4>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none">
                <option>All Teams</option>
              </select>
            </div>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.teams}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                    {data?.teams.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 h-[400px]"
          >
            <h4 className="font-bold text-lg mb-6">Automation Types</h4>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categories}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {data?.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity / Issues */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-4">Urgent Issues (AX Support Required)</h4>
            <div className="space-y-4">
              {[
                { team: '개발팀', issue: 'n8n API 연동 오류 발생', time: '10 mins ago', status: 'High' },
                { team: '세일즈팀', issue: 'Claude 토큰 한도 초과', time: '1 hour ago', status: 'Medium' },
                { team: '마케팅팀', issue: '이미지 생성 자동화 템플릿 문의', time: '3 hours ago', status: 'Low' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'High' ? 'bg-red-500' : item.status === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{item.issue}</p>
                      <p className="text-xs text-slate-500">{item.team} • {item.time}</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-primary hover:underline">Resolve</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-4">Daily Check Status</h4>
            <div className="flex flex-wrap gap-2">
              {data?.teams.map((team, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full border border-white/10 text-xs">
                  <div className={`w-2 h-2 rounded-full ${i < 8 ? 'bg-secondary shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                  {team.name}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-6">* 8/12 Teams submitted (11:00 AM Deadline)</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
