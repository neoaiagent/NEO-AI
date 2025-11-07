
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Share2, Mic, Film, Edit, Image as Images, LayoutDashboard, Wallet, FileText, Search, ArrowUpRight, LogOut } from 'lucide-react';
import DashboardHome from '@/components/dashboard/DashboardHome';
import ToolWorkspace from '@/components/dashboard/ToolWorkspace';
import { useHistory } from '@/contexts/HistoryContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const TOOLS = [
  { id: 'social-media-generator', name: 'Social Media Generator', icon: <Share2 className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/b30b6761-82f6-4c3d-ae64-f6b3031c0cb9' },
  { id: 'text-to-speech', name: 'Text to Speech', icon: <Mic className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/d996171e-b384-40ec-845e-f91de371710d' },
  { id: 'image-to-video', name: 'Image to Video', icon: <Film className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/332c14f4-cbdd-465c-8e6a-e4ee0ae77b2d' },
  { id: 'ads-generator', name: 'ADS Generator', icon: <ArrowUpRight className="w-4 h-4" /> },
  { id: 'image-editing', name: 'Image Editing', icon: <Edit className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/3d7c9427-7656-441c-aad7-435df664a1df' },
  { id: 'brief-to-images', name: 'Brief to Images', icon: <Images className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/fc9a2362-699a-42f4-b549-8bc4aa20d3ac' },
  { id: 'moodboard-generator', name: 'Moodboard Generator', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'money-tracking', name: 'Money Tracking', icon: <Wallet className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/5d45a2f6-a6cd-428e-bbb1-66f24ca81a29' },
  { id: 'cv-generator', name: 'CV Generator', icon: <FileText className="w-4 h-4" /> },
  { id: 'ai-scraper', name: 'AI Scraper', icon: <Search className="w-4 h-4" /> },
  { id: 'image-upscaler', name: 'Image Upscaler', icon: <ArrowUpRight className="w-4 h-4" />, webhook: 'https://n8n-teoxahs8xdqn.blueberry.sumopod.my.id/webhook/35207cbe-41b8-42f3-a9c4-727f07ac6d80' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeView, setActiveView] = useState('home');
  const [selectedTool, setSelectedTool] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/login');
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setHistoryItem(null);
    setActiveView('tool');
  };

  const handleHistoryItemClick = (item) => {
    const tool = TOOLS.find(t => t.id === item.toolId);
    if (tool) {
      setSelectedTool(tool);
      setHistoryItem(item);
      setActiveView('tool');
    }
  };

  const handleBackHome = () => {
    setActiveView('home');
    setSelectedTool(null);
    setHistoryItem(null);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - NeoAI</title>
        <meta name="description" content="Manage your AI projects and tools with NeoAI Dashboard" />
      </Helmet>
      <div className="min-h-screen bg-[#F8F9FB]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-[#0573AC]">NeoAI</Link>
            <div id="topbar-actions" className="flex items-center gap-2">
              <button id="btn-account" onClick={() => navigate('/account')} className="btn-ghost flex items-center gap-2">
                <User className="w-4 h-4" /> Account
              </button>
              <button 
                onClick={handleSignOut} 
                className="btn-ghost flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-4rem)]">
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-2">
              <button id="nav-home" onClick={handleBackHome} className={`nav-item w-full ${activeView === 'home' ? 'is-active' : ''}`}>
                <Home className="w-4 h-4" /> Home
              </button>
              <div className="pt-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">TOOLS</div>
                <ul id="nav-tools-list" className="space-y-1">
                  {TOOLS.map((tool) => (
                    <li key={tool.id} data-tool={tool.id} onClick={() => handleToolSelect(tool)} className={`nav-item cursor-pointer ${selectedTool?.id === tool.id && !historyItem ? 'is-active' : ''}`}>
                      {tool.icon}<span>{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          
          <main className="flex-1 overflow-y-auto">
            {activeView === 'home' ? (
              <DashboardHome onHistoryItemClick={handleHistoryItemClick} />
            ) : (
              <ToolWorkspace tool={selectedTool} onBack={handleBackHome} historyItem={historyItem} />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
