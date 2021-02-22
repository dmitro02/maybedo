import MainContainer from './components/MainContainer/MainContainer';
import { TasksContextProvider } from './contexts/TasksContext';
import { isMobile } from './utils/commonUtils';

declare global { interface Window { iAmRunningOnMobile: boolean } }
window.iAmRunningOnMobile = isMobile()

const App = () => (
    <>
        <div id="portal-root"></div>
        <TasksContextProvider>
            <MainContainer />
        </TasksContextProvider>
    </>
)

export default App;
