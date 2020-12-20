import { getExportFileNameJson } from './../components/Settings/ExportImport';
import { Task } from './../types';
import { Dropbox } from 'dropbox'
import fetch from 'isomorphic-fetch'
import { convertDataToJson } from '../components/Settings/ExportImport';
import { nanoid } from 'nanoid'

const CLIENT_ID = 'lxn28fv9hhsn7id' 
const AUTH_URL = 'https://www.dropbox.com/oauth2/authorize'
const GET_TOKEN_URL = 'https://api.dropbox.com/oauth2/token'
const DROPBOX_ACCESS_TOKEN_LS_ITEM_NAME = 'dropboxAccessToken'

const saveAccessTokenToLS = (accessToken: string) => {
    localStorage.setItem(DROPBOX_ACCESS_TOKEN_LS_ITEM_NAME, accessToken)
}

const getAccessTokenFromLS = () => {
    return localStorage.getItem(DROPBOX_ACCESS_TOKEN_LS_ITEM_NAME) || ''
}

const getSortedExports = async () => {
    const dbx = new Dropbox({ accessToken: getAccessTokenFromLS(), fetch })
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
    const dbx = new Dropbox({ accessToken: getAccessTokenFromLS(), fetch })
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
    console.log(JSON.parse(latestExportJson as string))
    return JSON.parse(latestExportJson as string)
} 

export const uploadToDropBox = async (root: Task) => {
    const dbx = new Dropbox({ accessToken: getAccessTokenFromLS(), fetch })
    const contents = convertDataToJson(root)
    const path = '/' + getExportFileNameJson()
    const res = await dbx.filesUpload({ contents, path })
    console.log(res)
}

export const generateCodeVerifier = () => {
    return nanoid(43)
}

export const getDropboxAuthUrl = (codeVerifier: string) => {
    return `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&code_challenge_method=plain&code_challenge=${codeVerifier}`
}

const getAccessToken = async (authorizationCode: string, codeVerifier: string) => {
    const body = new URLSearchParams({
        code: authorizationCode,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code_verifier: codeVerifier
    })

    const response = await fetch(GET_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body
    })

    const resData = await response.json()

    return resData.access_token
}

export const getAndSaveAccessToken = async (authToken: string|undefined, codeVerifier: string) => {
    // TODO: display failure/success banners
    if (!authToken) return
    const accessToken = await getAccessToken(authToken, codeVerifier)
    saveAccessTokenToLS(accessToken)
}
