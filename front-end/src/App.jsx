import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
  const [board, setBoard] = useState(Array(6).fill('').map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [letterStatus, setLetterStatus] = useState(Array(6).fill('').map(() => Array(5).fill('')));
  const [keyStatus, setKeyStatus] = useState({});
  const [rightWord, setRightWord] = useState('');


  const keyboard = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    '>ZXCVBNM<',
  ];

  const handleKeyPress = async (key) => {
    if (key === 'Enter') {
      if (currentCol === 5) {
        const currentGuess = board[currentRow].join('').toLowerCase();

        try {
          const response = await fetch(`http://localhost:8080/?word=${currentGuess}`);
          const data = await response.json();

          if (data.result) {
            const newLetterStatus = [...letterStatus];
            const newKeyStatus = { ...keyStatus };

            data.result.forEach((status, index) => {
              const letter = currentGuess[index].toUpperCase();
              if (status === 1) {
                newLetterStatus[currentRow][index] = 'green';
                newKeyStatus[letter] = '#6aaa64';
              } else if (status === 0) {
                newLetterStatus[currentRow][index] = 'yellow';
                newKeyStatus[letter] = '#c9b458';
              } else {
                newLetterStatus[currentRow][index] = 'gray';
                newKeyStatus[letter] = '#787c7e';
              }
            });

            setLetterStatus(newLetterStatus);
            setKeyStatus(newKeyStatus);

            if (data.result.every((status) => status === 1)) {
              setGameStatus('won');
            } else if (currentRow === 5) {
              setGameStatus('failed');
              fetch('http://localhost:8080/getWord')
                .then((res) => res.json())
                .then((wordData) => setRightWord(wordData.word));
            } else {
              setCurrentRow((prevRow) => Math.min(prevRow + 1, 5));
              setCurrentCol(0);
              setAttempts((prevAttempts) => prevAttempts + 1);
            }
          }
        } catch (error) {
          console.error('Error fetching word status:', error);
        }
      }
    } else if (key === 'Backspace' || key === '←') {
      if (currentCol > 0) {
        const newBoard = board.map((row, rowIndex) =>
          rowIndex === currentRow
            ? row.map((cell, colIndex) => (colIndex === currentCol - 1 ? '' : cell))
            : row
        );
        setBoard(newBoard);
        setCurrentCol((prevCol) => prevCol - 1);
      }
    } else if (/^[A-Za-z]$/.test(key)) {
      if (currentCol < 5) {
        const newBoard = board.map((row, rowIndex) =>
          rowIndex === currentRow
            ? row.map((cell, colIndex) => (colIndex === currentCol ? key.toUpperCase() : cell))
            : row
        );
        setBoard(newBoard);
        setCurrentCol((prevCol) => prevCol + 1);
      }
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    resetGame();
  };

  const resetGame = () => {
    setBoard(Array(6).fill('').map(() => Array(5).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus(null);
    setAttempts(1);
    setLetterStatus(Array(6).fill('').map(() => Array(5).fill('')));
    setKeyStatus({});
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameStatus) {
        if (event.key === 'Enter') {
          closeDialog();
        }
      } else {
        handleKeyPress(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, currentRow, currentCol, gameStatus]);

  useEffect(() => {
    if (gameStatus) {
      openDialog();
    }
  }, [gameStatus]);


  return (
    <div className="background">
      <div className="app">
        <h1 className="title">Sozdle</h1>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className="cell"
                  style={{
                    backgroundColor:
                      letterStatus[rowIndex][colIndex] === 'green'
                        ? '#6aaa64'
                        : letterStatus[rowIndex][colIndex] === 'yellow'
                        ? '#c9b458'
                        : letterStatus[rowIndex][colIndex] === 'gray'
                        ? '#787c7e'
                        : 'white',
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="keyboard">
          {keyboard.map((line, lineIndex) => (
            <div key={lineIndex} className="keyboard-line">
              {line.split('').map((key) => (
                <button
                  key={key}
                  className={`key ${key === '>' ? 'large-key' : ''}`}
                  onClick={() => handleKeyPress(key === '>' ? 'Enter' : key === '<' ? '←' : key)}
                  style={{
                    backgroundColor: keyStatus[key] || 'white',
                  }}
                >
                  {key === '>' ? 'Enter' : key === '<' ? '←' : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {isOpen && (
          <div className="overlay">
            <div className="dialog">
              <h2>{gameStatus === 'won' ? 'You Won!' : 'You Failed!'}</h2>
              {gameStatus === 'failed' && <p>The word was: {rightWord}</p>}
              <button onClick={closeDialog}>New Game</button>
              <p className="small-text">or press Enter to play again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
