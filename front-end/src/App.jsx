import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(6).fill('').map(() => Array(5).fill(''))); // Игровое поле 6x5
  const [currentRow, setCurrentRow] = useState(0); 
  const [currentCol, setCurrentCol] = useState(0); 

  const keyboard = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    '>ZXCVBNM<',
  ];

  const handleKeyPress = (key) => {
    if (key === 'Enter') {
      if (currentCol === 5) {
        setCurrentRow((prevRow) => Math.min(prevRow + 1, 5));
        setCurrentCol(0);
      }
    } else if (key === 'Backspace' || key === '←') {
      if (currentCol > 0) {
        // Удаляем символ
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
        // Ввод буквы
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, currentRow, currentCol]); 

  return (
    <div className="background"> {/* Контейнер для фона */}
      <div className="app">
        <h1 className="title">Sozdle</h1>

        {/* Игровое поле */}
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="cell">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Клавиатура */}
        <div className="keyboard">
          {keyboard.map((line, lineIndex) => (
            <div key={lineIndex} className="keyboard-line">
              {line.split('').map((key) => (
                <button
                  key={key}
                  className={`key ${key === '>' ? 'large-key' : ''}`}
                  onClick={() => handleKeyPress(key === '>' ? 'Enter' : key === '<' ? '←' : key)} // Заменяем ">" на "Enter" и "<" на "←"
                >
                  {key === '>' ? 'Enter' : key === '<' ? '←' : key} {/* Обработка символов */}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
