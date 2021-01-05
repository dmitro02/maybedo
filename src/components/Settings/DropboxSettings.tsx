import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import DropboxSync from '../../utils/DropboxSync'

const DropboxSettings = () => {
    const [ store ] = useTasksContext()
    const { rootProject } = store

    const dbx = new DropboxSync()

    const authTokenRef = useRef<HTMLInputElement>(null)

    return (
        <div className="settings-block">
            <h2>Dropbox Synchronization</h2>
            <p>
                Get authorization code <a href={dbx.authUrl} target="_black">here</a>
                , insert it into the input below and click "Authorize" button.
            </p>
            <input 
                type="text" 
                size={48} 
                placeholder="authorizarion code"
                ref={authTokenRef}
            />
            <button onClick={() => dbx.auhtorize(authTokenRef.current?.value)}>
                Authorize
            </button>
            <div>
                <button onClick={() => dbx.upload(rootProject)}>Upload</button>
                <button onClick={() => dbx.download()}>Download</button>
            </div>
        </div>
    )
}

export default DropboxSettings
