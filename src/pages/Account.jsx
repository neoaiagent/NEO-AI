import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { CreditCard, Settings, MessageCircle } from 'lucide-react';

const Account = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const mockTransactions = [
    { date: '2025-10-25', description: 'Credit Top-up', amount: 'Rp 50,000', status: 'Completed' },
    { date: '2025-10-20', description: 'Social Media Generator', amount: '-500 credits', status: 'Completed' },
    { date: '2025-10-18', description: 'Credit Top-up', amount: 'Rp 100,000', status: 'Completed' },
    { date: '2025-10-15', description: 'Image to Video', amount: '-1,200 credits', status: 'Completed' },
  ];

  return (
    <>
      <Helmet>
        <title>Account - NeoAI</title>
        <meta name="description" content="Manage your NeoAI account settings and billing" />
      </Helmet>

      <div className="min-h-screen bg-[#F8F9FB]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold text-[#0573AC]">
                NeoAI
              </Link>
              <Link to="/dashboard" className="btn-ghost">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <div className="container py-8">
          <h1 className="text-3xl font-bold text-[#013353] mb-8">Account Settings</h1>

          <Tabs defaultValue="billing" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Support
              </TabsTrigger>
            </TabsList>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-[#013353] mb-4">Billing & Subscription</h2>
                <p className="text-gray-600 mb-6">
                  Manage your subscription, add AI Credits, and view your transaction history.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button className="btn-primary">Add Credits</button>
                  <button className="btn-secondary">Change Plan</button>
                </div>

                <h3 className="font-semibold text-[#013353] mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{tx.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{tx.amount}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-[#013353] mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      className="input-field"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="input-field"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                    <input
                      type="password"
                      placeholder="New password"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleThemeChange('light')}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          theme === 'light'
                            ? 'border-[#0573AC] bg-[#0573AC]/10'
                            : 'border-gray-300'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-[#0573AC] bg-[#0573AC]/10'
                            : 'border-gray-300'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      className="w-4 h-4 text-[#0573AC] rounded focus:ring-[#0573AC]"
                    />
                    <label htmlFor="notifications" className="text-sm text-gray-700">
                      Enable email notifications
                    </label>
                  </div>

                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-[#013353] mb-4">Need help?</h2>
                <p className="text-gray-600 mb-6">
                  Our support team is here to assist you with any questions or issues.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-[#F8F9FB] rounded-lg">
                    <h3 className="font-semibold text-[#013353] mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Chat with our support team in real-time
                    </p>
                    <button className="btn-primary">Start Chat</button>
                  </div>

                  <div className="p-4 bg-[#F8F9FB] rounded-lg">
                    <h3 className="font-semibold text-[#013353] mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Send us an email and we'll get back to you within 24 hours
                    </p>
                    <a
                      href="mailto:neoai021@gmail.com"
                      className="text-[#0573AC] hover:underline font-medium"
                    >
                      neoai021@gmail.com
                    </a>
                  </div>

                  <div className="p-4 bg-[#F8F9FB] rounded-lg">
                    <h3 className="font-semibold text-[#013353] mb-2">Help Center</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse our documentation and tutorials
                    </p>
                    <a href="/help" className="btn-secondary inline-block">
                      Visit Help Center
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="bg-[#013353] text-white py-4 mt-12">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
              <nav className="flex gap-4">
                <a href="/about" className="hover:text-[#0573AC] transition-colors">About</a>
                <a href="/terms" className="hover:text-[#0573AC] transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-[#0573AC] transition-colors">Privacy</a>
                <a href="/contact" className="hover:text-[#0573AC] transition-colors">Contact</a>
              </nav>
              <p className="text-gray-300">
                © 2025 Horizon AI — Powered by NEO AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Account;