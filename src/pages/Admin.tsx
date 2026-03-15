import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { RichTextEditor } from '../components/RichTextEditor';
import { toast } from 'sonner';
import { Modal } from '../components/Modal';
import { Search, Filter, Plus, Trash2, Edit3, Eye, LayoutDashboard, FileText, Settings, Activity } from 'lucide-react';

import { LoadingLattice } from '../components/LoadingLattice';
import { Lattice3D } from '../components/Lattice3D';
import { GoogleGenAI } from '@google/genai';

const AIAssistant = ({ onGenerate }: { onGenerate: (content: string) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithRetry = async (ai: any, params: any, retries = 2, delay = 1000): Promise<any> => {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const status = err?.status || err?.code;
      const message = err?.message || "";

      if (status === 403 || message.includes("permission")) {
        // Try falling back to a more common model if 3.1 fails
        if (params.model === 'gemini-3.1-pro-preview') {
          console.warn("Permission denied for 3.1-pro, falling back to 3-flash");
          return await ai.models.generateContent({
            ...params,
            model: 'gemini-3-flash-preview'
          });
        }
        throw new Error("PERMISSION_DENIED: Your API key does not have access to this model or billing is not enabled.");
      }

      if (retries > 0 && (status === 500 || status === 503 || status === 429 || !status)) {
        console.warn(`Retrying AI generation. Retries left: ${retries}. Error:`, err);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateWithRetry(ai, params, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      // @ts-ignore
      const apiKey = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null) || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY_NOT_FOUND");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await generateWithRetry(ai, {
        model: 'gemini-3.1-pro-preview',
        contents: `Generate a high-fidelity, brutalist, and sophisticated blog post content for a design agency called SAVANT. The topic is: ${prompt}. Use a cryptic, powerful, and proprietary tone. Return the content in HTML format. Only return the HTML body content, no head or body tags.`,
      });
      onGenerate(response.text || '');
      toast.success('NEURAL_SYNTHESIS_COMPLETE');
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      toast.error(`SYNTHESIS_FAILED: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="font-mono text-[9px] text-electric-gold tracking-[0.3em] uppercase mb-4">Neural_Content_Synthesizer</div>
      <div className="flex gap-4">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ENTER_TOPIC_FOR_SYNTHESIS..."
          className="flex-1 bg-white/5 border border-white/10 p-3 text-white font-mono text-[10px] focus:outline-none focus:border-electric-gold transition-all"
        />
        <TechButton 
          onClick={handleGenerate}
          disabled={isGenerating}
          width="w-32"
          height="h-10"
          colorClass="bg-electric-gold"
          borderClass="bg-electric-gold"
        >
          {isGenerating ? 'SYNTHESIZING...' : 'GENERATE'}
        </TechButton>
      </div>
    </div>
  );
};

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const { posts, addPost, updatePost, deletePost } = useBlog();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      drafts: posts.filter(p => p.status === 'draft').length,
      lastUpdated: posts.length > 0 ? new Date(Math.max(...posts.map(p => new Date(p.createdAt).getTime()))).toLocaleDateString() : 'N/A'
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [posts, searchQuery, filterStatus]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(`AUTHENTICATION_FAILED: ${error?.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('SESSION_TERMINATED');
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(`TERMINATION_FAILED: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('MISSING_REQUIRED_PARAMETERS');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updatePost(editingId, title, content, status);
        toast.success('DATA_NODE_UPDATED');
        setEditingId(null);
      } else {
        await addPost(title, content, status);
        toast.success('DATA_NODE_PUBLISHED');
      }
      setTitle('');
      setContent('');
      setStatus('draft');
      setViewMode('editor');
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error(`OPERATION_FAILED: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setStatus(post.status);
    setEditingId(post.id);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setTitle('');
    setContent('');
    setStatus('draft');
    setEditingId(null);
    setViewMode('editor');
  };

  const confirmDelete = (id: string) => {
    setPostToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await deletePost(postToDelete);
      toast.success('DATA_NODE_DELETED');
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(`DELETION_FAILED: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingLattice />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="max-w-md w-full p-12 border border-white/10 bg-obsidian/80 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-crimson/50" />
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/20 tracking-widest">RESTRICTED_ACCESS</div>
          
          <h2 className="font-display font-black text-4xl text-white mb-8 tracking-tighter">Admin_Terminal</h2>
          <p className="font-mono text-xs text-white/40 mb-12">Authentication required to access sovereign data controls.</p>
          
          <TechButton 
            onClick={handleLogin}
            width="w-full"
            height="h-16"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'PROCESSING...' : 'AUTHENTICATE_VIA_GOOGLE'}
          </TechButton>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="max-w-md w-full p-12 border border-crimson/30 bg-obsidian/80 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-crimson" />
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-crimson tracking-widest">ACCESS_DENIED</div>
          
          <h2 className="font-display font-black text-4xl text-white mb-8 tracking-tighter">Insufficient_Privileges</h2>
          <p className="font-mono text-xs text-white/40 mb-12">Your current clearance level does not permit access to this terminal.</p>
          
          <TechButton 
            onClick={handleLogout}
            colorClass="bg-white"
            borderClass="bg-white"
            width="w-full"
            height="h-16"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'TERMINATING...' : 'TERMINATE_SESSION'}
          </TechButton>
        </div>
      </div>
    );
  }

  return (
    <div className="savant-page-container">
      {/* Background Lattice */}
      <div className="fixed inset-0 pointer-events-none opacity-20 grayscale">
        <Lattice3D />
      </div>
      
      <div className="savant-stack">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-crimson" />
              <span className="font-mono text-[10px] text-crimson tracking-[0.5em] uppercase">Sovereign_Lattice_v5.5 // Admin</span>
            </div>
            <h1 className="font-display font-black text-6xl md:text-8xl text-white tracking-tighter leading-[0.8]">
              Command_ <br />
              <span className="text-crimson italic font-serif text-[0.7em]">Center.</span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Authenticated_As</div>
              <div className="font-mono text-xs text-white font-bold">{user.email}</div>
            </div>
            <TechButton 
              onClick={handleLogout}
              width="w-32"
              height="h-12"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'TERMINATING...' : 'LOGOUT'}
            </TechButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="savant-grid grid-cols-2 md:grid-cols-4">
          {[
            { label: 'TOTAL_NODES', value: stats.total, icon: FileText, color: 'text-white' },
            { label: 'PUBLISHED', value: stats.published, icon: Activity, color: 'text-electric-gold' },
            { label: 'DRAFTS', value: stats.drafts, icon: Edit3, color: 'text-white/40' },
            { label: 'LAST_SYNC', value: stats.lastUpdated, icon: LayoutDashboard, color: 'text-crimson' }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, x: [0, -2, 2, 0] }}
              transition={{ 
                opacity: { delay: i * 0.1 },
                y: { delay: i * 0.1 },
                x: { duration: 0.2, repeat: 0 }
              }}
              className="p-6 border border-white/10 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-crimson group-hover:h-full transition-all duration-500" />
              
              {/* Glitch Overlay */}
              <motion.div 
                className="absolute inset-0 bg-crimson/5 opacity-0 group-hover:opacity-100 pointer-events-none"
                animate={stat.label === 'LAST_SYNC' ? { opacity: [0, 0.1, 0] } : {}}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
              <stat.icon size={14} className="text-white/20 mb-4" />
              <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mb-2">{stat.label}</div>
              <div className={`font-display font-black text-3xl ${stat.color}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="savant-grid lg:grid-cols-12 items-start !gap-16">
          {/* Editor Panel */}
          <div className="lg:col-span-7 relative">
            <div className="p-10 border border-white/10 bg-obsidian/60 backdrop-blur-3xl overflow-hidden relative">
              {/* Scanning Line */}
              <motion.div 
                className="absolute inset-0 w-full h-[1px] bg-electric-gold/5 z-0 pointer-events-none"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute top-0 left-0 w-1 h-full bg-electric-gold/50" />
              
              <div className="flex justify-between items-center mb-8">
                <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                  {editingId ? 'EDIT_DATA_NODE' : 'CREATE_DATA_NODE'}
                </div>
                <div className="flex bg-white/5 p-1 border border-white/10">
                  <button 
                    onClick={() => setViewMode('editor')}
                    className={`px-4 py-1 font-mono text-[9px] tracking-widest transition-all ${viewMode === 'editor' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    EDITOR
                  </button>
                  <button 
                    onClick={() => setViewMode('preview')}
                    className={`px-4 py-1 font-mono text-[9px] tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    PREVIEW
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {viewMode === 'editor' ? (
                  <motion.form 
                    key="editor"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-white/50 tracking-widest">TITLE</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:outline-none focus:border-electric-gold transition-colors duration-300" 
                        placeholder="ENTER_TITLE" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-white/50 tracking-widest">CONTENT</label>
                      <RichTextEditor 
                        content={content} 
                        onChange={setContent} 
                      />
                      <AIAssistant onGenerate={(generated) => setContent(generated)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-white/50 tracking-widest">STATUS</label>
                        <select 
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                          className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:outline-none focus:border-electric-gold transition-colors duration-300 appearance-none"
                        >
                          <option value="draft">DRAFT</option>
                          <option value="published">PUBLISHED</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <TechButton 
                        type="submit"
                        colorClass="bg-electric-gold"
                        borderClass="bg-electric-gold"
                        width="flex-1"
                        height="h-16"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'PROCESSING...' : (editingId ? 'UPDATE_NODE' : 'PUBLISH_NODE')}
                      </TechButton>
                      
                      {editingId && (
                        <TechButton 
                          type="button" 
                          onClick={handleCancelEdit}
                          colorClass="bg-white"
                          borderClass="bg-white"
                          width="w-32"
                          height="h-16"
                        >
                          CANCEL
                        </TechButton>
                      )}
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="font-mono text-[10px] text-crimson tracking-[0.5em] uppercase">PREVIEW_MODE</div>
                      <h2 className="font-display font-black text-5xl text-white tracking-tighter leading-none">{title || 'UNTITLED_NODE'}</h2>
                    </div>
                    <div 
                      className="prose prose-invert prose-lg max-w-none font-light text-white/70"
                      dangerouslySetInnerHTML={{ __html: content || '<p className="text-white/20 italic">NO_CONTENT_PROVIDED</p>' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Data Lattice (Posts List) */}
          <div className="lg:col-span-5 savant-stack relative">
            <div className="savant-stack !gap-6">
              <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase border-b border-white/10 pb-4 flex justify-between items-center">
                <span>DATA_LATTICE_INDEX</span>
                <span>{filteredPosts.length} NODES</span>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH_NODES..."
                    className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white font-mono text-[10px] tracking-widest focus:outline-none focus:border-crimson/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-white/5 border border-white/10 pl-12 pr-8 py-3 text-white font-mono text-[10px] tracking-widest focus:outline-none focus:border-crimson/50 transition-all appearance-none"
                  >
                    <option value="all">ALL_STATUS</option>
                    <option value="published">PUBLISHED</option>
                    <option value="draft">DRAFTS</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="p-12 border border-white/5 bg-white/[0.01] text-center">
                <div className="font-mono text-xs text-white/30 tracking-widest">NO_DATA_NODES_FOUND</div>
              </div>
            ) : (
              <div className="savant-stack !gap-4">
                {filteredPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Scanning Line on Hover */}
                    <motion.div 
                      className="absolute inset-0 w-full h-[1px] bg-white/5 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className={`absolute top-0 left-0 w-[2px] h-full ${post.status === 'published' ? 'bg-electric-gold' : 'bg-white/10'}`} />
                    
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-xl text-white tracking-tight group-hover:text-electric-gold transition-colors">{post.title}</h3>
                        <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">
                          {new Date(post.createdAt).toLocaleDateString()} // {post.status}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="p-2 bg-white/5 hover:bg-electric-gold hover:text-black transition-all border border-white/10"
                          title="EDIT"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(post.id)}
                          className="p-2 bg-white/5 hover:bg-crimson transition-all border border-white/10"
                          title="DELETE"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div 
                      className="text-white/40 font-light line-clamp-2 text-xs prose prose-invert prose-sm max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <div className="font-mono text-[8px] text-white/10">NODE_ID: {post.id.substring(0, 8)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm_Deletion"
        footer={
          <>
            <TechButton 
              onClick={() => setIsDeleteModalOpen(false)}
              width="w-32"
              height="h-12"
              colorClass="bg-white"
              borderClass="bg-white"
            >
              CANCEL
            </TechButton>
            <TechButton 
              onClick={handleDelete}
              width="w-32"
              height="h-12"
              colorClass="bg-crimson"
              borderClass="bg-crimson"
            >
              DELETE
            </TechButton>
          </>
        }
      >
        <div className="space-y-4">
          <p>You are about to terminate a data node from the sovereign lattice.</p>
          <div className="p-4 bg-crimson/10 border border-crimson/20 text-crimson font-mono text-[10px] tracking-widest uppercase">
            Warning: This operation is irreversible and will result in permanent data loss.
          </div>
          <p className="text-white/40 italic">Continue with deletion sequence?</p>
        </div>
      </Modal>
    </div>
  );
}
