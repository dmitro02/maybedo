import { useState } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import * as lsUtils from '../../utils/localStorageUtils'
import Syncer, { SyncSources, SyncTargets } from '../../utils/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSettings from './DropboxSettings'

function SyncSettings() {
    const initialState = {
        target: lsUtils.getSyncTarget(),
        dataSource: undefined
    }

    const [ state, setState ] = useState(initialState)

    const { store, actions } = useTasksContext()

    const getTargetSettingsElement = () => {
        const { target, dataSource } = state
        switch (target) {
            case SyncTargets.Dropbox:
                return <DropboxSettings source={dataSource!} />
            default:
                return null
        }
    }

    const getSyncModal = () => {
        const selectLocal = () => {
            actions.setModal(null) 
            Syncer
                .getInstance(actions)
                .initSync(SyncSources.Local)
        }
    
        const selectRemote = () => {
            actions.setModal(null)
            Syncer
                .getInstance(actions)
                .initSync(SyncSources.Remote)
        }
    
        return (
            <>
                <div>Select initial data source</div>
                <div className="">
                    <button onClick={selectLocal}>Local</button>
                    <button onClick={selectRemote}>Remote</button>
                </div>
            </>
        )
    }

    const handleTargetChange = (e: any) => {
        const value = e.target.value as SyncTargets
        
        lsUtils.setSyncTarget(value)

        if (value === SyncTargets.Disabled) {
            actions.setSyncStatus(SyncStatuses.NotConfigured)
            Syncer.getInstance(actions).initSync()
        } else {
            const modal = getSyncModal()
            actions.setModal(modal)
        }
        
        setState({ target: value, dataSource: undefined })
    }

    const isSelectDisabled = 
        store.syncStatus === SyncStatuses.InProgress || 
        store.syncStatus === SyncStatuses.Success

    return (
        <div className="settings-block">
            <h2>Cloud Synchronization</h2>
            <select 
                disabled={isSelectDisabled} 
                value={state.target} 
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
