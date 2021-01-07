import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import DropboxSync from '../../utils/DropboxSync'
import { 
    setBanner, 
    setSpinner 
} from '../../contexts/actionCreators'
import { 
    FailureBanner, 
    SuccessBanner 
} from '../../types'

const DropboxSettings = () => {
    const [, dispatch ] = useTasksContext()

    // const { rootProject } = store

    const dbx = new DropboxSync()

    const authTokenRef = useRef<HTMLInputElement>(null)

    const authorizeApp = async () => {
        dispatch(setSpinner(true))
        try {
            await dbx.auhtorize(authTokenRef.current?.value)
            dispatch(setBanner(new SuccessBanner('Application successfully authorized')))
        } catch(e) {
            dispatch(setBanner(new FailureBanner('Error: ' + e.message)))
        }
        dispatch(setSpinner(false))   
    }

    const checkConnection = async () => {
        try {
            await dbx.check()
            dispatch(setBanner(new SuccessBanner('Successfully accessed Dropbox')))
        } catch(e) {
            dispatch(setBanner(new FailureBanner(e.message)))
        } 
    }

    return (
        <div className="settings-block">
            <h2>
                Dropbox Synchronization
                {dbx.isConfigured && 
                    <span className="already-authorized" title="Already configured">
                        &#10004;
                    </span>
                }
            </h2>
            <p>
                Get authorization code <a href={dbx.authUrl} target="_black">here</a>
                , insert it into the input below and click "Authorize" button. 
            </p>
            <input 
                type="text" 
                size={48} 
                placeholder="authorizarion code"
                ref={authTokenRef}
                className="auth-code"
            />
            <button onClick={authorizeApp}>Authorize</button>
            <button onClick={checkConnection}>Check</button>
            {/* <div>
                <button onClick={() => dbx.upload(rootProject)}>Upload</button>
                <button onClick={() => dbx.download()}>Download</button>
            </div> */}
        </div>
    )
}

export default DropboxSettings
