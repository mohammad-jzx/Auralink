export type KidProfile = {
  id: string;
  name: string;
  points: number;
  streak: number;
  age: number;
};

export type DictionaryItem = {
  id: string;
  text: string;
  emoji: string;
  video: string;
  tags: string[];
};

export type Story = {
  id: string;
  title: string;
  cover: string;
  slides: string[];
};

export type Progress = {
  learnedWordIds: string[];
  games: { id: string; plays: number; bestScore: number }[];
  weeklyMinutes: number[];
};

export type KidsSeed = {
  profile: KidProfile;
  dictionary: DictionaryItem[];
  stories: Story[];
  progress: Progress;
};

export type ProgressUpdate = {
  childId: string;
  deltaPoints?: number;
  learnedWordId?: string;
  gameId?: string;
  score?: number;
};