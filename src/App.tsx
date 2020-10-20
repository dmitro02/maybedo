import React from 'react'
import Layout from './components/Layout/Layout';
import { TasksContextProvider } from './contexts/TasksContext';
import './styles/common.scss'

const App = () => (
    <TasksContextProvider>
        <Layout />
    </TasksContextProvider>
)

export default App;
