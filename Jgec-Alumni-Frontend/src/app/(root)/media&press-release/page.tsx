"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Play, Search, Newspaper, Clock, ChevronLeft, ChevronRight, Camera, MapPin
} from "lucide-react";
import { useGetNewsQuery } from "@/store/feature/media-press-feature";
import Loading from "@/app/Loader";
import toast from "react-hot-toast";

// --- Types ---
type MediaType = "youtube" | "facebook" | "image";

interface MediaAsset {
  id: number;
  type: MediaType;
  url: string;
  newsId: number;
}

interface NewsItem {
  id: number;
  media: MediaAsset[];
  tag: string;
  title: string;
  excerpt: string;
  createdAt: string;
  location: string;
}

// --- Utilities ---
const getMediaEmbedUrl = (type: MediaType, url: string) => {
  if (type === "youtube") {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  if (type === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  return url;
};

const getMediaThumbnail = (type: MediaType, url: string): string => {
  if (type === "youtube") {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  }
  if (type === "facebook") {
    // Note: Facebook thumbnails usually require Graph API, using a placeholder or generic FB icon is safer if IDs are dynamic
    return "https://www.facebook.com/images/fb_icon_325x325.png"; 
  }
  return url;
};

// Define this helper at the top of your component or inside the component body
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function JGECNewspaperFeed() {
  // Initialize as null to prevent property access on undefined
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: newsData, isError, isLoading, error } = useGetNewsQuery({
    search: searchQuery,
  });

  // Sync state when data arrives
  useEffect(() => {
    if (newsData?.data && newsData.data.length > 0) {
      // Only set initial active news if none is selected
      if (!activeNews) {
        setActiveNews(newsData.data[0]);
      }
    }
    if (isError) toast.error((error as any)?.message || "Failed to load news");
  }, [newsData, isError, error]);

  const handleNewsChange = (news: NewsItem) => {
    setActiveNews(news);
    setActiveMediaIndex(0);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredNews = useMemo(() => {
    if (!newsData?.data) return [];
    return newsData.data.filter((item: NewsItem) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || item.tag === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [newsData, searchQuery, activeFilter]);

  // Handle media navigation
  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeNews) {
      setActiveMediaIndex((prev) => (prev + 1) % activeNews.media.length);
    }
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeNews) {
      setActiveMediaIndex((prev) => (prev - 1 + activeNews.media.length) % activeNews.media.length);
    }
  };

  // 1. Check Loading first
  if (isLoading) return <Loading />;

  // 2. Check if activeNews is still null (data hasn't arrived or list is empty)
  if (!activeNews) {
    return (
      <div className="min-h-screen bg-slate-100 pt-40 text-center font-serif">
        <h2 className="text-2xl text-slate-600 italic">No news records available.</h2>
      </div>
    );
  }

  // 3. Safely get current media asset
  const currentMedia = activeNews.media[activeMediaIndex];

  return (
    <div className="min-h-screen bg-slate-100 pt-32 lg:pt-40 pb-12 px-2 md:px-8 font-serif text-slate-900">
      <div className="max-w-[1440px] mx-auto bg-white border border-slate-300 shadow-xl overflow-hidden">
        
        {/* Newspaper Header */}
        <header className="p-4 md:p-8 border-b-4 border-double border-slate-900 text-center">
          <div className="flex justify-between items-center text-[8px] md:text-xs font-sans font-bold border-b border-slate-200 pb-2 mb-4 md:mb-6 uppercase tracking-[0.2em] text-slate-500">
            <span>Vol. LXVI ... No. 2026</span>
            <span className="hidden sm:block">Jalpaiguri Government Engineering College</span>
            <span>Est. 1961</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-slate-900">
            Media & <span className="text-indigo-700">Press Releases</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-200 pt-2 text-[9px] md:text-xs font-sans font-bold uppercase text-slate-500">
            <span>Last Updated: {formatDate(activeNews.createdAt)}</span>
            <span className="flex items-center gap-2 text-emerald-600">
              <Newspaper size={14} /> Official Despatches
            </span>
            <span className="hidden lg:block text-primary">Member Portal Active</span>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row border-b border-slate-200">
          <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3 bg-slate-50">
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search Public Records..."
              className="bg-transparent outline-none w-full font-sans text-sm italic"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1 p-2 overflow-x-auto no-scrollbar bg-white">
            {["All", "Event", "Notice", "Achievement"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-2 text-[10px] font-sans font-black uppercase tracking-widest transition-all
                  ${activeFilter === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-col lg:flex-row">
          {/* LEFT: Lead Story */}
          <div className="lg:w-2/3 p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="lg:sticky lg:top-10 space-y-6">
              
              {/* Media Gallery with safety check on currentMedia */}
              {currentMedia && (
                <div className="relative border-4 md:border-[12px] border-slate-100 shadow-sm">
                  <div className="aspect-video w-full overflow-hidden bg-black relative">
                    {currentMedia.type === "image" ? (
                      <img src={currentMedia.url} className="w-full h-full object-cover" alt={activeNews.title} />
                    ) : (
                      <iframe
                        className="w-full h-full"
                        src={getMediaEmbedUrl(currentMedia.type, currentMedia.url)}
                        allowFullScreen
                      />
                    )}

                    {activeNews.media.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                        <button onClick={prevMedia} className="pointer-events-auto bg-white/90 p-2 hover:bg-slate-900 hover:text-white shadow-lg">
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextMedia} className="pointer-events-auto bg-white/90 p-2 hover:bg-slate-900 hover:text-white shadow-lg">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 bg-purple-700 text-white px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest shadow-md">
                    {currentMedia.type}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-sans font-black uppercase text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Lead Story
                </div>
                <h2 className="text-3xl md:text-4xl font-black leading-[0.95] tracking-tighter uppercase text-slate-900">
                  {activeNews.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-base leading-relaxed text-justify italic border-t border-slate-100 pt-6 text-slate-700">
                  <p className="first-letter:text-6xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-slate-900 first-letter:not-italic">
                    {activeNews.excerpt}
                  </p>
                  <div className="font-sans font-bold text-[11px] not-italic text-primary uppercase tracking-tight bg-slate-50 p-4 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-1"><MapPin size={12}/> {activeNews.location}</div>
                    <div className="flex items-center gap-2"><Clock size={12}/> Filed: {formatDate(activeNews.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Feed Pane */}
          <div className="lg:w-1/3 bg-white">
            <div className="p-3 bg-slate-900 text-white flex justify-between items-center font-sans font-bold text-[10px] uppercase tracking-widest">
              <span>Latest Despatches</span>
              <span className="opacity-60 italic">Scroll for more</span>
            </div>

            <div className="max-h-[600px] lg:h-[calc(100vh-300px)] overflow-y-auto divide-y divide-slate-100 custom-newspaper-scrollbar">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNewsChange(item)}
                  className={`group cursor-pointer p-4 transition-all flex gap-4
                    ${activeNews.id === item.id ? "bg-slate-50 border-l-4 border-purple-700" : "hover:bg-slate-50/50"}
                  `}
                >
                  <div className="h-20 w-20 shrink-0 border border-slate-200 p-1 bg-white relative overflow-hidden shadow-sm">
                    <img
                      src={getMediaThumbnail(item.media[0].type, item.media[0].url)}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt=""
                    />
                    {item.media.length > 1 && (
                      <div className="absolute top-0.5 left-0.5 bg-white border border-slate-900 p-0.5 shadow-sm">
                        <Camera size={8} />
                      </div>
                    )}
                    {item.media[0].type !== "image" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Play size={14} className="text-white fill-white opacity-80" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-sans font-black uppercase text-purple-700 border-b border-purple-700">
                        {item.tag}
                      </span>
                      <span className="text-[8px] font-sans text-slate-400 font-bold uppercase">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h4 className={`text-sm md:text-base font-bold leading-tight transition-all
                      ${activeNews.id === item.id ? "text-slate-900 underline" : "text-slate-500 group-hover:text-primary"}
                    `}>
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-newspaper-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-newspaper-scrollbar::-webkit-scrollbar-thumb { background: #0f172a; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
