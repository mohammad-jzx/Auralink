// Type definitions
export interface DictItem {
  id: string
  term: string
  videoUrl?: string // Local video file path
  description: string
  category: string
  lang: "ASL" | "JSL"
  tags: string[]
  video?: {
    provider: "youtube" | "local"
    videoId?: string
    startSec?: number
    endSec?: number
  }
}

// User progress data
export const userProgress = {
  lessonProgress: {
    completed: 3,
    total: 10,
    currentLesson: 4,
  },
  streak: 7,
  badges: [
    { id: 1, name: "First Steps", icon: "🎯", earned: true },
    { id: 2, name: "Week Warrior", icon: "🔥", earned: true },
    { id: 3, name: "Dictionary Master", icon: "📚", earned: false },
  ],
  totalPoints: 450,
}

// Lesson data
export const lesson = {
  id: "lesson-1",
  title: "الأرقام الأساسية",
  lang: "ar",
  videoUrl: "/sign-language-numbers.png",
  text: "في هذا الدرس سنتعلم كيفية التعبير عن الأرقام من 1 إلى 10 بلغة الإشارة. الأرقام هي أساس التواصل في أي لغة.",
  examples: [
    {
      number: "1",
      description: "ارفع السبابة لأعلى",
      videoUrl: "/sign-language-number-1.png",
    },
    {
      number: "2",
      description: "ارفع السبابة والوسطى",
      videoUrl: "/sign-language-number-2.png",
    },
    {
      number: "3",
      description: "ارفع السبابة والوسطى والبنصر",
      videoUrl: "/sign-language-number-3.png",
    },
  ],
  duration: "15 دقيقة",
  difficulty: "مبتدئ",
}

// Challenge data
export const challenge = {
  id: "challenge-1",
  type: "mcq",
  question: "ما هي الطريقة الصحيحة للتعبير عن الرقم 5 بلغة الإشارة؟",
  options: [
    "رفع جميع أصابع اليد الواحدة",
    "رفع السبابة والإبهام فقط",
    "رفع ثلاثة أصابع من اليد اليمنى واثنين من اليسرى",
    "عمل قبضة باليد",
  ],
  answerIdx: 0,
  linkedLesson: "lesson-1",
  points: 10,
  explanation: "الرقم 5 يُعبر عنه برفع جميع أصابع اليد الواحدة بوضوح.",
}

