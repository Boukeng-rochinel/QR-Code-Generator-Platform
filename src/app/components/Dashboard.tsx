import { Link, Wifi, MapPin, FileText, Image as ImageIcon, Share2, Video, Type, Briefcase, Mail, Phone, Calendar, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onSelectType: (type: string) => void;
  qrCodes: any[];
}

export function Dashboard({ onSelectType, qrCodes }: DashboardProps) {
  const qrTypes = [
    { id: 'url', title: 'Website URL', description: 'Link to any website', icon: Link, color: 'bg-blue-600' },
    { id: 'wifi', title: 'WiFi Network', description: 'Share WiFi credentials', icon: Wifi, color: 'bg-violet-600' },
    { id: 'location', title: 'Location', description: 'Show map location', icon: MapPin, color: 'bg-orange-600' },
    { id: 'pdf', title: 'PDF File', description: 'Link to PDF document', icon: FileText, color: 'bg-blue-600' },
    { id: 'image', title: 'Image Gallery', description: 'Display multiple images', icon: ImageIcon, color: 'bg-violet-600' },
    { id: 'social', title: 'Social Media', description: 'Share social profiles', icon: Share2, color: 'bg-orange-600' },
    { id: 'video', title: 'Video', description: 'Link to video content', icon: Video, color: 'bg-blue-600' },
    { id: 'text', title: 'Plain Text', description: 'Display text message', icon: Type, color: 'bg-gray-600' },
    { id: 'business', title: 'Business Info', description: 'Company details', icon: Briefcase, color: 'bg-violet-600' },
    { id: 'email', title: 'Email', description: 'Compose email', icon: Mail, color: 'bg-orange-600' },
    { id: 'phone', title: 'Phone Number', description: 'Make a phone call', icon: Phone, color: 'bg-blue-600' },
    { id: 'event', title: 'Calendar Event', description: 'Add to calendar', icon: Calendar, color: 'bg-violet-600' },
  ];

  const recentQRCodes = qrCodes.slice(-3).reverse();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your QR Code
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Generate professional QR codes with custom designs, track scans, and analyze performance—all in one platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onSelectType('url')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              View Examples
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{qrCodes.length}</div>
          <div className="text-sm text-gray-600">Total QR Codes</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              +8%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2,547</div>
          <div className="text-sm text-gray-600">Total Scans</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              +5%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">64%</div>
          <div className="text-sm text-gray-600">Click Rate</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">127</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
      </div>

      {/* Recent QR Codes */}
      {recentQRCodes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent QR Codes</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentQRCodes.map((qr) => (
              <div
                key={qr.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <img src={qr.qrCode} alt="QR Code" className="w-full h-auto" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate mb-1">{qr.url}</p>
                    <p className="text-sm text-gray-500 capitalize">{qr.type} QR Code</p>
                  </div>
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                  <span className="text-gray-600">156 scans</span>
                  <span className="text-gray-500">{new Date(qr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Type Selection */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose QR Code Type</h2>
          <p className="text-gray-600">Select the type of QR code you want to create</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {qrTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <type.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
