import { useRef, useState } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import Portal from '../../HOCs/Portal'
import * as lsUtils from '../../utils/localStorageUtils'
import Syncer, { SyncSources, SyncTargets } from '../../utils/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSettings from './DropboxSettings'
import SyncModal from './SyncModal'

interface SyncOpts {
    target: SyncTargets
    dataSource: SyncSources | undefined
}

function SyncSettings() {
    const initialState: SyncOpts = {
        target: lsUtils.getSyncTarget(),
        dataSource: undefined
    }

    const [ syncOpts, setSyncOpts ] = useState(initialState)

    const [ showModal, setShowModal ] = useState(false)

    const { store, actions } = useTasksContext()

    const targetRef = useRef<SyncTargets>(syncOpts.target)

    const getTargetSettingsElement = () => {
        const { target, dataSource } = syncOpts
        switch (target) {
            case SyncTargets.Dropbox:
                return <DropboxSettings source={dataSource!} />
            default:
                return null
        }
    }

    const handleTargetChange = (e: any) => {
        const value = e.target.value as SyncTargets
        targetRef.current = value

        if (value === SyncTargets.Disabled) {
            setSyncOpts({ target: value, dataSource: undefined })
            lsUtils.setSyncTarget(value)
            actions.setSyncStatus(SyncStatuses.NotConfigured)
            Syncer.getInstance(actions).initSync()
        } else {
            setShowModal(true)
        }
    }

    const isSelectDisabled = 
        store.syncStatus === SyncStatuses.InProgress || 
        store.syncStatus === SyncStatuses.Success

    const initSyncWithTarget = (dataSource: SyncSources) => {
        const target = targetRef.current
        setSyncOpts({ target, dataSource })
        lsUtils.setSyncTarget(target)
        Syncer
            .getInstance(actions)
            .initSync(dataSource)
        setShowModal(false)
    }   
    
    const onModalLocal = () => {
        initSyncWithTarget(SyncSources.Local)
    }

    const onModalRemote = () => {
        initSyncWithTarget(SyncSources.Remote)
    }

    const onModalCancel = () => {
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
                <SyncModal 
                    onCancel={onModalCancel} 
                    onLocal={onModalLocal} 
                    onRemote={onModalRemote} 
                />
            </Portal>}
        </div>
    )
}

export default SyncSettings
