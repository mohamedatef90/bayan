export interface BookChapter {
  id: string;
  titleEn: string;
  titleAr: string;
  contentAr: string;
  contentEn: string;
  insights?: string; // Additional commentary
}

export interface Book {
  id: string;
  titleEn: string;
  titleAr: string;
  authorEn: string;
  authorAr: string;
  era: string; // e.g. "150 H / 767 CE"
  categoryEn: string;
  categoryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  coverBg: string; // CSS gradient and styling
  size: string; // e.g., "1.2 MB"
  chapters: BookChapter[];
  source: string; // e.g. "Süleymaniye Library, MS 2341"
  publisherEn?: string;
  publisherAr?: string;
  isCommunity?: boolean;
  status?: "pending" | "approved" | "rejected";
  reviewsCount?: number;
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: "nawawi-40",
    titleEn: "Al-Nawawi's Forty Hadith",
    titleAr: "الأربعون النووية",
    authorEn: "Imam Yahya ibn Sharaf al-Nawawi",
    authorAr: "الإمام يحيى بن شرف النووي",
    era: "676 AH / 1277 CE",
    categoryEn: "Hadith",
    categoryAr: "الحديث الشريف",
    descriptionEn: "A classic compilation of forty-two fundamental traditions of the Prophet Muhammad, peace and blessings be upon him, capturing the essence of Islamic sacred law and theology.",
    descriptionAr: "مؤلف كلاسيكي يضم اثنين وأربعين حديثاً من أصح الأحاديث النبوية، تشمل جوامع كلم النبي صلى الله عليه وسلم، وتعد قاعدة من قواعد الدين.",
    coverBg: "linear-gradient(135deg, #08396D 0%, #062A52 100%)",
    size: "450 KB",
    source: "Süleymaniye Library, MS 1402",
    publisherEn: "Bayan Heritage Preservation Press",
    publisherAr: "مطبعة بيان لإحياء التراث",
    chapters: [
      {
        id: "hadith-1",
        titleEn: "Hadith 1: Actions are by Intentions",
        titleAr: "الحديث الأول: إنما الأعمال بالنيات",
        contentAr: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: «إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ».",
        contentEn: "On the authority of Amir al-Mu'minin (Commander of the Faithful), Abu Hafs Umar bin al-Khattab (may Allah be pleased with him), who said: I heard the Messenger of Allah (peace and blessings of Allah be upon him) say: 'Actions are but by intentions and every man shall have only that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was for some worldly benefit or to take a woman in marriage, his migration was for that which he migrated.'",
        insights: "This hadith forms the pivot of Islam. It is said to constitute a third of all knowledge because every action of a believer must be preceded by a sincere intention (Ikhlas) for the sake of Allah alone."
      },
      {
        id: "hadith-2",
        titleEn: "Hadith 2: Islam, Iman, and Ihsan",
        titleAr: "الحديث الثاني: الإسلام والإيمان والإحسان",
        contentAr: "عَنْ عُمَرَ رَضِيَ اللَّهُ عَنْهُ أَيْضاً قَالَ: «بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعَرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ... فَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ. فَقَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً. قَالَ: صَدَقْتَ... قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ. قَالَ: أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ. قَالَ: صَدَقْتَ. قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ. قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ...»",
        contentEn: "Also on the authority of Umar (may Allah be pleased with him), who said: 'While we were one day sitting with the Messenger of Allah (peace be upon him), there appeared before us a man with extremely white garments and extremely black hair. No traces of journeying were visible on him, and none of us knew him... He said: \"O Muhammad, tell me about Islam.\" The Messenger of Allah (peace be upon him) said: \"Islam is to testify that there is no deity worthy of worship but Allah and Muhammad is His Messenger, to perform the prayers, to pay the zakat, to fast during Ramadan, and to perform the pilgrimage to the House if you are able to.\" He said: \"You have spoken the truth.\" ... He said: \"Then tell me about Iman (Faith).\" He (the Prophet) said: \"It is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine destiny (Qadar), both the good and the evil thereof.\" He said: \"You have spoken the truth.\" He said: \"Then tell me about Ihsan (Perfection).\" He said: \"It is to worship Allah as though you see Him, and if you cannot see Him, then indeed He sees you...\"'",
        insights: "Commonly known as the Hadith of Gabriel (Jibril), this text defines the three ascending levels of the religion: outer submission (Islam), inner faith (Iman), and spiritual excellence/mindfulness (Ihsan)."
      }
    ]
  },
  {
    id: "riyad-salihin",
    titleEn: "Riyad as-Salihin",
    titleAr: "رياض الصالحين",
    authorEn: "Imam Yahya ibn Sharaf al-Nawawi",
    authorAr: "الإمام يحيى بن شرف النووي",
    era: "670 AH / 1271 CE",
    categoryEn: "Adab & Tazkiyah",
    categoryAr: "الآداب والتزكية",
    descriptionEn: "The Meadows of the Righteous is an extremely popular refinement of Islamic character, gathering verses from the Qur'an and authentic prophetic traditions guiding personal conduct.",
    descriptionAr: "كتاب حافل من أحاديث الرسول صلى الله عليه وسلم المرتبة في أبواب شتى، تهدف إلى تهذيب النفوس وتطهير القلوب والتحلي بمكارم الأخلاق الآداب.",
    coverBg: "linear-gradient(135deg, #0B4A8B 0%, #2E6DB4 100%)",
    size: "1.8 MB",
    source: "Kılıç Ali Paşa Library, MS 102",
    publisherEn: "Dar Al-Hadith Printing & Publishing",
    publisherAr: "دار الحديث للطباعة والنشر",
    chapters: [
      {
        id: "riyad-ch1",
        titleEn: "Chapter on Sincerity and Sincere Intent",
        titleAr: "باب الإخلاص وإحضار النية",
        contentAr: "قَالَ اللهُ تَعَالَى: {وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ} [البينة: ٥]. وَقَالَ تَعَالَى: {لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ} [الحج: ٣٧].",
        contentEn: "Allah the Exalted says: 'And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth, and to establish prayer and to give zakah. And that is the correct religion.' (98:5). And He says: 'Their meat will not reach Allah, nor will their blood, but what reaches Him is piety from you.' (24:37).",
        insights: "Sincerity (Ikhlas) is the spiritual foundation of all actions. Without a pure, uncorrupted motivation directed toward the Divine, outward religious compliance remains a hollow vessel."
      },
      {
        id: "riyad-ch2",
        titleEn: "Chapter on Repentance (Tawbah)",
        titleAr: "باب التوبة",
        contentAr: "قَالَ العُلَمَاءُ: التَّوْبَةُ وَاجِبَةٌ مِنْ كُلِّ ذَنْبٍ، فَإِنْ كَانَتِ المَعْصِيَةُ بَيْنَ العَبْدِ وَبَيْنَ اللهِ تَعَالَى لاَ تَتَعَلَّقُ بِحَقِّ آدَمِيٍّ فَلَهَا ثَلاَثَةُ شُرُوطٍ: أَحَدُهَا: أَنْ يُقْلِعَ عَنِ المَعْصِيَةِ. وَالثَّانِي: أَنْ يَنْدَمَ عَلَى فِعْلِهَا. وَالثَّالِثُ: أَنْ يَعْزِمَ أَنْ لاَ يَعُودَ إِلَيْهَا أَبَداً. فَإِنْ فُقِدَ أَحَدُ الثَّلاَثَةِ لَمْ تَصِحَّ تَوْبَتُهُ.",
        contentEn: "The scholars say: Repentance is obligatory for every sin. If the disobedience is between the servant and Allah the Exalted and does not relate to the right of another human being, it has three conditions: First, that he desists from the sin. Second, that he regrets having done it. Third, that he resolves never to return to it. If one of these three is missing, his repentance is not valid.",
        insights: "Repentance (Tawbah) in Islam is an direct covenant of forgiveness with the Creator. If human rights (Huquq al-Ibad) have been violated, a fourth condition is added: returning the taken rights or seeking explicit forgiveness."
      }
    ]
  },
  {
    id: "bukhari-intro",
    titleEn: "Selections from Sahih al-Bukhari",
    titleAr: "مختصر صحيح البخاري",
    authorEn: "Imam Muhammad ibn Ismail al-Bukhari",
    authorAr: "الإمام محمد بن إسماعيل البخاري",
    era: "256 AH / 870 CE",
    categoryEn: "Hadith",
    categoryAr: "الحديث الشريف",
    descriptionEn: "The undisputed most authentic compilation of Prophetic traditions. Known as 'Al-Jami' al-Sahih', it represents the peak of critical transmission science in Islamic history.",
    descriptionAr: "أصح كتب الحديث النبوي عند أهل السنة والجماعة. صنفه الإمام البخاري وجعله مرجعاً شاملاً في الفقه والاعتقاد والسنن والسيرة النبوية.",
    coverBg: "linear-gradient(135deg, #1F2937 0%, #08396D 100%)",
    size: "3.5 MB",
    source: "Süleymaniye Library, MS 2341",
    publisherEn: "Dar al-Minhaj Publishing House",
    publisherAr: "دار المنهاج للنشر والتوزيع بجدة",
    chapters: [
      {
        id: "bukhari-ch1",
        titleEn: "Book 1: How the Revelation Began",
        titleAr: "باب كَيْفَ كَانَ بَدْءُ الْوَحْيِ",
        contentAr: "عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ أَنَّ عُبَيْدَ بْنَ عُمَيْرٍ أَخْبَرَهُ أَنَّ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ: «أَوَّلُ مَا بُدِئَ بِهِ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ مِنَ الْوَحْيِ الرُّؤْيَا الصَّالِحَةُ فِي النَّوْمِ، فَكَانَ لاَ يَرَى رُؤْيَا إِلاَّ جَاءَتْ مِثْلَ فَلَقِ الصُّبْحِ، ثُمَّ حُبِّبَ إِلَيْهِ الْخَلاَءُ، وَكَانَ يَخْلُو بِغَارِ حِرَاءٍ فَيَتَحَنَّثُ فِيهِ... حَتَّى جَاءَهُ الْحَقُّ...»",
        contentEn: "Narrated Aisha (the mother of the faithful believers): The commencement of the Divine Inspiration to Allah's Messenger (peace be upon him) was in the form of good dreams which came true like bright daylight, and then the love of seclusion was bestowed upon him. He used to go in seclusion in the cave of Hira where he used to worship Allah alone continuously... until suddenly the Truth descended upon him...",
        insights: "The dawning of revelation marks the transition of human history through divine speech. This chapter documents the physical and spiritual intensity experienced by the Prophet, peace be upon him, at Mount Hira."
      }
    ]
  },
  {
    id: "malik-muwatta",
    titleEn: "Al-Muwatta of Imam Malik",
    titleAr: "موطأ الإمام مالك",
    authorEn: "Imam Malik ibn Anas",
    authorAr: "الإمام مالك بن أنس",
    era: "179 AH / 795 CE",
    categoryEn: "Fiqh & Hadith",
    categoryAr: "الفقه والحديث",
    descriptionEn: "One of the earliest formulated law codes in Islam, combining prophetic traditions, rulings of the Companions, and the unbroken living practice ('Amal) of Medina.",
    descriptionAr: "من أقدم مجاميع الفقه والحديث النبوي الشريف، جمع فيه الإمام مالك أصح الآثار والسنن، معتمداً على عمل أهل المدينة الفقهي.",
    coverBg: "linear-gradient(135deg, #6E2A30 0%, #8A3A40 100%)",
    size: "2.1 MB",
    source: "Nuruosmaniye Library, MS 982",
    publisherEn: "Dar Ibn Hazm Preservations",
    publisherAr: "دار ابن حزم للطباعة والنشر ببيروت",
    chapters: [
      {
        id: "muwatta-ch1",
        titleEn: "The Book of the Times of Prayer",
        titleAr: "كتاب وقوت الصلاة",
        contentAr: "يَحْيَى عَنْ مَالِكٍ عَنْ ابْنِ شِهَابٍ أَنَّ عُمَرَ بْنَ عَبْدِ الْعَزِيزِ أَخَّرَ الصَّلَاةَ يَوْمًا، فَدَخَلَ عَلَيْهِ عُرْوَةُ بْنُ الزُّبَيْرِ فَأَخْبَرَهُ أَنَّ الْمُغِيرَةَ بْنَ شُعْبَةَ أَخَّرَ الصَّلَاةَ يَوْمًا وَهُوَ بِالْكُوفَةِ، فَدَخَلَ عَلَيْهِ أَبُو مَسْعُودٍ الْأَنْصَارِيُّ فَقَالَ: مَا هَذَا يَا مُغِيرَةُ؟ أَلَيْسَ قَدْ عَلِمْتَ أَنَّ جِبْرِيلَ نَزَلَ فَصَلَّى فَصَلَّى رَسُولُ اللَّهِ، ثُمَّ صَلَّى فَصَلَّى رَسُولُ اللَّهِ...؟",
        contentEn: "Yahya related to me from Malik from Ibn Shihab that Umar ibn Abd al-Aziz delayed the prayer one day. Urwa ibn az-Zubayr came in and told him that al-Mughira ibn Shuba delayed the prayer one day while he was in Kufa, and Abu Masud al-Ansari came in and said: 'What is this, Mughira? Do you not know that Gabriel descended and prayed, and the Messenger of Allah prayed, then he prayed again, and the Messenger of Allah prayed...?'",
        insights: "This hadith establishes the celestial origin of the five prayer times. Gabriel (Jibril) came as an instructor to demonstrate the boundaries, beginning and end, of each prayer."
      }
    ]
  }
];
