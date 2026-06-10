import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, bookTitle, currentChapter, contentAr, contentEn } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "No question provided." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        text: `**[Demo Mode - API Key not set up]**
        
Thank you for your question: *"${question}"* regarding the book **${bookTitle || "Islamic Sciences"}** (${currentChapter || "General Chapter"}).
        
### 💡 Scholarly Explanation (English)
The text you are reading represents a fundamental principle in Islamic thought. Historically, classical writers began with these reminders to ensure the reader purifies their purpose before diving deep into technical sciences. This highlights the connection between intellect, actions, and inner sincerity.
        
### 📖 التفسير والشرح اللغوي (العربية)
هذا النص الكريم يعكس أصالة المنهج العلمي والتزكوي في تراثنا الإسلامي. وقد دأب الأئمة على تصدير مؤلفاتهم بهذه الومضات لتنبيه القارئ إلى إخلاص نيته لله عز وجل، وربط العمل الظاهر بصلاح الباطن، مما يثري الفهم ويحقق غاية العلم النافع.`
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are "Bayan AI", an esteemed bilingual (English & Arabic) Islamic Heritage Scholar and Assistant.
A student of knowledge is currently reading the following book in your library:
Book Title: "${bookTitle || "General Digital Library"}"
Chapter: "${currentChapter || "Introductory"}"
Arabic text: "${contentAr || "N/A"}"
English text: "${contentEn || "N/A"}"

The reader's question is:
"${question}"

Provide a detailed, respectful, and highly intellectual scholarly explanation in both English and Arabic.
- Structure it beautifully with markdown headings.
- Be precise, cite traditional sources, and emphasize the educational value of the answers.
- Ensure you have substantial sections in both English and Arabic to cater to bilingual readers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Bayan AI, a respectful, highly educated, and traditional Islamic sciences scholar. You explain classical texts clearly and bilingually (English & Arabic). Avoid preaching, maintain scholarly, high-integrity depth.",
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Chat API error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate explanation" }, { status: 500 });
  }
}
