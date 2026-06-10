export interface TranslationSet {
  brandName: string;
  tagline: string;
  discoverTitle: string;
  discoverDesc: string;
  heroSubtitle: string;
  exploreBtn: string;
  tabLibrary: string;
  tabPeerReview: string;
  tabMyShelf: string;
  tabCatalog: string;
  searchPlaceholder: string;
  categoryFilter: string;
  downloadBtn: string;
  downloaded: string;
  readBtn: string;
  offlineMode: string;
  offlineActive: string;
  submitManuscript: string;
  peerReviewTitle: string;
  peerReviewDesc: string;
  uploadFormTitle: string;
  bookTitleEn: string;
  bookTitleAr: string;
  authorEn: string;
  authorAr: string;
  manuscriptEra: string;
  bookCategory: string;
  bookPublisher: string;
  sourceLibrary: string;
  manuscriptContent: string;
  manuscriptContentDesc: string;
  submitToReview: string;
  reviewQueue: string;
  aiAuditReport: string;
  authenticityScore: string;
  authorVerification: string;
  narratorsIsnaad: string;
  anomaliesFlagged: string;
  scholarlyAlignment: string;
  recommendation: string;
  communityEndorsements: string;
  endorseBtn: string;
  scholarlyPublish: string;
  myBookmarks: string;
  noBookmarks: string;
  noDownloads: string;
  parallelView: string;
  enOnly: string;
  arOnly: string;
  aiSummarizeBtn: string;
  askAssistant: string;
  askPlaceholder: string;
  askBtn: string;
  backToLibrary: string;
  uploadSuccess: string;
  reviewApproved: string;
  reviewRequired: string;
  ourValuesTitle: string;
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;
  footerRights: string;
  footerAbout: string;
  loginBtn: string;
  signUpBtn: string;
}

