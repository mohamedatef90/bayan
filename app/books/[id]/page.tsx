"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft,
  Calendar,
  BookmarkCheck,
  Download,
  Award,
  Book,
  FileText,
  Bookmark,
  Languages,
  ArrowRight,
  Sparkles,
  Award as ScholarBadge,
  CheckCircle,
  FileCheck,
  User,
  LogOut,
  Clock,
  BookMarked,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_BOOKS, Book as BookType } from "@/lib/booksData";
import { translations, TSet } from "@/lib/translations";
import { safeStringify } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  // Safe resolution of parameters
  const resolvedParams = React.use ? React.use(params) : (params as any);
  const bookId = resolvedParams?.id;

  // Localization State
  const [lang, setLang] = useState<"en" | "ar">(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("bayan_lang");
      if (savedLang === "ar" || savedLang === "en") return savedLang as "en" | "ar";
    }
    return "en";
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t: TSet = translations[lang];

  // Auth States mapping other pages
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bayan_is_logged_in") === "true";
    }
    return false;
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bayan_user_email") || "";
    }
    return "";
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Load from localStorage
  const [publicBooks, setPublicBooks] = useState<BookType[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bayan_public_books");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse public books:", e);
        }
      }
    }
    return INITIAL_BOOKS;
  });
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedDownloads = localStorage.getItem("bayan_downloads");
      if (storedDownloads) {
        try {
          return JSON.parse(storedDownloads);
        } catch (e) {
          console.error("Failed to parse downloads:", e);
        }
      }
    }
    return [];
  });
  const [printBook, setPrintBook] = useState<BookType | null>(null);

  // Sync state on mount
  useEffect(() => {
    // Already handled in lazy state initializers above.
  }, []);

  // Sync auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bayan_is_logged_in", isLoggedIn ? "true" : "false");
      localStorage.setItem("bayan_user_email", userEmail);
    }
  }, [isLoggedIn, userEmail]);

  // Handle language switch
  const changeLanguage = (newLang: "en" | "ar") => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("bayan_lang", newLang);
    }
  };

  // Find the book
  const book = publicBooks.find(b => b.id === bookId);

  // Simulated PDF Downloader
  const handleDownloadPDF = () => {
    if (!book) return;
    setPrintBook(book);
    
    // Save to downloaded shelf
    if (!downloadedIds.includes(book.id)) {
      const updated = [...downloadedIds, book.id];
      setDownloadedIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("bayan_downloads", safeStringify(updated));
      }
    }

    setTimeout(() => {
      window.print();
      setPrintBook(null);
    }, 500);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
        <div className="geo-bg" />
        <Book className="w-16 h-16 text-slate/40 mb-4 animate-pulse" />
        <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
          {lang === "en" ? "Manuscript Not Found" : "المخطوطة غير موجودة"}
        </h2>
        <p className="text-sm text-slate max-w-md mb-6 leading-relaxed">
          {lang === "en" 
            ? "The requested classical work could not be located in our digital repository catalogs." 
            : "لم نتمكن من العثور على المخطوطة المطلوبة في فهارس ومستودعات بيان الرقمية."}
        </p>
        <Link 
          href="/books"
          className="bg-ink-900 hover:bg-[#c7a05a] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
        >
          {lang === "en" ? "Return to Catalog" : "العودة للفهرس الكامل"}
        </Link>
      </div>
    );
  }

  const isAlreadyDownloaded = downloadedIds.includes(book.id);

  return (
    <div className={`min-h-screen bg-paper font-sans relative pb-16 selection:bg-gold-500/20`} dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Decorative Islamic Geometry Overlay */}
      <div className="geo-bg" />

      {/* TOP NAV BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-paper/90 border-b border-ink-900/10 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gold-300/30 shadow-xs">
              <img 
                src="https://i.postimg.cc/hjnRFmmk/bayan-logo-2.png" 
                alt="Bayan Logo" 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wider text-ink-900 block leading-none">
                {t.brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#c7a05a] font-mono block mt-0.5">
                {lang === "en" ? "Heritage Library" : "مسند التراث"}
              </span>
            </div>
          </Link>

          {/* Navigation links matching app catalog navigation */}
          <div className="hidden md:flex items-center gap-1.5 bg-paper-2/50 p-1.5 rounded-xl border border-ink-900/5">
            <Link
              href="/?tab=library"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all"
            >
              {t.tabLibrary}
            </Link>
            <Link
              href="/books"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all"
            >
              {t.tabCatalog}
            </Link>
            <Link
              href="/?tab=portal"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all"
            >
              {t.tabPeerReview}
            </Link>
            <Link
              href="/?tab=shelf"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all"
            >
              {t.tabMyShelf}
            </Link>
          </div>

          {/* Right Actions: Language and User Auth status info */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-10 px-3.5 rounded-xl bg-white border border-ink-900/5 flex items-center gap-2 hover:bg-paper-2 text-ink-900 transition-all text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Languages className="w-4 h-4 text-gold-700 font-bold" />
                <span className="hidden sm:inline">{lang === "en" ? "English" : "العربية"}</span>
              </button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute mt-2 w-32 rounded-xl bg-white border border-ink-900/10 shadow-lg py-1.5 z-50 overflow-hidden ${lang === "en" ? "right-0" : "left-0"}`}
                  >
                    <button
                      onClick={() => { changeLanguage("en"); setLangDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-char hover:bg-paper-2 flex items-center justify-between"
                    >
                      <span>English</span>
                      {lang === "en" && <span className="text-gold-700">✓</span>}
                    </button>
                    <button
                      onClick={() => { changeLanguage("ar"); setLangDropdownOpen(false); }}
                      className="w-full text-right px-4 py-2 text-xs text-char hover:bg-paper-2 flex items-center justify-between"
                      dir="rtl"
                    >
                      <span>العربية</span>
                      {lang === "ar" && <span className="text-gold-700">✓</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User status */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="h-10 px-3.5 rounded-xl bg-paper-2 hover:bg-ink-900 hover:text-white flex items-center gap-2 text-ink-900 border border-ink-900/5 transition-all text-xs font-semibold shadow-xs uppercase cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold-700" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{userEmail.split("@")[0]}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Back navigation Row */}
        <Link 
          href="/books" 
          className="inline-flex items-center gap-2 text-slate hover:text-ink-900 transition-colors text-xs font-semibold uppercase tracking-wider mb-8 bg-white/70 px-4 py-2 rounded-lg border border-ink-900/5 shadow-2xs hover:border-[#c7a05a]/40 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
          <span>{lang === "en" ? "Catalog Directory" : "العودة لفهرس المصنفات الكلية"}</span>
        </Link>

        {/* Dynamic Detail grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Book Spine Graphic & Primary actions (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Spine Book Cover simulation card */}
            <div 
              className="rounded-3xl border border-ink-900/10 shadow-2xl overflow-hidden relative flex flex-col justify-between text-paper select-none h-[420px] p-8 aspect-[3/4] mx-auto w-full max-w-[340px] group transition-all duration-300 hover:scale-[1.01]"
              style={{ background: book.coverBg }}
            >
              {/* Spine edge simulation */}
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-15" />
              
              {/* Inner margin boundary */}
              <div className="absolute inset-5 border border-white/15 pointer-events-none z-10 rounded-md" />
              <div className="absolute inset-5.5 border border-gold-400/20 pointer-events-none z-10 rounded-md" />

              {/* Watermark Ornament element */}
              <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-25 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 110">
                  <path d="M50 5 L95 35 L95 75 L50 105 L5 75 L5 35 Z" stroke="#D9B879" fill="none" strokeWidth="1.5" />
                  <path d="M50 15 L85 40 L85 70 L50 95 L15 70 L15 40 Z" stroke="#D9B879" fill="none" strokeWidth="1" />
                  <circle cx="50" cy="55" r="10" stroke="#D9B879" fill="none" strokeWidth="1" />
                </svg>
              </div>

              {/* Top metadata tags */}
              <div className="flex items-start justify-between gap-2 relative z-20">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-md text-gold-300 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c7a05a]" />
                  {lang === "en" ? book.categoryEn : book.categoryAr}
                </span>
                <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1.5 rounded text-paper/90 border border-white/5">
                  {book.size}
                </span>
              </div>

              {/* Title group */}
              <div className="relative z-20 pl-2">
                <p className="text-[10px] font-mono text-gold-300/80 mb-1 uppercase tracking-widest">
                  {lang === "en" ? "CLASSICAL ARTIFACT" : "مصنف تراثي محقق"}
                </p>
                <h2 
                  className="font-display font-medium text-2xl tracking-wide text-white mb-2 leading-tight"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {lang === "en" ? book.titleEn : book.titleAr}
                </h2>
                <div className="flex items-center gap-1.5 opacity-90 border-t border-white/10 pt-2.5 mt-2">
                  <span className="text-xs font-mono text-paper/90">
                    {lang === "en" ? `By ${book.authorEn}` : `بقلم ${book.authorAr}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons below details */}
            <div className="bg-white rounded-2xl border border-ink-900/10 p-5 shadow-sm space-y-3.5">

              {/* PDF Printing and Download Simulation */}
              <button
                onClick={handleDownloadPDF}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs ${
                  isAlreadyDownloaded 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-500/20 hover:bg-emerald-100" 
                    : "bg-white text-ink-900 hover:bg-maroon-700 hover:text-white border-ink-900/5 hover:border-maroon-700"
                }`}
              >
                <Download className="w-4.5 h-4.5" />
                <span>
                  {isAlreadyDownloaded 
                    ? (lang === "en" ? "Re-Download Document PDF" : "إعادة تحميل المخطوطة PDF")
                    : (lang === "en" ? "Compile & Download PDF" : "تجميع وتحميل نسخة PDF")
                  }
                </span>
              </button>

              {/* Verified Badge */}
              <div className="flex items-center gap-2.5 bg-paper/60 border border-ink-900/5 px-3.5 py-2.5 rounded-xl text-[10px] text-slate font-mono">
                <CheckCircle className="w-4.5 h-4.5 text-gold-700 flex-shrink-0" />
                <span>
                  {lang === "en" 
                    ? "Verified via scholarly peer reviews." 
                    : "مصنف معتمد ومحقق من قبل الهيئة العلمية لـ بيان."}
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT: Scholarly Description, Metadata grid & Chapter list Index (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Detailed metadata description block */}
            <div className="bg-white rounded-3xl border border-ink-900/10 p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Title names */}
              <div className="border-b border-ink-900/5 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display font-medium text-3xl text-ink-900 leading-tight">
                      {lang === "en" ? book.titleEn : book.titleAr}
                    </h1>
                    <p className="text-sm font-mono text-gold-700 mt-1.5 flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>{lang === "en" ? `Era of Origin: ${book.era}` : `عصر التدوين والتحقيق: ${book.era}`}</span>
                    </p>
                  </div>
                  
                  {/* Category Pill Tag */}
                  <span className="bg-[#c7a05a]/10 border border-[#c7a05a]/20 text-[#c7a05a] font-semibold text-xs px-3 py-1.5 rounded-lg">
                    {lang === "en" ? book.categoryEn : book.categoryAr}
                  </span>
                </div>
              </div>

              {/* Author Info detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-paper/40 p-4.5 rounded-xl border border-ink-900/5">
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate tracking-wider mb-1">
                    {lang === "en" ? "English Author Attribution" : "المؤلف بالإنجليزية"}
                  </span>
                  <p className="text-sm font-semibold text-ink-950 font-sans">{book.authorEn}</p>
                </div>
                <div className="text-right sm:border-l sm:border-ink-900/5 sm:pl-4" dir="rtl">
                  <span className="block text-[10px] font-mono uppercase text-slate tracking-wider mb-1">
                    {lang === "en" ? "Arabic Historical Attribution" : "المؤلف ونسب المتن"}
                  </span>
                  <p className="text-sm font-bold text-ink-950 font-ar">{book.authorAr}</p>
                </div>
              </div>

              {/* Overview Synopsis */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#c7a05a] font-bold">
                  {lang === "en" ? "Book Info" : "معلومات الكتاب"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate">
                      <Languages className="w-3.5 h-3.5" /> English Translation
                    </span>
                    <p className="text-xs text-char/80 text-justify">
                      {book.descriptionEn}
                    </p>
                  </div>
                  
                  <div className="space-y-2 border-t md:border-t-0 md:border-l md:pl-6 border-ink-900/5 pt-4 md:pt-0" dir="rtl">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate">
                      <Languages className="w-3.5 h-3.5" /> الموثق العربي المحقق
                    </span>
                    <p className="text-xs text-char/80 text-justify font-ar leading-normal">
                      {book.descriptionAr}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata specs row */}
              <div className="border-t border-ink-900/5 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-paper/30 p-3 rounded-lg border border-ink-900/5">
                  <span className="block text-[9px] text-slate uppercase mb-0.5">{lang === "en" ? "Source MS" : "مصدر المخطوط"}</span>
                  <span className="font-semibold text-ink-900 truncate block text-[11px]" title={book.source}>{book.source.split(',')[0]}</span>
                </div>
                <div className="bg-paper/30 p-3 rounded-lg border border-ink-900/5">
                  <span className="block text-[9px] text-slate uppercase mb-0.5">{lang === "en" ? "Sections count" : "أبواب وفصول"}</span>
                  <span className="font-semibold text-ink-900 text-[11px]">{book.chapters.length} {lang === "en" ? "Sections" : "مباحث"}</span>
                </div>
                <div className="bg-paper/30 p-3 rounded-lg border border-ink-900/5">
                  <span className="block text-[9px] text-slate uppercase mb-0.5">{lang === "en" ? "Digital footprint" : "حجم التخزين"}</span>
                  <span className="font-semibold text-ink-900 text-[11px]">{book.size} JSON / KB</span>
                </div>
                <div className="bg-paper/30 p-3 rounded-lg border border-ink-900/5">
                  <span className="block text-[9px] text-slate uppercase mb-0.5">{lang === "en" ? "Archival press" : "دار النشر الطابعة"}</span>
                  <span className="font-semibold text-ink-900 text-[11px] truncate block" title={book.publisherEn}>{lang === "en" ? (book.publisherEn || 'Bayan Archive') : (book.publisherAr || 'مستودع بيان')}</span>
                </div>
              </div>

            </div>

            {/* Chapters layout preview Index */}
            <div className="bg-white rounded-3xl border border-ink-900/10 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-ink-900/5 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-lg text-ink-900">
                    {lang === "en" ? "Table of Contents" : "فهرس أبواب وفصول المتن المحقق"}
                  </h3>
                  <p className="text-slate text-[11px]">
                    {lang === "en" 
                      ? `${book.chapters.length} segments matching the bilingually authenticated manuscript.` 
                      : `${book.chapters.length} فصول مبوبة ومطابقة للمخطوط والمأثور.`}
                  </p>
                </div>
                <FileText className="w-5 h-5 text-gold-700" />
              </div>

              {/* Chapters list preview list */}
              <div className="space-y-4">
                {book.chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="border border-ink-900/5 rounded-xl p-4 bg-paper/20"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#c7a05a] font-bold bg-[#c7a05a]/10 px-2 py-0.5 rounded-md">
                          {lang === "en" ? `Vol. ${index + 1}` : `القسم ${index + 1}`}
                        </span>
                        <h4 className="text-sm font-semibold text-ink-950 font-sans">
                          {lang === "en" ? chapter.titleEn : chapter.titleAr}
                        </h4>
                      </div>
                      <p className="text-[11px] font-ar text-slate line-clamp-1" dir="rtl">
                        {chapter.titleAr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MOBILE LOWER DRAWER / BOTTOM LINKS */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-900/10 z-40 px-4 py-2.5 flex items-center justify-between text-slate shadow-lg">
        <Link href="/" className="flex flex-col items-center gap-1 hover:text-ink-900 cursor-pointer text-slate">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabLibrary}</span>
        </Link>
        <Link href="/books" className="flex flex-col items-center gap-1 hover:text-ink-900 text-slate hover:bg-paper-2 cursor-pointer">
          <Book className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabCatalog}</span>
        </Link>
        <Link href="/?tab=portal" className="flex flex-col items-center gap-1 hover:text-ink-900 cursor-pointer text-slate">
          <UploadCloud className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabPeerReview}</span>
        </Link>
        <Link href="/?tab=shelf" className="flex flex-col items-center gap-1 hover:text-ink-900 cursor-pointer text-slate">
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabMyShelf}</span>
        </Link>
      </div>

      {/* EXCLUSIVE PRINT COMPILER CONTAINER FOR PDF SAVINGS */}
      {printBook && (
        <div className="hidden print:block bg-white text-black p-12 min-h-screen" dir="rtl">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Cover Page */}
            <div className="text-center py-24 border-8 border-double border-gray-950 space-y-12 min-h-[92vh] flex flex-col justify-between items-center" dir={lang === "en" ? "ltr" : "rtl"}>
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500 font-bold">BAYAN DIGITAL ARCHIVES · بيان لإحياء التراث</p>
                <div className="w-24 h-1 bg-gray-900 mx-auto" />
              </div>

              <div className="space-y-6 my-auto">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-950 mb-4" style={{ fontFamily: "serif" }}>
                  {printBook.titleAr}
                </h1>
                <h2 className="text-2xl italic text-gray-700 font-sans tracking-wide">
                  {printBook.titleEn}
                </h2>
                <div className="w-12 h-0.5 bg-gray-400 mx-auto my-6" />
                <p className="text-xl font-medium text-gray-800">{printBook.categoryEn} · {printBook.categoryAr}</p>
              </div>

              <div className="space-y-3">
                <p className="text-xl font-bold text-gray-900 leading-normal">{printBook.authorAr}</p>
                <p className="text-sm text-gray-600 font-sans">{printBook.authorEn}</p>
                <p className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded w-fit mx-auto">{printBook.era}</p>
              </div>

              <div className="space-y-4 w-full">
                <div className="border-t border-gray-200 pt-6 max-w-md mx-auto grid grid-cols-2 gap-4 text-xs font-mono text-gray-600">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">PUBLISHER</span>
                    <span className="font-bold">{printBook.publisherEn || "Bayan Heritage"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">الناشر</span>
                    <span className="font-bold">{printBook.publisherAr || "دار بيان للنشر والتوزيع"}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-serif">Preserved, verified bilingually, and compiled via Bayan Research Console & Peer Audit</p>
              </div>
            </div>

            {/* Book Information Summary Page */}
            <div className="break-before-page pt-12 space-y-8" dir={lang === "en" ? "ltr" : "rtl"}>
              <div className="border-b-2 border-gray-900 pb-4">
                <h3 className="text-2xl font-bold">Book Summary & التعريف بالمتن</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-3 text-left" dir="ltr">
                  <span className="font-bold text-xs uppercase text-gray-500 block">English Synopses</span>
                  <p className="text-gray-800">{printBook.descriptionEn}</p>
                </div>
                <div className="space-y-3 text-right" dir="rtl">
                  <span className="font-bold text-xs uppercase text-gray-500 block">الملخص والتحقيق</span>
                  <p className="text-gray-800" style={{ fontFamily: "serif" }}>{printBook.descriptionAr}</p>
                </div>
              </div>
            </div>

            {/* Chapters with beautiful side-by-side break-before-page */}
            {printBook.chapters.map((ch, idx) => (
              <div key={ch.id} className="break-before-page pt-12 space-y-8 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-gray-400 font-bold">Chapter {idx + 1} / الباب {idx + 1}</span>
                  <h3 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "serif" }}>{ch.titleAr}</h3>
                  <h4 className="text-lg italic text-gray-500 font-sans">{ch.titleEn}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-justify">
                  {/* Arabic Column */}
                  <div className="space-y-4 text-right" dir="rtl">
                    <p className="text-lg leading-loose text-gray-950" style={{ fontFamily: "serif" }}>{ch.contentAr}</p>
                  </div>
                  {/* English Column */}
                  <div className="space-y-4 text-left" dir="ltr">
                    <p className="text-base leading-relaxed text-gray-800 font-sans">{ch.contentEn}</p>
                  </div>
                </div>
                
                {/* Scholarly notes */}
                {ch.insights && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6 text-xs italic" dir="ltr">
                    <b className="font-bold uppercase text-gray-600 block not-italic mb-1 font-mono text-[10px]">Scholarly Notes / حاشية المحقق:</b>
                    {ch.insights}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
