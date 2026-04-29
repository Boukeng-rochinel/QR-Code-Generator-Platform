import { useState } from 'react';
import { QrCode, Home, BarChart3, Settings, LogOut, Menu, X, Plus } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { QRCustomizer } from './QRCustomizer';
import { Analytics } from './Analytics';

type View = 'home' | 'customizer' | 'analytics' | 'settings';

interface QRCodeData {
  url: string;
  qrCode: string;
  id: string;
  type: string;
  createdAt: string;
}

interface MainAppProps {
  onLogout: () => void;
}

export function MainApp({ onLogout }: MainAppProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedType, setSelectedType] = useState<string>('');
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setCurrentView('customizer');
  };

  const handleBackToDashboard = () => {
    setCurrentView('home');
    setSelectedType('');
  };

  const handleQRGenerated = (data: Omit<QRCodeData, 'createdAt'>) => {
    setQrCodes((prev) => [...prev, { ...data, createdAt: new Date().toISOString() }]);
  };

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QR Platform</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('customizer');
                  setSelectedType('url');
                }}
                className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create QR</span>
              </button>

              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as View);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCurrentView('customizer');
                    setSelectedType('url');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create QR</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <Dashboard onSelectType={handleSelectType} qrCodes={qrCodes} />
        )}

        {currentView === 'customizer' && (
          <QRCustomizer
            type={selectedType}
            onBack={handleBackToDashboard}
            onGenerated={handleQRGenerated}
          />
        )}

        {currentView === 'analytics' && <Analytics qrCodes={qrCodes} />}

        {currentView === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">user@example.com</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">••••••••</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between py-3">
                      <span className="text-gray-900">Email notifications</span>
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between py-3">
                      <span className="text-gray-900">Marketing emails</span>
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600">© 2026 QR Platform. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
