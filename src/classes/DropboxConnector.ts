import { readFile } from '../utils/commonUtils';
import { 
    Metadata, 
    ICloudConnector, 
    SyncTargets 
} from './Syncer';
import DropboxClient from './DropboxClient'

const CLIENT_ID = 'lxn28fv9hhsn7id'

const DATA_FOLDER_PATH = '/data'
const METADATA_FILE_PATH = '/metadata.json'
const MAX_EXPORTS_NUMBER_TO_KEEP = 10

export default class DropboxConnector implements ICloudConnector {
    private dropboxClient: DropboxClient

    syncTarget = SyncTargets.Dropbox

    constructor() {
        this.dropboxClient = new DropboxClient(CLIENT_ID)
    }

    get authUrl(): string {
        return this.dropboxClient.authUrl
    }

    get isConfigured(): boolean {
        return this.dropboxClient.isConfigured
    }

    async authorize(authorizationCode?: string)  {
        await this.dropboxClient.authorize(authorizationCode)
    }

    async check() {
        await this.dropboxClient.check()
    }

    async uploadData(metadata: Metadata, taskList: string) {
        await this.uploadMetadata(metadata)
        await this.uploadTaskList(taskList)
    }

    async downloadMetadata(): Promise<Metadata> {        
        try {
            const response: any = await this.dropboxClient.downloadFile(METADATA_FILE_PATH)
            const fileContent = await readFile(response.result.fileBlob)
            return JSON.parse(fileContent as string)
        } catch(e) {
            return new Metadata()
        }
    }

    async uploadMetadata(metadata: Metadata) {
        const contents = JSON.stringify(metadata)
        await this.dropboxClient.uploadFile(contents, METADATA_FILE_PATH)
    }

    async downloadTaskList(): Promise<string | null> {
        try {
            const latestExport = await this.getLatestExport()
            const latestExportJson = await readFile(latestExport.fileBlob)
            return latestExportJson as string           
        } catch(e) {
            console.error(e)
            return null
        }
    } 
    
    async uploadTaskList(taskList: string) {
        if (!taskList) return

        const path = `${DATA_FOLDER_PATH}/tasklist_${new Date().toISOString()}.json`
        await this.dropboxClient.uploadFile(taskList, path)

        await this.deleteOldestExports()
    }

    private async getSortedExports(): Promise<any[]> {
        const response: any = await this.dropboxClient.listFolder(DATA_FOLDER_PATH)
        return response.result.entries.sort((a: any, b: any) => {
            const clientModifiedA = new Date(a.client_modified)
            const clientModifiedB = new Date(b.client_modified)
            if (clientModifiedA < clientModifiedB)
                return -1
            if (clientModifiedA > clientModifiedB)
                return 1
            return 0
        })
    }

    private async getLatestExport() {
        const sortedExports = await this.getSortedExports()
        const path = sortedExports.pop().path_lower
        const response: any = await this.dropboxClient.downloadFile(path)
        return response.result
    }

    private async deleteOldestExports() {
        const sortedExports = await this.getSortedExports()

        for (let i = 0; i < sortedExports.length - MAX_EXPORTS_NUMBER_TO_KEEP; i++) {            
            await this.dropboxClient.deleteFile(sortedExports[i].path_lower)
        }
    }

    async getItemList() {
        const response: any = await this.dropboxClient.listFolder(DATA_FOLDER_PATH)

        return response.result.entries
    } 
}
