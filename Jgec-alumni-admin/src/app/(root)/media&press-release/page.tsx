"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  Plus,
  Trash2,
  Video,
  X,
  Loader2,
  Newspaper,
  Edit3,
  MapPin,
  Calendar,
  Camera,
  Search,
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import Image from "next/image";

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
import toast from "react-hot-toast";

interface Media {
  id: number;
  type: "image" | "youtube" | "facebook";
  url: string;
}

interface NewsItem {
  id: number;
  title: string;
  tag: string;
  excerpt: string;
  date: string;
  location: string;
  media: Media[];
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/media_press`;

export default function MediaPressAdmin() {
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  // Logic States
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<Media[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<{ id?: number; type: "youtube" | "facebook"; url: string }[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    tag: "Event",
    excerpt: "",
    date: new Date().toISOString().split("T")[0],
    location: "JGEC Campus",
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setNewsList(data.data || data || []);
    } catch {
      toast.error("Failed to load press releases");
    }
  };

  const handleDeleteItem = async (id: number, title: string) => {
    if (!window.confirm(`Permanently delete article "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Press release deleted");
        fetchNews();
      }
    } catch {
      toast.error("Failed to delete article");
    }
  };

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

      newImages.forEach((file) => data.append("images", file));

      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        toast.success(editId ? "Article updated" : "Article published");
        setIsModalOpen(false);
        fetchNews();
        resetStates();
      } else {
        toast.error("Failed to save article");
      }
    } catch {
      toast.error("Error submitting press release");
    } finally {
      setLoading(false);
    }
  };

  const resetStates = () => {
    setEditId(null);
    setDeleteMediaIds([]);
    setExistingImages([]);
    setNewImages([]);
    setVideoLinks([]);
    setFormData({
      title: "",
      tag: "Event",
      excerpt: "",
      date: new Date().toISOString().split("T")[0],
      location: "JGEC Campus",
    });
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      tag: item.tag || "Event",
      excerpt: item.excerpt,
      date: item.date,
      location: item.location || "JGEC Campus",
    });
    setExistingImages(item.media.filter((m) => m.type === "image"));
    setVideoLinks(
      item.media
        .filter((m) => m.type !== "image")
        .map((m) => ({ id: m.id, type: m.type as "youtube" | "facebook", url: m.url }))
    );
    setDeleteMediaIds([]);
    setNewImages([]);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    resetStates();
    setIsModalOpen(true);
  };

  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "all" || item.tag?.toLowerCase() === selectedTag.toLowerCase();
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full space-y-6">
      {/* Command Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Media & Press Releases
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Publish institutional updates, media announcements, alumni honors, and news clippings.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Story</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, stories, or summaries..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {["all", "Event", "Notice", "Achievement", "Alumni"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tag === "all" ? "All Tags" : tag}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Total Articles: <strong className="text-slate-900 dark:text-slate-100">{filteredNews.length}</strong>
          </div>
        </div>

        {/* Story Grid */}
        <div className="p-4 sm:p-6">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => {
                const coverImage = item.media?.find((m) => m.type === "image")?.url;

                return (
                  <div
                    key={item.id}
                    className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                        {coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <Newspaper className="h-8 w-8 opacity-40 mb-1" />
                            <span className="text-[11px] font-medium">Official Dispatch</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-primary border border-slate-200 dark:border-slate-800 shadow-xs">
                          {item.tag || "News"}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                            title={item.title}
                          >
                            {item.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 rounded-lg shrink-0">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36 rounded-xl border-slate-200 dark:border-slate-800">
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(item)}
                                className="cursor-pointer text-xs font-medium py-2"
                              >
                                <Edit3 size={14} className="mr-2 text-primary" /> Edit Story
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteItem(item.id, item.title)}
                                className="cursor-pointer text-xs font-medium py-2 text-rose-600 focus:text-rose-600"
                              >
                                <Trash2 size={14} className="mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location || "Campus"}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Newspaper className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">No press releases published</p>
                <p className="text-xs text-slate-500 mt-1">
                  Document campus events, honorary alumni awards, or official announcements.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  Create First Release
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <span>{editId ? "Edit Press Release" : "Draft New Press Release"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Article Title / Headline</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Alumni Convention 2026..."
                  required
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Tag</Label>
                  <Select value={formData.tag} onValueChange={(val) => setFormData({ ...formData, tag: val })}>
                    <SelectTrigger className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Notice">Notice</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Release Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="JGEC Campus"
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Executive Summary / Excerpt</Label>
                <Textarea
                  rows={4}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Provide an overview of the event, keynote speakers, or decisions reached..."
                  required
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              {/* Photo Uploads */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-primary" />
                  <span>Article Photos</span>
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {existingImages.map((img) => (
                    <div key={img.id} className="aspect-square bg-slate-100 rounded-lg relative group overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} className="w-full h-full object-cover" alt="Article Media" />
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteMediaIds((prev) => [...prev, img.id]);
                          setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
                        }}
                        className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {newImages.map((file, i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-lg relative group overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
                      <button
                        type="button"
                        onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-white/90 text-rose-600 rounded p-1 shadow-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                    <Plus size={20} />
                    <span className="text-[10px] font-semibold mt-1">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && setNewImages([...newImages, ...Array.from(e.target.files)])}
                    />
                  </label>
                </div>
              </div>

              {/* Broadcasts */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-primary" />
                  <span>External Video Broadcasts (YouTube / Facebook)</span>
                </Label>
                <div className="space-y-2">
                  {videoLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <Select
                        value={link.type}
                        onValueChange={(val) => {
                          const up = [...videoLinks];
                          up[i].type = val as "youtube" | "facebook";
                          setVideoLinks(up);
                        }}
                      >
                        <SelectTrigger className="w-[110px] h-8 bg-white dark:bg-slate-900 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <SelectItem value="youtube" className="text-xs">YouTube</SelectItem>
                          <SelectItem value="facebook" className="text-xs">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                      <input
                        placeholder="Paste streaming URL..."
                        value={link.url}
                        onChange={(e) => {
                          const up = [...videoLinks];
                          up[i].url = e.target.value;
                          setVideoLinks(up);
                        }}
                        className="bg-transparent text-xs flex-1 px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setVideoLinks(videoLinks.filter((_, idx) => idx !== i))}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setVideoLinks([...videoLinks, { type: "youtube", url: "" }])}
                    className="w-full py-1.5 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Video Broadcast URL</span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-2 shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button disabled={loading} type="submit" className="bg-primary hover:bg-primary/95 text-white text-xs">
                {loading ? <Loader2 className="animate-spin mr-1.5 h-3.5 w-3.5" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                {editId ? "Update Story" : "Publish Story"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
