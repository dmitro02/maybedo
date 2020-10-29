import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { uploadToDropBox, downloadFromDropBox } from '../../utils/dropBoxUtils'

const DropboxSync = () => {
    const [ store ] = useTasksContext()

    const { rootProject } = store

    return (
        <div className="settings-block">
            <h2>Dropbox Synchronization</h2>
            <button onClick={() => uploadToDropBox(rootProject)}>Upload</button>
            <button onClick={downloadFromDropBox}>Download</button>
        </div>
    )
}

export default DropboxSync
