import syncer from '../../classes/Syncer'
import './SyncStatus.scss'
import { 
    MdSyncProblem,
    MdSyncDisabled,
    MdSync
} from 'react-icons/md'
import { usePropertyWithState } from '../../classes/Store2'

export enum SyncStatuses {
    NotConfigured = 'NOT_CONFIGURED',
    Idle = 'IDLE',
    InProgress = 'IN_PROGRESS',
    Failure = 'FAILURE'
}

const SyncStatus = () => {
    const [ status ] = usePropertyWithState('syncStatus')

    const refresh = () => syncer.sync()

    const baseClass = 'material-icons-outlined common-btn'
    const noHoverClass = baseClass + ' no-hover'
    const inProgresClass = noHoverClass + ' syncing'
    const failureClass = baseClass + ' failure'

    const getStatusElement = (status?: SyncStatuses) => {
        switch (status) {
            case SyncStatuses.NotConfigured:
                return <MdSyncDisabled 
                            className={noHoverClass}
                            title="cloud sync disabled"
                        />  
            case SyncStatuses.Idle:
                return <MdSync 
                            className={baseClass}
                            onClick={refresh}
                            title="synchronize"
                        />     
            case SyncStatuses.InProgress:
                return <MdSync 
                            className={inProgresClass}
                            onClick={refresh}
                            title="synchronizing"
                        />                
            case SyncStatuses.Failure:
                return <MdSyncProblem 
                            className={failureClass}
                            onClick={refresh}
                            title="sync failed"
                        />            
            default:
                 return <MdSyncDisabled 
                            className={noHoverClass}
                            title="cloud sync disabled"
                        />   
        }
    } 

    return (
        <div className='sync-status'>
            {getStatusElement(status)}
        </div>
    )
}

export default SyncStatus
