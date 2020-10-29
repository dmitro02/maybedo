import { getExportFileNameJson } from './../components/Settings/ExportImport';
import { Task } from './../types';
import { TOKEN } from '../localConfig'
import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'
import { convertDataToJson } from '../components/Settings/ExportImport';

const dbx = new Dropbox({ accessToken: TOKEN, fetch })

const getSortedExports = async () => {
    const response: any = await dbx.filesListFolder({ path: '' })
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

const getLatestExport = async () => {
    const sortedExports = await getSortedExports()
    const path = sortedExports.pop().path_lower
    const response: any = await dbx.filesDownload({ path })
    return response.result
} 

const readFile = (blob: Blob) => new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = () => resolve(fr.result)
    fr.readAsText(blob)
})

export const downloadFromDropBox = async () => {
    const latestExport = await getLatestExport()
    const latestExportJson = await readFile(latestExport.fileBlob)
    return JSON.parse(latestExportJson as string)
} 

export const uploadToDropBox = async (root: Task) => {
    const contents = convertDataToJson(root)
    const path = '/' + getExportFileNameJson()
    const res = await dbx.filesUpload({ contents, path })
    console.log(res)
}

