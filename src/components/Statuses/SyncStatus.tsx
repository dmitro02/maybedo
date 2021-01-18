import React from 'react'
import './SyncStatus.scss'

export enum SyncStatuses {
    NotConfigured = 'NOT_CONFIGURED',
    InProgress = 'IN_PROGRESS',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

type Props = {
    status: SyncStatuses | undefined
}

const SyncStatus = ({ status }: Props) => {
    const className = 'material-icons-outlined common-btn'

    const getStatusElement = (status?: SyncStatuses) => {
        switch (status) {
            case SyncStatuses.NotConfigured:
                return <span className={className}>cloud_off</span>
            case SyncStatuses.InProgress:
                return <span className={`${className} syncing`}>sync</span>   
            case SyncStatuses.Success:
                return <span className={className}>sync</span>               
            case SyncStatuses.Failure:
                return <span className={className}>sync_problem</span>            
            default:
                return <span className={className}>cloud_off</span>
        }
    } 

    return (
        <div>
            {getStatusElement(status)}
        </div>
    )
}

export default SyncStatus
