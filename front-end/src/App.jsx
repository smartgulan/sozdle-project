import { useState } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(6).fill('')); // 6 строк для слов
  const keyboard = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    '>ZXCVBNM<',
  ];

  return (
    <div className="background"> {/* Контейнер для фона */}
      <div className="app">
        <h1 className="title">Sozdle</h1>
        
        {/* Игровое поле */}
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array(5).fill('').map((_, colIndex) => (
                <div key={colIndex} className="cell"></div>
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
                  className={`key ${key === '>' ? 'large-key' : ''}`} // Добавляем класс для "Enter"
                  onClick={() => console.log(key === '>' ? 'Enter' : key)} // Заменяем ">" на "Enter"
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
