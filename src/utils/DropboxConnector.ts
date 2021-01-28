import { SyncTargets } from './Syncer';
import { ICloudConnector } from './../types';
import DropboxClient from './DropboxClient'
import { Metadata } from '../types';

const CLIENT_ID = 'lxn28fv9hhsn7id'

const DATA_FOLDER_PATH = '/data'
const METADATA_FILE_PATH = '/metadata.json'
const MAX_EXPORTS_NUMBER_TO_KEEP = 10

export default class DropboxConnector implements ICloudConnector {
    private dropboxCon: DropboxClient

    syncTarget = SyncTargets.Dropbox

    constructor() {
        this.dropboxCon = new DropboxClient(CLIENT_ID)
    }

    get authUrl(): string {
        return this.dropboxCon.authUrl
    }

    get isConfigured(): boolean {
        return this.dropboxCon.isConfigured
    }

    async authorize(authorizationCode?: string)  {
        await this.dropboxCon.authorize(authorizationCode)
    }

    async check() {
        await this.dropboxCon.check()
    }

    async uploadData(metadata: Metadata, taskList: string) {
        await this.uploadMetadata(metadata)
        await this.uploadTaskList(taskList)
    }

    async downloadMetadata(): Promise<Metadata> {        
        try {
            const response: any = await this.dropboxCon.downloadFile(METADATA_FILE_PATH)
            const fileContent = await this.readFile(response.result.fileBlob)
            return JSON.parse(fileContent as string)
        } catch(e) {
            return new Metadata()
        }
    }

    async uploadMetadata(metadata: Metadata) {
        const contents = JSON.stringify(metadata)
        await this.dropboxCon.uploadFile(contents, METADATA_FILE_PATH)
    }

    async downloadTaskList(): Promise<string | null> {
        try {
            const latestExport = await this.getLatestExport()
            const latestExportJson = await this.readFile(latestExport.fileBlob)
            return latestExportJson as string           
        } catch(e) {
            console.error(e)
            return null
        }
    } 
    
    async uploadTaskList(taskList: string) {
        if (!taskList) return

        const path = `${DATA_FOLDER_PATH}/tasklist_${new Date().toISOString()}.json`
        await this.dropboxCon.uploadFile(taskList, path)

        await this.deleteOldestExports()
    }

    private async getSortedExports(): Promise<any[]> {
        const response: any = await this.dropboxCon.listFolder(DATA_FOLDER_PATH)
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
        const response: any = await this.dropboxCon.downloadFile(path)
        return response.result
    }

    private async deleteOldestExports() {
        const sortedExports = await this.getSortedExports()

        for (let i = 0; i < sortedExports.length - MAX_EXPORTS_NUMBER_TO_KEEP; i++) {            
            await this.dropboxCon.deleteFile(sortedExports[i].path_lower)
        }
    }

    private readFile(blob: Blob) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onerror = reject
            fr.onload = () => resolve(fr.result)
            fr.readAsText(blob)
        })
    }
}
