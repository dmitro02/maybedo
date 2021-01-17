import React from 'react'
import './SyncStatus.scss'

const SyncStatus = () => {

    const className = 'material-icons-outlined common-btn'

    return (
        <div>
            <span className={className}>cloud_done</span>
            <span className={className}>cloud_off</span>
            <span className={className}>sync</span>
            <span className={`${className} syncing`}>sync</span>
            <span className={className}>sync_problem</span>
        </div>
    )
}

export default SyncStatus
