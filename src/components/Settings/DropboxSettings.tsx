import { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import DropboxConnector from '../../utils/DropboxConnector'
import { 
    FailureBanner, 
    SuccessBanner 
} from '../../types'
import Syncer, { SyncSources } from '../../utils/Syncer'
import { GoArrowRight } from "react-icons/go";

type Props = { source: SyncSources }

const DropboxSettings = ({ source }: Props) => {
    const { actions } = useTasksContext()

    const dbx = new DropboxConnector()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        actions.setLoading(true)
        try {
            await dbx.authorize(authTokenRef.current?.value)

            Syncer.getInstance(actions).initSync(source, dbx)

            actions.setBanner(new SuccessBanner('Application successfully authorized'))
        } catch(e) {
            actions.setBanner(new FailureBanner('Error: ' + e.message))
        }
        actions.setLoading(false)
    }

    return (
        <>
            <h3>
                Connect Dropbox
                {dbx.isConfigured && 
                    <span className="already-authorized" title="Already configured">
                        &#10004;
                    </span>
                }
            </h3>
            <div className="dropbox-flow">
                <button onClick={()=> window.open(dbx.authUrl, "_blank")} type="button">Get Code</button>
                <GoArrowRight className="arrow-right" />
                <input 
                    type="text" 
                    size={48} 
                    placeholder="insert authorizarion code here"
                    ref={authTokenRef}
                    className="auth-code"
                />
                <GoArrowRight className="arrow-right" />
                <button onClick={authorizeApp}>Authorize</button>
            </div>
        </>
    )
}

export default DropboxSettings
