import OpenAI from 'openai';

// Configure Edge Runtime
export const runtime = 'edge';
export const maxDuration = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 8000,
});

// Function to preserve formatting
function preserveFormatting(text: string): string {
  // Replace single newlines with double newlines to ensure proper spacing
  return text
    .replace(/\n/g, '\n\n') // Double all newlines
    .replace(/\n\n\n\n/g, '\n\n') // But prevent more than double newlines
    .replace(/- /g, '\n- ') // Ensure list items are on new lines
    .replace(/\n\n- /g, '\n- ') // But prevent double newlines before list items
    .trim();
}

type Language =
  | "ar"
  | "en"
  | "bn"
  | "fr"
  | "fa"
  | "ms"
  | "ur"
  | "tr"
  | "id"
  | "ha"
  | "es"
  | "ru"
  | "si"
  | "am"
  | "my"
  | "hi"
  | "uz";


export async function POST(req: Request) {
  try {
    // Get language from request
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get('language') || 'en') as Language;

    // Create a new thread
    const thread = await openai.beta.threads.create();

    // Set greeting based on language
    // const greeting =
    //   language === 'ar'
    //     ? 'أهلاً بك ضيف الرحمن. أنا مساعدك في الحج والعمرة، هنا لأقدم لك التوجيه والدعم في رحلتك. كيف يمكنني مساعدتك اليوم؟'
    //     : "Greetings, pilgrim. I am your Hajj and Umrah assistant, here to guide you on your spiritual journey. Whether you need health advice or information about your pilgrimage, I'm here to help.";

    const greeting = {
        en: "Greetings, pilgrim. I am your Hajj and Umrah assistant, here to guide you on your spiritual journey. Whether you need health advice or information about your pilgrimage, I'm here to help.",
        bn: "শুভেচ্ছা, হজযাত্রী। আমি আপনার হজ ও উমরাহ সহকারী, আপনার আধ্যাত্মিক যাত্রায় পথপ্রদর্শনের জন্য এখানে আছি। আপনি স্বাস্থ্য পরামর্শ চান কিংবা আপনার তীর্থযাত্রা সম্পর্কে তথ্য প্রয়োজন—আমি সাহায্য করতে প্রস্তুত।",
        ar: 'أهلاً بك ضيف الرحمن. أنا مساعدك في الحج والعمرة، هنا لأقدم لك التوجيه والدعم في رحلتك. كيف يمكنني مساعدتك اليوم؟',
        fr: "Salutations, pèlerin. Je suis votre assistant Hajj et Omra, ici pour vous guider dans votre voyage spirituel. Que vous ayez besoin de conseils de santé ou d'informations sur votre pèlerinage, je suis là pour vous aider.",
        fa: "درود بر شما، زائر. من دستیار حج و عمره شما هستم و اینجا هستم تا شما را در سفر معنوی خود راهنمایی کنم. چه به توصیه های بهداشتی نیاز داشته باشید و چه به اطلاعاتی در مورد زیارت خود، من اینجا هستم تا به شما کمک کنم.",
        ms: "Salam, jemaah. Saya pembantu Haji dan Umrah anda, di sini untuk membimbing anda dalam perjalanan rohani anda. Sama ada anda memerlukan nasihat kesihatan atau maklumat tentang ziarah anda, saya sedia membantu.",
        ur: "سلام، زائر۔ میں آپ کا حج اور عمرہ اسسٹنٹ ہوں، یہاں آپ کے روحانی سفر میں آپ کی رہنمائی کرنے کے لیے ہوں۔ چاہے آپ کو صحت کے مشورے کی ضرورت ہو یا اپنی زیارت کے بارے میں معلومات، میں یہاں مدد کے لیے ہوں۔",
        tr: "Selamlar hacı. Ben Hac ve Umre yardımcınızım, manevi yolculuğunuzda size rehberlik etmek için buradayım. İster sağlık tavsiyesine, ister hac yolculuğunuz hakkında bilgiye ihtiyacınız olsun, size yardımcı olmak için buradayım.",
        id: "Salam, peziarah. Saya asisten Haji dan Umrah Anda, di sini untuk memandu Anda dalam perjalanan spiritual Anda. Apakah Anda memerlukan saran kesehatan atau informasi tentang ziarah Anda, saya di sini untuk membantu.",
        ha: "Gaisuwa, mahajjaci. Ni ne mataimakiyar ku na Hajji da Umrah, a nan don in jagorance ku a tafiyar ku ta ruhaniya. Ko kuna buƙatar shawarwari game da lafiya ko bayani game da aikin hajji, ina nan don taimakawa.",
        es: "Saludos, peregrino. Soy su asistente de Hajj y Umrah, aquí para guiarlo en su viaje espiritual. Ya sea que necesite consejos de salud o información sobre su peregrinación, estoy aquí para ayudarlo.",
        ru: "Приветствую вас, паломник. Я ваш помощник по хаджу и умре, я здесь, чтобы направлять вас в вашем духовном путешествии. Если вам нужен совет по здоровью или информация о вашем паломничестве, я здесь, чтобы помочь.",
        si: "සුභ පැතුම්, වන්දනාකරු. මම ඔබගේ හජ් සහ උම්රා සහායක වෙමි, ඔබගේ අධ්‍යාත්මික ගමනේදී ඔබට මග පෙන්වීමට මෙහි සිටිමි. ඔබට සෞඛ්‍ය උපදෙස් හෝ ඔබගේ වන්දනාව පිළිබඳ තොරතුරු අවශ්‍ය වුවද, මම ඔබට සහාය වීමට මෙහි සිටිමි.",
        am: "ሰላም ሐጅ። እኔ የሐጅ እና ዑምራ ረዳትዎ ነኝ፣ በመንፈሳዊ ጉዞዎ ላይ ለመምራት እዚህ መጥቻለሁ። የጤና ምክር ወይም ስለ ሐጅዎ መረጃ ቢያስፈልግዎ፣ ለመርዳት እዚህ አለሁ።",
        my: "ဘုရားဖူးများခင်ဗျား။ ကျွန်ုပ်သည် သင်၏ ဟဂ်ျနှင့် အုမ်ရာလက်ထောက်ဖြစ်ပြီး သင်၏ဝိညာဉ်ရေးခရီးစဉ်တွင် သင့်အားလမ်းညွှန်ရန် ဤနေရာတွင်ရှိနေပါသည်။ ကျန်းမာရေးအကြံဉာဏ်များ သို့မဟုတ် သင်၏ဘုရားဖူးခရီးစဉ်အကြောင်း အချက်အလက်များ လိုအပ်သည်ဖြစ်စေ ကူညီရန် ကျွန်ုပ်ဤနေရာတွင်ရှိပါသည်။",
        hi: "नमस्ते, तीर्थयात्री। मैं आपका हज और उमराह सहायक हूं, यहां आपके आध्यात्मिक यात्रा में आपका मार्गदर्शन करने के लिए हूं। चाहे आपको स्वास्थ्य संबंधी सलाह चाहिए या अपनी तीर्थयात्रा के बारे में जानकारी, मैं यहां मदद करने के लिए हूं।",
        uz: "Salom, ziyoratchi. Men sizning Haj va Umra bo'yicha yordamchingizman, bu yerda sizning ma'naviy safaringizda sizga yo'l-yo'riq ko'rsataman. Sog'liq bo'yicha maslahat kerakmi yoki ziyoratingiz haqida ma'lumot kerakmi, men yordam berishga tayyorman.",
      };

    // Create an initial message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'assistant',
      content: greeting[language],
    });

    return new Response(
      JSON.stringify({
        threadId: thread.id,
        greeting: greeting[language],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-transform',
        },
      }
    );
  } catch (error: any) {
    console.error('Thread creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create thread',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-transform',
        },
      }
    );
  }
}
