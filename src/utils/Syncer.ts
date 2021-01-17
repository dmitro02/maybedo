import { 
    Task, 
    ICloudConnector, 
    IActions 
} from './../types';
import DropboxConnector from "./DropboxConnector"
import LsConnector from "./LsConnector"

export default class Syncer {
    private cloudConnector: ICloudConnector
    private actions: IActions

    constructor(actions: IActions, cloudConnector?: ICloudConnector) {
        this.cloudConnector = cloudConnector || new DropboxConnector()
        this.actions = actions
    }

    async onLoad() {
        const lsUpdatedAt = LsConnector.getLsUpdatedAt()
        const cloudUpdatedAt = await this.getCloudUpdatedAt()
                
        if (cloudUpdatedAt > lsUpdatedAt) {
            const taskList = await this.cloudConnector.downloadTaskList()
   
            LsConnector.saveToLocalStorage(cloudUpdatedAt, taskList)
            this.loadToStore(cloudUpdatedAt, taskList)
        } else if (cloudUpdatedAt < lsUpdatedAt) {
            const taskList = LsConnector.getLsTaskList()

            this.loadToStore(lsUpdatedAt, taskList)
            await this.cloudConnector.uploadData({ updatedAt: lsUpdatedAt }, taskList)
        } else if (cloudUpdatedAt === lsUpdatedAt) {
            const taskList = LsConnector.getLsTaskList()

            this.loadToStore(lsUpdatedAt, taskList)
        } else {
            this.saveToLS()
        }
    }

    async onDemand() {
        this.saveToLS()
        
        const lsUpdatedAt = LsConnector.getLsUpdatedAt()
        const cloudUpdatedAt = await this.getCloudUpdatedAt()     
        
        if (cloudUpdatedAt > lsUpdatedAt) {
            const taskList = await this.cloudConnector.downloadTaskList()

            LsConnector.saveToLocalStorage(cloudUpdatedAt, taskList)
            this.loadToStore(cloudUpdatedAt, taskList)
        } else if (cloudUpdatedAt < lsUpdatedAt) {
            const taskList = LsConnector.getLsTaskList()

            await this.cloudConnector.uploadData({ updatedAt: lsUpdatedAt }, taskList)
        }
    }

    saveToLS() {        
        this.actions.saveToLocalStorage()
    }

    loadToStore(updatedAt: number, taskList: Task | null) {
        console.log('taskList', taskList);
        
        if (!taskList) return
        this.actions.setAppData({ taskList, updatedAt })
    }

    private async getCloudUpdatedAt() {
        const cloudMetadata = await this.cloudConnector.downloadMetadata()
        return cloudMetadata?.updatedAt || 0
    }
}
