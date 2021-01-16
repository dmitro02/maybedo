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
    Task
} from '../../types'
import { 
    convertDataToHtmlString,
    convertDataToJsonString, 
    DataTypes, 
    getExportFileName,
    validateExportedData
} from '../../utils/persistDataUtils'

type Props = {
    backToTaskList(): void
}

const ExportImport = (props: Props) => {
    const [ store, dispatch ] = useTasksContext()

    const { taskList } = store

    const { backToTaskList } = props

    const fileInputRef = useRef<HTMLInputElement>(null)

    let dataType = DataTypes.JSON

    const exportData = () => {
        switch (dataType) {
            case DataTypes.JSON:
                exportDataAsJson(taskList)
                break
            case DataTypes.HTML:
                exportDataAsHtml(taskList)
                break
            default:
                exportDataAsJson(taskList)
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
        <div className="settings-block">
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
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', getExportFileName(type));
    link.click();
}

const exportDataAsJson = (root: Task) => {
    doExport(convertDataToJsonString(root), DataTypes.JSON)
}

const exportDataAsHtml = (root: Task) => {
    const content = convertDataToHtmlString(root)
    const styles = 'body { font-family: sans-serif; font-size: 16px; } ul, li { margin-top: 6px }'
    const data = `<html><head><style>${styles}</style></head><body>${content}</body></html>`
    doExport(data, DataTypes.HTML)
}

export default ExportImport
