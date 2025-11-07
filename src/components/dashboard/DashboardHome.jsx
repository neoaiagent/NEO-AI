
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { useHistory } from '@/contexts/HistoryContext';

const DashboardHome = ({ onHistoryItemClick }) => {
  const { toast } = useToast();
  const { history } = useHistory();
  
  const credits = 'Rp 77,000';
  const balance = 'Rp 45,000';
  const projects = history.length.toString();

  const usageData = [
    { day: 'Mon', usage: 2 }, { day: 'Tue', usage: 5 }, { day: 'Wed', usage: 3 },
    { day: 'Thu', usage: 7 }, { day: 'Fri', usage: 6 }, { day: 'Sat', usage: 4 },
    { day: 'Sun', usage: 8 },
  ];

  const handleAddCredit = () => {
    toast({
      title: "Add Credit",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const getThumbnailSrc = (item) => {
    // Use the generated image if available
    if (item.toolId === 'brief-to-images' && item.result?.url) {
        return item.result.url;
    }
    // Use the input image for tools that transform an image
    if (item.inputFileUrl) {
        return item.inputFileUrl;
    }
    // Fallback to generic icons
    switch (item.toolId) {
        case 'image-to-video': return 'https://images.unsplash.com/photo-1533613220943-95620d363e2a?q=80&w=2070&auto=format&fit=crop';
        case 'brief-to-images': return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop';
        case 'text-to-speech': return 'https://images.unsplash.com/photo-1593341646782-e016533c6c1c?q=80&w=2070&auto=format&fit=crop';
        default: return 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1955&auto=format&fit=crop';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <section id="home-stats" className="grid-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card stat">
          <h3 className="text-gray-600 font-medium">AI Credits</h3><p className="value">{credits}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card stat">
          <h3 className="text-gray-600 font-medium">AI Balance</h3><p className="value">{balance}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card stat">
          <h3 className="text-gray-600 font-medium">Projects Generated</h3><p className="value">{projects}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card stat action">
          <h3 className="text-gray-600 font-medium">Add Credit</h3>
          <button onClick={handleAddCredit} className="btn-primary mt-2">+ Add Credit</button>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} id="usage-7d" className="card">
        <h3 className="text-lg font-semibold text-[#013353] mb-4">Usage (Last 7 Days)</h3>
        <div id="usage-7d-chart" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="usage" fill="#0573AC" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} id="recent-history" className="space-y-4">
        <h3 className="text-lg font-semibold text-[#013353]">Recent History</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.slice(0, 4).map(item => (
            <article key={item.id} className="history-card cursor-pointer" onClick={() => onHistoryItemClick(item)}>
              <img className="thumb" alt={`${item.toolName} preview`} src={getThumbnailSrc(item)} />
              <div className="meta">
                <h4 className="title">{`Result - ${new Date(item.date).toLocaleDateString()}`}</h4>
                <div className="sub">{item.toolName} • <span className={item.status === 'Completed' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{item.status}</span></div>
              </div>
            </article>
          ))}
        </div>

        <details id="history-table-wrap" className="card">
          <summary className="cursor-pointer font-medium text-[#0573AC] hover:underline">Show table view</summary>
          <div className="mt-4 overflow-x-auto">
            <table id="history-table" className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th-cell">Project</th>
                  <th className="th-cell">Tool</th>
                  <th className="th-cell">Date</th>
                  <th className="th-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onHistoryItemClick(item)}>
                    <td className="td-cell">{`Result from ${new Date(item.date).toLocaleDateString()}`}</td>
                    <td className="td-cell">{item.toolName}</td>
                    <td className="td-cell">{new Date(item.date).toLocaleString()}</td>
                    <td className="td-cell">
                      <span className={`status-badge ${item.status === 'Completed' ? 'status-completed' : 'status-failed'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </motion.section>
    </div>
  );
};

export default DashboardHome;
