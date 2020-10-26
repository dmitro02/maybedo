import React, { useRef } from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { 
    setAppData, 
    setModal, 
    setBanner 
} from '../../contexts/actionCreators'
import { 
    BannerTypes, 
    IBanner, 
    IModal, 
    Task, 
    ExportedData 
} from '../../types'

enum DataTypes {
    JSON = 'json',
    HTML = 'html'
}

type Props = {
    backToTaskList(): void
}

const ExportImport = (props: Props) => {
    const [ store, dispatch ] = useTasksContext()

    const { rootProject } = store

    const { backToTaskList } = props

    const fileInputRef = useRef<HTMLInputElement>(null)

    let dataType = DataTypes.JSON

    const exportData = () => {
        switch (dataType) {
            case DataTypes.JSON:
                exportDataAsJson(rootProject)
                break
            case DataTypes.HTML:
                exportDataAsHtml(rootProject)
                break
            default:
                exportDataAsJson(rootProject)
        }
    }

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        reader.onload = () => {
            const modal: IModal = {
                text: 'Do you want to overwrite existing data?',
                okAction: () => doImport(reader),
                cancelAction: () => clearFileInput()
            }
            dispatch(setModal(modal))
        };
        const files = e.target.files
        files && reader.readAsText(files[0])
    }

    const doImport = (reader: FileReader) => {
        clearFileInput()
        let dataToImport
        try {
            dataToImport = JSON.parse(reader.result as string)
        } catch(err) {
            const banner: IBanner = {
                text: 'Failed to parse JSON file',
                type: BannerTypes.Failure
            }
            dispatch(setBanner(banner))
            return
        }
        if (!validateExportedData(dataToImport)) {
            const banner: IBanner = {
                text: 'Some required fields are missing',
                type: BannerTypes.Failure
            }
            dispatch(setBanner(banner))
            return
        }
        dispatch(setAppData(dataToImport))
        backToTaskList()
        const banner: IBanner = {
            text: 'Data successfully imported',
            type: BannerTypes.Success,
            delay: 5
        }
        dispatch(setBanner(banner))
    }

    const clickOnFileInput = () => {
        const node = fileInputRef.current!
        node.click()
    }

    const clearFileInput = () => {
        const node = fileInputRef.current!
        node.value = ''
    }

    const setDataType = (e: any) => {
        dataType = e.target.value
    }

    return (
        <div className="export-import">
            <h2>Import/Export your data</h2>
            <button className="export-btn" onClick={exportData}>Export</button>
            <span className="words-between">as</span>
            <select className="data-types-select" onChange={setDataType}>
                <option value={DataTypes.JSON}>{DataTypes.JSON.toUpperCase()}</option>
                <option value={DataTypes.HTML}>{DataTypes.HTML.toUpperCase()}</option>
            </select>
            <button className="import-btn" onClick={clickOnFileInput}>Import JSON</button>
            <input 
                className="input-hidden" 
                type="file" 
                accept=".json" 
                onChange={importData} 
                ref={fileInputRef} 
            />
        </div>
    )
}

const doExport = (data: string, type: DataTypes) => {
    const dataToExport = `data:text/${type};charset=utf-8,${data}`
    const encodedUri = encodeURI(dataToExport)
    const timestamp = new Date().toISOString()
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `todolist_export_${timestamp}.${type}`);
    link.click();
}

const exportDataAsJson = (root: Task) => {
    doExport(convertDataToJson(root), DataTypes.JSON)
}

export const convertDataToJson = (root: Task) => {
    const excludeKeys = [
        'path',
        'selectedSubTaskPath'
    ]
    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value
    const data = { 
        timestamp: Date.now(),
        tasklist: root
     }
    return JSON.stringify(data, replacer, 2)
}

const convertDataToHtml = (root: Task): string => {
    const textDecoration = root.isDone 
        ? 'style="text-decoration: line-through"' : ''
    const subtasks = root.tasks.length 
        ? `<ul>${root.tasks.map(task => convertDataToHtml(task))}</ul>` : ''
    const item = `<li ${textDecoration}>${root.text + subtasks}</li>` 
    return item.replace(/>,</g, '><')
}

const exportDataAsHtml = (root: Task) => {
    const content = convertDataToHtml(root)
    const styles = 'body { font-family: sans-serif; font-size: 16px; } ul, li { margin-top: 6px }'
    const data = `<html><head><style>${styles}</style></head><body>${content}</body></html>`
    doExport(data, DataTypes.HTML)
}

export const isExportedData = (data: any): data is ExportedData => {
    if (!data) return false
    const dataToValidate = data as ExportedData
    return dataToValidate.timestamp !== undefined
            && dataToValidate.tasklist !== undefined 
}

const isTask = (data: any): data is Task => {
    const dataToValidate = data as Task
    return dataToValidate.text !== undefined 
            && dataToValidate.isDone !== undefined 
            && dataToValidate.tasks !== undefined
}

const validateTaks = (data: any): boolean => {
    if (!isTask(data)) return false
    for (let task of data.tasks) {
        if(!validateTaks(task)) return false;
    }
    return true
} 

export const validateExportedData = (data: any): boolean => {
    if (!isExportedData(data)) return false
    return validateTaks(data.tasklist)
} 

export default ExportImport
