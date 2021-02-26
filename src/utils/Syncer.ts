import { SyncStatuses } from '../components/Statuses/SyncStatus';
import { 
    ICloudConnector, 
    IActions, 
    Metadata
} from './../types';
import DropboxConnector from './DropboxConnector';
import * as lsUtils from "./localStorageUtils"
import taskStore from './Store'

const SYNC_INTERVAL_IN_MINUTES = 5 

export enum SyncTargets {
    Dropbox = 'DROPBOX',
    Disabled = 'DISABLED'
}

export enum SyncSources {
    Local = 'LOCAL',
    Remote = 'REMOTE' 
}

export default class Syncer {
    private static instance: Syncer;

    private cloudConnector: ICloudConnector | null = null
    private actions: IActions
    private isSyncFaild: boolean = false
    private interval: any = null

    private constructor(actions: IActions) {
        this.actions = actions
        this.onDemandCloud = this.onDemandCloud.bind(this)
        this.onDemandLocal = this.onDemandLocal.bind(this)
    }

    public static getInstance(actions?: IActions): Syncer {
        if (!actions) return Syncer.instance;

        if (!Syncer.instance) {
            Syncer.instance = new Syncer(actions);
        }
        return Syncer.instance;
    }

    async initSync(source?: SyncSources, cloudConnector?: ICloudConnector) {
        this.actions.setLoading(true)

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
        
        this.resetSync()

        const isConfigured = this.cloudConnector ? await this.check() : false        

        if (isConfigured) {
            if (source) {
                await this.forceUpdateFromSource(source)
            } else {
                await this.onLoadCloud()
            }
            this.interval = setInterval(this.onDemandCloud, 60000 * SYNC_INTERVAL_IN_MINUTES)
        } else {
            this.onLoadLocal()
            this.interval = setInterval(this.onDemandLocal, 60000 * SYNC_INTERVAL_IN_MINUTES)
        }

        this.addGlobalEventListeners()

        this.actions.setLoading(false)
    }

    private resetSync() {
        clearInterval(this.interval)
        this.removeGlobalEventListeners()
    }

    private addGlobalEventListeners() {
        window.addEventListener('unload', this.onDemandLocal)
        window.addEventListener('blur', this.onDemandLocal)
    }

    private removeGlobalEventListeners() {
        window.removeEventListener('unload', this.onDemandLocal)
        window.removeEventListener('blur', this.onDemandLocal) 
    }

    private async onLoadCloud() {
        this.isSyncFaild = false
        this.actions.setSyncStatus(SyncStatuses.InProgress)

        const cloudUpdatedAt = await this.getCloudUpdatedAt()
        const lsUpdatedAt = lsUtils.getLsUpdatedAt()
        
        if (cloudUpdatedAt > lsUpdatedAt) {
            const taskList = await this.getCloudTaskList()
   
            lsUtils.saveToLocalStorage(cloudUpdatedAt, taskList)
            this.loadToStore(cloudUpdatedAt, taskList)
        } else if (cloudUpdatedAt < lsUpdatedAt) {
            const taskList = lsUtils.getLsTaskList()

            if (taskList) {
                this.loadToStore(lsUpdatedAt, taskList)
                await this.setCloudData({ updatedAt: lsUpdatedAt }, taskList)
            }
        } else if (cloudUpdatedAt === lsUpdatedAt) {
            const taskList = lsUtils.getLsTaskList()

            this.loadToStore(lsUpdatedAt, taskList)
        } else {
            this.saveToLS()
        }

        this.setSyncResultStatus()
    }

    private async forceUpdateFromSource(source: SyncSources) {
        this.isSyncFaild = false
        this.actions.setSyncStatus(SyncStatuses.InProgress)        
        
        if (source === SyncSources.Remote) {
            const updatedAt = await this.getCloudUpdatedAt()
            const taskList = await this.getCloudTaskList()
            lsUtils.saveToLocalStorage(updatedAt, taskList)
            this.loadToStore(updatedAt, taskList)
        } else {
            this.saveToLS()
            const updatedAt = lsUtils.getLsUpdatedAt()
            const taskList = lsUtils.getLsTaskList()
            await this.setCloudData({ updatedAt }, taskList)
        }

        this.setSyncResultStatus()
    }

    private onLoadLocal() {
        const lsUpdatedAt = lsUtils.getLsUpdatedAt()

        if (lsUpdatedAt) {
            const taskList = lsUtils.getLsTaskList()
            this.loadToStore(lsUpdatedAt, taskList)
        } else {
            this.saveToLS()
        }
    }

    async onDemandCloud() {
        this.isSyncFaild = false
        this.actions.setSyncStatus(SyncStatuses.InProgress)

        this.saveToLS()
        
        const cloudUpdatedAt = await this.getCloudUpdatedAt()
        const lsUpdatedAt = lsUtils.getLsUpdatedAt()     
        
        if (cloudUpdatedAt > lsUpdatedAt) {
            const taskList = await this.getCloudTaskList()

            lsUtils.saveToLocalStorage(cloudUpdatedAt, taskList)
            this.loadToStore(cloudUpdatedAt, taskList)
        } else if (cloudUpdatedAt < lsUpdatedAt) {
            const taskList = lsUtils.getLsTaskList()

            if (taskList) {
                await this.setCloudData({ updatedAt: lsUpdatedAt }, taskList)
            }
        }

        this.setSyncResultStatus()
    }

    private onDemandLocal() {
        this.saveToLS()
    }

    private saveToLS() {
        const { updatedAt, taskListJSON } = taskStore  
        lsUtils.saveToLocalStorage(updatedAt, taskListJSON)    
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
                this.actions.setSyncStatus(SyncStatuses.NotConfigured)
                return false
            } else {
                this.actions.setSyncStatus(SyncStatuses.Failure)
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
            this.actions.setSyncStatus(SyncStatuses.Failure)
        } else {
            this.actions.setSyncStatus(SyncStatuses.Success)
            setTimeout(() => this.actions.setSyncStatus(SyncStatuses.Idle), 3000)
        }
    }
}
