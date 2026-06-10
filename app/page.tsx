"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight,
  Book, 
  ChevronRight,
  Database,
  Globe, 
  Trash2, 
  UserCheck, 
  Sparkles, 
  CornerDownRight,
  Volume2,
  BookmarkCheck,
  Calendar,
  Languages,
  Check,
  RotateCw,
  FileText,
  User,
  LogIn,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { INITIAL_BOOKS, Book as BookType, BookChapter } from "@/lib/booksData";
import { translations, TSet } from "@/lib/translations";
import { safeStringify } from "@/lib/utils";

interface Review {
  id: string;
  reviewer: string;
  verdict: "Approved" | "Needs Revision" | "Rejected";
  comments: string;
  date: string;
}

interface UnderReviewManuscript extends BookType {
  submitter: string;
  dateSubmitted: string;
  endorsements: number;
  aiReport?: {
    isAuthentic: boolean;
    confidenceScore: number;
    authorMatch: string;
    narratorCheck: string;
    revoltFlags: string[];
    theologicalAlignment: string;
    summaryEn: string;
    summaryAr: string;
    overallRecommendation: string;
  };
  reviews: Review[];
}

function getSeedReviewQueue(): UnderReviewManuscript[] {
  return [
    {
      id: "mira-hadith",
      titleEn: "Al-Arba'in fi Usul al-Din",
      titleAr: "الأربعون في أصول الدين",
      authorEn: "Imam Al-Ghazali al-Tusi",
      authorAr: "الإمام الغزالي الطوسي",
      era: "505 AH / 1111 CE",
      categoryEn: "Aqeedah",
      categoryAr: "العقيدة وأصول الدين",
      descriptionEn: "A foundational compilation containing forty major traditions regarding the principles and beliefs of Islamic creed.",
      descriptionAr: "رسالة فقهية وعقدية نادرة تنسب لحجة الإسلام الغزالي، تتناول أربعين أصلا من أصول العقائد والعبادات والعمل الصالح.",
      coverBg: "linear-gradient(135deg, #6E2A30 0%, #08396D 100%)",
      size: "620 KB",
      source: "Süleymaniye Library, MS 1042",
      submitter: "mohamed.atefm20@gmail.com",
      dateSubmitted: "2026-06-07",
      endorsements: 1,
      chapters: [
        {
          id: "mira-ch1",
          titleEn: "Book 1: Knowledge and Sincerity",
          titleAr: "الباب الأول: في العلم والإخلاص",
          contentAr: "قال الغزالي رحمه الله: اعلم أن العلم بدون العمل جنون، والعمل بدون إخلاص رياء. وإن الله تعالى لا يتقبل من القول والعمل إلا ما خلصت فيه النية وكان ابتغاء لوجهه الكريم.",
          contentEn: "Al-Ghazali said, may Allah have mercy on him: Know that knowledge without action is madness, and action without sincerity is ostentation. Verily, Allah the Exalted does not accept of speech and deed except that which contains sincere intent and is done seeking His noble countenance."
        }
      ],
      aiReport: {
        isAuthentic: true,
        confidenceScore: 89,
        authorMatch: "Stylistically and chronologically consistent. The text matches verified attributions of Mukhtasar Ghazali in logic and Tazkiyah found in the Turkish Ottoman state library.",
        narratorCheck: "Integrates reliable chains that trace back cleanly to primary authorities. Strong bibliographic integrity.",
        revoltFlags: [],
        theologicalAlignment: "Fully aligned with traditional Sunni orthopraxy and Sufi ethics.",
        summaryEn: "A profound guide on purification of the soul other scholars have cross-referred as exceptionally authentic.",
        summaryAr: "مخطوط غني ونادر يُثبت أهمية العلوم الروحانية والأخلاقية وعلاقتها بالعلم والعمل.",
        overallRecommendation: "Approved for Public Library"
      },
      reviews: [
        {
          id: "rev-1",
          reviewer: "Prof. Tariq Al-Suleimani",
          verdict: "Approved",
          comments: "I checked the original manuscript number at the library. It is authentic and of high quality. Excellent submission.",
          date: "2026-06-08"
        }
      ]
    }
  ];
}

