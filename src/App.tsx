import React from 'react'
import Layout from './components/Layout/Layout';
import { TasksContextProvider } from './contexts/TasksContext';

const App = () => (
    <TasksContextProvider>
        <Layout />
    </TasksContextProvider>
)

export default App;
