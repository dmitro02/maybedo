import syncer from '../../classes/Syncer'
import './SyncStatus.scss'
import { Events, useSubscribe } from '../../classes/Store'
import { useState } from 'react'

export enum SyncStatuses {
    NotConfigured = 'NOT_CONFIGURED',
    Idle = 'IDLE',
    InProgress = 'IN_PROGRESS',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

const SyncStatus = () => {
    const [ status, setStatus ] = useState<SyncStatuses>(SyncStatuses.NotConfigured)

    useSubscribe(Events.SetSyncStatus, setStatus)

    const refresh = () => {
        syncer.onDemandCloud()
    }

    const baseClass = 'material-icons-outlined common-btn'
    const noHoverClass = baseClass + ' no-hover'
    const inProgresClass = noHoverClass + ' syncing'
    const failureClass = baseClass + ' failure'

    const getStatusElement = (status?: SyncStatuses) => {
        switch (status) {
            case SyncStatuses.NotConfigured:
                return <span 
                    className={noHoverClass} 
                    title="clud sync disabled">cloud_off</span>
            case SyncStatuses.Idle:
                return <span 
                    className={baseClass} 
                    onClick={refresh} 
                    title="synchronize">sync</span>    
            case SyncStatuses.InProgress:
                return <span className={inProgresClass}>sync</span>   
            case SyncStatuses.Success:
                return <span 
                    className={noHoverClass} 
                    title="synchronized">cloud_done</span>               
            case SyncStatuses.Failure:
                return <span 
                    className={failureClass} 
                    title="sync failed">sync_problem</span>            
            default:
                return <span 
                    className={noHoverClass} 
                    title="clud sync disabled">cloud_off</span>
        }
    } 

    return (
        <div className='sync-status'>
            {getStatusElement(status)}
        </div>
    )
}

export default SyncStatus
