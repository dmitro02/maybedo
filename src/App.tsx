import React from 'react'
import './App.scss'
import Header from './components/Header/Header'
import Tasks from './components/Tasks/Tasks'
import { TasksContextProvider } from './contexts/TasksContext'

function App() {
  return (
    <div className="App">
      <Header />
      <TasksContextProvider>
        <Tasks />
      </TasksContextProvider>
      
    </div>
  );
}

export default App;
