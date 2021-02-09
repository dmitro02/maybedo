import { useState } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import Portal from '../../HOCs/Portal'
import * as lsUtils from '../../utils/localStorageUtils'
import Syncer, { SyncSources, SyncTargets } from '../../utils/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSettings from './DropboxSettings'
import SyncModal from './SyncModal'

function SyncSettings() {
    const initialState = {
        target: lsUtils.getSyncTarget(),
        dataSource: undefined
    }

    const [ syncOpts, setSyncOpts ] = useState(initialState)

    const [ showModal, setShowModal ] = useState(false)

    const { store, actions } = useTasksContext()

    const getTargetSettingsElement = () => {
        const { target, dataSource } = syncOpts
        switch (target) {
            case SyncTargets.Dropbox:
                return <DropboxSettings source={dataSource!} />
            default:
                return null
        }
    }

    // const getSyncModal = () => {
    //     const selectLocal = () => {
    //         actions.setModal(null) 
    //         Syncer
    //             .getInstance(actions)
    //             .initSync(SyncSources.Local)
    //     }
    
    //     const selectRemote = () => {
    //         actions.setModal(null)
    //         Syncer
    //             .getInstance(actions)
    //             .initSync(SyncSources.Remote)
    //     }
    
    //     return (
    //         <>
    //             <div>Select initial data source</div>
    //             <div className="">
    //                 <button onClick={selectLocal}>Local</button>
    //                 <button onClick={selectRemote}>Remote</button>
    //             </div>
    //         </>
    //     )
    // }

    const handleTargetChange = (e: any) => {
        const value = e.target.value as SyncTargets
        
        lsUtils.setSyncTarget(value)

        if (value === SyncTargets.Disabled) {
            actions.setSyncStatus(SyncStatuses.NotConfigured)
            Syncer.getInstance(actions).initSync()
        } else {
            setShowModal(true)
        }
        
        setSyncOpts({ target: value, dataSource: undefined })
    }

    const isSelectDisabled = 
        store.syncStatus === SyncStatuses.InProgress || 
        store.syncStatus === SyncStatuses.Success

    const onModalLocal = () => {
        Syncer
            .getInstance(actions)
            .initSync(SyncSources.Local)
        setShowModal(false)
    }

    const onModalRemote = () => {
        Syncer
            .getInstance(actions)
            .initSync(SyncSources.Remote)
        setShowModal(false)
    }

    return (
        <div className="settings-block">
            <h2>Cloud Synchronization</h2>
            <select 
                disabled={isSelectDisabled} 
                value={syncOpts.target} 
                onChange={handleTargetChange}
            >
                <option value={SyncTargets.Disabled}>Disabled</option>
                <option value={SyncTargets.Dropbox}>Dropbox</option>
            </select>
            {getTargetSettingsElement()}
            {showModal && 
            <Portal>
                <SyncModal onLocal={onModalLocal} onRemote={onModalRemote} />
            </Portal>}
        </div>
    )
}

export default SyncSettings
