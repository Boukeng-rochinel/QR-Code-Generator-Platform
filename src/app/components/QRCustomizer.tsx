import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ArrowLeft, Download, Upload, Wifi, MapPin, Link as LinkIcon } from 'lucide-react';

interface QRCustomizerProps {
  type: string;
  onBack: () => void;
  onGenerated: (data: { url: string; qrCode: string; id: string; type: string }) => void;
}

interface QRSettings {
  // Common
  foregroundColor: string;
  backgroundColor: string;
  logo: string | null;
  frameText: string;
  frameColor: string;
  showFrame: boolean;

  // URL
  url: string;

  // WiFi
  wifiSSID: string;
  wifiPassword: string;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass';
  wifiHidden: boolean;

  // Location
  latitude: string;
  longitude: string;
  locationAddress: string;
}

export function QRCustomizer({ type, onBack, onGenerated }: QRCustomizerProps) {
  const [settings, setSettings] = useState<QRSettings>({
    foregroundColor: '#1e40af',
    backgroundColor: '#ffffff',
    logo: null,
    frameText: 'Scan Me',
    frameColor: '#f97316',
    showFrame: true,

    url: '',

    wifiSSID: '',
    wifiPassword: '',
    wifiEncryption: 'WPA',
    wifiHidden: false,

    latitude: '',
    longitude: '',
    locationAddress: '',
  });

  const [qrCode, setQrCode] = useState('');
  const [finalQrCode, setFinalQrCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const content = getQRContent();
    if (content) {
      generatePreview(content);
    }
  }, [settings, type]);

  const getQRContent = (): string => {
    switch (type) {
      case 'url':
        return settings.url;

      case 'wifi':
        if (!settings.wifiSSID) return '';
        return `WIFI:T:${settings.wifiEncryption};S:${settings.wifiSSID};P:${settings.wifiPassword};H:${settings.wifiHidden};;`;

      case 'location':
        if (settings.latitude && settings.longitude) {
          return `geo:${settings.latitude},${settings.longitude}`;
        }
        return '';

      default:
        return settings.url;
    }
  };

  const generatePreview = async (content: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(content || 'https://example.com', {
        width: 300,
        margin: 1,
        color: {
          dark: settings.foregroundColor,
          light: settings.backgroundColor,
        },
      });

      setQrCode(qrDataUrl);
      await composeFinalQR(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR preview:', error);
    }
  };

  const composeFinalQR = async (qrDataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hasFrame = settings.showFrame;
    const frameHeight = hasFrame ? 60 : 0;

    canvas.width = 300;
    canvas.height = 300 + frameHeight;

    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const qrImg = new window.Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, 300, 300);

      if (settings.logo) {
        const logoImg = new window.Image();
        logoImg.onload = () => {
          const logoSize = 50;
          const logoX = (300 - logoSize) / 2;
          const logoY = (300 - logoSize) / 2;

          ctx.fillStyle = 'white';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          if (hasFrame) {
            drawFrame(ctx);
          }

          setFinalQrCode(canvas.toDataURL());
        };
        logoImg.src = settings.logo;
      } else {
        if (hasFrame) {
          drawFrame(ctx);
        }
        setFinalQrCode(canvas.toDataURL());
      }
    };
    qrImg.src = qrDataUrl;
  };

  const drawFrame = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = settings.frameColor;
    ctx.fillRect(0, 300, 300, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(settings.frameText, 150, 335);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings({ ...settings, logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const content = getQRContent();
    const id = Math.random().toString(36).substring(7);
    onGenerated({ url: content, qrCode: finalQrCode, id, type });

    const link = document.createElement('a');
    link.download = `qrcode-${type}-${id}.png`;
    link.href = finalQrCode;
    link.click();
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'wifi': return Wifi;
      case 'location': return MapPin;
      default: return LinkIcon;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Page Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
            <TypeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{type} QR Code</h2>
            <p className="text-gray-600">Customize your QR code settings and download</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Content Settings */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TypeIcon className="w-4 h-4 text-blue-600" />
              Content
            </h3>

            {type === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={settings.url}
                  onChange={(e) => setSettings({ ...settings, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {type === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={settings.wifiSSID}
                    onChange={(e) => setSettings({ ...settings, wifiSSID: e.target.value })}
                    placeholder="MyWiFiNetwork"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="text"
                    value={settings.wifiPassword}
                    onChange={(e) => setSettings({ ...settings, wifiPassword: e.target.value })}
                    placeholder="password123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                  <select
                    value={settings.wifiEncryption}
                    onChange={(e) => setSettings({ ...settings, wifiEncryption: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.wifiHidden}
                    onChange={(e) => setSettings({ ...settings, wifiHidden: e.target.checked })}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700">Hidden Network</span>
                </label>
              </div>
            )}

            {type === 'location' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address or Place</label>
                  <textarea
                    value={settings.locationAddress}
                    onChange={(e) => setSettings({ ...settings, locationAddress: e.target.value })}
                    placeholder="Enter address (e.g., 123 Main St, New York, NY)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or enter coordinates below</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      value={settings.latitude}
                      onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                      placeholder="40.7128"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="text"
                      value={settings.longitude}
                      onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                      placeholder="-74.0060"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {settings.latitude && settings.longitude && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Map Preview</p>
                    <div className="w-full h-32 bg-gray-200 rounded overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.longitude)-0.01},${parseFloat(settings.latitude)-0.01},${parseFloat(settings.longitude)+0.01},${parseFloat(settings.latitude)+0.01}&layer=mapnik&marker=${settings.latitude},${settings.longitude}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.foregroundColor}
                    onChange={(e) => setSettings({ ...settings, foregroundColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.foregroundColor}
                    onChange={(e) => setSettings({ ...settings, foregroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="grid grid-cols-5 gap-2">
                  {['#1e40af', '#7c3aed', '#f97316', '#6b7280', '#ffffff'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSettings({ ...settings, foregroundColor: color })}
                      className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Logo</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center gap-2 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">Upload Logo</span>
            </button>
            {settings.logo && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 rounded">
                <img src={settings.logo} alt="Logo" className="w-10 h-10 object-cover rounded" />
                <button
                  onClick={() => setSettings({ ...settings, logo: null })}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center - Preview */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h3>
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
              {finalQrCode ? (
                <div className="space-y-6">
                  <img src={finalQrCode} alt="QR Code" className="shadow-2xl rounded-lg" />
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold transition-colors shadow-sm"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <TypeIcon className="w-20 h-20 text-gray-300" />
                  </div>
                  <p>Fill in the content to generate QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Frame Settings */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Frame</h3>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={settings.showFrame}
                onChange={(e) => setSettings({ ...settings, showFrame: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium">Add Text Frame</span>
            </label>

            {settings.showFrame && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frame Text</label>
                  <input
                    type="text"
                    value={settings.frameText}
                    onChange={(e) => setSettings({ ...settings, frameText: e.target.value })}
                    placeholder="Scan Me"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frame Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.frameColor}
                      onChange={(e) => setSettings({ ...settings, frameColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.frameColor}
                      onChange={(e) => setSettings({ ...settings, frameColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              {type === 'wifi' && (
                <>
                  <li>• Use WPA/WPA2 for best security</li>
                  <li>• Test the QR code before printing</li>
                  <li>• Guests can scan to connect instantly</li>
                </>
              )}
              {type === 'location' && (
                <>
                  <li>• Use decimal coordinates for accuracy</li>
                  <li>• Test coordinates on a map first</li>
                  <li>• Opens in default maps app when scanned</li>
                </>
              )}
              {type === 'url' && (
                <>
                  <li>• Include https:// in URL</li>
                  <li>• Use URL shorteners for long links</li>
                  <li>• Test link before generating</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
