import React from 'react'
import './App.scss'
import Tasks from './components/Tasks/Tasks'
import { TasksContextProvider } from './contexts/TasksContext'

function App() {
  return (
    <div className="App">
      <TasksContextProvider>
        <Tasks />
      </TasksContextProvider>
    </div>
  );
}

export default App;
