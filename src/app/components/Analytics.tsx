import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { QrCode, MousePointerClick, TrendingUp, Globe, Eye, Download, Share2 } from 'lucide-react';

interface AnalyticsProps {
  qrCodes: Array<{ url: string; qrCode: string; id: string; type: string; createdAt: string }>;
}

export function Analytics({ qrCodes }: AnalyticsProps) {
  const scansByDay = [
    { date: 'Mon', scans: 45 },
    { date: 'Tue', scans: 52 },
    { date: 'Wed', scans: 38 },
    { date: 'Thu', scans: 67 },
    { date: 'Fri', scans: 83 },
    { date: 'Sat', scans: 92 },
    { date: 'Sun', scans: 71 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 68, color: '#1e40af' },
    { name: 'Desktop', value: 22, color: '#7c3aed' },
    { name: 'Tablet', value: 10, color: '#f97316' },
  ];

  const topQRCodes = [
    { name: 'Product Launch', scans: 234 },
    { name: 'Event Registration', scans: 189 },
    { name: 'Restaurant Menu', scans: 156 },
    { name: 'Contact Card', scans: 143 },
  ];

  const stats = [
    { label: 'Total Scans', value: '2,547', icon: Eye, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', change: '+12.5%' },
    { label: 'Total QR Codes', value: qrCodes.length.toString(), icon: QrCode, bgColor: 'bg-violet-100', iconColor: 'text-violet-600', change: '+8.2%' },
    { label: 'Click Rate', value: '64%', icon: MousePointerClick, bgColor: 'bg-orange-100', iconColor: 'text-orange-600', change: '+5.1%' },
    { label: 'Countries', value: '24', icon: Globe, bgColor: 'bg-gray-100', iconColor: 'text-gray-600', change: '+3.0%' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your QR code performance and engagement</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Scans Over Time</h3>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={scansByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="scans"
                stroke="#1e40af"
                strokeWidth={3}
                dot={{ fill: '#1e40af', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                <span className="text-sm text-gray-600">{device.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing QR Codes</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topQRCodes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar
              dataKey="scans"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent QR Codes</h3>
        {qrCodes.length > 0 ? (
          <div className="space-y-3">
            {qrCodes.slice(-5).reverse().map((qr) => (
              <div key={qr.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <img src={qr.qrCode} alt="QR" className="w-16 h-16 rounded border border-gray-200" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 truncate">{qr.url}</div>
                  <div className="text-sm text-gray-500 capitalize">{qr.type} QR Code</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">156 scans</div>
                  <div className="text-xs text-gray-500">
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No QR codes generated yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
