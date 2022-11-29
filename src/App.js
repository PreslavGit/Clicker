import { useState } from 'react';
import './App.css';
import Enemy from "./Components/Enemy.js";

function App() {

  const [enemyBits, setEnemyBits] = useState({});

  const printBits = (obj) => {
    let out = ''
    for (const key in obj) {
      out += ` ${key}: ${obj[key].count}  `
    }
    console.log(out);
    return out
  }

  return (
    <div className="App">
      <Enemy setEnemyBits={setEnemyBits} />
      <h3 className='printBits'>{printBits(enemyBits)}</h3>
    </div>
  );
}

export default App;
