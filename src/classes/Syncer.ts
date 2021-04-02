import { SyncStatuses } from '../components/Statuses/SyncStatus';
import DropboxConnector from './DropboxConnector';
import * as lsUtils from "../utils/localStorageUtils"
import taskStore, { actions } from './Store'

const SYNC_INTERVAL_IN_MINUTES = 5 

export class Metadata {
    updatedAt: number | undefined

    constructor(updatedAt?: number) {
        this.updatedAt = updatedAt
    }
}

export interface ICloudConnector {
    syncTarget: SyncTargets
    authorize: () => any
    check: () => any
    downloadMetadata: () => Promise<Metadata>
    downloadTaskList: () => Promise<string | null>
    uploadData: (metadata: Metadata, taskList: string) => any
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

    async initSync(source?: SyncSources, cloudConnector?: ICloudConnector) {
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
            source
                ? await this.forceUpdateFromSource(source)
                : await this.sync()

            this.interval = setInterval(this.sync, 60000 * SYNC_INTERVAL_IN_MINUTES)
        }
    }

    async sync() {
        this.isSyncFaild = false
        actions.setSyncStatus(SyncStatuses.InProgress)
    
        const cloudUpdatedAt = await this.getCloudUpdatedAt()
        const lsUpdatedAt = lsUtils.getUpdatedAt()
        
        if (cloudUpdatedAt > lsUpdatedAt) {
            const taskList = await this.getCloudTaskList()
    
            lsUtils.saveToLocalStorage(cloudUpdatedAt, taskList)
            this.loadToStore(cloudUpdatedAt, taskList)
        } else if (cloudUpdatedAt < lsUpdatedAt) {
            const taskList = lsUtils.getTaskList()
    
            if (taskList) {
                await this.setCloudData({ updatedAt: lsUpdatedAt }, taskList)
            }
        }
        this.setSyncResultStatus()
    }

    private async forceUpdateFromSource(source: SyncSources) {
        this.isSyncFaild = false
        actions.setSyncStatus(SyncStatuses.InProgress)
        
        if (source === SyncSources.Remote) {
            const updatedAt = await this.getCloudUpdatedAt()
            const taskList = await this.getCloudTaskList()
            lsUtils.saveToLocalStorage(updatedAt, taskList)
            this.loadToStore(updatedAt, taskList)
        } else {
            const updatedAt = lsUtils.getUpdatedAt()
            const taskList = lsUtils.getTaskList()
            await this.setCloudData({ updatedAt }, taskList)
        }
        this.setSyncResultStatus()
    }

    private loadToStore(updatedAt: number, taskList: string | null) {        
        if (!taskList) return
        taskStore.setData(taskList, updatedAt)
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

    private async getCloudUpdatedAt(): Promise<number> {
        try {
            const cloudMetadata = await this.cloudConnector!.downloadMetadata()
            return cloudMetadata?.updatedAt || 0
        } catch {
            this.isSyncFaild = true
            return 0
        }
    }

    private async getCloudTaskList(): Promise<string | null> {
        try {
            return await this.cloudConnector!.downloadTaskList()
        } catch {
            this.isSyncFaild = true
            return null
        }
    }

    private async setCloudData(metadata: Metadata, taskList: string | null) {
        try {
            taskList && await this.cloudConnector!.uploadData(metadata, taskList)
        } catch {
            this.isSyncFaild = true            
        }
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
}

const syncer = new Syncer()

export default syncer
