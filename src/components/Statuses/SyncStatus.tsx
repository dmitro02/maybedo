import React from 'react'
import Syncer from '../../utils/Syncer'
import './SyncStatus.scss'

export enum SyncStatuses {
    NotConfigured = 'NOT_CONFIGURED',
    Idle = 'IDLE',
    InProgress = 'IN_PROGRESS',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

type Props = {
    status: SyncStatuses | undefined
}

const SyncStatus = ({ status }: Props) => {
    const refresh = () => {
        Syncer.getInstance().onDemandCloud()
    }

    const baseClass = 'material-icons-outlined common-btn'
    const noHoverClass = baseClass + ' no-hover'
    const inProgresClass = noHoverClass + ' syncing'
    const failureClass = baseClass + ' failure'

    const getStatusElement = (status?: SyncStatuses) => {
        switch (status) {
            case SyncStatuses.NotConfigured:
                return <span className={noHoverClass}>cloud_off</span>
            case SyncStatuses.Idle:
                return <span className={baseClass} onClick={refresh}>sync</span>    
            case SyncStatuses.InProgress:
                return <span className={inProgresClass}>sync</span>   
            case SyncStatuses.Success:
                return <span className={noHoverClass}>cloud_done</span>               
            case SyncStatuses.Failure:
                return <span className={failureClass}>sync_problem</span>            
            default:
                return <span className={noHoverClass}>cloud_off</span>
        }
    } 

    return (
        <div className='sync-status'>
            {getStatusElement(status)}
        </div>
    )
}

export default SyncStatus
