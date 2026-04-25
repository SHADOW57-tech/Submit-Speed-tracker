import { useState } from 'react';
import { 
  Eye, EyeOff, Shield, Zap, 
  Palette, Mail, Code, Webhook 
} from 'lucide-react';

type SettingsTab = 'Account' | 'System' | 'Appearance' | 'Notifications' | 'Advanced';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Account');
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    role: 'Super Admin',
    email: 'admin@submitspeed.com',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [systemConfig, setSystemConfig] = useState({
    currency: 'USD',
    units: 'Metric',
    trackingPrefix: 'UA',
    trackingSuffix: 'ZA',
  });

  const [appearanceConfig, setAppearanceConfig] = useState({
    primaryColor: '#dc2626',
    logoUrl: '',
    companyName: 'Submit Speed',
    supportPhone: '+1-800-000-0000',
    supportEmail: 'support@submitspeed.com',
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailProvider: 'Resend',
    emailApiKey: '',
    sendOnPickup: true,
    sendOnTransit: true,
    sendOnDelivery: true,
  });

  const [advancedConfig, setAdvancedConfig] = useState({
    webhookUrl: '',
    apiKeyName: '',
    googleMapsKey: '',
    enableDetailedLogs: true,
  });

  const handleSave = () => {
    alert(`${activeTab} settings saved successfully!`);
  };

  return (
    <div className="flex-1 bg-background min-h-screen p-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">System Settings</h1>
          <p className="text-muted-foreground">Configure your logistics platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-card border border-border rounded-xl p-4 space-y-2 sticky top-6">
              {(['Account', 'System', 'Appearance', 'Notifications', 'Advanced'] as SettingsTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="col-span-4 bg-card border border-border rounded-xl p-8">
            {activeTab === 'Account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Shield size={24} /> Profile</h2>
                <input 
                  className="w-full bg-background border border-border p-3 rounded-lg"
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                />
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-background border border-border p-3 rounded-lg"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Save Account</button>
              </div>
            )}

            {activeTab === 'System' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Zap size={24} /> System</h2>
                <select 
                  className="w-full bg-background border border-border p-3 rounded-lg"
                  value={systemConfig.currency}
                  onChange={(e) => setSystemConfig({...systemConfig, currency: e.target.value})}
                >
                  <option>USD</option><option>NGN</option>
                </select>
                <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Save System</button>
              </div>
            )}

            {activeTab === 'Appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Palette size={24} /> Appearance</h2>
                <input 
                  type="text"
                  className="w-full bg-background border border-border p-3 rounded-lg"
                  value={appearanceConfig.companyName}
                  onChange={(e) => setAppearanceConfig({...appearanceConfig, companyName: e.target.value})}
                />
                <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Save Appearance</button>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Mail size={24} /> Notifications</h2>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={notificationConfig.sendOnPickup}
                    onChange={(e) => setNotificationConfig({...notificationConfig, sendOnPickup: e.target.checked})}
                  />
                  Send on Pickup
                </label>
                <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Save Notifications</button>
              </div>
            )}

            {activeTab === 'Advanced' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Webhook size={24} /> Webhooks</h2>
                <input 
                  type="url"
                  placeholder="Webhook URL"
                  className="w-full bg-background border border-border p-3 rounded-lg"
                  value={advancedConfig.webhookUrl}
                  onChange={(e) => setAdvancedConfig({...advancedConfig, webhookUrl: e.target.value})}
                />
                <h2 className="text-xl font-bold flex items-center gap-2 mt-4"><Code size={24} /> API Settings</h2>
                <input 
                  type="text"
                  placeholder="API Key Name"
                  className="w-full bg-background border border-border p-3 rounded-lg"
                  value={advancedConfig.apiKeyName}
                  onChange={(e) => setAdvancedConfig({...advancedConfig, apiKeyName: e.target.value})}
                />
                <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Save Advanced</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;