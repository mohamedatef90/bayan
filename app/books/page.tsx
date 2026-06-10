"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft,
  Calendar,
  BookmarkCheck,
  Download,
  Book,
  Search,
  Languages,
  ArrowRight,
  User,
  LogOut,
  UserCheck,
  Award,
  UploadCloud,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_BOOKS, Book as BookType } from "@/lib/booksData";
import { translations, TSet } from "@/lib/translations";
import { safeStringify } from "@/lib/utils";

export default function AllBooksCatalog() {
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

  // Load public books
  const [publicBooks, setPublicBooks] = useState<BookType[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bayan_public_books");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse public books in catalog:", e);
        }
      }
    }
    return INITIAL_BOOKS;
  });

  // Track downloaded shelf IDs
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedDownloads = localStorage.getItem("bayan_downloads");
      if (storedDownloads) {
        try {
          return JSON.parse(storedDownloads);
        } catch (e) {
          console.error("Failed to parse downloads in catalog:", e);
        }
      }
    }
    return [];
  });

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // PDF Printing state
  const [printBook, setPrintBook] = useState<BookType | null>(null);

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

  // Perform filtering logic
  const getFilteredBooks = () => {
    return publicBooks.filter((book) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        book.titleEn.toLowerCase().includes(query) ||
        book.titleAr.includes(query) ||
        book.authorEn.toLowerCase().includes(query) ||
        book.authorAr.includes(query) ||
        book.descriptionEn.toLowerCase().includes(query) ||
        book.descriptionAr.includes(query) ||
        book.chapters.some(ch => 
          ch.titleEn.toLowerCase().includes(query) ||
          ch.titleAr.includes(query)
        );

      const matchesCategory = selectedCategory === "all" ||
        book.categoryEn === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  // Simulated PDF Downloader
  const handleDownloadPDF = (book: BookType) => {
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

  // Logout trigger
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserMenuOpen(false);
  };

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

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-1.5 bg-paper-2/50 p-1.5 rounded-xl border border-ink-900/5">
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all"
            >
              {t.tabLibrary}
            </Link>
            <Link
              href="/books"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-ink-900 text-white shadow-xs"
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

          {/* Right Actions: Language and User Auth */}
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

            {/* Authenticated User state control */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="h-10 px-3 rounded-xl bg-ink-900 text-white flex items-center gap-2 hover:bg-ink-850 transition-all text-xs font-semibold shadow-md cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold-300" />
                  <span className="hidden sm:inline truncate max-w-[100px]">{userEmail.split("@")[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className={`absolute mt-2 w-48 rounded-xl bg-white border border-ink-900/10 shadow-lg py-1.5 z-50 overflow-hidden ${lang === "en" ? "right-0" : "left-0"}`}
                    >
                      <div className="px-4 py-2 border-b border-ink-900/5 text-slate text-[10px] font-mono truncate">
                        {userEmail}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-xs text-maroon-700 hover:bg-paper-2 flex items-center gap-2 justify-start cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === "en" ? "Log out" : "تسجيل الخروج"}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setUserEmail("reader.heritage@bayan.org");
                }}
                className="h-10 px-4 rounded-xl bg-[#c7a05a] hover:bg-gold-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {t.loginBtn}
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* MOBILE LOWER DRAWER / BOTTOM LINKS */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-ink-900/10 z-40 px-4 py-2.5 flex items-center justify-between text-slate shadow-lg">
        <Link href="/" className="flex flex-col items-center gap-1 hover:text-ink-900 cursor-pointer text-slate">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabLibrary}</span>
        </Link>
        <Link href="/books" className="flex flex-col items-center gap-1 text-ink-900 cursor-pointer">
          <Book className="w-5 h-5 text-[#c7a05a]" />
          <span className="text-[10px] font-semibold text-ink-900">{t.tabCatalog}</span>
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

      {/* CATALOG HEADER HERO AREA */}
      <header className="relative py-16 bg-gradient-to-b from-ink-950 via-[#0a1e35] to-ink-900 border-b border-gold-400/10 overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c7a05a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Architectural Dome Shape vector */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 pointer-events-none flex items-end justify-end">
          <svg className="w-full h-full max-w-[340px]" viewBox="0 0 100 110">
            <path d="M 49.8 19.7 L 49.6 20.9 L 49.2 22.3 L 48.7 23.6 L 48.2 24.9 L 47.6 26.3 L 46.9 27.6 L 46.2 29.0 L 45.3 30.3 L 44.4 31.6 L 43.4 33.0 L 42.3 34.3 L 41.2 35.7 L 39.9 37.0 L 38.7 38.2 L 37.3 39.6 L 35.9 40.9 L 34.5 42.3 L 33.1 43.6 L 31.7 44.9 L 30.3 46.3 L 28.9 47.6 L 27.5 49.0 L 26.3 50.3 L 25.2 51.6 L 24.1 53.0 L 23.1 54.3 L 22.3 55.7 L 21.6 56.9 L 21.1 58.3 L 20.6 59.6 L 20.3 60.9 L 20.1 62.3 L 20.0 63.6 L 20.1 65.0 L 20.3 66.3 L 20.7 67.6 L 21.2 69.0 L 22.0 70.3 L 23.1 71.7 L 26.4 73.0 L 28.4 74.3 L 71.6 74.3 L 73.6 73.0 L 76.9 71.7 L 78.0 70.3 L 78.8 69.0 L 79.3 67.6 L 79.7 66.3 L 79.9 65.0 L 80.0 63.6 L 79.9 62.3 L 79.7 60.9 L 79.4 59.6 L 78.9 58.3 L 78.4 56.9 L 77.7 55.7 L 76.9 54.3 L 75.9 53.0 L 74.8 51.6 L 73.7 50.3 L 72.5 49.0 L 71.1 47.6 L 69.7 46.3 L 68.3 44.9 L 66.9 43.6 L 65.5 42.3 L 64.1 40.9 L 62.7 39.6 L 61.3 38.2 L 60.1 37.0 L 58.8 35.7 L 57.7 34.3 L 56.6 33.0 L 55.6 31.6 L 54.7 30.3 L 53.8 29.0 L 53.1 27.6 L 52.4 26.3 L 51.8 24.9 L 51.3 23.6 L 50.8 22.3 L 50.4 20.9 L 50.2 19.7 Z" fill="none" stroke="#D9B879" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c7a05a] hover:text-white transition-colors mb-4">
            <ArrowLeft className={`w-3.5 h-3.5 ${lang === "ar" ? "rotate-180" : ""}`} />
            <span>{lang === "en" ? "Home Library" : "المكتبة الرئيسية"}</span>
          </Link>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl tracking-tight text-white mb-3">
            {lang === "en" ? "Bayan General Catalog" : "المكتبة الشاملة لبيان"}
          </h1>
          <p className="text-sm text-paper/80 max-w-2xl leading-relaxed">
            {lang === "en" 
              ? "Comprehensive digital archives of classically authenticated manuscripts, and reliable heritage works in pristine parallel presentation." 
              : "الفهرس الشامل للمتون والمصنفات التراثية المحققة، معروضة بإخراج متميز يتيح الدراسة المقابلة بلغات متعددة."}
          </p>
        </div>
      </header>

      {/* SEARCH AND EXPLORATION PANEL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white p-6 rounded-2xl border border-ink-900/10 shadow-sm flex flex-col lg:flex-row items-center gap-4 mb-8">
          
          {/* Search bar input representation */}
          <div className="relative w-full flex-1">
            <span className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-4" : "left-0 pl-4"} flex items-center pointer-events-none`}>
              <Search className="w-5 h-5 text-slate" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} py-3 bg-paper-2/40 border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-ink-500/10 text-char transition-all`}
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 lg:flex-none px-4 py-3 bg-paper border border-ink-900/10 rounded-xl text-xs font-medium tracking-wide focus:outline-none text-char cursor-pointer"
            >
              <option value="all">{lang === "en" ? "All Categories" : "كل الفنون والتصنيفات"}</option>
              <option value="Hadith">{lang === "en" ? "Hadith" : "الحديث الشريف"}</option>
              <option value="Adab & Tazkiyah">{lang === "en" ? "Adab & Tazkiyah" : "الآداب والتزكية"}</option>
              <option value="Fiqh & Hadith">{lang === "en" ? "Fiqh & Hadith" : "الفقه والحديث"}</option>
            </select>

            {/* Reset terms filter */}
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                className="px-4 py-3 bg-maroon-700/10 hover:bg-maroon-700 text-maroon-700 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === "en" ? "Reset" : "إعادة ضبط"}
              </button>
            )}
          </div>
        </div>

        {/* BOOK LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getFilteredBooks().map((book) => {
            const isDownloaded = downloadedIds.includes(book.id);
            return (
              <div 
                key={book.id} 
                className="bg-white rounded-2xl border border-ink-900/10 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#c7a05a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Book link box */}
                <Link
                  href={`/books/${book.id}`}
                  className="cursor-pointer flex-1 flex flex-col"
                  title={lang === "en" ? `Study ${book.titleEn}` : `دراسة ${book.titleAr}`}
                >
                  {/* Spine, binding and layout simulation */}
                  <div 
                    className="h-48 p-6 relative flex flex-col justify-between text-paper overflow-hidden select-none transition-all duration-500 group-hover:brightness-[1.05]" 
                    style={{ background: book.coverBg }}
                  >
                    {/* Spine representation */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-15" />
                    
                    {/* Gold bindings borders */}
                    <div className="absolute inset-4 border border-white/15 pointer-events-none z-10 rounded" />
                    <div className="absolute inset-4.5 border border-gold-400/20 pointer-events-none z-10 rounded" />

                    {/* Hand crafted vector dome design overlay */}
                    <div className="absolute right-0 bottom-0 w-1/3 h-1/2 opacity-25 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                      <svg className="w-full h-full" viewBox="0 0 100 110">
                        <path 
                          d="M 49.8 19.7 L 49.6 20.9 L 49.2 22.3 L 48.7 23.6 L 48.2 24.9 L 47.6 26.3 L 46.9 27.6 L 46.2 29.0 L 45.3 30.3 L 44.4 31.6 L 43.4 33.0 L 42.3 34.3 L 41.2 35.7 L 39.9 37.0 L 38.7 38.2 L 37.3 39.6 L 35.9 40.9 L 34.5 42.3 L 33.1 43.6 L 31.7 44.9 L 30.3 46.3 L 28.9 47.6 L 27.5 49.0 L 26.3 50.3 L 25.2 51.6 L 24.1 53.0 L 23.1 54.3 L 22.3 55.7 L 21.6 56.9 L 21.1 58.3 L 20.6 59.6 L 20.3 60.9 L 20.1 62.3 L 20.0 63.6 L 20.1 65.0 L 20.3 66.3 L 20.7 67.6 L 21.2 69.0 L 22.0 70.3 L 23.1 71.7 L 26.4 73.0 L 28.4 74.3 L 71.6 74.3 L 73.6 73.0 L 76.9 71.7 L 78.0 70.3 L 78.8 69.0 L 79.3 67.6 L 79.7 66.3 L 79.9 65.0 L 80.0 63.6 L 79.9 62.3 L 79.7 60.9 L 79.4 59.6 L 78.9 58.3 L 78.4 56.9 L 77.7 55.7 L 76.9 54.3 L 75.9 53.0 L 74.8 51.6 L 73.7 50.3 L 72.5 49.0 L 71.1 47.6 L 69.7 46.3 L 68.3 44.9 L 66.9 43.6 L 65.5 42.3 L 64.1 40.9 L 62.7 39.6 L 61.3 38.2 L 60.1 37.0 L 58.8 35.7 L 57.7 34.3 L 56.6 33.0 L 55.6 31.6 L 54.7 30.3 L 53.8 29.0 L 53.1 27.6 L 52.4 26.3 L 51.8 24.9 L 51.3 23.6 L 50.8 22.3 L 50.4 20.9 L 50.2 19.7 Z" 
                          stroke="#D9B879" 
                          fill="none" 
                          strokeWidth="2.5" 
                        />
                      </svg>
                    </div>

                    {/* Top indicator badges */}
                    <div className="flex items-start justify-between gap-2 relative z-20">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-sans uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md text-gold-300 border border-white/5">
                        <span className="w-1 h-1 rounded-full bg-[#c7a05a]" />
                        {lang === "en" ? book.categoryEn : book.categoryAr}
                      </span>
                      <span className="text-[9px] font-mono bg-white/10 px-2 py-1 rounded text-paper/90 border border-white/5">
                        {book.size}
                      </span>
                    </div>

                    {/* Core titles inside the manual covers */}
                    <div className="relative z-20 pl-2">
                      <p className="text-[9px] font-mono text-gold-300/80 mb-0.5 uppercase tracking-widest">
                        {lang === "en" ? "CLASSICAL ARTIFACT" : "مصنف تراثي محقق"}
                      </p>
                      <h3 
                        className="font-display font-medium text-xl tracking-wide line-clamp-1 mb-1 text-white"
                        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}
                      >
                        {lang === "en" ? book.titleEn : book.titleAr}
                      </h3>
                      <div className="flex items-center gap-1.5 opacity-90">
                        <span className="text-[11px] font-mono text-paper/90 line-clamp-1">
                          {lang === "en" ? `By ${book.authorEn}` : `بقلم ${book.authorAr}`}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Metadata fields list */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4 bg-paper/20 pb-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate/80 border-b border-ink-900/5 pb-3 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold-700/80" />
                          <span className="font-semibold text-ink-950">{book.era}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-gold-700/80" />
                          <span className="text-gold-800 font-medium">{book.source.split(',')[0]}</span>
                        </div>
                      </div>
                      
                      <p className="text-[12px] text-char/80 line-clamp-3 leading-relaxed min-h-[54px]">
                        {lang === "en" ? book.descriptionEn : book.descriptionAr}
                      </p>

                      {/* Sections counts row */}
                      <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-slate/75">
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-ink-900/5 shadow-xs">
                          📄 {book.chapters.length} {lang === "en" ? "Sections" : "مباحث"}
                        </span>
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-ink-900/5 shadow-xs">
                          🎙️ {lang === "en" ? "Audio Aligned" : "مصحح اللفظ"}
                        </span>
                      </div>

                      {/* Community submission badges */}
                      {book.isCommunity && (
                        <div className="mt-4 flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-500/20 text-emerald-800 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === "en" ? "Scholarly Verified Candidate" : "مخطوطة محققة معتمدة"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Print download triggering container */}
                <div className="p-6 pt-0 bg-paper/20">
                  <div className="flex items-center gap-2 pt-3 border-t border-ink-900/5">
                    
                    {/* PDF print downloader */}
                    <button
                      onClick={() => handleDownloadPDF(book)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-ink-900 hover:bg-maroon-700 hover:text-white border border-ink-900/5 hover:border-maroon-700 transition-all shadow-xs cursor-pointer"
                      title={lang === "en" ? "Download PDF Edition" : "تحميل نسخة PDF"}
                    >
                      <Download className="w-4.5 h-4.5" />
                    </button>

                    {/* Go to reading dynamic route */}
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-1 bg-ink-900 hover:bg-[#c7a05a] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer text-center"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t.readBtn}</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Empty search fallback */}
          {getFilteredBooks().length === 0 && (
            <div className="col-span-full py-24 text-center">
              <Book className="w-16 h-16 text-slate mx-auto mb-4 opacity-40 animate-pulse" />
              <p className="text-slate font-semibold text-sm mb-1">
                {lang === "en" ? "No manuscripts match your query" : "لم نعثر على أي مخطوط مطابق لبحثك"}
              </p>
              <p className="text-xs text-slate/75 max-w-md mx-auto leading-relaxed">
                {lang === "en" 
                  ? "Try searching different historical keywords, authors name, or change category filters." 
                  : "جرب البحث بكلمات دلالية مغايرة، أو أسماء كبار المصنفين، أو تغيير قسم التصفية الشامل."}
              </p>
            </div>
          )}
        </div>

      </main>

      {/* COMPACT PRINT-ONLY VIEW RENDERED TEMPORARILY AT PRINT TIME */}
      {printBook && (
        <div className="hidden print:block fixed inset-0 bg-white text-gray-900 z-[9999] p-12 overflow-y-auto font-serif h-full w-full">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Cover header block */}
            <div className="text-center space-y-4 border-b-4 border-double border-gray-900 pb-10">
              <span className="font-mono text-xs tracking-widest text-[#c7a05a] font-bold block uppercase">Bayan Heritage Manuscripts Archive / دار بيان لحفظ ونشر التراث</span>
              <h1 className="text-5xl font-black text-gray-900 mt-2">{printBook.titleAr}</h1>
              <h2 className="text-3xl italic text-gray-700 font-sans mt-1">{printBook.titleEn}</h2>
              <div className="flex justify-center items-center gap-6 font-mono text-sm pt-4">
                <span>Era: {printBook.era}</span>
                <span>•</span>
                <span>Source: {printBook.source}</span>
                <span>•</span>
                <span>Category: {printBook.categoryEn}</span>
              </div>
            </div>

            {/* Introductory metadata summary */}
            <div className="space-y-6 pt-4 border-b border-gray-100 pb-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-600" />
                <h3 className="text-2xl font-bold">Book Summary & التعريف بالمتن</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-3 text-left animate-slideUp" dir="ltr">
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
