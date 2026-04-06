import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../lib/axios';
import { mockRevenueData, mockTopItems, mockOrdersByHour } from '../../lib/mockData';

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [hourly, setHourly] = useState([]);

  useEffect(() => {
    api.get('/analytics/revenue').then(r => setRevenue(r.data)).catch(() => setRevenue(mockRevenueData));
    api.get('/analytics/top-items').then(r => setTopItems(r.data)).catch(() => setTopItems(mockTopItems));
    api.get('/analytics/orders-by-hour').then(r => setHourly(r.data)).catch(() => setHourly(mockOrdersByHour));
  }, []);

  const chartTheme = { stroke: '#FF9E18', fill: 'rgba(255,158,24,0.15)', text: '#a0815a', grid: '#544434' };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <h1 className="font-heading text-2xl font-bold text-on-surface mb-8">Sales Analytics</h1>

      {/* Revenue Chart */}
      <div className="card mb-6">
        <h2 className="font-heading font-semibold text-on-surface mb-4">Revenue (Last 14 days)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis dataKey="date" tick={{ fill: chartTheme.text, fontSize: 11 }} tickFormatter={v => v.slice(5)} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#2e1b0e', border: 'none', borderRadius: 8, color: '#f5e6c8' }} />
            <Area type="monotone" dataKey="revenue" stroke={chartTheme.stroke} fill={chartTheme.fill} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <div className="card">
          <h2 className="font-heading font-semibold text-on-surface mb-4">Top Items</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis type="number" tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#2e1b0e', border: 'none', borderRadius: 8, color: '#f5e6c8' }} />
              <Bar dataKey="qty" fill={chartTheme.stroke} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Hour */}
        <div className="card">
          <h2 className="font-heading font-semibold text-on-surface mb-4">Orders by Hour</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="hour" tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#2e1b0e', border: 'none', borderRadius: 8, color: '#f5e6c8' }} />
              <Line type="monotone" dataKey="count" stroke={chartTheme.stroke} strokeWidth={2} dot={{ fill: chartTheme.stroke, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
