import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { kidsSeed, KidsSeed, KidProfile, DictionaryItem, Story, Progress } from '../data/kidsSeed';

type KidsState = {
  data: KidsSeed;
  loading: boolean;
  error: string | null;
};

type KidsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: KidsSeed }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'SET_STREAK'; payload: number }
  | { type: 'MARK_WORD_LEARNED'; payload: string }
  | { type: 'RECORD_GAME_PLAY'; payload: { gameId: string; score: number } };

const kidsReducer = (state: KidsState, action: KidsAction): KidsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };
    case 'ADD_POINTS':
      return {
        ...state,
        data: {
          ...state.data,
          profile: {
            ...state.data.profile,
            points: state.data.profile.points + action.payload
          }
        }
      };
    case 'SET_STREAK':
      return {
        ...state,
        data: {
          ...state.data,
          profile: {
            ...state.data.profile,
            streak: action.payload
          }
        }
      };
    case 'MARK_WORD_LEARNED':
      if (!state.data.progress.learnedWordIds.includes(action.payload)) {
        return {
          ...state,
          data: {
            ...state.data,
            progress: {
              ...state.data.progress,
              learnedWordIds: [...state.data.progress.learnedWordIds, action.payload]
            }
          }
        };
      }
      return state;
    case 'RECORD_GAME_PLAY':
      const existingGame = state.data.progress.games.find(g => g.id === action.payload.gameId);
      const updatedGames = existingGame
        ? state.data.progress.games.map(g =>
            g.id === action.payload.gameId
              ? { ...g, plays: g.plays + 1, bestScore: Math.max(g.bestScore, action.payload.score) }
              : g
          )
        : [...state.data.progress.games, { id: action.payload.gameId, plays: 1, bestScore: action.payload.score }];
      
      return {
        ...state,
        data: {
          ...state.data,
          progress: {
            ...state.data.progress,
            games: updatedGames
          }
        }
      };
    default:
      return state;
  }
};

const KidsContext = createContext<{
  state: KidsState;
  addPoints: (points: number) => void;
  setStreak: (streak: number) => void;
  markWordLearned: (wordId: string) => void;
  recordGamePlay: (gameId: string, score: number) => void;
} | null>(null);

export const KidsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(kidsReducer, {
    data: kidsSeed,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/kids/seed');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_DATA', payload: data });
        } else {
          // Fallback to local seed data
          dispatch({ type: 'SET_DATA', payload: kidsSeed });
        }
      } catch (error) {
        console.log('API not available, using local seed data');
        dispatch({ type: 'SET_DATA', payload: kidsSeed });
      }
    };

    fetchData();
  }, []);

  const addPoints = (points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
    // Sync with backend
    fetch('/api/kids/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        childId: state.data.profile.id, 
        deltaPoints: points 
      })
    }).catch(console.error);
  };

  const setStreak = (streak: number) => {
    dispatch({ type: 'SET_STREAK', payload: streak });
  };

  const markWordLearned = (wordId: string) => {
    dispatch({ type: 'MARK_WORD_LEARNED', payload: wordId });
    // Sync with backend
    fetch('/api/kids/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        childId: state.data.profile.id, 
        learnedWordId: wordId 
      })
    }).catch(console.error);
  };

  const recordGamePlay = (gameId: string, score: number) => {
    dispatch({ type: 'RECORD_GAME_PLAY', payload: { gameId, score } });
    // Sync with backend
    fetch('/api/kids/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        childId: state.data.profile.id, 
        gameId, 
        score 
      })
    }).catch(console.error);
  };

  return (
    <KidsContext.Provider value={{
      state,
      addPoints,
      setStreak,
      markWordLearned,
      recordGamePlay
    }}>
      {children}
    </KidsContext.Provider>
  );
};

export const useKids = () => {
  const context = useContext(KidsContext);
  if (!context) {
    throw new Error('useKids must be used within KidsProvider');
  }
  return context;
};