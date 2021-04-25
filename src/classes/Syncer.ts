import { SyncStatuses } from '../components/Statuses/SyncStatus';
import DropboxConnector from './DropboxConnector';
import { reload, store } from './Store'
import * as lsUtils from "../utils/localStorageUtils"
import * as taskService from '../utils/taskService'
import metaLocal, { Metadata } from './Metadata'

const SYNC_INTERVAL_IN_MINUTES = 10

export interface ICloudConnector {
    syncTarget: SyncTargets
    authorize: () => any
    check: () => any
    downloadItems: (names: string[]) => Promise<any[]>
    uploadItems: (files: string[][]) => Promise<void>
    deleteItems: (names: string[]) => Promise<void>
    downloadMetadata: () => Promise<string>
    uploadMetadata: (metadata: string) => void
}

export enum SyncTargets {
    Dropbox = 'DROPBOX',
    Disabled = 'DISABLED'
}

class Syncer {
    private cloudConnector: ICloudConnector | null = null
    private isSyncFaild: boolean = false
    private interval: any = null

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
            await this.sync()
            this.interval = setInterval(this.sync.bind(this), 60000 * SYNC_INTERVAL_IN_MINUTES)
        }
    }

    async sync() {
        if (store.syncStatus === SyncStatuses.InProgress) return

        this.isSyncFaild = false
        store.syncStatus = SyncStatuses.InProgress

        try {
            const metaRemote = await this.fetchRemoteMeta()
            await this.syncChanges(metaLocal, metaRemote)
        } catch (e) {
            console.error(e);
            this.isSyncFaild = true
        }

        store.syncStatus = this.isSyncFaild
            ? SyncStatuses.Failure
            : SyncStatuses.Idle
    }

    private async check(): Promise<boolean> {
        try {
            await this.cloudConnector!.check()
        } catch(e) {
            if (e.message.toLowerCase().includes('not_configured')) {
                store.syncStatus = SyncStatuses.NotConfigured
                return false
            } else {
                store.syncStatus = SyncStatuses.Failure
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

    private async fetchRemoteMeta(): Promise<Metadata> {
        const taskListStr = await this.cloudConnector?.downloadMetadata() || '{}'
        const taskList = JSON.parse(taskListStr)
        return new Metadata(taskList)
    }

    private uploadRemoteMeta(metadata: Metadata) {
        const taskListStr = JSON.stringify(metadata.taskList)
        this.cloudConnector?.uploadMetadata(taskListStr)
    }

    private processChanges = (local: Metadata, remote: Metadata) => {
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

    private syncChanges = async (local: Metadata, remote: Metadata) => {
        this.processChanges(local, remote)

        const toDownload = remote.created.concat(remote.updated)
        const toUpload = local.created.concat(local.updated)
        const toDeleteLocal = remote.deleted
        const toDeleteRemote = local.deleted
    
        const needToUpdateRemote = toUpload.length || toDeleteRemote.length
        const needToUpdateLocal = toDownload.length || toDeleteLocal.length

        const items = await this.cloudConnector?.downloadItems(toDownload)
        items?.forEach((it) => taskService.createTask(it))
 
        const filesToUpload = toUpload.map((it) => {
            const fileContent = localStorage.getItem(it) || ''
            return [fileContent, it]
        })
        await this.cloudConnector?.uploadItems(filesToUpload)

        await this.cloudConnector?.deleteItems(toDeleteRemote)

        toDeleteLocal.forEach((it) => taskService.deleteTask(it))
    
        local.reset()
        local.save()

        needToUpdateLocal && reload()

        needToUpdateRemote && this.uploadRemoteMeta(metaLocal)
      }
}

const syncer = new Syncer()

export default syncer
