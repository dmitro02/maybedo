import { useState } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import * as lsUtils from '../../utils/localStorageUtils'
import Syncer, { SyncTargets } from '../../utils/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSync from './DropboxSettings'

function SyncSettings() {
    const [ target, setTarget ] = useState(lsUtils.getSyncTarget())

    const { actions } = useTasksContext()

    const getTargetSettingsElement = () => {
        switch (target) {
            case SyncTargets.Dropbox:
                return <DropboxSync />
            default:
                return null
        }
    }

    const handleTargetChange = (e: any) => {
        const value = e.target.value as SyncTargets
        
        lsUtils.setSyncTarget(value)

        if (value === SyncTargets.Disabled) {
            actions.setSyncStatus(SyncStatuses.NotConfigured)
        } else {
            Syncer.getInstance(actions).initSync()
        }
        
        setTarget(value)
    }

    return (
        <div className="settings-block">
            <h2>Cloud Synchronization</h2>
            <select value={target} onChange={handleTargetChange}>
                <option value={SyncTargets.Disabled}>Disabled</option>
                <option value={SyncTargets.Dropbox}>Dropbox</option>
            </select>
            {getTargetSettingsElement()}
        </div>
    )
}

export default SyncSettings
