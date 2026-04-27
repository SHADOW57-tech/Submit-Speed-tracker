import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  Zap,
  Palette,
  Mail,
  Code,
  Webhook,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { API } from "@/services/api";

// 1. Define the Tab Type
type SettingsTab =
  | "Account"
  | "System"
  | "Appearance"
  | "Notifications"
  | "Advanced"
  | "Owner";

const Settings = () => {
  const storedUser = localStorage.getItem('userInfo');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isOwner = currentUser?.role?.toString().toLowerCase() === 'owner';

  const [activeTab, setActiveTab] = useState<SettingsTab>(isOwner ? 'Owner' : 'Account');
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Admin User',
    role: currentUser?.role?.toString() || 'admin',
    email: currentUser?.email || 'admin@submitspeed.com',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemConfig, setSystemConfig] = useState({
    currency: "USD",
    units: "Metric",
    trackingPrefix: "UA",
    trackingSuffix: "ZA",
  });

  const [appearanceConfig, setAppearanceConfig] = useState({
    primaryColor: "#dc2626",
    logoUrl: "",
    companyName: "Submit Speed",
    supportPhone: "+1-800-000-0000",
    supportEmail: "support@submitspeed.com",
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailProvider: "Resend",
    emailApiKey: "",
    sendOnPickup: true,
    sendOnTransit: true,
    sendOnDelivery: true,
  });

  const [advancedConfig, setAdvancedConfig] = useState({
    webhookUrl: "",
    apiKeyName: "",
    googleMapsKey: "",
    enableDetailedLogs: true,
  });

  const [ownerAdmins, setOwnerAdmins] = useState<any[]>([]);
  const [ownerLogs, setOwnerLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminQuery, setAdminQuery] = useState('');
  const [logDateRange, setLogDateRange] = useState({ start: '', end: '' });

  const fetchOwnerAdmins = async () => {
    setAdminsLoading(true);
    try {
      const { data } = await API.get('/admin/admins');
      setOwnerAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins', error);
      toast.error('Unable to load admin list');
    } finally {
      setAdminsLoading(false);
    }
  };

  const fetchOwnerLogs = async () => {
    setLogsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (adminQuery) params.adminName = adminQuery;
      if (logDateRange.start) params.startDate = logDateRange.start;
      if (logDateRange.end) params.endDate = logDateRange.end;

      const { data } = await API.get('/admin/logs', { params });
      setOwnerLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
      toast.error('Unable to load activity logs');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchOwnerAdmins();
      fetchOwnerLogs();
    }
  }, [isOwner]);

  const handleSave = () => {
    toast.success('Settings saved successfully.');
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      await API.post(`/admin/admins/${userId}/toggle`);
      toast.success('Admin role updated');
      fetchOwnerAdmins();
      fetchOwnerLogs();
    } catch (error) {
      console.error('Toggle admin failed', error);
      toast.error('Unable to update role');
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen p-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Configure your logistics platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-card border border-border rounded-xl p-4 space-y-2 sticky top-6">
              {(
                [
                  "Account",
                  "System",
                  "Appearance",
                  "Notifications",
                  "Advanced",
                  ...(isOwner ? ["Owner"] : []),
                ] as SettingsTab[]
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? "bg-red-600 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="col-span-4 bg-card border border-border rounded-xl p-8">
            {activeTab === "Account" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Shield size={24} /> Profile
                </h2>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Save Account
                </button>
              </div>
            )}

            {activeTab === "System" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap size={24} /> System
                </h2>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Local Currency
                  </label>
                  <select
                    className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                    value={systemConfig.currency}
                    onChange={(e) =>
                      setSystemConfig({
                        ...systemConfig,
                        currency: e.target.value,
                      })
                    }
                  >
                    <option value="USD">USD - Dollar</option>
                    <option value="NGN">NGN - Naira</option>
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Save System
                </button>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Palette size={24} /> Appearance
                </h2>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Company Branding
                  </label>
                  <input
                    type="text"
                    className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                    value={appearanceConfig.companyName}
                    onChange={(e) =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Save Appearance
                </button>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Mail size={24} /> Notifications
                </h2>
                <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-red-600"
                      checked={notificationConfig.sendOnPickup}
                      onChange={(e) =>
                        setNotificationConfig({
                          ...notificationConfig,
                          sendOnPickup: e.target.checked,
                        })
                      }
                    />
                    <span className="font-medium text-sm">
                      Notify customers on Pickup
                    </span>
                  </label>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Save Notifications
                </button>
              </div>
            )}

            {activeTab === "Owner" && isOwner && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ShieldCheck size={24} /> Owner Dashboard
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Manage admin roles and review activity logs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      fetchOwnerAdmins();
                      fetchOwnerLogs();
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg">Admin Management</h3>
                    <span className="text-sm text-zinc-500">{adminsLoading ? 'Loading...' : `${ownerAdmins.length} admins`}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50 dark:bg-zinc-800">
                        <tr>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Name</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Email</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Role</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {ownerAdmins.map((user) => (
                          <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{user.name || 'No Name'}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{user.role}</td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                disabled={user.role === 'owner'}
                                onClick={() => handleToggleAdmin(user._id)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                              >
                                <Trash2 size={14} />
                                {user.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 w-full">
                      <input
                        value={adminQuery}
                        onChange={(e) => setAdminQuery(e.target.value)}
                        placeholder="Filter by admin name"
                        className="w-full bg-background border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <input
                        type="date"
                        value={logDateRange.start}
                        onChange={(e) => setLogDateRange({ ...logDateRange, start: e.target.value })}
                        className="w-full bg-background border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <input
                        type="date"
                        value={logDateRange.end}
                        onChange={(e) => setLogDateRange({ ...logDateRange, end: e.target.value })}
                        className="w-full bg-background border border-border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <button
                      onClick={fetchOwnerLogs}
                      className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Search Logs
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50 dark:bg-zinc-800">
                        <tr>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Time</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Admin</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Action</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">Target</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-500">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {logsLoading ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-sm text-zinc-500">
                              Loading activity logs...
                            </td>
                          </tr>
                        ) : ownerLogs.length > 0 ? (
                          ownerLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{new Date(log.createdAt).toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{log.performer?.name || log.performer?.email}</td>
                              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{log.actionType}</td>
                              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{log.targetId || '—'}</td>
                              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">{log.ipAddress || '—'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-sm text-zinc-500">
                              No activity logs found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "Advanced" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Webhook size={24} /> Webhooks
                </h2>
                <input
                  type="url"
                  placeholder="Webhook URL"
                  className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  value={advancedConfig.webhookUrl}
                  onChange={(e) =>
                    setAdvancedConfig({
                      ...advancedConfig,
                      webhookUrl: e.target.value,
                    })
                  }
                />
                <h2 className="text-xl font-bold flex items-center gap-2 mt-4">
                  <Code size={24} /> API Settings
                </h2>
                <input
                  type="text"
                  placeholder="API Key Name"
                  className="w-full bg-background border border-border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  value={advancedConfig.apiKeyName}
                  onChange={(e) =>
                    setAdvancedConfig({
                      ...advancedConfig,
                      apiKeyName: e.target.value,
                    })
                  }
                />
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Save Advanced
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
