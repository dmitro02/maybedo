import { useRef, useState } from 'react'
import Portal from '../../HOCs/Portal'
import * as lsUtils from '../../utils/localStorageUtils'
import Syncer, { SyncSources, SyncTargets } from '../../utils/Syncer'
import { SyncStatuses } from '../Statuses/SyncStatus'
import DropboxSettings from './DropboxSettings'
import SyncModal from './SyncModal'
import { actions, Events, useSubscribe } from '../../utils/Store'

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

    const [ isSelectDisabled, setIsSelectDisabled ] = useState(false)

    const targetRef = useRef<SyncTargets>(syncOpts.target)

    const toggleTargetSelector = (status: SyncStatuses) => {
        const flag = 
            status === SyncStatuses.InProgress || 
            status === SyncStatuses.Success
        setIsSelectDisabled(flag)
    }

    useSubscribe(Events.SetSyncStatus, toggleTargetSelector)

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
            Syncer.getInstance().initSync()
        } else {
            setShowModal(true)
        }
    }

    const initSyncWithTarget = (dataSource: SyncSources) => {
        const target = targetRef.current
        setSyncOpts({ target, dataSource })
        lsUtils.setSyncTarget(target)
        Syncer.getInstance().initSync(dataSource)
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
