import { useRef, useState } from 'react'
import * as lsUtils from '../../utils/localStorageUtils'
import syncer, { SyncTargets } from '../../classes/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSettings from './DropboxSettings'
import { store, useSubscribe } from '../../classes/Store2'

function SyncSettings() {
    const [ syncTarget, setSyncTarget ] = useState(lsUtils.getSyncTarget())

    const targetRef = useRef(syncTarget)

    const syncStatus = useSubscribe('syncStatus')

    const isSelectDisabled = syncStatus === SyncStatuses.InProgress

    const getTargetSettingsElement = () => {
        switch (syncTarget) {
            case SyncTargets.Dropbox:
                return <DropboxSettings />
            default:
                return null
        }
    }

    const handleTargetChange = (e: any) => {
        const target = e.target.value as SyncTargets
        targetRef.current = target

        if (target === SyncTargets.Disabled) {
            store.syncStatus = SyncStatuses.NotConfigured
        }
            
        setSyncTarget(target)
        lsUtils.setSyncTarget(target)
        syncer.init()
    }  

    return (
        <div className="settings-block">
            <h2>Cloud Synchronization</h2>
            <select 
                disabled={isSelectDisabled} 
                value={syncTarget} 
                onChange={handleTargetChange}
            >
                <option value={SyncTargets.Disabled}>Disabled</option>
                <option value={SyncTargets.Dropbox}>Dropbox</option>
            </select>
            {getTargetSettingsElement()}
        </div>
    )
}

export default SyncSettings
