/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  Globe, 
  Zap, 
  Copy, 
  CheckCircle2,
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AffiliateLink, PLATFORMS } from './types';

export default function App() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', platform: 'Amazon' });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch links', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });
      if (res.ok) {
        setNewLink({ title: '', url: '', platform: 'Amazon' });
        setShowAddModal(false);
        fetchLinks();
      }
    } catch (err) {
      console.error('Failed to add link', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/links/' + id, { method: 'DELETE' });
      fetchLinks();
    } catch (err) {
      console.error('Failed to delete link', err);
    }
  };

  const handleLinkClick = async (id: number, url: string) => {
    try {
      await fetch(`/api/links/${id}/click`, { method: 'POST' });
      window.open(url, '_blank');
      fetchLinks();
    } catch (err) {
      console.error('Failed to track click', err);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareOnSocial = (platform: string, url: string, title: string) => {
    const text = `Check out this amazing deal: ${title}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">AffiliateHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              Add New Link
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 leading-tight">
                Share Your Links <span className="text-indigo-600">Globally</span> in Seconds.
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                The fastest way to distribute your affiliate links across India's 28 states and beyond. 
                One dashboard, infinite reach.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Globe size={16} className="text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Global Distribution</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                  <Zap size={16} className="text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Instant Sharing</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <Globe className="w-full h-full text-indigo-600" />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <BarChart3 className="text-indigo-600 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</span>
            </div>
            <div className="text-3xl font-display font-bold text-slate-900">
              {links.reduce((acc, curr) => acc + curr.clicks, 0).toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +12% from yesterday
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Share2 className="text-amber-600 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Links</span>
            </div>
            <div className="text-3xl font-display font-bold text-slate-900">{links.length}</div>
            <div className="mt-2 text-sm text-slate-500">Across {new Set(links.map(l => l.platform)).size} platforms</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Globe className="text-emerald-600 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reach</span>
            </div>
            <div className="text-3xl font-display font-bold text-slate-900">28 States</div>
            <div className="mt-2 text-sm text-slate-500">Optimized for Indian networks</div>
          </div>
        </div>

        {/* Links List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-display font-bold text-lg text-slate-900">Your Distribution Hub</h2>
            <div className="text-sm text-slate-500 font-medium">
              Manage and Share
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading your links...</div>
            ) : links.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Plus className="text-slate-400 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No links yet</h3>
                <p className="text-slate-500 mb-6">Add your first affiliate link to start earning.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Create your first link →
                </button>
              </div>
            ) : (
              links.map((link) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={link.id} 
                  className="p-6 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl text-white shrink-0 ${PLATFORMS.find(p => p.name === link.platform)?.color || 'bg-slate-600'}`}>
                        <Zap size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate mb-1">{link.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            {link.platform}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 size={14} />
                            {link.clicks} clicks
                          </span>
                          <span className="hidden md:inline">•</span>
                          <span className="truncate max-w-[200px]">{link.url}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Social Quick Share */}
                      <div className="flex items-center gap-1 mr-4 bg-slate-100 p-1 rounded-lg">
                        <button 
                          onClick={() => shareOnSocial('whatsapp', link.url, link.title)}
                          className="p-2 hover:bg-white rounded-md text-emerald-600 transition-all"
                          title="Share on WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button 
                          onClick={() => shareOnSocial('facebook', link.url, link.title)}
                          className="p-2 hover:bg-white rounded-md text-blue-600 transition-all"
                          title="Share on Facebook"
                        >
                          <Facebook size={18} />
                        </button>
                        <button 
                          onClick={() => shareOnSocial('twitter', link.url, link.title)}
                          className="p-2 hover:bg-white rounded-md text-sky-500 transition-all"
                          title="Share on Twitter"
                        >
                          <Twitter size={18} />
                        </button>
                      </div>

                      <button 
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          copiedId === link.id 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {copiedId === link.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {copiedId === link.id ? 'Copied!' : 'Copy Link'}
                      </button>

                      <button 
                        onClick={() => handleLinkClick(link.id, link.url)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Open Link"
                      >
                        <ExternalLink size={20} />
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(link.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add Link Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100">
                <h2 className="text-2xl font-display font-bold text-slate-900">Add New Link</h2>
                <p className="text-slate-500 text-sm">Paste your affiliate link below to start distributing.</p>
              </div>
              
              <form onSubmit={handleAddLink} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setNewLink({ ...newLink, platform: p.name })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          newLink.platform === p.name 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Link Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. iPhone 15 Pro Max - Best Deal"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-all"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Affiliate URL</label>
                  <input 
                    required
                    type="url" 
                    placeholder="https://amazon.in/dp/..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-all"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
                  >
                    Generate & Distribute
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-5 h-5" />
            <span className="font-display font-bold text-lg">AffiliateHub</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 AffiliateHub Link Distribution Network. Optimized for 28 Indian States.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
