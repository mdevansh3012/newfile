import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Lock,
  Star,
  Music,
  Coffee,
  Moon,
  Sun,
  Camera,
} from "lucide-react";

const LoveStoryLocket = () => {
  const [currentStage, setCurrentStage] = useState("locket");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [letter, setLetter] = useState("");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [completedMemories, setCompletedMemories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showNextHint, setShowNextHint] = useState(false);

  const [scrambledWords, setScrambledWords] = useState([
    { original: "sunshine", scrambled: "suhnines", solved: false },
    { original: "yashvi", scrambled: "hvyasi", solved: false },
    { original: "light", scrambled: "gilth", solved: false },
    { original: "pookie", scrambled: "ooikep", solved: false },
  ]);

  const memories = [
    { id: 1, icon: <Coffee className="w-6 h-6" />, title: "Blue Oven Cafe" },
    { id: 2, icon: <Star className="w-6 h-6" />, title: "SkyBlue" },
    { id: 3, icon: <Music className="w-6 h-6" />, title: "Theobroma Cafe" },
    { id: 4, icon: <Camera className="w-6 h-6" />, title: "Nini's Kitchen" },
  ];

  useEffect(() => {
    fetch("/new.txt")
      .then((response) => response.text())
      .then(setLetter)
      .catch((error) => console.error("Error loading letter:", error));
  }, []);

  const handleStageTransition = (nextStage) => {
    setShowSuccess(true);
    setTimeout(() => {
      setCurrentStage(nextStage);
      setShowSuccess(false);
    }, 2000);
  };

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    const expectedPosition = completedMemories.length;

    if (memory.id === expectedPosition + 1) {
      setCompletedMemories((prev) => [...prev, memory]);
      setSelectedMemory(null);
      if (completedMemories.length + 1 === memories.length) {
        handleStageTransition("wordle");
      }
    } else {
      setTimeout(() => setSelectedMemory(null), 1000);
    }
  };

  const handleRiddleSubmit = (e) => {
    e.preventDefault();
    if (riddleAnswer.toLowerCase().trim() === "sunshine") {
      handleStageTransition("scramble");
      setRiddleAnswer("");
    }
  };

  const handleWordSubmit = (word) => {
    const updatedWords = scrambledWords.map((w) =>
      w.original === word ? { ...w, solved: true } : w
    );
    setScrambledWords(updatedWords);
    setCurrentWord("");

    if (updatedWords.every((w) => w.solved)) {
      setShowSuccess(true);
      setTimeout(() => {
        setIsUnlocked(true);
        setCurrentStage("letter");
        setShowSuccess(false);
      }, 2000);
    }
  };

  const commonCardStyle = "w-96 bg-white rounded-xl shadow-lg p-8";
  const commonButtonStyle =
    "w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors";
  const commonInputStyle =
    "w-full p-2 border rounded-lg text-center focus:ring-2 focus:ring-rose-500 outline-none";

  const renderWordle = () => {
    const wordPuzzles = [
      {
        word: "CHEESECAKE",
        hint: "What's a 10-letter word for dessert that we enjoyed together?",
        message: "🧁",
        nextHint: "Ready for our next adventure? 🚲",
      },
      {
        word: "BIKE",
        hint: "4-letter word for a mode of transportation that was the one of the things I did for the first time ",
        message:
          "Yaad che first time gya blue oven ma tyaare rasto nti khabr 😂😂",
        nextHint: "Now, let's think about what lights up my world... ☀️",
      },
      {
        word: "SUNSHINE",
        hint: "A 8-letter word which brightens my day when I see it or call it",
        message: "Well aana par to su j kau...🙂🙃 You're My Sunshine",
        nextHint: "Last one! Think about our favorite song... 🎵",
      },
      {
        word: "PERFECT",
        hint: "What's that song I sing that makes you smile every time?",
        message:
          "Obviously Perfect ...(Just like you 👀)Ed Sheeran knows it, and I know it too! 🎸",
        nextHint: "You've unlocked all the special words! 💝",
      },
    ];

    const maxAttempts = 3;
    const currentPuzzle = wordPuzzles[currentWordIndex];

    const checkGuess = (guess) => {
      const result = [];
      const targetLetters = currentPuzzle.word.split("");
      const guessLetters = guess.split("");

      // First pass: Mark correct letters (green)
      guessLetters.forEach((letter, index) => {
        if (targetLetters[index] === letter) {
          result[index] = { letter, color: "bg-green-500" };
          targetLetters[index] = null;
        }
      });

      // Second pass: Mark misplaced letters (yellow) or incorrect letters (gray)
      guessLetters.forEach((letter, index) => {
        if (!result[index]) {
          const targetIndex = targetLetters.indexOf(letter);
          if (targetIndex !== -1) {
            result[index] = { letter, color: "bg-yellow-500" };
            targetLetters[targetIndex] = null;
          } else {
            result[index] = { letter, color: "bg-gray-400" };
          }
        }
      });

      return result;
    };

    const handleGuessSubmit = (e) => {
      e.preventDefault();
      if (currentGuess.length !== currentPuzzle.word.length) return;

      const newGuess = currentGuess.toUpperCase();
      const guessResult = checkGuess(newGuess);
      const newGuesses = [...guesses, guessResult];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (newGuess === currentPuzzle.word) {
        setGameWon(true);
        setShowMessage(true);

        setTimeout(() => {
          setShowNextHint(true);
        }, 2000);

        if (currentWordIndex < wordPuzzles.length - 1) {
          setTimeout(() => {
            setCurrentWordIndex((prev) => prev + 1);
            setGuesses([]);
            setGameWon(false);
            setGameOver(false);
            setShowMessage(false);
            setShowNextHint(false);
          }, 5000);
        } else {
          setTimeout(() => {
            handleStageTransition("scramble");
          }, 6000);
        }
      } else if (newGuesses.length >= maxAttempts) {
        setGameOver(true);
      }
    };

    const renderSquare = (letterInfo, index) => (
      <motion.div
        key={index}
        className={`w-12 h-12 ${
          letterInfo ? letterInfo.color : "bg-gray-200"
        } flex items-center justify-center text-white text-2xl font-bold rounded-lg`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        {letterInfo ? letterInfo.letter : ""}
      </motion.div>
    );

    const renderRow = (guess) => (
      <div className="flex gap-2">
        {Array(currentPuzzle.word.length)
          .fill(null)
          .map((_, index) => renderSquare(guess ? guess[index] : null, index))}
      </div>
    );

    return (
      <motion.div
        className={commonCardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 mx-auto"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart className="w-full h-full text-rose-500" />
          </motion.div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Word Puzzle {currentWordIndex + 1}/4
          </h2>

          <motion.div
            className="text-lg text-rose-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={currentPuzzle.hint}
          >
            {currentPuzzle.hint}
          </motion.div>

          <div className="space-y-2">
            {Array(maxAttempts)
              .fill(null)
              .map((_, index) => (
                <div key={index}>{renderRow(guesses[index])}</div>
              ))}
          </div>

          {!gameWon && !gameOver && (
            <form onSubmit={handleGuessSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={currentPuzzle.word.length}
                value={currentGuess}
                onChange={(e) =>
                  setCurrentGuess(e.target.value.replace(/[^a-zA-Z]/g, ""))
                }
                className={commonInputStyle}
                placeholder={`Enter ${currentPuzzle.word.length}-letter word`}
                disabled={gameWon || gameOver}
              />
              <button
                type="submit"
                className={commonButtonStyle}
                disabled={currentGuess.length !== currentPuzzle.word.length}
              >
                Guess
              </button>
            </form>
          )}

          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-lg font-medium text-rose-600"
              >
                {currentPuzzle.message}
                {showNextHint && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-blue-600"
                  >
                    {currentPuzzle.nextHint}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {gameOver && !gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-600 font-medium"
            >
              The word was: {currentPuzzle.word}
              <br />
              <button
                onClick={() => {
                  setGuesses([]);
                  setGameOver(false);
                  setCurrentGuess("");
                }}
                className="mt-4 text-blue-500 underline"
              >
                Try Again
              </button>
            </motion.div>
          )}

          <div className="text-sm text-gray-600">
            Green = correct letter, correct spot
            <br />
            Yellow = correct letter, wrong spot
            <br />
            Gray = incorrect letter
          </div>
        </div>
      </motion.div>
    );
  };

  const renderScramble = () => (
    <motion.div
      className={commonCardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 bg-rose-400"
              animate={{
                rotate: [0, 45],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Word Scramble</h2>
        <div className="grid grid-cols-2 gap-4">
          {scrambledWords.map((word, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg ${
                word.solved
                  ? "bg-rose-100 text-rose-800"
                  : "bg-rose-50 text-rose-700"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {word.solved ? (
                <span className="font-bold">{word.original}</span>
              ) : (
                <span className="font-mono">{word.scrambled}</span>
              )}
            </motion.div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const matchingWord = scrambledWords.find(
              (w) => w.original === currentWord.toLowerCase() && !w.solved
            );
            if (matchingWord) {
              handleWordSubmit(matchingWord.original);
            }
          }}
          className="space-y-4"
        >
          <input
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            className={commonInputStyle}
            placeholder="Unscramble a word..."
          />
          <button type="submit" className={commonButtonStyle}>
            Submit Word
          </button>
        </form>
      </div>
    </motion.div>
  );

  const renderLocket = () => (
    <motion.div className="relative w-96 h-96">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-rose-300 to-rose-400 rounded-full shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4">
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                className={`relative p-4 rounded-xl cursor-pointer ${
                  completedMemories.includes(memory)
                    ? "bg-rose-100"
                    : "bg-gray-50 hover:bg-rose-50"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleMemoryClick(memory)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <motion.div
                    className={`text-rose-500 ${
                      completedMemories.includes(memory)
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                  >
                    {memory.icon}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-700">
                    {memory.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
          animate={showSuccess ? { scale: [1, 1.5, 1], rotate: [0, 360] } : {}}
        >
          <Lock className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderUnlockedLetter = () => {
    const paragraphStyle = {
      marginBottom: "1.5rem",
      color: "#4a4a4a",
      fontSize: "1.50rem",
      fontFamily: '"Dancing Script", cursive',
      letterSpacing: "1.5px",
    };

    const firstLetterStyle = {
      fontSize: "3.5rem",
      float: "left",
      lineHeight: "1",
      marginRight: "8px",
      fontFamily: '"Great Vibes", cursive',
      color: "#ff6b95",
    };

    const signatureStyle = {
      textAlign: "right",
      fontStyle: "italic",
      color: "#ff6b95",
      marginTop: "3rem",
      fontFamily: '"Great Vibes", cursive',
      fontSize: "1.8rem",
    };

    return (
      <motion.div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-rose-400 to-red-300 p-8 text-center cursor-pointer relative overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute top-4 left-4">
              <Heart className="w-8 h-8 text-white opacity-30" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Heart className="w-8 h-8 text-white opacity-30" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="relative"
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="font-serif text-4xl text-white mb-2 font-bold tracking-wide">
              The Secret Letter
            </h1>
            <p className="text-white/80 font-light">
              Click to {isOpen ? "close" : "open"} the letter
            </p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-12 bg-gradient-to-br from-white to-rose-50">
                <div className="max-w-3xl mx-auto space-y-8">
                  {letter.split("\n\n").map((paragraph, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      {/* Decorative line before first paragraph */}
                      {index === 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                      )}

                      {/* Different styling for different paragraphs */}
                      <p style={paragraphStyle}>
                        {index === 0 && (
                          <span style={firstLetterStyle}>
                            {paragraph.charAt(0)}
                          </span>
                        )}
                        {index === 0 ? paragraph.slice(1) : paragraph}
                      </p>

                      {/* Decorative elements between paragraphs */}
                      {index < letter.split("\n\n").length - 1 && (
                        <div className="flex justify-center my-8">
                          <motion.p
                            className="font-bold text-2xl text-rose-700 mt-2"
                            transition={{ duration: 2, repeat: Infinity }}
                            style={signatureStyle}
                          >
                            Devansh
                          </motion.p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const stageInfo = {
    locket: {
      title: "Unlock the Memory Locket",
      success: "Memories Unlocked! 💝",
    },
    wordle: {
      title: "Solve the Sunshine Wordle",
      success: "Word Solved! 🌞",
    },
    scramble: {
      title: "It's Wordle Time 🎉",
      success: "Words Completed! 💫",
    },
    letter: { title: "", success: "Love Story Unlocked! 💝" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex flex-col items-center justify-center p-8">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 bg-rose-500 bg-opacity-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="text-4xl text-white">
              {stageInfo[currentStage].success}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="text-3xl text-center text-rose-600 mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {stageInfo[currentStage].title}
      </motion.div>

      {currentStage === "locket" && renderLocket()}
      {currentStage === "wordle" && renderWordle()}
      {currentStage === "scramble" && renderScramble()}
      {currentStage === "letter" && renderUnlockedLetter()}
    </div>
  );
};

export default LoveStoryLocket;