// Dictionary data with real video files - JSL (Jordanian Sign Language)
export const dictionary: DictItem[] = [
  // JSL Items (Existing)
  {
    id: "1",
    term: "السلام عليكم",
    description: "تحية إسلامية أساسية تعني السلام عليكم",
    category: "تحيات",
    lang: "JSL",
    tags: ["تحية", "سلام", "أساسي"],
    videoUrl: "/video/السلام عليكم.mp4"
  },
  {
    id: "2",
    term: "وعليكم السلام",
    description: "رد على التحية الإسلامية",
    category: "تحيات",
    lang: "JSL",
    tags: ["رد", "تحية", "سلام"],
    videoUrl: "/video/ وعليكم السلام.mp4"
  },
  {
    id: "3",
    term: "صباح الخير",
    description: "تحية صباحية",
    category: "تحيات",
    lang: "JSL",
    tags: ["صباح", "تحية", "وقت"],
    videoUrl: "/video/صباح الخير .mp4"
  },
  {
    id: "4",
    term: "شكراً",
    description: "التعبير عن الامتنان والشكر",
    category: "تحيات",
    lang: "JSL",
    tags: ["شكر", "امتنان", "أساسي"],
    videoUrl: "/video/شكرا.mp4"
  },
  {
    id: "5",
    term: "اهلا وسهلا",
    description: "ترحيب بالضيوف",
    category: "تحيات",
    lang: "JSL",
    tags: ["ترحيب", "ضيوف", "أهلا"],
    videoUrl: "/video/اهلا وسهلا.mp4"
  },
  {
    id: "6",
    term: "أنا",
    description: "ضمير المتكلم المفرد",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "متكلم", "أساسي"],
    videoUrl: "/video/انا.mp4"
  },
  {
    id: "7",
    term: "أنت",
    description: "ضمير المخاطب المفرد",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "مخاطب", "أساسي"],
    videoUrl: "/video/انت.mp4"
  },
  {
    id: "8",
    term: "أنتم",
    description: "ضمير المخاطب الجمع",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "مخاطب", "جمع"],
    videoUrl: "/video/انتم.mp4"
  },
  {
    id: "9",
    term: "هو",
    description: "ضمير الغائب المفرد المذكر",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "غائب", "مذكر"],
    videoUrl: "/video/هو.mp4"
  },
  {
    id: "10",
    term: "هي",
    description: "ضمير الغائب المفرد المؤنث",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "غائب", "مؤنث"],
    videoUrl: "/video/هي.mp4"
  },
  {
    id: "11",
    term: "هم",
    description: "ضمير الغائب الجمع المذكر",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "غائب", "جمع", "مذكر"],
    videoUrl: "/video/هم.mp4"
  },
  {
    id: "12",
    term: "هن",
    description: "ضمير الغائب الجمع المؤنث",
    category: "ضمائر",
    lang: "JSL",
    tags: ["ضمير", "غائب", "جمع", "مؤنث"],
    videoUrl: "/video/هن.mp4"
  },
  {
    id: "13",
    term: "بابا",
    description: "الأب",
    category: "عائلة",
    lang: "JSL",
    tags: ["أب", "عائلة", "أساسي"],
    videoUrl: "/video/بابا.mp4"
  },
  {
    id: "14",
    term: "ماما",
    description: "الأم",
    category: "عائلة",
    lang: "JSL",
    tags: ["أم", "عائلة", "أساسي"],
    videoUrl: "/video/ماما.mp4"
  },
  {
    id: "15",
    term: "أخ",
    description: "الأخ",
    category: "عائلة",
    lang: "JSL",
    tags: ["أخ", "عائلة", "أقارب"],
    videoUrl: "/video/اخ.mp4"
  },
  {
    id: "16",
    term: "أخت",
    description: "الأخت",
    category: "عائلة",
    lang: "JSL",
    tags: ["أخت", "عائلة", "أقارب"],
    videoUrl: "/video/اخت.mp4"
  },
  {
    id: "17",
    term: "جدي",
    description: "جد الأب",
    category: "عائلة",
    lang: "JSL",
    tags: ["جد", "عائلة", "أقارب"],
    videoUrl: "/video/جدي.mp4"
  },
  {
    id: "18",
    term: "جدتي",
    description: "جدة الأب",
    category: "عائلة",
    lang: "JSL",
    tags: ["جدة", "عائلة", "أقارب"],
    videoUrl: "/video/جدتي.mp4"
  },
  {
    id: "19",
    term: "عائلة",
    description: "الأسرة",
    category: "عائلة",
    lang: "JSL",
    tags: ["أسرة", "عائلة", "أقارب"],
    videoUrl: "/video/عائلة.mp4"
  },
  {
    id: "20",
    term: "أكل",
    description: "تناول الطعام",
    category: "أفعال",
    lang: "JSL",
    tags: ["طعام", "أكل", "فعل"],
    videoUrl: "/video/اكل.mp4"
  },
  {
    id: "21",
    term: "نام",
    description: "النوم",
    category: "أفعال",
    lang: "JSL",
    tags: ["نوم", "راحة", "فعل"],
    videoUrl: "/video/نام.mp4"
  },
  {
    id: "22",
    term: "مشى",
    description: "المشي",
    category: "أفعال",
    lang: "JSL",
    tags: ["مشي", "حركة", "فعل"],
    videoUrl: "/video/مشي.mp4"
  },
  {
    id: "23",
    term: "ركض",
    description: "الركض",
    category: "أفعال",
    lang: "JSL",
    tags: ["ركض", "حركة", "فعل"],
    videoUrl: "/video/ركض.mp4"
  },
  {
    id: "24",
    term: "وقف",
    description: "الوقوف",
    category: "أفعال",
    lang: "JSL",
    tags: ["وقوف", "حركة", "فعل"],
    videoUrl: "/video/وقف.mp4"
  },
  {
    id: "25",
    term: "جاء",
    description: "الوصول",
    category: "أفعال",
    lang: "JSL",
    tags: ["وصول", "حركة", "فعل"],
    videoUrl: "/video/جاء.mp4"
  },
  {
    id: "26",
    term: "ذهب",
    description: "المغادرة",
    category: "أفعال",
    lang: "JSL",
    tags: ["مغادرة", "حركة", "فعل"],
    videoUrl: "/video/ذهب.mp4"
  },
  {
    id: "27",
    term: "سافر",
    description: "السفر",
    category: "أفعال",
    lang: "JSL",
    tags: ["سفر", "حركة", "فعل"],
    videoUrl: "/video/سافر.mp4"
  },
  {
    id: "28",
    term: "يعمل",
    description: "العمل",
    category: "أفعال",
    lang: "JSL",
    tags: ["عمل", "مهنة", "فعل"],
    videoUrl: "/video/يعمل.mp4"
  },
  {
    id: "29",
    term: "بيت",
    description: "المنزل",
    category: "أماكن",
    lang: "JSL",
    tags: ["منزل", "بيت", "مكان"],
    videoUrl: "/video/بيت.mp4"
  },
  {
    id: "30",
    term: "مدرسة",
    description: "المؤسسة التعليمية",
    category: "أماكن",
    lang: "JSL",
    tags: ["تعليم", "مدرسة", "مكان"],
    videoUrl: "/video/مدرسة.mp4"
  },
  {
    id: "31",
    term: "جامع",
    description: "مكان العبادة الإسلامي",
    category: "أماكن",
    lang: "JSL",
    tags: ["عبادة", "جامع", "مكان"],
    videoUrl: "/video/جامع.mp4"
  },
  {
    id: "32",
    term: "كلية",
    description: "مؤسسة تعليم عالي",
    category: "أماكن",
    lang: "JSL",
    tags: ["تعليم", "كلية", "مكان"],
    videoUrl: "/video/كلية.mp4"
  },
  {
    id: "33",
    term: "مستشفى",
    description: "مؤسسة صحية",
    category: "أماكن",
    lang: "JSL",
    tags: ["صحة", "مستشفى", "مكان"],
    videoUrl: "/video/مستشفى.mp4"
  },
  {
    id: "34",
    term: "رجل",
    description: "شخص ذكر بالغ",
    category: "أشخاص",
    lang: "JSL",
    tags: ["ذكر", "بالغ", "شخص"],
    videoUrl: "/video/رجل.mp4"
  },
  {
    id: "35",
    term: "امرأة",
    description: "شخص أنثى بالغة",
    category: "أشخاص",
    lang: "JSL",
    tags: ["أنثى", "بالغة", "شخص"],
    videoUrl: "/video/امرأة.mp4"
  },
  {
    id: "36",
    term: "طفل",
    description: "شخص صغير السن",
    category: "أشخاص",
    lang: "JSL",
    tags: ["صغير", "طفل", "شخص"],
    videoUrl: "/video/طفل.mp4"
  },
  {
    id: "37",
    term: "صديق",
    description: "شخص مقرب",
    category: "أشخاص",
    lang: "JSL",
    tags: ["مقرب", "صديق", "شخص"],
    videoUrl: "/video/صديق.mp4"
  },
  {
    id: "38",
    term: "ضيف",
    description: "شخص زائر",
    category: "أشخاص",
    lang: "JSL",
    tags: ["زائر", "ضيف", "شخص"],
    videoUrl: "/video/ضيوف.mp4"
  },

  // ASL Items (New)
  {
    id: "asl-1",
    term: "Hello",
    description: "Basic greeting in American Sign Language",
    category: "Greetings",
    lang: "ASL",
    tags: ["greeting", "basic", "hello"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 79, endSec: 84 }
  },
  {
    id: "asl-2",
    term: "Thank you",
    description: "Expression of gratitude in ASL",
    category: "Greetings",
    lang: "ASL",
    tags: ["thanks", "gratitude", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 162, endSec: 168 }
  },
  {
    id: "asl-3",
    term: "Good morning",
    description: "Morning greeting in ASL",
    category: "Greetings",
    lang: "ASL",
    tags: ["morning", "greeting", "time"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 343, endSec: 353 }
  },
  {
    id: "asl-4",
    term: "I / Me",
    description: "First person singular pronoun in ASL",
    category: "Pronouns",
    lang: "ASL",
    tags: ["pronoun", "first", "singular"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 97, endSec: 105 }
  },
  {
    id: "asl-5",
    term: "You",
    description: "Second person pronoun in ASL",
    category: "Pronouns",
    lang: "ASL",
    tags: ["pronoun", "second", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 488, endSec: 500 }
  },
  {
    id: "asl-6",
    term: "Yes",
    description: "Affirmative response in ASL",
    category: "Basics",
    lang: "ASL",
    tags: ["affirmation", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 123, endSec: 130 }
  },
  {
    id: "asl-7",
    term: "No",
    description: "Negative response in ASL",
    category: "Basics",
    lang: "ASL",
    tags: ["negative", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 131, endSec: 139 }
  },
  {
    id: "asl-8",
    term: "Help",
    description: "Asking for assistance in ASL",
    category: "Actions",
    lang: "ASL",
    tags: ["assistance", "action"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 140, endSec: 153 }
  },
  {
    id: "asl-9",
    term: "Want",
    description: "Expressing desire in ASL",
    category: "Actions",
    lang: "ASL",
    tags: ["desire", "action"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 169, endSec: 177 }
  },
  {
    id: "asl-10",
    term: "Don't Want",
    description: "Expressing lack of desire in ASL",
    category: "Common Signs",
    lang: "ASL",
    tags: ["negative", "desire"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 86, endSec: 95 }
  },
  {
    id: "asl-11",
    term: "Finish / Done",
    description: "Indicating completion in ASL",
    category: "Common Signs",
    lang: "ASL",
    tags: ["completion", "action"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 294, endSec: 304 }
  },
  {
    id: "asl-12",
    term: "Like",
    description: "Expressing preference in ASL",
    category: "Feelings",
    lang: "ASL",
    tags: ["preference", "emotion"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 267, endSec: 276 }
  },
  {
    id: "asl-13",
    term: "More",
    description: "Requesting additional in ASL",
    category: "Quantifiers",
    lang: "ASL",
    tags: ["quantity", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 231, endSec: 238 }
  },
  {
    id: "asl-14",
    term: "Please",
    description: "Making polite request in ASL",
    category: "Politeness",
    lang: "ASL",
    tags: ["politeness", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 154, endSec: 161 }
  },
  {
    id: "asl-15",
    term: "Happy",
    description: "Expressing happiness in ASL",
    category: "Feelings",
    lang: "ASL",
    tags: ["emotion", "positive"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 353, endSec: 362 }
  },
  {
    id: "asl-16",
    term: "Sad",
    description: "Expressing sadness in ASL",
    category: "Feelings",
    lang: "ASL",
    tags: ["emotion", "negative"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 362, endSec: 372 }
  },
  {
    id: "asl-17",
    term: "Go",
    description: "Indicating movement in ASL",
    category: "Actions",
    lang: "ASL",
    tags: ["movement", "action"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 110, endSec: 119 }
  },
  {
    id: "asl-18",
    term: "Need",
    description: "Expressing requirement in ASL",
    category: "Common Signs",
    lang: "ASL",
    tags: ["requirement", "basic"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 174, endSec: 181 }
  },
  {
    id: "asl-19",
    term: "How are you?",
    description: "Asking about wellbeing in ASL",
    category: "Common Signs",
    lang: "ASL",
    tags: ["question", "greeting"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 141, endSec: 156 }
  },
  {
    id: "asl-20",
    term: "Nice to meet you",
    description: "Greeting for first meeting in ASL",
    category: "Common Signs",
    lang: "ASL",
    tags: ["greeting", "introduction"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 181, endSec: 195 }
  },
  {
    id: "asl-21",
    term: "Father",
    description: "Male parent in ASL",
    category: "Family",
    lang: "ASL",
    tags: ["family", "parent"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 106, endSec: 115 }
  },
  {
    id: "asl-22",
    term: "Mother",
    description: "Female parent in ASL",
    category: "Family",
    lang: "ASL",
    tags: ["family", "parent"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 116, endSec: 122 }
  },
  {
    id: "asl-23",
    term: "Dog",
    description: "Canine animal in ASL",
    category: "Animals",
    lang: "ASL",
    tags: ["animal", "pet"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 188, endSec: 194 }
  },
  {
    id: "asl-24",
    term: "Cat",
    description: "Feline animal in ASL",
    category: "Animals",
    lang: "ASL",
    tags: ["animal", "pet"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 195, endSec: 201 }
  },
  {
    id: "asl-25",
    term: "Bathroom",
    description: "Restroom location in ASL",
    category: "Places",
    lang: "ASL",
    tags: ["location", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 249, endSec: 258 }
  },
  {
    id: "asl-26",
    term: "Eat / Food",
    description: "Consuming food in ASL",
    category: "Food",
    lang: "ASL",
    tags: ["eating", "food"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 210, endSec: 223 }
  },
  {
    id: "asl-27",
    term: "Milk",
    description: "Dairy beverage in ASL",
    category: "Food",
    lang: "ASL",
    tags: ["drink", "dairy"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 224, endSec: 230 }
  },
  {
    id: "asl-28",
    term: "Learn",
    description: "Acquiring knowledge in ASL",
    category: "Actions",
    lang: "ASL",
    tags: ["education", "action"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 277, endSec: 284 }
  },
  {
    id: "asl-29",
    term: "Sign",
    description: "Using sign language in ASL",
    category: "Actions",
    lang: "ASL",
    tags: ["communication", "language"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 285, endSec: 293 }
  },
  {
    id: "asl-30",
    term: "What?",
    description: "Question word in ASL",
    category: "Questions",
    lang: "ASL",
    tags: ["question", "basic"],
    video: { provider: "youtube", videoId: "0FcwzMq4iWg", startSec: 178, endSec: 187 }
  },
  {
    id: "asl-31",
    term: "Scared",
    description: "Feeling fear in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["emotion", "fear"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 290, endSec: 305 }
  },
  {
    id: "asl-32",
    term: "Terrified",
    description: "Feeling intense fear in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["emotion", "fear", "intense"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 305, endSec: 314 }
  },
  {
    id: "asl-33",
    term: "Bad",
    description: "Negative quality in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["negative", "quality"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 314, endSec: 323 }
  },
  {
    id: "asl-34",
    term: "Busy",
    description: "Occupied with activity in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["state", "activity"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 323, endSec: 335 }
  },
  {
    id: "asl-35",
    term: "Fine",
    description: "Acceptable state in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["state", "okay"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 335, endSec: 343 }
  },
  {
    id: "asl-36",
    term: "Same",
    description: "Identical or similar in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["comparison", "similarity"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 372, endSec: 383 }
  },
  {
    id: "asl-37",
    term: "So-So",
    description: "Mediocre or average in ASL",
    category: "Descriptive Signs",
    lang: "ASL",
    tags: ["state", "neutral"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 383, endSec: 391 }
  },
  {
    id: "asl-38",
    term: "I'm happy",
    description: "Expressing personal happiness in ASL",
    category: "Phrases",
    lang: "ASL",
    tags: ["statement", "emotion"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 425, endSec: 443 }
  },
  {
    id: "asl-39",
    term: "I need help",
    description: "Requesting assistance in ASL",
    category: "Phrases",
    lang: "ASL",
    tags: ["request", "assistance"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 458, endSec: 474 }
  },
  {
    id: "asl-40",
    term: "Yes, same here!",
    description: "Expressing agreement in ASL",
    category: "Phrases",
    lang: "ASL",
    tags: ["agreement", "response"],
    video: { provider: "youtube", videoId: "4Ll3OtqAzyw", startSec: 474, endSec: 488 }
  }
]