export const translations: Record<"en" | "ar", TranslationSet> = {
  en: {
    brandName: "BAYAN",
    tagline: "Preserving Islamic Heritage",
    discoverTitle: "Discover Islamic Heritage",
    discoverDesc: "A pristine digital platform preserving, protecting, and promoting authentic Islamic scholarship through state-of-the-art knowledge, education, and technology.",
    heroSubtitle: "Bayan · Presenting heritage knowledge with clarity, integrity, and high reliability.",
    exploreBtn: "Explore the Collection",
    tabLibrary: "Home",
    tabPeerReview: "Peer-Review Portal",
    tabMyShelf: "My Saved Shelf",
    tabCatalog: "All Books",
    searchPlaceholder: "Search thousands of classical texts, authors, categories...",
    categoryFilter: "Category",
    downloadBtn: "Save Offline",
    downloaded: "Downloaded",
    readBtn: "Book Info",
    offlineMode: "Offline Mode",
    offlineActive: "Running Offline",
    submitManuscript: "Submit a Manuscript",
    peerReviewTitle: "Bayan Adala Peer-Review Portal",
    peerReviewDesc: "Community-led scholarly curation. Submit classical manuscripts, view automated AI authenticity audits, and vote to publish works to the public archive.",
    uploadFormTitle: "New Manuscript Submission",
    bookTitleEn: "Book Title (English)",
    bookTitleAr: "Book Title (Arabic - العربية)",
    authorEn: "Author (English)",
    authorAr: "Author (Arabic - العربية)",
    manuscriptEra: "Estimated Era (e.g. 240 AH / 854 CE)",
    bookCategory: "Manuscript Genre",
    bookPublisher: "Publisher/Preserver",
    sourceLibrary: "Original Source (e.g. Süleymaniye Library, MS 104)",
    manuscriptContent: "Manuscript Content (Arabic and/or English Parallel Text)",
    manuscriptContentDesc: "Paste the text of the manuscript. Classical Arabic with diacritics is highly encouraged.",
    submitToReview: "Submit to Review Queue",
    reviewQueue: "Active Review Queue",
    aiAuditReport: "Bayan AI Authenticity & Attributions Audit",
    authenticityScore: "Heritage Correctness Score",
    authorVerification: "Chronological & Stylistic Match",
    narratorsIsnaad: "Chains of Narration (Isnaad) Check",
    anomaliesFlagged: "Theological & Textual Anomalies",
    scholarlyAlignment: "Consensus (Ijma') Integration Report",
    recommendation: "AI Scholarly Recommendation",
    communityEndorsements: "Community Endorsements",
    endorseBtn: "Endorse Authenticity",
    scholarlyPublish: "Authorize & Publish to Library",
    myBookmarks: "My Highlighted Bookmarks & Notes",
    noBookmarks: "You haven't bookmarked any excerpts or verses yet.",
    noDownloads: "No books currently compiled for offline access.",
    parallelView: "Bilingual Parallel",
    enOnly: "English Only",
    arOnly: "Arabic Only",
    aiSummarizeBtn: "Analyze Verse with Bayan AI",
    askAssistant: "Bayan AI Heritage Assistant",
    askPlaceholder: "Ask Bayan AI a scholarly question about this chapter/verse...",
    askBtn: "Inquire",
    backToLibrary: "← Return to Library",
    uploadSuccess: "Manuscript successfully submitted for peer-review!",
    reviewApproved: "Approved for Public Library",
    reviewRequired: "Requires Scholarly Revision",
    ourValuesTitle: "Values & Analytical Standards",
    value1Title: "Scholarly Integrity",
    value1Desc: "Rigorous research verification of source material, manuscript attributions, and narrator chains of authority (Isnaad).",
    value2Title: "Bilingual Scholarship",
    value2Desc: "A pristine parallel presentation of classical Arabic texts alongside carefully reviewed English translation sheets.",
    value3Title: "Collaborative Curation",
    value3Desc: "Enabling expert reviewers and academics to audit manuscripts interactively with automatic AI-backed verification reports.",
    footerRights: "© 2026 BAYAN. Preserving Classical Heritage with Ultimate Scientific Care.",
    footerAbout: "Bayan is a high-reliability digital research archive and peer-evaluation framework for authentic Islamic texts, combining standard academic rigor with AI-powered attributions & anomalies auditing.",
    loginBtn: "Log In",
    signUpBtn: "Sign Up"
  },
  ar: {
    brandName: "بيان",
    tagline: "نحافظ على التراث الإسلامي",
    discoverTitle: "استكشف التراث الإسلامي الأصيل",
    discoverDesc: "منصة رقمية رائدة مكرسة لحفظ التراث العلمي الإسلامي وحمايته، نجمع بين عراقة المخطوطات وأحدث التقنيات لخدمة طالب المعرفة.",
    heroSubtitle: "بيان · نقدّم المعرفة التراثية بوضوح وأمانة وموثوقية عالية.",
    exploreBtn: "تصفح المكتبة العامة",
    tabLibrary: "الرئيسية",
    tabPeerReview: "بوابة مراجعة الكتب",
    tabMyShelf: "رفّي المحفوظ",
    tabCatalog: "المكتبة الشاملة",
    searchPlaceholder: "ابحث في آلاف النصوص الكلاسيكية، المؤلفين، الأقسام الفقهية...",
    categoryFilter: "التصنيف",
    downloadBtn: "حفظ للقراءة بدون إنترنت",
    downloaded: "تم التحميل",
    readBtn: "معلومات الكتاب",
    offlineMode: "وضع عدم الاتصال",
    offlineActive: "تعمل بدون إنترنت",
    submitManuscript: "تقديم مخطوطة جديدة",
    peerReviewTitle: "منصة بيان للتحقيق والمراجعة الشرعية",
    peerReviewDesc: "منصة تفاعلية آمنة لتحقيق المخطوطات. قدم النصوص الكلاسيكية، وتصفح تقارير الموثوقية الآلية بالذكاء الاصطناعي، وشارك في تدقيقها ونشرها.",
    uploadFormTitle: "تقديم مخطوطة أو كتاب جديد",
    bookTitleEn: "عنوان الكتاب (بالإنجليزية)",
    bookTitleAr: "عنوان الكتاب (بالعربية)",
    authorEn: "المؤلف (بالإنجليزية)",
    authorAr: "المؤلف (بالعربية)",
    manuscriptEra: "العهد التاريخي التقريبي (مثال: ٢٤٠ هـ / ٨٥٤ م)",
    bookCategory: "تصنيف المخطوطة",
    bookPublisher: "دار النشر / المحقق",
    sourceLibrary: "المصدر الأصلي (مثال: مكتبة السليمانية، مخطوط ١٠٤)",
    manuscriptContent: "نص المخطوطة (عربي مع الترجمة الإنجليزية إن وجدت)",
    manuscriptContentDesc: "أدخل نص المخطوطة هنا. ننصح بكتابة النص العربي بالتشكيل والضبط الصحيح.",
    submitToReview: "إرسال إلى طابور التدقيق والتحقيق",
    reviewQueue: "المخطوطات النشطة قيد المراجعة والتدقيق",
    aiAuditReport: "تقرير الذكاء الاصطناعي لبيان عن الموثوقية والأسانيد",
    authenticityScore: "نسبة موثوقية النص التراثي",
    authorVerification: "تحليل الأسلوب والمطابقة الزمنية للمؤلف",
    narratorsIsnaad: "دراسة وتخريج أسانيد المتون والروايات",
    anomaliesFlagged: "العلل والشذوذ أو الخلل المسجل في النص",
    scholarlyAlignment: "تقرير المطابقة والاتساق مع إجماع المحققين",
    recommendation: "توصية التحقيق الآلي الشرعية",
    communityEndorsements: "تزكيات وتوثيق المجتمع والمحققين",
    endorseBtn: "تزكية وتوثيق صحة المتن",
    scholarlyPublish: "اعتماد ونشر المخطوطة في المكتبة العامة",
    myBookmarks: "مقتبساتي وإشاراتي المحفوظة والملاحظات",
    noBookmarks: "لم تقم بحفظ أي مقتبسات أو ملاحظات حتى الآن.",
    noDownloads: "لا توجد كتب محملة حالياً للقراءة دون اتصال بالإنترنت.",
    parallelView: "عرض متوازي (عربي/إنجليزي)",
    enOnly: "الإنجليزية فقط",
    arOnly: "العربية فقط",
    aiSummarizeBtn: "تحليل النص بواسطة المساعد الذكي لبيان",
    askAssistant: "مساعد بيان العلمي للتراث والبحث الشرعي",
    askPlaceholder: "اسأل المساعد الذكي لبيان سؤالاً علمياً عن هذا الباب أو الحديث...",
    askBtn: "استفسار",
    backToLibrary: "← العودة إلى المكتبة",
    uploadSuccess: "تم تقديم المخطوطة بنجاح لدخول طابور المراجعة الشرعية!",
    reviewApproved: "معتمد ونشر في المكتبة العامة",
    reviewRequired: "يحتاج إلى تدقيق ومراجعة علمية",
    ourValuesTitle: "مبادئنا ومعايير التحقيق",
    value1Title: "الأمانة والتحقيق العلمي",
    value1Desc: "دراسة وتخريج دقيق لأسانيد المرويات والتحقق من صحة نسبة المصنفات لأصحابها بالمنهجية العلمية الصارمة.",
    value2Title: "التمكين وتعدد اللغات",
    value2Desc: "عرض متميز ومتوازٍ للنصوص التراثية باللغة العربية مشكولة ومضبوطة بجودة متناهية، ومقابلة بترجمات إنجليزية متقنة.",
    value3Title: "التحقيق الجماعي المشترك",
    value3Desc: "إتاحة المشاركة لكبار العلماء والمحققين لتقييم المخطوطات والتحقق منها بمساعدة تقارير التدقيق الذكية.",
    footerRights: "© ٢٠٢٦ بيان للإحياء والتحقيق العلمي. حفظ التراث الإسلامي بأدق المناهج والوسائل الحديثة.",
    footerAbout: "منصة بيان هي مرجعية رقمية رائدة مكرسة لحفظ المخطوطات والكتب الإسلامية وتحقيقها بلغات متعددة، تجمع بين التقاليد المنهجية الأصيلة وتقارير الذكاء الاصطناعي لرصد الأسانيد والعلل.",
    loginBtn: "تسجيل الدخول",
    signUpBtn: "إنشاء حساب"
  }
};
export type { TranslationSet as TSet };
