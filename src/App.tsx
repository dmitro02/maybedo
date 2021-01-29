import MainContainer from './components/MainContainer/MainContainer';
import { TasksContextProvider } from './contexts/TasksContext';

const App = () => (
    <TasksContextProvider>
        <MainContainer />
    </TasksContextProvider>
)

export default App;
