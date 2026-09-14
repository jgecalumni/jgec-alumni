"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { 
  Plus, Trash2, Video, X, Loader2, Newspaper, 
  Edit3, MapPin, Calendar, Image as ImageIcon, 
  Camera, Search, Globe, Filter, MoreHorizontal,
  CheckCircle2, AlertCircle, Trash
} from "lucide-react";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Media { id: number; type: "image" | "youtube" | "facebook"; url: string; }
interface NewsItem { id: number; title: string; tag: string; excerpt: string; date: string; location: string; media: Media[]; }

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/media_press`;

export default function MediaPressAdmin() {
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Logic States
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<Media[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<{id?: number, type: "youtube" | "facebook", url: string}[]>([]);
  
  const [formData, setFormData] = useState({
    title: "", tag: "Event", excerpt: "", 
    date: new Date().toISOString().split('T')[0], 
    location: "JGEC Campus" 
  });

  useEffect(() => { fetchNews(); }, []);

  // --- READ ---
  const fetchNews = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setNewsList(data.data || data);
    } catch (err) { console.error("Fetch failed"); }
  };

  // --- DELETE ---
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchNews();
    } catch (err) { console.error("Deletion failed:", err); }
  };

  // --- CREATE & UPDATE ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API_BASE_URL}/${editId}` : API_BASE_URL;
    const method = editId ? "PATCH" : "POST";

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("tag", formData.tag);
      data.append("excerpt", formData.excerpt);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("videoLinks", JSON.stringify(videoLinks));
      data.append("deleteMediaIds", JSON.stringify(deleteMediaIds));
      
      newImages.forEach(file => data.append("images", file));

      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        fetchNews();
        resetStates();
      }
    } catch (err) { console.error("Submit failed:", err); }
    finally { setLoading(false); }
  };

  const resetStates = () => {
    setEditId(null);
    setDeleteMediaIds([]);
    setExistingImages([]);
    setNewImages([]);
    setVideoLinks([]);
    setFormData({ 
      title: "", tag: "Event", excerpt: "", 
      date: new Date().toISOString().split('T')[0], 
      location: "JGEC Campus" 
    });
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditId(item.id);
    setFormData({ title: item.title, tag: item.tag, excerpt: item.excerpt, date: item.date, location: item.location });
    setExistingImages(item.media.filter(m => m.type === 'image'));
    setVideoLinks(item.media.filter(m => m.type !== 'image').map(m => ({ id: m.id, type: m.type as "youtube" | "facebook", url: m.url })));
    setDeleteMediaIds([]);
    setNewImages([]);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    resetStates();
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 w-full">
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Media & Press Release</h1>
          <p className="text-muted-foreground mt-1">Manage and curate campus news stories.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              placeholder="Search archive..." 
              className="bg-background border border-border rounded-lg py-2 pl-9 pr-4 text-sm w-64 outline-none focus:ring-2 focus:ring-ring focus:border-input text-foreground transition-all"
            />
          </div>
          <button 
            onClick={handleOpenCreate} 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 duration-300"
          >
            <Plus size={18} /> 
            <span>Create Article</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div key={item.id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video bg-muted overflow-hidden border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.media.find(m => m.type === 'image')?.url || "https://placehold.co/600x400/f1f5f9/94a3b8?text=NO+IMAGE"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={item.title}
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-background/95 backdrop-blur rounded-full text-xs font-bold uppercase text-primary shadow-sm border border-border">
                  {item.tag}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-card-foreground line-clamp-2 leading-snug text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground transition-all rounded-lg shrink-0">
                        <MoreHorizontal size={18}/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-border bg-popover p-1">
                      <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="cursor-pointer font-medium py-2 text-popover-foreground rounded-lg hover:bg-muted">
                        <Edit3 size={16} className="mr-2 text-primary"/> Edit Article
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive cursor-pointer font-medium py-2 rounded-lg hover:bg-destructive/10">
                        <Trash2 size={16} className="mr-2"/> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium leading-relaxed">{item.excerpt}</p>
                
                <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-muted-foreground/70"/> {item.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-muted-foreground/70"/> {item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {newsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border shadow-sm px-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">No Press Releases Yet</h3>
            <p className="text-muted-foreground max-w-sm text-sm font-medium mb-8">
              Document alumni achievements or upcoming skill development seminars here to keep the community informed and engaged.
            </p>
            <Button onClick={handleOpenCreate} className="rounded-lg bg-primary hover:bg-primary/90 px-6 py-2.5 font-semibold text-primary-foreground shadow-sm transition-all">
              <Plus size={18} className="mr-2" /> Publish Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border border-border shadow-lg bg-card sm:max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <Edit3 size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editId ? "Update News" : "Draft New Article"}
                </DialogTitle>
                <p className="text-muted-foreground text-sm mt-1">Capture alumni success and campus events.</p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1 modal-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Headline</Label>
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Skill Development Seminar 2026..." 
                      className="bg-background border-border focus:ring-2 focus:ring-ring focus:border-input transition-all placeholder:text-muted-foreground" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">Category</Label>
                      <Select value={formData.tag} onValueChange={(val) => setFormData({...formData, tag: val})}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border rounded-lg">
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Notice">Notice</SelectItem>
                          <SelectItem value="Achievement">Achievement</SelectItem>
                          <SelectItem value="Alumni">Alumni</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">Date</Label>
                      <Input 
                        type="date" 
                        value={formData.date} 
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="bg-background border-border" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Excerpt</Label>
                    <Textarea 
                      rows={6}
                      value={formData.excerpt} 
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Write a catchy summary..." 
                      className="bg-background border-border focus:ring-2 focus:ring-ring focus:border-input text-sm resize-y transition-all" 
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="p-5 bg-muted/40 rounded-xl border border-border">
                    <Label className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Camera size={16} className="text-primary" /> Gallery Assets
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {existingImages.map(img => (
                        <div key={img.id} className="aspect-square bg-background rounded-lg border border-border relative group overflow-hidden shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
                          <button type="button" onClick={() => {
                            setDeleteMediaIds(prev => [...prev, img.id]);
                            setExistingImages(prev => prev.filter(i => i.id !== img.id));
                          }} className="absolute inset-0 bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Trash size={18}/>
                          </button>
                        </div>
                      ))}
                      {newImages.map((file, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg border border-border relative group overflow-hidden">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New Upload" />
                           <button type="button" onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-background/80 hover:bg-background text-destructive rounded-md p-1 shadow-sm transition-colors">
                             <X size={14}/>
                           </button>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground">
                        <Plus size={24} />
                        <span className="text-xs mt-1 font-medium">Add</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && setNewImages([...newImages, ...Array.from(e.target.files)])} />
                      </label>
                    </div>
                  </div>

                  <div className="p-5 bg-muted/40 rounded-xl border border-border">
                    <Label className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Video size={16} className="text-primary" /> Broadcasts
                    </Label>
                    <div className="space-y-3">
                      {videoLinks.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center bg-background p-1.5 rounded-xl border border-border shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-input transition-all">
                          <Select 
                            value={link.type}
                            onValueChange={(val) => {
                              const up = [...videoLinks];
                              up[i].type = val as "youtube" | "facebook";
                              setVideoLinks(up);
                            }}
                          >
                            <SelectTrigger className="w-[110px] h-9 bg-muted border-0 shadow-none text-xs rounded-lg focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-xl shadow-lg">
                              <SelectItem value="youtube" className="text-xs font-medium">YouTube</SelectItem>
                              <SelectItem value="facebook" className="text-xs font-medium">Facebook</SelectItem>
                            </SelectContent>
                          </Select>
                          <input 
                            placeholder="Paste broadcast link..."
                            value={link.url} 
                            onChange={(e) => {
                              const up = [...videoLinks];
                              up[i].url = e.target.value;
                              setVideoLinks(up);
                            }}
                            className="bg-transparent border-none text-sm outline-none flex-1 px-2 min-w-0 truncate text-foreground placeholder:text-muted-foreground" 
                          />
                          <button type="button" className="text-muted-foreground hover:text-destructive shrink-0 p-1.5 rounded-lg hover:bg-destructive/10 transition-colors mr-1" onClick={() => setVideoLinks(videoLinks.filter((_, idx) => idx !== i))}>
                             <X size={16} />
                          </button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" className="w-full border-dashed border-border text-muted-foreground text-sm hover:text-foreground hover:bg-muted transition-all" onClick={() => setVideoLinks([...videoLinks, { type: "youtube", url: "" }])}>
                        <Plus size={16} className="mr-2" /> Add Stream Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="bg-background border-border text-foreground hover:bg-muted">Cancel</Button>
              <Button disabled={loading} type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all min-w-[140px]">
                {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <CheckCircle2 className="mr-2" size={16}/>}
                {editId ? "Update News" : "Publish News"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}