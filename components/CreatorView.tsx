import React, { useState } from 'react';
import type { GameData } from '../types';

interface CreatorViewProps {
  onGameCreated: (data: GameData) => void;
}

const CreatorView: React.FC<CreatorViewProps> = ({ onGameCreated }) => {
  const [wordsInput, setWordsInput] = useState('');
  const [phraseInput, setPhraseInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    setGeneratedLink(null);

    const words = wordsInput
      .split(/[\n,]+/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);

    // Rule 1: At least one word must be provided.
    if (words.length === 0) {
      setError('Please enter at least one word to guess.');
      return;
    }

    // Rule 2: All words must contain only letters.
    for (const word of words) {
        if (!/^[a-z]+$/.test(word)) {
            setError(`Invalid word: "${word}". Words can only contain letters (a-z).`);
            return;
        }
    }
    
    const firstWordLength = words[0].length;

    // Rule 3: Word length must be between 3 and 8 characters.
    if (firstWordLength < 3 || firstWordLength > 8) {
        setError(`Words must be between 3 and 8 letters long. Your words are ${firstWordLength} letters long.`);
        return;
    }

    // Rule 4: All words must be the same length.
    const inconsistentWord = words.find(w => w.length !== firstWordLength);
    if (inconsistentWord) {
      setError(`All words must be the same length. "${words[0]}" has ${firstWordLength} letters, but "${inconsistentWord}" has ${inconsistentWord.length}.`);
      return;
    }

    // Rule 5: A secret phrase must be provided.
    if (phraseInput.trim().length === 0) {
      setError('Please enter a secret phrase to be revealed at the end.');
      return;
    }


    const gameData: GameData = { words, phrase: phraseInput.trim() };
    const encodedData = btoa(JSON.stringify(gameData));
    const link = `${window.location.origin}${window.location.pathname}#/play/${encodedData}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">Create Your Puzzle</h2>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 mb-4 rounded-md">{error}</div>}

      <div className="space-y-6">
        <div>
          <label htmlFor="words" className="block text-sm font-medium text-gray-300 mb-1">
            Words to Guess
          </label>
          <textarea
            id="words"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            placeholder="Enter words separated by commas or new lines, e.g., react, hooks, state"
            className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            aria-describedby="words-error"
            aria-invalid={!!error}
          />
        </div>
        <div>
          <label htmlFor="phrase" className="block text-sm font-medium text-gray-300 mb-1">
            Secret Phrase
          </label>
          <input
            id="phrase"
            type="text"
            value={phraseInput}
            onChange={(e) => setPhraseInput(e.target.value)}
            placeholder="The prize for winning!"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            aria-describedby="phrase-error"
            aria-invalid={!!error}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-bold text-lg transition-transform transform hover:scale-105"
      >
        Generate Game Link
      </button>

      {generatedLink && (
        <div className="mt-6 p-4 bg-gray-700 rounded-md">
          <p className="text-green-300 font-semibold">Your game is ready!</p>
          <div className="flex items-center mt-2 space-x-2">
            <input
              type="text"
              readOnly
              value={generatedLink}
              className="w-full p-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-gray-600 hover:bg-gray-500 rounded-md"
              title="Copy link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
           <a 
            href={generatedLink}
            className="block text-center mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold transition">
               Play Now!
            </a>
        </div>
      )}
    </div>
  );
};

export default CreatorView;
