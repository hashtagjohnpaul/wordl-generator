
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { GameData, LetterStatuses, GameState, LetterStatus } from '../types';
import { MAX_GUESSES } from '../constants';
import Grid from './Grid';
import Keyboard from './Keyboard';
import Modal from './Modal';

interface PlayerViewProps {
  gameData: GameData;
}

const PlayerView: React.FC<PlayerViewProps> = ({ gameData }) => {
  const { words, phrase } = gameData;
  
  const [wordLength, setWordLength] = useState(words[0].length);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const solution = useMemo(() => words[currentWordIndex].toLowerCase(), [words, currentWordIndex]);

  const [guesses, setGuesses] = useState<string[]>(() => Array(MAX_GUESSES).fill(''));
  const [currentTurn, setCurrentTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [letterStatuses, setLetterStatuses] = useState<LetterStatuses>({});
  const [gameState, setGameState] = useState<GameState>('playing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 2000);
  }

  const resetForNewWord = useCallback(() => {
    setGuesses(Array(MAX_GUESSES).fill(''));
    setCurrentTurn(0);
    setCurrentGuess('');
    // Keep letter statuses for a consistent keyboard experience
  }, []);

  const processInput = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'Enter') {
      if (currentGuess.length !== wordLength) {
        showToast('Not enough letters');
        return;
      }
      
      const newGuesses = [...guesses];
      newGuesses[currentTurn] = currentGuess;
      setGuesses(newGuesses);

      const newLetterStatuses = {...letterStatuses};
      const solutionLetters = solution.split('');
      const guessLetters = currentGuess.split('');
      const tempSolution = [...solutionLetters];
      
      // First pass for correct letters
      guessLetters.forEach((letter, i) => {
        if (letter === tempSolution[i]) {
          newLetterStatuses[letter] = 'correct';
          tempSolution[i] = ''; // Mark as used
        }
      });
      
      // Second pass for present letters
       guessLetters.forEach((letter, i) => {
        if (solutionLetters[i] !== letter && tempSolution.includes(letter)) {
          if(newLetterStatuses[letter] !== 'correct'){
            newLetterStatuses[letter] = 'present';
          }
          tempSolution[tempSolution.indexOf(letter)] = ''; // Mark as used
        }
      });

      // Third pass for absent
      guessLetters.forEach(letter => {
        if(!(letter in newLetterStatuses)){
          newLetterStatuses[letter] = 'absent';
        }
      })
      
      setLetterStatuses(newLetterStatuses);

      if (currentGuess === solution) {
        if (currentWordIndex === words.length - 1) {
          setGameState('won');
        } else {
          setTimeout(() => {
            setCurrentWordIndex(prev => prev + 1);
            resetForNewWord();
          }, 2000);
        }
      } else if (currentTurn === MAX_GUESSES - 1) {
        setGameState('lost');
      }

      setCurrentTurn(prev => prev + 1);
      setCurrentGuess('');
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key.toLowerCase());
    }
  }, [currentGuess, currentTurn, gameState, guesses, wordLength, solution, words, currentWordIndex, letterStatuses, resetForNewWord]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      processInput(event.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processInput]);

  return (
    <div className="flex flex-col items-center w-full">
        {toastMessage && (
            <div className="absolute top-20 bg-gray-700 text-white px-4 py-2 rounded-md animate-pulse">
                {toastMessage}
            </div>
        )}
      <div className="mb-4">
        <h2 className="text-xl text-gray-400">Word {currentWordIndex + 1} of {words.length}</h2>
      </div>
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        turn={currentTurn}
        solution={solution}
        wordLength={wordLength}
      />
      <Keyboard onKeyPress={processInput} letterStatuses={letterStatuses} />
      {(gameState === 'won' || gameState === 'lost') && (
        <Modal gameState={gameState} secretPhrase={phrase} solution={solution} />
      )}
    </div>
  );
};

export default PlayerView;
