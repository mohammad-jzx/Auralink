import { KidsSeed } from './types';

export let kidsSeedData: KidsSeed = {
  profile: { 
    id: "child-1", 
    name: "محمد", 
    points: 120, 
    streak: 3, 
    age: 8 
  },
  dictionary: [
    { 
      id: "w1", 
      text: "ماء", 
      emoji: "💧", 
      video: "/placeholders/sign-water.mp4", 
      tags: ["أساسيات"] 
    },
    { 
      id: "w2", 
      text: "حمّام", 
      emoji: "🚻", 
      video: "/placeholders/sign-bathroom.mp4", 
      tags: ["أساسيات"] 
    },
    { 
      id: "w3", 
      text: "مدرسة", 
      emoji: "🏫", 
      video: "/placeholders/sign-school.mp4", 
      tags: ["أماكن"] 
    },
    { 
      id: "w4", 
      text: "طبيب", 
      emoji: "🩺", 
      video: "/placeholders/sign-doctor.mp4", 
      tags: ["أشخاص"] 
    },
    { 
      id: "w5", 
      text: "طعام", 
      emoji: "🍎", 
      video: "/placeholders/sign-food.mp4", 
      tags: ["أساسيات"] 
    },
    { 
      id: "w6", 
      text: "بيت", 
      emoji: "🏠", 
      video: "/placeholders/sign-home.mp4", 
      tags: ["أماكن"] 
    }
  ],
  stories: [
    { 
      id: "s1", 
      title: "رحلتي إلى المدرسة", 
      cover: "https://images.pexels.com/photos/159844/school-back-to-school-colorful-159844.jpeg?auto=compress&cs=tinysrgb&w=200", 
      slides: [
        "استيقظت مبكراً في الصباح",
        "تناولت الإفطار مع العائلة", 
        "لبست حقيبتي المدرسية",
        "وصلت إلى المدرسة بأمان"
      ]
    },
    { 
      id: "s2", 
      title: "زيارة الطبيب", 
      cover: "https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=200", 
      slides: [
        "شعرت بألم بسيط في بطني",
        "أخبرت والدتي عن الألم",
        "ذهبنا إلى عيادة الطبيب",
        "فحصني الطبيب بلطف",
        "أعطاني دواءً مفيداً",
        "تحسّنت بعد تناول الدواء"
      ]
    },
    { 
      id: "s3", 
      title: "يوم في الحديقة", 
      cover: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=200", 
      slides: [
        "خرجت للعب في الحديقة",
        "رأيت أطفالاً يلعبون معاً",
        "انضممت إليهم في اللعب",
        "قضينا وقتاً ممتعاً جداً"
      ]
    }
  ],
  progress: {
    learnedWordIds: ["w1", "w3"],
    games: [
      { id: "match", plays: 3, bestScore: 60 },
      { id: "pop", plays: 2, bestScore: 40 }
    ],
    weeklyMinutes: [12, 15, 20, 18, 25, 10, 0]
  }
};

export const updateProgress = (update: any) => {
  if (update.deltaPoints) {
    kidsSeedData.profile.points += update.deltaPoints;
  }

  if (update.learnedWordId && !kidsSeedData.progress.learnedWordIds.includes(update.learnedWordId)) {
    kidsSeedData.progress.learnedWordIds.push(update.learnedWordId);
  }

  if (update.gameId && update.score !== undefined) {
    const existingGame = kidsSeedData.progress.games.find(g => g.id === update.gameId);
    if (existingGame) {
      existingGame.plays += 1;
      existingGame.bestScore = Math.max(existingGame.bestScore, update.score);
    } else {
      kidsSeedData.progress.games.push({
        id: update.gameId,
        plays: 1,
        bestScore: update.score
      });
    }
  }

  return kidsSeedData;
};