export default function Home() {
  // Locale State
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t: TSet = translations[lang];

  // Tab State: "library" | "portal" | "shelf"
  const [activeTab, setActiveTab] = useState<"library" | "portal" | "shelf">("library");

  // Auth/User States
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [authPasswordInput, setAuthPasswordInput] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Sync auth state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bayan_is_logged_in", isLoggedIn ? "true" : "false");
      localStorage.setItem("bayan_user_email", userEmail);
    }
  }, [isLoggedIn, userEmail]);

  // Splash Screen State — skip if already shown this session
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("bayan_splash_shown");
    }
    return true;
  });

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("bayan_splash_shown", "1");
    }, 3200);
    return () => clearTimeout(timer);
  }, [showSplash]);

  // Books State
  const [publicBooks, setPublicBooks] = useState<BookType[]>(() => {
    if (typeof window !== "undefined") {
      const storedPublic = localStorage.getItem("bayan_public_books");
      if (storedPublic) {
        try {
          return JSON.parse(storedPublic);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_BOOKS;
  });

  const [reviewQueue, setReviewQueue] = useState<UnderReviewManuscript[]>(() => {
    if (typeof window !== "undefined") {
      const storedReview = localStorage.getItem("bayan_review_queue");
      if (storedReview) {
        try {
          return JSON.parse(storedReview);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return getSeedReviewQueue();
  });
  
  // Library Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Reader State
  const [activeBook, setActiveBook] = useState<BookType | null>(null);
  const [printBook, setPrintBook] = useState<BookType | null>(null);
  const [activeChapter, setActiveChapter] = useState<BookChapter | null>(null);
  const [readMode, setReadMode] = useState<"bilingual" | "en" | "ar">("bilingual");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  // Bookmarks State (array of bookmarked chapters belonging to a book)
  const [bookmarks, setBookmarks] = useState<{ id: string; bookId: string; bookTitle: string; chapterTitle: string; note: string; date: string }[]>(() => {
    if (typeof window !== "undefined") {
      const storedBookmarks = localStorage.getItem("bayan_bookmarks");
      if (storedBookmarks) {
        try {
          return JSON.parse(storedBookmarks);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [addingNoteId, setAddingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  // Offline/downloads simulation state
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedDownloads = localStorage.getItem("bayan_downloads");
      if (storedDownloads) {
        try {
          return JSON.parse(storedDownloads);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [offlineMode, setOfflineMode] = useState(false);

  // Upload Form State
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newAuthorEn, setNewAuthorEn] = useState("");
  const [newAuthorAr, setNewAuthorAr] = useState("");
  const [newEra, setNewEra] = useState("");
  const [newCategory, setNewCategory] = useState("Hadith");
  const [newSource, setNewSource] = useState("");
  const [newChapterTitleEn, setNewChapterTitleEn] = useState("");
  const [newChapterTitleAr, setNewChapterTitleAr] = useState("");
  const [newContentEn, setNewContentEn] = useState("");
  const [newContentAr, setNewContentAr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Selected Submission for active detail check
  const [selectedSubmission, setSelectedSubmission] = useState<UnderReviewManuscript | null>(null);
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [newComment, setNewComments] = useState("");
  const [newVerdict, setNewVerdict] = useState<"Approved" | "Needs Revision" | "Rejected">("Approved");

  // AI Assistant Chat State
  const [assistantChat, setAssistantChat] = useState<{ query: string; response: string; loading: boolean }[]>([]);
  const [assistantInput, setAssistantInput] = useState("");

  // Initialize and Sync localstorage
  useEffect(() => {
    // Save defaults to localStorage only if they don't exist yet, to enable persistence
    if (!localStorage.getItem("bayan_public_books")) {
      localStorage.setItem("bayan_public_books", safeStringify(INITIAL_BOOKS));
    }
    if (!localStorage.getItem("bayan_review_queue")) {
      localStorage.setItem("bayan_review_queue", safeStringify(getSeedReviewQueue()));
    }
  }, []);

  // Trigger native print flow for beautiful vector PDF creation
  useEffect(() => {
    if (printBook) {
      const timer = setTimeout(() => {
        window.print();
        setPrintBook(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printBook]);

  // Read query parameters to load books from Catalog
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const readId = params.get("read");
      const tabParam = params.get("tab");
      
      let changed = false;
      if (tabParam && ["library", "portal", "shelf"].includes(tabParam)) {
        setTimeout(() => {
          setActiveTab(tabParam as any);
        }, 0);
        changed = true;
      }

      if (readId) {
        const found = publicBooks.find(b => b.id === readId);
        if (found) {
          setTimeout(() => {
            setActiveBook(found);
            setActiveChapter(found.chapters[0]);
            setActiveTab("library");
            // Clear query params so we don't keep resetting on reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
          }, 0);
          return;
        }
      }

      if (changed) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [publicBooks]);

  const savePublicBooks = (updated: BookType[]) => {
    setPublicBooks(updated);
    localStorage.setItem("bayan_public_books", safeStringify(updated));
  };

  const saveReviewQueue = (updated: UnderReviewManuscript[]) => {
    setReviewQueue(updated);
    localStorage.setItem("bayan_review_queue", safeStringify(updated));
  };

  // Toggle Bookmark
  const handleToggleBookmark = (chapter: BookChapter, book: BookType) => {
    const existing = bookmarks.find(b => b.id === chapter.id);
    let updated;
    if (existing) {
      updated = bookmarks.filter(b => b.id !== chapter.id);
    } else {
      updated = [
        ...bookmarks,
        {
          id: chapter.id,
          bookId: book.id,
          bookTitle: lang === "en" ? book.titleEn : book.titleAr,
          chapterTitle: lang === "en" ? chapter.titleEn : chapter.titleAr,
          note: "",
          date: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")
        }
      ];
    }
    setBookmarks(updated);
    localStorage.setItem("bayan_bookmarks", safeStringify(updated));
  };

  const handleSaveNote = (id: string, noteText: string) => {
    const updated = bookmarks.map(b => b.id === id ? { ...b, note: noteText } : b);
    setBookmarks(updated);
    localStorage.setItem("bayan_bookmarks", safeStringify(updated));
    setAddingNoteId(null);
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bayan_bookmarks", safeStringify(updated));
  };

  // Offline Simulation
  const handleToggleDownload = (bookId: string) => {
    let updated;
    if (downloadedIds.includes(bookId)) {
      updated = downloadedIds.filter(id => id !== bookId);
    } else {
      updated = [...downloadedIds, bookId];
    }
    setDownloadedIds(updated);
    localStorage.setItem("bayan_downloads", safeStringify(updated));
  };

  // Safe client-side uploads to Peer-Review Portal
  const handleNewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleEn || !newTitleAr || !newContentAr || !newContentEn) {
      alert("Please fill in the core Arabic and English fields.");
      return;
    }

    setIsSubmitting(true);
    const newId = `manuscript-${Date.now()}`;
    const newBook: UnderReviewManuscript = {
      id: newId,
      titleEn: newTitleEn,
      titleAr: newTitleAr,
      authorEn: newAuthorEn || "Unknown Author",
      authorAr: newAuthorAr || "مؤلف مجهول",
      era: newEra || "Classic Era",
      categoryEn: newCategory,
      categoryAr: newCategory === "Hadith" ? "الحديث الشريف" : "الفقه والآداب",
      descriptionEn: `Community contributed manuscript on ${newCategory}.`,
      descriptionAr: `مخطوطة وبحث مقدم من أصدقاء المجتمع في تخصص ${newCategory === "Hadith" ? "الحديث الشريف" : "الفقه والآداب"}.`,
      coverBg: "linear-gradient(135deg, #C7A05A 0%, #A07A38 100%)",
      size: `${Math.ceil(newContentAr.length / 1024)} KB`,
      source: newSource || "Private Collection",
      submitter: "mohamed.atefm20@gmail.com",
      dateSubmitted: new Date().toISOString().split("T")[0],
      endorsements: 0,
      chapters: [
        {
          id: `${newId}-ch1`,
          titleEn: newChapterTitleEn || "Section 1",
          titleAr: newChapterTitleAr || "الفصل الأول",
          contentAr: newContentAr,
          contentEn: newContentEn
        }
      ],
      reviews: []
    };

    try {
      // Execute the real AI authentication report via Next.js API route!
      const res = await fetch("/api/gemini/peer-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify({
          title: newBook.titleEn,
          author: newBook.authorEn,
          era: newBook.era,
          language: "Bilingual Parallel",
          content: newBook.chapters[0].contentAr + "\n\n" + newBook.chapters[0].contentEn
        })
      });

      if (res.ok) {
        const aiReport = await res.json();
        newBook.aiReport = aiReport;
      }
    } catch (err) {
      console.error("AI Peer-Review generator failed, using robust fallback.", err);
    }

    const updatedQueue = [newBook, ...reviewQueue];
    saveReviewQueue(updatedQueue);

    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Clear Form Fields
    setNewTitleEn("");
    setNewTitleAr("");
    setNewAuthorEn("");
    setNewAuthorAr("");
    setNewEra("");
    setNewSource("");
    setNewChapterTitleEn("");
    setNewChapterTitleAr("");
    setNewContentEn("");
    setNewContentAr("");

    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  // Perform community endorse/verify vote
  const handleEndorse = (item: UnderReviewManuscript) => {
    const updatedQueue = reviewQueue.map(q => {
      if (q.id === item.id) {
        const nextEndorse = q.endorsements + 1;
        // Automatic scholarly promotion when reaching 2 endorsements!
        if (nextEndorse >= 2) {
          const promoBook: BookType = {
            id: q.id,
            titleEn: q.titleEn,
            titleAr: q.titleAr,
            authorEn: q.authorEn,
            authorAr: q.authorAr,
            era: q.era,
            categoryEn: q.categoryEn,
            categoryAr: q.categoryAr,
            descriptionEn: q.descriptionEn,
            descriptionAr: q.descriptionAr,
            coverBg: q.coverBg,
            size: q.size,
            chapters: q.chapters,
            source: q.source,
            isCommunity: true
          };
          // Append to public library!
          const updatedPublic = [...publicBooks, promoBook];
          savePublicBooks(updatedPublic);
          alert(lang === "en" ? `${q.titleEn} has received high verification and is now published to the Public Library!` : `لقد حصل كتاب "${q.titleAr}" على توثيقات عالية وتم نشره رسمياً في المكتبة العامة!`);
          return { ...q, endorsements: nextEndorse, status: "approved" };
        }
        return { ...q, endorsements: nextEndorse };
      }
      return q;
    });

    saveReviewQueue(updatedQueue as UnderReviewManuscript[]);
    // Update active details overlay if open
    if (selectedSubmission && selectedSubmission.id === item.id) {
      setSelectedSubmission({ ...selectedSubmission, endorsements: selectedSubmission.endorsements + 1 });
    }
  };

  // Publish / Authorize directly as a scholar role
  const handleScholarlyPublish = (item: UnderReviewManuscript) => {
    const promoBook: BookType = {
      id: item.id,
      titleEn: item.titleEn,
      titleAr: item.titleAr,
      authorEn: item.authorEn,
      authorAr: item.authorAr,
      era: item.era,
      categoryEn: item.categoryEn,
      categoryAr: item.categoryAr,
      descriptionEn: item.descriptionEn,
      descriptionAr: item.descriptionAr,
      coverBg: item.coverBg,
      size: item.size,
      chapters: item.chapters,
      source: item.source,
      isCommunity: true
    };
    const updatedPublic = [...publicBooks, promoBook];
    savePublicBooks(updatedPublic);

    const updatedQueue = reviewQueue.map(q => q.id === item.id ? { ...q, status: "approved" } : q);
    saveReviewQueue(updatedQueue as UnderReviewManuscript[]);
    
    if (selectedSubmission) {
      setSelectedSubmission({ ...selectedSubmission, status: "approved" });
    }

    alert(lang === "en" ? "Scholarly authorization granted. Manuscript is now public!" : "تم منح الموافقة العلمية المعتمدة بنجاح. المخطوطة الآن منشورة للجميع!");
  };

  // Submit manual peer-review comment
  const handleAddReviewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !selectedSubmission) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      reviewer: "Al-Azhar Al-Sharif Board",
      verdict: newVerdict,
      comments: newComment,
      date: new Date().toLocaleDateString()
    };

    const updatedQueue = reviewQueue.map(q => {
      if (q.id === selectedSubmission.id) {
        return {
          ...q,
          reviews: [...q.reviews, newRev]
        };
      }
      return q;
    });

    saveReviewQueue(updatedQueue);
    setSelectedSubmission({
      ...selectedSubmission,
      reviews: [...selectedSubmission.reviews, newRev]
    });
    setNewComments("");
  };

  // Inquire from Gemini Chat Assistant
  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput || !activeBook || !activeChapter) return;

    const currentQuery = assistantInput;
    setAssistantInput("");
    setAssistantChat(prev => [...prev, { query: currentQuery, response: "", loading: true }]);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify({
          question: currentQuery,
          bookTitle: activeBook.titleEn,
          currentChapter: activeChapter.titleEn,
          contentAr: activeChapter.contentAr,
          contentEn: activeChapter.contentEn
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssistantChat(prev => 
          prev.map(c => c.query === currentQuery ? { ...c, response: data.text, loading: false } : c)
        );
      } else {
        throw new Error("Chat api returned invalid response");
      }
    } catch (err) {
      console.error(err);
      setAssistantChat(prev => 
        prev.map(c => c.query === currentQuery ? { ...c, response: "Bayan Assistant temporarily busy. Please retry in a few moments.", loading: false } : c)
      );
    }
  };

  // Get filtered books based on search & category filter
  const getFilteredBooks = () => {
    let result = publicBooks;
    if (selectedCategory !== "all") {
      result = result.filter(b => b.categoryEn === selectedCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        b =>
          b.titleEn.toLowerCase().includes(q) ||
          b.titleAr.includes(q) ||
          b.authorEn.toLowerCase().includes(q) ||
          b.authorAr.includes(q) ||
          b.categoryEn.toLowerCase().includes(q)
      );
    }
    return result;
  };

  return (
    <>
      {/* SMOOTH 3S SPLASH LOADING SCREEN WITH FADE & SCALE */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfbf7] select-none pointer-events-auto"
          >
            {/* Ambient golden aura background */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center">
              {/* Logo & Content Container with 3s Fade and Scale Entry */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1.0 }}
                transition={{ duration: 3.0, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center gap-6"
              >
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <img 
                    src="https://i.postimg.cc/hjnRFmmk/bayan-logo-2.png" 
                    alt="Bayan Logo" 
                    className="w-28 h-28 object-contain animate-fade"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="text-center space-y-1">
                  <h1 className="font-display font-semibold text-3xl tracking-[0.2em] text-ink-900 leading-none">
                    بيان
                  </h1>
                  <h2 className="font-display font-medium text-xs uppercase tracking-[0.3em] text-gold-700 font-mono mt-2">
                    BAYAN
                  </h2>
                  <div className="h-[2px] w-8 bg-gold-305/40 mx-auto my-3" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate font-mono">
                    Heritage Library & Peer Portal
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen pb-16 overflow-x-hidden selection:bg-gold-500 selection:text-ink-900 bg-paper print:hidden">
      {/* Subtle Islamic Geometric Watermark Pattern */}
      <div className="geo-bg" />

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-paper/90 border-b border-ink-900/10 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveBook(null); setActiveTab("library"); }}>
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gold-300/30">
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
              <span className="text-[9px] uppercase tracking-widest text-gold-700 font-mono block mt-0.5">
                {lang === "en" ? "Heritage Library" : "مسند التراث"}
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1.5 bg-paper-2/50 p-1.5 rounded-xl border border-ink-900/5">
            <button
              onClick={() => { setActiveTab("library"); setActiveBook(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeTab === "library"
                  ? "bg-ink-900 text-white shadow-sm"
                  : "text-slate hover:text-ink-900 hover:bg-paper-2"
              }`}
            >
              {t.tabLibrary}
            </button>
            <Link
              href="/books"
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide text-slate hover:text-ink-900 hover:bg-paper-2 transition-all cursor-pointer"
            >
              {t.tabCatalog}
            </Link>
            <button
              onClick={() => { setActiveTab("portal"); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeTab === "portal"
                  ? "bg-ink-900 text-white shadow-sm"
                  : "text-slate hover:text-ink-900 hover:bg-paper-2"
              }`}
            >
              {t.tabPeerReview}
            </button>
            <button
              onClick={() => { setActiveTab("shelf"); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeTab === "shelf"
                  ? "bg-ink-900 text-white shadow-sm"
                  : "text-slate hover:text-ink-900 hover:bg-paper-2"
              }`}
            >
              {t.tabMyShelf}
            </button>
          </div>

          {/* Right Actions: Language Toggle & Auth */}
          <div className="flex items-center gap-3">

            {/* Authenticated User Menu OR Sign In & Sign Up Options */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="h-10 px-3.5 rounded-xl bg-paper-2 hover:bg-ink-900 hover:text-white flex items-center gap-2 text-ink-900 border border-ink-900/5 transition-all text-xs font-semibold shadow-xs uppercase cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold-700" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{userEmail.split("@")[0]}</span>
                  <span className={`text-[8px] opacity-70 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-ink-900/10 shadow-lg py-1.5 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-ink-900/5">
                        <p className="text-[10px] text-slate font-mono uppercase tracking-widest">{lang === 'en' ? 'Logged In As' : 'مسجل الدخول كـ'}</p>
                        <p className="text-xs font-bold text-ink-900 truncate">{userEmail || 'reviewer@bayan.org'}</p>
                      </div>
                      
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setActiveTab("shelf");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate hover:bg-paper-2 hover:text-ink-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-gold-700" />
                        {t.tabMyShelf}
                      </button>

                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsLoggedIn(false);
                          setUserEmail("");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        {lang === "en" ? "Sign Out" : "تسجيل الخروج"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthEmailInput("");
                    setAuthPasswordInput("");
                    setAuthModalOpen(true);
                  }}
                  className="h-10 px-3 sm:px-3.5 rounded-xl bg-paper-2 hover:bg-ink-900 hover:text-white flex items-center gap-1.5 text-ink-900 border border-ink-900/5 transition-all font-semibold text-xs cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-gold-700" />
                  <span>{t.loginBtn}</span>
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthEmailInput("");
                    setAuthPasswordInput("");
                    setAuthModalOpen(true);
                  }}
                  className="h-10 px-3 sm:px-3.5 rounded-xl bg-ink-900 text-white hover:bg-[#c7a05a] transition-all font-semibold text-xs cursor-pointer shadow-xs"
                >
                  <span>{t.signUpBtn}</span>
                </button>
              </div>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
                className="h-10 px-3 rounded-xl bg-paper-2 hover:bg-ink-900 hover:text-white flex items-center gap-2 text-ink-900 border border-ink-900/5 transition-all font-medium text-xs tracking-wider font-mono shadow-sm"
                title="Change Language / تغيير اللغة"
              >
                <Globe className="w-4.5 h-4.5 text-gold-700" />
                <span className="uppercase font-semibold">{lang}</span>
                <span className={`text-[8px] opacity-70 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-ink-900/10 shadow-lg py-1.5 z-50 overflow-hidden"
                  >
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLang("en");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                        lang === "en"
                          ? "bg-gold-500/10 text-ink-900 font-bold"
                          : "text-slate hover:bg-paper-2 hover:text-ink-900"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-ink-900/5 text-gold-700 font-bold uppercase">EN</span>
                        English
                      </span>
                      {lang === "en" && <Check className="w-4 h-4 text-gold-700" />}
                    </button>

                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLang("ar");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                        lang === "ar"
                          ? "bg-gold-500/10 text-ink-900 font-bold"
                          : "text-slate hover:bg-paper-2 hover:text-ink-900"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-ar-read" dir="rtl">
                        <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-ink-900/5 text-gold-700 font-bold uppercase">AR</span>
                        العربية
                      </span>
                      {lang === "ar" && <Check className="w-4 h-4 text-gold-700" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-md border-t border-ink-900/10 shadow-lg px-4 py-2.5 flex justify-between items-center">
        <button
          onClick={() => { setActiveTab("library"); setActiveBook(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === "library" ? "text-ink-900" : "text-slate"}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabLibrary}</span>
        </button>
        <Link
          href="/books"
          className="flex flex-col items-center gap-1 text-slate hover:text-ink-900 cursor-pointer"
        >
          <Book className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabCatalog}</span>
        </Link>
        <button
          onClick={() => { setActiveTab("portal"); }}
          className={`flex flex-col items-center gap-1 ${activeTab === "portal" ? "text-ink-900" : "text-slate"}`}
        >
          <UploadCloud className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabPeerReview}</span>
        </button>
        <button
          onClick={() => { setActiveTab("shelf"); }}
          className={`flex flex-col items-center gap-1 ${activeTab === "shelf" ? "text-ink-900" : "text-slate"}`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.tabMyShelf}</span>
        </button>
      </div>

      {/* DYNAMIC VIEW CONTAINER */}
      <main className="w-full pb-24 animate-rise">
        
        {/* VIEW 1: PUBLIC LIBRARY SECTION */}
        {activeTab === "library" && !activeBook && (
          <div className="w-full">
            {/* HERO SECTION IN RADIAL METALLIC BLUE/NAVY AND FULL WIDTH AT 60vh WITH FIXED ATTACHED BACKGROUND */}
            <div 
              className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden mb-12 bg-cover bg-center bg-no-repeat bg-fixed"
              style={{ 
                backgroundImage: `url('https://i.postimg.cc/SjFKHRys/bayan-cover.png')` 
              }}
            >
              {/* Overlay with color blue */}
              <div className="absolute inset-0 bg-[#08396D]/85 backdrop-blur-[1.5px]" />
              
              {/* Abstract Golden Arch Watermark Background */}
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 pointer-events-none flex items-end justify-end">
                <svg className="w-full h-full max-w-[340px]" viewBox="0 0 100 110">
                  <path d="M 49.8 19.7 L 49.6 20.9 L 49.2 22.3 L 48.7 23.6 L 48.2 24.9 L 47.6 26.3 L 46.9 27.6 L 46.2 29.0 L 45.3 30.3 L 44.4 31.6 L 43.4 33.0 L 42.3 34.3 L 41.2 35.7 L 39.9 37.0 L 38.7 38.2 L 37.3 39.6 L 35.9 40.9 L 34.5 42.3 L 33.1 43.6 L 31.7 44.9 L 30.3 46.3 L 28.9 47.6 L 27.5 49.0 L 26.3 50.3 L 25.2 51.6 L 24.1 53.0 L 23.1 54.3 L 22.3 55.7 L 21.6 56.9 L 21.1 58.3 L 20.6 59.6 L 20.3 60.9 L 20.1 62.3 L 20.0 63.6 L 20.1 65.0 L 20.3 66.3 L 20.7 67.6 L 21.2 69.0 L 22.0 70.3 L 23.1 71.7 L 26.4 73.0 L 28.4 74.3 L 71.6 74.3 L 73.6 73.0 L 76.9 71.7 L 78.0 70.3 L 78.8 69.0 L 79.3 67.6 L 79.7 66.3 L 79.9 65.0 L 80.0 63.6 L 79.9 62.3 L 79.7 60.9 L 79.4 59.6 L 78.9 58.3 L 78.4 56.9 L 77.7 55.7 L 76.9 54.3 L 75.9 53.0 L 74.8 51.6 L 73.7 50.3 L 72.5 49.0 L 71.1 47.6 L 69.7 46.3 L 68.3 44.9 L 66.9 43.6 L 65.5 42.3 L 64.1 40.9 L 62.7 39.6 L 61.3 38.2 L 60.1 37.0 L 58.8 35.7 L 57.7 34.3 L 56.6 33.0 L 55.6 31.6 L 54.7 30.3 L 53.8 29.0 L 53.1 27.6 L 52.4 26.3 L 51.8 24.9 L 51.3 23.6 L 50.8 22.3 L 50.4 20.9 L 50.2 19.7 Z" fill="none" stroke="#D9B879" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#D9B879] block mb-4">
                    {lang === "en" ? "01 — Foundation Standards" : "التأسيس والمنهجية"}
                  </span>
                  <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-6.5xl tracking-tight text-white mb-3">
                    {t.discoverTitle}
                  </h1>
                  <p 
                    className={`text-xl sm:text-2xl text-gold-300 mb-6 text-center ${lang === "ar" ? "font-ar-read" : "font-sans"}`} 
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {t.heroSubtitle}
                  </p>
                  <p className="text-sm sm:text-base text-paper/85 max-w-2xl leading-relaxed mb-8 mx-auto">
                    {t.discoverDesc}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-700 text-ink-900 hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      {t.exploreBtn}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setActiveTab("portal")}
                      className="inline-flex items-center gap-2 border border-paper/20 hover:border-paper bg-transparent text-paper font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {t.submitManuscript}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN INNER WIDTH RESTRICTOR FOR CONTENT BELOW HERO */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* OUR VALUES SECTION */}
            <div className="mb-14 mt-4">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#c7a05a] font-bold bg-[#c7a05a]/10 px-3 py-1 rounded-full">
                  {lang === "en" ? "METHODOLOGY" : "معايير المنهجية"}
                </span>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink-900 mt-4 leading-snug">
                  {t.ourValuesTitle}
                </h2>
                <div className="w-12 h-1 bg-[#c7a05a]/30 mx-auto mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* VALUE CARD 1 */}
                <div className="bg-white p-6 rounded-2xl border border-ink-900/10 shadow-sm hover:border-[#c7a05a]/40 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-xl bg-[#c7a05a]/10 flex items-center justify-center text-[#c7a05a] mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-ink-900 mb-2">
                    {t.value1Title}
                  </h3>
                  <p className="text-xs text-slate leading-relaxed">
                    {t.value1Desc}
                  </p>
                </div>

                {/* VALUE CARD 2 */}
                <div className="bg-white p-6 rounded-2xl border border-ink-900/10 shadow-sm hover:border-[#c7a05a]/40 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-xl bg-[#c7a05a]/10 flex items-center justify-center text-[#c7a05a] mb-4 group-hover:scale-110 transition-transform">
                    <Languages className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-ink-900 mb-2">
                    {t.value2Title}
                  </h3>
                  <p className="text-xs text-slate leading-relaxed">
                    {t.value2Desc}
                  </p>
                </div>

                {/* VALUE CARD 3 */}
                <div className="bg-white p-6 rounded-2xl border border-ink-900/10 shadow-sm hover:border-[#c7a05a]/40 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-xl bg-[#c7a05a]/10 flex items-center justify-center text-[#c7a05a] mb-4 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-ink-900 mb-2">
                    {t.value3Title}
                  </h3>
                  <p className="text-xs text-slate leading-relaxed">
                    {t.value3Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* EXPLORER & SEARCH MODULE */}
            <div id="library-explorer" className="mb-8 scroll-mt-24">
              <div className="bg-white p-6 rounded-2xl border border-ink-900/10 shadow-sm flex flex-col lg:flex-row items-center gap-4">
                
                {/* Search query input */}
                <div className="relative w-full flex-1">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-12 pr-4 py-3 bg-paper-2/40 border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-ink-500/10 text-char transition-all"
                  />
                </div>

                {/* Filter and reset actions */}
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

                  {/* Reset Filters */}
                  {(searchTerm || selectedCategory !== "all") && (
                    <button
                      onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                      className="px-4 py-3 bg-maroon-700/10 hover:bg-maroon-700 text-maroon-700 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {lang === "en" ? "Reset" : "إعادة ضبط"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BOOKS CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredBooks().map((book) => {
                const isDownloaded = downloadedIds.includes(book.id);
                return (
                  <div 
                    key={book.id} 
                    className="bg-white rounded-2xl border border-ink-900/10 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#c7a05a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Clickable Graphic Cover & Narrative metadata */}
                    <Link
                      href={`/books/${book.id}`}
                      className="cursor-pointer flex-1 flex flex-col"
                      title={lang === "en" ? `Click to view ${book.titleEn}` : `انقر لمشاهدة ${book.titleAr}`}
                    >
                      {/* Simulated elegant manual cover background with physical spine & gold bindings */}
                      <div 
                        className="h-48 p-6 relative flex flex-col justify-between text-paper overflow-hidden select-none transition-all duration-500 group-hover:brightness-[1.05]" 
                        style={{ background: book.coverBg }}
                      >
                        {/* Physical spine simulation */}
                        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-15" />
                        
                        {/* Elegant vintage/editorial gold inner margin border */}
                        <div className="absolute inset-4 border border-white/15 pointer-events-none z-10 rounded" />
                        <div className="absolute inset-4.5 border border-gold-400/20 pointer-events-none z-10 rounded" />

                        {/* Geometric Dome Watermark element inside the cover */}
                        <div className="absolute right-0 bottom-0 w-1/3 h-1/2 opacity-25 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                          <svg className="w-full h-full" viewBox="0 0 100 110">
                            <use href="#ic" stroke="#D9B879" fill="none" strokeWidth="2.5" />
                          </svg>
                        </div>

                        {/* Top labels */}
                        <div className="flex items-start justify-between gap-2 relative z-20">
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-sans uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md text-gold-300 border border-white/5">
                            <span className="w-1 h-1 rounded-full bg-[#c7a05a]" />
                            {lang === "en" ? book.categoryEn : book.categoryAr}
                          </span>
                          <span className="text-[9px] font-mono bg-white/10 px-2 py-1 rounded text-paper/90 border border-white/5">
                            {book.size}
                          </span>
                        </div>

                        {/* Main Titles */}
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

                      {/* Book Metadata & details */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-4 bg-paper/20 pb-4">
                        <div>
                          {/* Source origin, era & Parts metric */}
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

                          {/* Special Ribbon for community uploaded books */}
                          {book.isCommunity && (
                            <div className="mt-4 flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-500/20 text-emerald-800 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{lang === "en" ? "Scholarly Verified Candidate" : "مخطوطة محققة معتمدة"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Card actions wrapper outside clickable zone */}
                    <div className="p-6 pt-0 bg-paper/20">
                      <div className="flex items-center gap-2 pt-3 border-t border-ink-900/5">
                        
                        {/* Download Book PDF */}
                        <button
                          onClick={() => setPrintBook(book)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-ink-900 hover:bg-maroon-700 hover:text-white border border-ink-900/5 hover:border-maroon-700 transition-all shadow-xs cursor-pointer"
                          title={lang === "en" ? "Download PDF Edition" : "تحميل نسخة PDF"}
                        >
                          <Download className="w-4.5 h-4.5" />
                        </button>

                        {/* Primary read button */}
                        <Link
                          href={`/books/${book.id}`}
                          className="flex-1 bg-ink-900 hover:bg-[#c7a05a] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{t.readBtn}</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}

              {getFilteredBooks().length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <Book className="w-12 h-12 text-slate mx-auto mb-4 opacity-50" />
                  <p className="text-slate font-medium text-sm">
                    {lang === "en" ? "No book matches your search query." : "لم يُعثر على نتائج مطابقة لعملية البحث."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* VIEW 2: ACTIVE DIGITAL BILINGUAL BOOK PROFILE */}
        {activeTab === "library" && activeBook && (
          <div className="animate-rise max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            {/* BACK BAR */}
            <div className="mb-6 flex items-center justify-between border-b border-ink-900/10 pb-4">
              <button
                onClick={() => setActiveBook(null)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-900 hover:text-maroon-700 transition-all font-mono"
              >
                {t.backToLibrary}
              </button>
            </div>

            {/* BOOK HERITAGE PRESENTATION LAYER */}
            <div className="bg-white rounded-3xl border border-ink-900/10 overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-12 shadow-sm animate-rise">
              {/* Elegant Graphic Book Cover */}
              <div 
                className="md:col-span-4 p-8 flex flex-col justify-between text-paper relative overflow-hidden min-h-[320px]"
                style={{ background: activeBook.coverBg }}
              >
                {/* Book Spine border shadow */}
                <div className="absolute top-0 left-0 w-4 h-full bg-black/10 z-20 border-r border-white/5" />
                {/* Islamic corner geometry watermark */}
                <div className="absolute right-0 bottom-0 w-2/3 h-1/2 opacity-20 pointer-events-none flex items-end justify-end">
                  <svg className="w-full h-full max-w-[150px]" viewBox="0 0 100 110">
                    <path d="M 49.8 19.7 L 49.6 20.9 L 49.2 22.3 L 48.7 23.6 L 48.2 24.9 L 47.6 26.3 Z" stroke="#D9B879" fill="none" strokeWidth="2" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300 block mb-2 px-2.5 py-0.5 bg-white/10 rounded-full w-fit border border-white/5">
                    {lang === "en" ? activeBook.categoryEn : activeBook.categoryAr}
                  </span>
                </div>

                <div className="relative z-10 my-6">
                  <h2 className="font-display font-bold text-2xl leading-tight mb-2 text-pretty text-white">
                    {activeBook.titleAr}
                  </h2>
                  <h3 className="font-sans font-medium text-xs text-gold-300 opacity-95 tracking-wide leading-relaxed line-clamp-2">
                    {activeBook.titleEn}
                  </h3>
                </div>

                <div className="relative z-10 text-[11px] font-mono opacity-85 space-y-1">
                  <p className="font-bold text-white">{activeBook.authorAr}</p>
                  <p>{activeBook.authorEn}</p>
                  <p className="text-[9px] opacity-75">{activeBook.era}</p>
                </div>
              </div>

              {/* Comprehensive Book Metadata and Descriptions */}
              <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-900/5 pb-4">
                    <div>
                      <h1 className="font-display font-bold text-2xl text-ink-900 leading-tight">
                        {lang === "en" ? activeBook.titleEn : activeBook.titleAr}
                      </h1>
                      <p className="text-xs text-gold-700 font-semibold mt-1">
                        {lang === "en" ? activeBook.authorEn : activeBook.authorAr}
                      </p>
                    </div>
                    
                    {/* Size and Era info */}
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-paper border border-ink-900/5 text-[11px] font-mono font-semibold rounded-lg text-slate shadow-2xs">
                        {activeBook.era} · {activeBook.size}
                      </span>
                    </div>
                  </div>

                  {/* Publisher / Preservation Press Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-paper p-4 rounded-xl border border-ink-900/5 text-xs font-mono">
                    <div>
                      <span className="text-slate block text-[10px] uppercase mb-1">{t.bookPublisher}</span>
                      <span className="font-bold text-ink-900">{activeBook.publisherEn || "Bayan Heritage Preservation"}</span>
                    </div>
                    <div dir="rtl" className="text-right sm:border-r sm:border-ink-900/5 pr-4">
                      <span className="text-slate block text-[10px] uppercase mb-1">{lang === "en" ? "Publisher" : "الناشر المحقق"}</span>
                      <span className="font-bold text-ink-900">{activeBook.publisherAr || "دار بيان لإحياء التراث وبحث الحديث"}</span>
                    </div>
                  </div>

                  {/* Book Description Side-by-Side Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] font-mono text-slate uppercase tracking-wider block font-bold">Description En</span>
                      <p className="text-xs text-char leading-relaxed">
                        {activeBook.descriptionEn}
                      </p>
                    </div>
                    <div dir="rtl" className="space-y-1.5 text-right md:border-r md:border-ink-900/5 md:pr-6">
                      <span className="text-[10px] font-mono text-slate uppercase tracking-wider block font-bold">التعريف بالمتن</span>
                      <p className="text-xs text-char leading-relaxed font-ar-read">
                        {activeBook.descriptionAr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Action triggers: Download PDF & Save on Shelf */}
                <div className="flex flex-wrap gap-3 border-t border-ink-900/5 pt-5">
                  <button
                    onClick={() => setPrintBook(activeBook)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-maroon-700 to-maroon-500 hover:from-maroon-500 hover:to-maroon-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    title="Download pristine high-fidelity PDF copy of this verified text"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download PDF Edition</span>
                  </button>
                  
                  <button
                    onClick={() => handleToggleDownload(activeBook.id)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                      downloadedIds.includes(activeBook.id)
                        ? "bg-emerald-50 text-emerald-800 border-emerald-500/20"
                        : "bg-paper hover:bg-paper-2 text-ink-900 border-ink-900/5"
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>{downloadedIds.includes(activeBook.id) ? (lang === "en" ? "Saved on Shelf" : "محفوظ في رفّك") : (lang === "en" ? "Save on Shelf" : "حفظ لمتن على رفّك")}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: PEER-REVIEW PORTAL SECTION */}
        {activeTab === "portal" && (
          <div className="animate-rise space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            {/* HERO HERO SECTION */}
            <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 bg-gradient-to-br from-maroon-700 to-amber-950 text-paper border border-gold-300/10 shadow-xl">
              <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 pointer-events-none flex items-end justify-end">
                <FileText className="w-full h-full max-w-[200px]" />
              </div>

              <div className="relative z-10 max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-widest text-gold-300 block mb-4">
                  {lang === "en" ? "02 — Collaborative Curation" : "التدقيق والمراجعة المشاركة"}
                </span>
                <h1 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight text-white mb-3">
                  {t.peerReviewTitle}
                </h1>
                <p className="font-ar-read text-xl sm:text-2xl text-gold-300 mb-6" dir="rtl">
                  تحقيق الأحاديث وحفظ المتون بمراجعة علمية موثوقة.
                </p>
                <p className="text-sm sm:text-base text-paper/85 max-w-2xl leading-relaxed mb-6">
                  {t.peerReviewDesc}
                </p>
              </div>
            </div>

            {/* MANUAL MANUSCRIPT SUBMISSION FORM */}
            <div className="bg-white rounded-2xl border border-ink-900/10 shadow-sm overflow-hidden">
              <div className="bg-ink-900 text-paper p-6">
                <h3 className="font-display font-semibold text-xl">
                  {t.uploadFormTitle}
                </h3>
                <p className="text-xs text-gold-300 mt-1 font-mono tracking-wide">
                  {lang === "en" ? "Submitted works undergo automated AI and manual peer audits" : "الأعمال ترسل تلقائياً إلى ذكائي آلي ومراجعة علمية معتمدة"}
                </p>
              </div>

              <form onSubmit={handleNewSubmission} className="p-6 md:p-8 space-y-6">
                {submitSuccess && (
                  <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-800 p-4 rounded-xl text-xs sm:text-sm font-medium">
                    {t.uploadSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.bookTitleEn}</label>
                    <input
                      type="text"
                      required
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Al-Muwatta (Selections)"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.bookTitleAr}</label>
                    <input
                      type="text"
                      required
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      placeholder="مثال: منسك الإمام مالك للنصائح"
                      dir="rtl"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.authorEn}</label>
                    <input
                      type="text"
                      value={newAuthorEn}
                      onChange={(e) => setNewAuthorEn(e.target.value)}
                      placeholder="e.g. Imam Malik ibn Anas"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.authorAr}</label>
                    <input
                      type="text"
                      value={newAuthorAr}
                      onChange={(e) => setNewAuthorAr(e.target.value)}
                      placeholder="مثال: الإمام مالك بن أنس"
                      dir="rtl"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.manuscriptEra}</label>
                    <input
                      type="text"
                      value={newEra}
                      onChange={(e) => setNewEra(e.target.value)}
                      placeholder="e.g. 179 AH / 795 CE"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.bookCategory}</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char cursor-pointer"
                    >
                      <option value="Hadith">Hadith / الحديث الشريف</option>
                      <option value="Adab & Tazkiyah">Adab & Tazkiyah / الآداب والتزكية</option>
                      <option value="Fiqh & Hadith">Fiqh & Hadith / الفقه والحديث</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">{t.sourceLibrary}</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g. Süleymaniye Library, MS 984"
                    className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ink-900/5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">Chapter Title (English)</label>
                    <input
                      type="text"
                      value={newChapterTitleEn}
                      onChange={(e) => setNewChapterTitleEn(e.target.value)}
                      placeholder="e.g. Intentions"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">Chapter Title (Arabic)</label>
                    <input
                      type="text"
                      value={newChapterTitleAr}
                      onChange={(e) => setNewChapterTitleAr(e.target.value)}
                      placeholder="مثال: باب النوايا والإخلاص"
                      dir="rtl"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">Content (English translation)</label>
                    <textarea
                      required
                      value={newContentEn}
                      onChange={(e) => setNewContentEn(e.target.value)}
                      rows={6}
                      placeholder="Translate the manuscript precisely into English here..."
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-2">Content (Arabic Original)</label>
                    <textarea
                      required
                      value={newContentAr}
                      onChange={(e) => setNewContentAr(e.target.value)}
                      rows={6}
                      placeholder="أدخل النص العربي الأصيل هنا..."
                      dir="rtl"
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-sm text-char font-ar"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold-500 hover:bg-gold-700 text-ink-900 hover:text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Generating AI Audit...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>{t.submitToReview}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* QUEUE OF UNDER-REVIEW ITEMS */}
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-2xl text-ink-900 border-b border-ink-900/5 pb-3">
                {t.reviewQueue}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewQueue.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-ink-900/10 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest bg-maroon-700/10 text-maroon-700 px-2.5 py-0.5 rounded-md">
                          {item.categoryEn}
                        </span>
                        <span className="text-[10px] font-mono text-slate">
                          {item.size}
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-xl text-ink-900 mb-1">
                        {lang === "en" ? item.titleEn : item.titleAr}
                      </h3>
                      <p className="text-xs font-mono text-gold-700 mb-3">
                        {lang === "en" ? `Submitted by: ${item.submitter}` : `مقدم بواسطة: ${item.submitter}`}
                      </p>
                      <p className="text-xs text-slate line-clamp-3 leading-relaxed">
                        {lang === "en" ? item.descriptionEn : item.descriptionAr}
                      </p>

                      {/* AI Audit summary badge */}
                      {item.aiReport && (
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-paper to-white border border-ink-900/5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                            <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-900">{t.aiAuditReport}</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div>
                              <span className="text-slate">Fidelity Score:</span>
                              <span className="font-bold text-ink-900 block">{item.aiReport.confidenceScore}%</span>
                            </div>
                            <div>
                              <span className="text-slate">Recommendation:</span>
                              <span className="font-bold text-[#c7a05a] block">{item.aiReport.overallRecommendation}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Panel */}
                    <div className="bg-paper-2/40 px-6 py-4 border-t border-ink-900/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate">
                          {t.communityEndorsements}: <b>{item.endorsements}</b>
                        </span>
                        {item.status !== "approved" && (
                          <button
                            onClick={() => handleEndorse(item)}
                            className="bg-paper-2 hover:bg-gold-500 hover:text-ink-900 p-2 rounded-xl text-ink-900 border border-ink-900/5 transition-all text-[11px]"
                            title={t.endorseBtn}
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSubmission(item)}
                          className="bg-white hover:bg-paper-2 border border-ink-900/10 text-char text-xs px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          {lang === "en" ? "Examine Case" : "الاطلاع والتحقيق"}
                        </button>
                        {item.status !== "approved" && (
                          <button
                            onClick={() => handleScholarlyPublish(item)}
                            className="bg-ink-900 hover:bg-ink-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all"
                          >
                            {lang === "en" ? "Approve" : "اعتماد"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MY PERSONAL INK-SAVED SHELF */}
        {activeTab === "shelf" && (
          <div className="animate-rise space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            {/* OFFLINE COMPILED MANUSCRIPTS */}
            <div>
              <h2 className="font-display font-semibold text-2xl text-ink-900 border-b border-ink-900/5 pb-3 mb-6">
                {lang === "en" ? "My Saved Books Shelf" : "رفّي ومخطوطاتي المحفوظة"}
              </h2>

              {downloadedIds.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-ink-900/10 text-center">
                  <Database className="w-12 h-12 text-slate mx-auto mb-4 opacity-50" />
                  <p className="text-slate font-medium text-sm">
                    {lang === "en" ? "No books saved on your shelf yet." : "لا توجد كتب محفوظة في هذا الرف بعد."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {publicBooks
                    .filter(b => downloadedIds.includes(b.id))
                    .map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-ink-900/10 p-5 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-paper" style={{ background: item.coverBg }}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-base text-ink-900 leading-tight">
                              {lang === "en" ? item.titleEn : item.titleAr}
                            </h4>
                            <p className="text-[10px] font-mono text-slate">
                              {item.size} · {item.era}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-ink-900/5">
                          <Link
                            href={`/books/${item.id}`}
                            className="flex-1 bg-ink-900 hover:bg-ink-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl text-center"
                          >
                            {t.readBtn}
                          </Link>
                          <button
                            onClick={() => setPrintBook(item)}
                            className="bg-paper-2 text-ink-900 hover:bg-maroon-700 hover:text-white p-2.5 rounded-xl transition-all"
                            title={lang === "en" ? "Download PDF Edition" : "تحميل كـ PDF"}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleDownload(item.id)}
                            className="text-maroon-700 hover:bg-maroon-700/10 p-2.5 rounded-xl transition-all"
                            title="Remove from Shelf"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* GLOBAL FOOTER */}
      <footer className="w-full bg-white border-t border-ink-900/10 pt-16 pb-12 mt-auto print:hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gold-300/30 shadow-xs">
                  <img 
                    src="https://i.postimg.cc/hjnRFmmk/bayan-logo-2.png" 
                    alt="Bayan Logo" 
                    className="w-7 h-7 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-display font-bold text-base tracking-wider text-ink-900 uppercase">
                  {t.brandName}
                </span>
              </div>
              <p className="text-xs text-slate leading-relaxed max-w-sm">
                {t.footerAbout}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-ink-900">
                {lang === "en" ? "Explore Portals" : "أقسام المنصة"}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => { setActiveTab("library"); setActiveBook(null); }}
                    className="text-slate hover:text-[#c7a05a] transition-colors font-medium cursor-pointer"
                  >
                    {t.tabLibrary}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("portal"); }}
                    className="text-slate hover:text-[#c7a05a] transition-colors font-medium cursor-pointer"
                  >
                    {t.tabPeerReview}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("shelf"); }}
                    className="text-slate hover:text-[#c7a05a] transition-colors font-medium cursor-pointer"
                  >
                    {t.tabMyShelf}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Standards */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-ink-900">
                {lang === "en" ? "Scholarly Preservation" : "أهداف التحقيق ومراجعة المتين"}
              </h4>
              <p className="text-xs text-slate leading-relaxed">
                {lang === "en" ? "All manuscripts reside under strict peer audits and dual attribution verifications using classical narration guidelines." : "تخضع كافة المخطوطات والكتب في هذا الأرشيف لتدقيق علمي متبادل ورصد كلي لعلل الحديث ونقاط الأسانيد."}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#c7a05a] font-bold bg-[#c7a05a]/5 px-2.5 py-1 rounded">
                  {lang === "en" ? "APPROVED STANDARD ACADEMIC ARCHIVE" : "أرشيف تراثي علمي معتمد"}
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-ink-900/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate/75 font-mono">
            <div>
              {t.footerRights}
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-ink-900 transition-colors">{lang === "en" ? "Heritage Terms" : "شروط الحفظ"}</a>
              <span>·</span>
              <a href="#" className="hover:text-ink-900 transition-colors">{lang === "en" ? "Scientific Criteria" : "منهج النقد"}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION DIALOG MODAL */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-ink-950/40 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white w-full max-w-md rounded-2xl border border-ink-900/15 shadow-xl overflow-hidden z-50"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {/* Header block with golden details */}
              <div className="relative p-6 pb-4 border-b border-ink-900/5 bg-paper/50">
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="absolute top-4 right-4 text-slate hover:text-ink-900 transition-colors w-7 h-7 rounded-lg hover:bg-ink-900/5 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#c7a05a] font-bold bg-[#c7a05a]/10 px-2.5 py-0.5 rounded">
                  {lang === "en" ? "Scholarly Access" : "بوابة المحققين"}
                </span>
                
                <h3 className="font-display font-medium text-lg text-ink-900 mt-2">
                  {authMode === "login" 
                    ? (lang === "en" ? "Enter the Archive" : "تسجيل الدخول للمكتبة")
                    : (lang === "en" ? "Create Academic Profile" : "إنشاء حساب عالم جديد")}
                </h3>
                <p className="text-slate text-xs mt-1 leading-relaxed">
                  {lang === "en" 
                    ? "Engage with verified Islamic source codes, peer reviews, and interactive AI analysis dashboards."
                    : "شارك في أبحاث التراث والتحقيق الشرعي المتبادل بالتواصل مع كبار العلماء والمساعد الذكي."}
                </p>
              </div>

              {/* Form Block */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Simulate success
                  setIsLoggedIn(true);
                  setUserEmail(authEmailInput || (authMode === "login" ? "muhaqqiq@bayan.org" : "student@bayan.org"));
                  setAuthModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                    {lang === "en" ? "Email Address" : "البريد الإلكتروني"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. scholar@bayan.org"
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-ink-900/10 focus:outline-none focus:border-[#c7a05a]/50 text-ink-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                    {lang === "en" ? "Security Key (Password)" : "كلمة المرور"}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPasswordInput}
                    onChange={(e) => setAuthPasswordInput(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-ink-900/10 focus:outline-none focus:border-[#c7a05a]/50 text-ink-900 transition-colors"
                  />
                </div>

                {authMode === "signup" && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                      {lang === "en" ? "Area of Specialization & Focus" : "التخصص والاهتمام العلمي"}
                    </label>
                    <select className="w-full text-xs px-4 py-2.5 rounded-xl border border-ink-900/10 focus:outline-none focus:border-[#c7a05a]/50 text-ink-900 bg-white transition-colors">
                      <option>{lang === "en" ? "Hadith Studies & narrator critique" : "علم الحديث وعلم الرجال (الجرح والتعديل)"}</option>
                      <option>{lang === "en" ? "Fiqh & comparative legal systems" : "أصول الفقه والشرائع الفقهية المقارنة"}</option>
                      <option>{lang === "en" ? "Classical Arabic Linguistics" : "اللغويات الكلاسيكية والنحو والصرف"}</option>
                      <option>{lang === "en" ? "General Islamic Intellectual History" : "التاريخ والآداب التراثية العامة"}</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full text-xs font-semibold py-3 rounded-xl bg-ink-900 hover:bg-[#c7a05a] text-white transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider mt-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  {authMode === "login" ? t.loginBtn : t.signUpBtn}
                </button>

                {/* Switch Login / Sign Up options */}
                <div className="pt-3 border-t border-ink-900/5 text-center">
                  <p className="text-xs text-slate">
                    {authMode === "login" 
                      ? (lang === "en" ? "First time participating?" : "تشارك للمرة الأولى؟")
                      : (lang === "en" ? "Already have an account?" : "تملك حساباً بالفعل؟")}{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="font-semibold text-[#c7a05a] hover:underline cursor-pointer"
                    >
                      {authMode === "login" 
                        ? (lang === "en" ? "Register Academic Key" : "سجل كمحقق جديد")
                        : (lang === "en" ? "Identify (Log In)" : "تسجيل الدخول")}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCHOLARLY PEER-REVIEW DIALOG CASE CHECK OVERLAY */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, translateY: 15 }}
              animate={{ scale: 1, translateY: 0 }}
              exit={{ scale: 0.95, translateY: 15 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-2xl border border-ink-900/15"
            >
              
              {/* Header */}
              <div className="bg-ink-900 text-paper p-6 flex justify-between items-center gap-4">
                <div>
                  <span className="font-mono text-[10px] text-gold-300 block mb-1">
                    {lang === "en" ? `Case ID: ${selectedSubmission.id}` : `معرف المخطوطة: ${selectedSubmission.id}`}
                  </span>
                  <h3 className="font-display font-semibold text-xl sm:text-2xl leading-tight">
                    {lang === "en" ? selectedSubmission.titleEn : selectedSubmission.titleAr}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-paper transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Case details scroll area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-sans">
                
                {/* Meta properties */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-paper p-3.5 rounded-xl border border-ink-900/5">
                    <span className="text-slate block mb-1">{t.authorEn}</span>
                    <span className="font-bold text-ink-900">{lang === "en" ? selectedSubmission.authorEn : selectedSubmission.authorAr}</span>
                  </div>
                  <div className="bg-paper p-3.5 rounded-xl border border-ink-900/5">
                    <span className="text-slate block mb-1">{lang === "en" ? "Era" : "العهد التاريخي"}</span>
                    <span className="font-bold text-ink-900">{selectedSubmission.era}</span>
                  </div>
                  <div className="bg-paper p-3.5 rounded-xl border border-ink-900/5">
                    <span className="text-slate block mb-1">{lang === "en" ? "Source" : "المصدر الفخري"}</span>
                    <span className="font-bold text-ink-900">{selectedSubmission.source}</span>
                  </div>
                  <div className="bg-paper p-3.5 rounded-xl border border-ink-900/5">
                    <span className="text-slate block mb-1">{lang === "en" ? "Submitter" : "مرسل المخطوطة"}</span>
                    <span className="font-bold text-ink-900">{selectedSubmission.submitter}</span>
                  </div>
                </div>

                {/* TWO COLUMN VIEW: MANUSCRIPT TEXT AND AUDIT REPORT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: book actual manuscript content */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-paper-2/40 p-6 rounded-2xl border border-ink-900/10">
                      <h4 className="font-display font-semibold text-lg text-ink-900 mb-4 border-b border-ink-900/5 pb-2">
                        {lang === "en" ? selectedSubmission.chapters[0].titleEn : selectedSubmission.chapters[0].titleAr}
                      </h4>

                      {/* Parallel content rendering */}
                      <p dir="rtl" className="font-ar-read text-xl text-right leading-relaxed mb-6">
                        {selectedSubmission.chapters[0].contentAr}
                      </p>
                      <p className="text-sm text-char leading-relaxed border-t border-ink-900/5 pt-4">
                        {selectedSubmission.chapters[0].contentEn}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: AI Audit details */}
                  <div className="lg:col-span-6 space-y-6">
                    {selectedSubmission.aiReport ? (
                      <div className="bg-gradient-to-br from-paper to-white p-6 rounded-2xl border border-gold-500/20 space-y-6 shadow-xs">
                        
                        {/* Title report */}
                        <div className="flex items-center gap-2 border-b border-ink-900/5 pb-3">
                          <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
                          <h4 className="font-display font-semibold text-base text-ink-900">
                            {t.aiAuditReport}
                          </h4>
                        </div>

                        {/* Audit specific list metadata */}
                        <div className="space-y-4 text-xs sm:text-sm">
                          <div>
                            <span className="font-mono text-[10px] text-slate block mb-1">{t.authenticityScore}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-paper-2 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gold-500 h-full rounded-full" style={{ width: `${selectedSubmission.aiReport.confidenceScore}%` }} />
                              </div>
                              <span className="font-bold font-mono text-ink-900">{selectedSubmission.aiReport.confidenceScore}%</span>
                            </div>
                          </div>

                          <div className="border-t border-ink-900/5 pt-3">
                            <span className="font-mono text-[10px] text-slate block mb-1">{t.authorVerification}</span>
                            <p className="text-char/80 leading-relaxed text-xs">{selectedSubmission.aiReport.authorMatch}</p>
                          </div>

                          <div className="border-t border-ink-900/5 pt-3">
                            <span className="font-mono text-[10px] text-slate block mb-1">{t.narratorsIsnaad}</span>
                            <p className="text-char/80 leading-relaxed text-xs">{selectedSubmission.aiReport.narratorCheck}</p>
                          </div>

                          {selectedSubmission.aiReport.revoltFlags.length > 0 && (
                            <div className="border-t border-ink-900/5 pt-3">
                              <span className="font-mono text-[10px] text-warn block mb-1">{t.anomaliesFlagged}</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {selectedSubmission.aiReport.revoltFlags.map((flag, fIdx) => (
                                  <span key={fIdx} className="bg-amber-50 text-warn border border-warn/25 px-2 py-0.5 rounded-md text-[10px] font-mono">
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-ink-900/5 pt-3">
                            <span className="font-mono text-[10px] text-slate block mb-1">{t.scholarlyAlignment}</span>
                            <p className="text-char/80 leading-relaxed text-xs">{selectedSubmission.aiReport.theologicalAlignment}</p>
                          </div>

                          <div className="border-t border-ink-900/5 pt-3 flex items-center justify-between gap-4">
                            <div>
                              <span className="font-mono text-[10px] text-slate block">{t.recommendation}</span>
                              <span className="font-bold text-[#c7a05a] text-xs">{selectedSubmission.aiReport.overallRecommendation}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {selectedSubmission.aiReport.isAuthentic ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-warn" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-ink-900/5 rounded-2xl bg-paper">
                        <Sparkles className="w-8 h-8 text-slate mx-auto mb-2 opacity-50" />
                        <p className="text-slate text-xs font-mono">No AI Verification report compiled for this submission.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SCHOLARLY COMMENTARIES AND FEEDBACK FROM PEERS */}
                <div className="space-y-6 pt-6 border-t border-ink-900/10">
                  <h4 className="font-display font-semibold text-lg text-ink-900">
                    {lang === "en" ? "Scholarly Discussion & Peer-Reviews" : "آراء شيوخ ومحققي المجتمع"}
                  </h4>

                  {/* Discussion comment feeds */}
                  <div className="space-y-4">
                    {selectedSubmission.reviews.map((rev) => (
                      <div key={rev.id} className="bg-paper p-5 rounded-2xl border border-ink-900/5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <b className="text-ink-900 font-semibold">{rev.reviewer}</b>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                            rev.verdict === "Approved" ? "bg-emerald-50 text-[#2e7d32]" : "bg-amber-50 text-warn"
                          }`}>
                            {rev.verdict}
                          </span>
                        </div>
                        <p className="text-char/80 leading-relaxed mb-1">{rev.comments}</p>
                        <span className="block font-mono text-[9px] text-slate text-right">{rev.date}</span>
                      </div>
                    ))}

                    {selectedSubmission.reviews.length === 0 && (
                      <p className="text-slate text-xs italic">
                        {lang === "en" ? "No peer audits filed for this manuscript yet." : "لا توجد أي مراجعات مكتوبة لهذه المخطوطة حتى الآن."}
                      </p>
                    )}
                  </div>

                  {/* Submission form for review */}
                  <form onSubmit={handleAddReviewComment} className="space-y-4 pt-4 border-t border-ink-900/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <b className="text-xs font-bold uppercase tracking-wider text-ink-900">
                        {lang === "en" ? "Submit your Peer Evaluation" : "تقديم مراجعة وتدقيق معتمد"}
                      </b>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-mono text-slate">Verdict:</label>
                        <select
                          value={newVerdict}
                          onChange={(e) => setNewVerdict(e.target.value as any)}
                          className="bg-paper border border-ink-900/10 rounded-lg text-[11px] px-3 py-1 font-mono cursor-pointer"
                        >
                          <option value="Approved">Approved / معتمد</option>
                          <option value="Needs Revision">Needs Revision / يحتاج مراجعة</option>
                          <option value="Rejected">Rejected / مرفوض</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      required
                      value={newComment}
                      onChange={(e) => setNewComments(e.target.value)}
                      rows={3}
                      placeholder={lang === "en" ? "Provide detailed scholarly justification, cross-references, or textual analysis..." : "أدخل تفاصيل التدقيق العلمي أو تخريج الأحاديث أو الملاحظات البلاغية..."}
                      className="w-full px-4 py-3 bg-paper border border-ink-900/10 focus:border-ink-500 rounded-xl text-xs text-char"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-ink-900 hover:bg-ink-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all"
                      >
                        {lang === "en" ? "Post Review" : "نشر التقييم"}
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Action Button Footer */}
              <div className="bg-paper p-5 border-t border-ink-900/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate">
                  <span>{t.communityEndorsements}: <b>{selectedSubmission.endorsements}</b></span>
                  {selectedSubmission.status !== "approved" && (
                    <button
                      onClick={() => handleEndorse(selectedSubmission)}
                      className="bg-pink-100 hover:bg-pink-200 p-2 rounded-xl text-pink-700 transition-all text-xs"
                      title={t.endorseBtn}
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-6 py-2.5 bg-paper-2 hover:bg-paper-2/80 rounded-xl text-xs font-bold text-char transition-all"
                  >
                    {lang === "en" ? "Cancel case study" : "إغلاق نافذة التدقيق"}
                  </button>
                  {selectedSubmission.status !== "approved" && (
                    <button
                      onClick={() => handleScholarlyPublish(selectedSubmission)}
                      className="px-6 py-2.5 bg-ink-900 hover:bg-ink-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {t.scholarlyPublish}
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* EXCLUSIVE PRINT-COMPILATION CONTAINER FOR PDF SAVINGS */}
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
  </>
  );
}
