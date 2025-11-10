
export type LetterStatus = 'correct' | 'present' | 'absent' | 'idle';

export interface GameData {
  words: string[];
  phrase: string;
}

export type GameState = 'creating' | 'playing' | 'won' | 'lost';

export type LetterStatuses = { [key: string]: LetterStatus };
