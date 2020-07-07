import React from 'react'
import './App.scss'
import Header from './components/header/Header'
import Done from './components/done/Done'
import Undone from './components/undone/Undone'

function App() {
  return (
    <div className="App">
      <Header />
      <Undone />
      <Done />
    </div>
  );
}

export default App;
