import MainContainer from './components/MainContainer/MainContainer';
import { TasksContextProvider } from './contexts/TasksContext';

const App = () => (
    <>
        <div id="portal-root"></div>
        <TasksContextProvider>
            <MainContainer />
        </TasksContextProvider>
    </>
)

export default App;
