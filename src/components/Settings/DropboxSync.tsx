import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    uploadToDropBox, 
    downloadFromDropBox, 
    generateCodeVerifier,
    getDropboxAuthUrl,
    getAndSaveAccessToken
} from '../../utils/dropBoxUtils'

export const DROPBOX_ACCESS_TOKEN_LS_ITEM_NAME = 'dropboxAccessToken'

const DropboxSync = () => {
    const [ store ] = useTasksContext()
    const { rootProject } = store

    const codeVerifier = generateCodeVerifier()
    const authUrl = getDropboxAuthUrl(codeVerifier)

    const authTokenRef = useRef<HTMLInputElement>(null)

    return (
        <div className="settings-block">
            <h2>Dropbox Synchronization</h2>
            <p>
                Get authorization code <a href={authUrl} target="_black">here</a>
                , insert it into the input below and click "Authorize" button.
            </p>
            <input 
                type="text" 
                size={43} 
                placeholder="authorizarion code"
                ref={authTokenRef}
            />
            <button onClick={() => getAndSaveAccessToken(authTokenRef.current?.value, codeVerifier)}>
                Authorize
            </button>
            <div>
                <button onClick={() => uploadToDropBox(rootProject)}>Upload</button>
                <button onClick={downloadFromDropBox}>Download</button>
            </div>
        </div>
    )
}

export default DropboxSync
