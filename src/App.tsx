import MainContainer from './components/MainContainer/MainContainer';
import { isMobile } from './utils/commonUtils';

declare global { interface Window { iAmRunningOnMobile: boolean } }
window.iAmRunningOnMobile = isMobile()

const App = () => (
    <>
        <div id="portal-root"></div>
        <MainContainer />
    </>
)

export default App;
