import { SyncStatuses } from '../components/Statuses/SyncStatus';
import DropboxConnector from './DropboxConnector';
import { actions } from './Store'
import * as lsUtils from "../utils/localStorageUtils"
import * as taskService from '../utils/taskService'
import metaLocal, { Metadata } from './Metadata'

const SYNC_INTERVAL_IN_MINUTES = 500 

export type TaskList = {
    [key: string]: number
}

export interface ICloudConnector {
    syncTarget: SyncTargets
    authorize: () => any
    check: () => any
    downloadItems: (names: string[]) => Promise<any[]>
    uploadItems: (files: string[][]) => void
    deleteItems: (names: string[]) => void
    downloadTaskList: () => Promise<string>
    uploadTaskList: (metadata: string) => void
}

export enum SyncTargets {
    Dropbox = 'DROPBOX',
    Disabled = 'DISABLED'
}

export enum SyncSources {
    Local = 'LOCAL',
    Remote = 'REMOTE' 
}

class Syncer {
    private cloudConnector: ICloudConnector | null = null
    private isSyncFaild: boolean = false
    private interval: any = null

    public constructor() {
        this.sync = this.sync.bind(this)
    }

    async init(cloudConnector?: ICloudConnector) {
        if (cloudConnector) {
            this.cloudConnector = cloudConnector
            lsUtils.setSyncTarget(cloudConnector.syncTarget)
        } else {
            const syncTarget = lsUtils.getSyncTarget()
            if (syncTarget === SyncTargets.Disabled) {
                this.cloudConnector = null
            } else {
                this.cloudConnector = this.createCloudConnector(syncTarget)
            }
        }
        
        clearInterval(this.interval)

        const isConfigured = this.cloudConnector ? await this.check() : false        

        if (isConfigured) {
            // await this.sync()
            this.interval = setInterval(this.sync, 60000 * SYNC_INTERVAL_IN_MINUTES)
        }
    }

    sync() {
        this.isSyncFaild = false

        actions.setSyncStatus(SyncStatuses.InProgress)

        const metaRemote = new Metadata()

        this.syncChanges(metaLocal, metaRemote)
    
        this.setSyncResultStatus()
    }

    private async check(): Promise<boolean> {
        try {
            await this.cloudConnector!.check()
        } catch(e) {
            if (e.message.toLowerCase().includes('not_configured')) {
                actions.setSyncStatus(SyncStatuses.NotConfigured)
                return false
            } else {
                actions.setSyncStatus(SyncStatuses.Failure)
                return true
            }
        }
        return true
    }

    private createCloudConnector(syncTarget?: SyncTargets) {
        switch (syncTarget) {
            case SyncTargets.Dropbox:
                return new DropboxConnector()
            default:
                return null
        }
    }

    private setSyncResultStatus() {
        if (this.isSyncFaild) {
            actions.setSyncStatus(SyncStatuses.Failure)
        } else {
            actions.setSyncStatus(SyncStatuses.Idle)
        }
    }

    processChanges = (local: Metadata, remote: Metadata) => {
        const localList = local.taskList
        const remoteList = remote.taskList

        if (!Object.keys(remoteList).length) {
            local.created = Object.keys(localList)
            local.deleted = []
            return
        }
      
        local.created.forEach((it) => { remoteList[it] = localList[it] })
        local.deleted.forEach((it) => { remote.removeFromTaskList(it) })

        Object.keys(localList).forEach((it) => {
            if (!remoteList.hasOwnProperty(it)) {
                remote.addToDeleted(it)
                return
            }
      
            const remoteUpdatedAt = remoteList[it].u
            const localUpdatedAt =  localList[it].u
            if (remoteUpdatedAt > localUpdatedAt) {
                remote.addToUpdated(it)
            } else if (remoteUpdatedAt < localUpdatedAt) {
                local.addToUpdated(it)
            }
        })
      
        Object.keys(remoteList).forEach((it) => {
            if (!localList.hasOwnProperty(it)) {
                remote.addToCreated(it)
            }
        })
    }

    syncChanges = async (local: Metadata, remote: Metadata) => {
        this.processChanges(local, remote)

        const toDownload = remote.created.concat(remote.updated)
        const toUpload = local.created.concat(local.updated)
        const toDeleteLocal = remote.deleted
        const toDeleteRemote = local.deleted
    
        const items = await this.cloudConnector?.downloadItems(toDownload)
        items?.forEach((it) => taskService.createTask(JSON.parse(it)))
 
        const filesToUpload = toUpload.map((it) => {
            const fileContent = localStorage.getItem(it) || ''
            return [fileContent, it]
        })
        // this.cloudConnector?.uploadItems(filesToUpload)

        this.cloudConnector?.deleteItems(toDeleteRemote)

        toDeleteLocal.forEach((it) => taskService.deleteTask(it))
    
        local.reset()
        local.save()

        console.log('upload new remote meta', local.taskList)
      }
}

const syncer = new Syncer()

export default syncer
