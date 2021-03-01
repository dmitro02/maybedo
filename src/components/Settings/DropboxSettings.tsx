import { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import DropboxConnector from '../../utils/DropboxConnector'
import { FailureBanner, SuccessBanner } from '../../types'
import Syncer, { SyncSources } from '../../utils/Syncer'
import { GoArrowRight } from "react-icons/go";
import Button from '../Buttons/Button'
import taskStore from '../../utils/Store'

type Props = { source: SyncSources }

const DropboxSettings = ({ source }: Props) => {
    const { actions } = useTasksContext()

    const dbx = new DropboxConnector()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        taskStore.notify('showLoading')
        try {
            await dbx.authorize(authTokenRef.current?.value)

            Syncer.getInstance(actions).initSync(source, dbx)
            const banner = new SuccessBanner('Application successfully authorized')
            taskStore.notify('showBanner', banner)
        } catch(e) {
            const banner = new FailureBanner('Error: ' + e.message)
            taskStore.notify('showBanner', banner)
        }
        taskStore.notify('hideLoading')
    }

    return (
        <>
            <h3>
                Connect Dropbox
                {dbx.isConfigured
                    ? <span className="is-authorized already-authorized" title="Already configured">
                        &#10004;
                    </span>
                    : <span className="is-authorized not-authorized" title="Not configured">
                        !
                    </span>
                }
            </h3>
            <div className="dropbox-flow">
                <Button text='get code' action={()=> window.open(dbx.authUrl, "_blank")} />
                <GoArrowRight className="arrow-right" />
                <input 
                    type="text" 
                    size={48} 
                    placeholder="insert authorizarion code here"
                    ref={authTokenRef}
                    className="auth-code"
                />
                <GoArrowRight className="arrow-right" />
                <Button text='authorize' action={authorizeApp} />
            </div>
        </>
    )
}

export default DropboxSettings
