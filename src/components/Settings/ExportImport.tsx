import { useRef, useState } from 'react'
import Task from '../../classes/Task'
import { FailureBanner, SuccessBanner } from '../Banner/Banner'
import { readFile } from '../../utils/commonUtils'
import { reload, store } from '../../classes/Store'
import Portal from '../../HOCs/Portal'
import ImportModal from './ImportModal'
import Button from '../Buttons/Button'
import { 
    createTasks, 
    getAllTasks, 
    getTasksTree 
} from '../../utils/taskService'

enum DataTypes {
    JSON = 'json',
    HTML = 'html'
}

type Props = {
    backToTaskList(): void
}

const ExportImport = (props: Props) => {
    const [ showModal, setShowModal ] = useState(false)

    const { backToTaskList } = props

    const fileInputRef = useRef<HTMLInputElement>(null)

    let dataType = DataTypes.JSON

    const exportData = () => {
        switch (dataType) {
            case DataTypes.JSON:
                exportDataAsJson()
                break
            case DataTypes.HTML:
                exportDataAsHtml()
                break
            default:
                exportDataAsJson()
        }
    }

    const doImport = async () => {
        let tasks: Task[] | null = null
        try {
            const files = fileInputRef.current?.files
            if (files) {
                const fileContent = await readFile(files[0])
                tasks = JSON.parse(fileContent)
                clearFileInput()
                setShowModal(false)
            }
        } catch(err) {
            setShowModal(false)
            store.banner = new FailureBanner('Failed to parse JSON file')
            clearFileInput()
            return
        }
        if (!tasks) {
            store.banner = new FailureBanner('No exported tasks found')
            return
        }
        
        createTasks(tasks)
        backToTaskList()
        reload()
        
        store.banner = new SuccessBanner('Data successfully imported', 5)
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

    const onModalConfirm = () => {
        doImport()
    }

    const onModalCancel = () => {
        clearFileInput()
        setShowModal(false)
    }

    return (
        <div className="settings-block">
            <h2>Import/Export your data</h2>
            <Button text='export' action={exportData} />
            <span className="words-between">as</span>
            <select className="data-types-select" onChange={setDataType}>
                <option value={DataTypes.JSON}>{DataTypes.JSON.toUpperCase()}</option>
                <option value={DataTypes.HTML}>{DataTypes.HTML.toUpperCase()}</option>
            </select>
            <Button 
                text='import json' 
                action={clickOnFileInput} 
                classNames={['import-btn']} 
            />
            <input 
                className="input-hidden" 
                type="file" 
                accept=".json" 
                onChange={() => setShowModal(true)} 
                ref={fileInputRef} 
            />
            {showModal && 
            <Portal>
                <ImportModal onCancel={onModalCancel} onConfirm={onModalConfirm} />
            </Portal>}
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

const exportDataAsJson = () => {
    doExport(convertDataToJsonString(), DataTypes.JSON)
}

const exportDataAsHtml = () => {
    const taskTree = getTasksTree()
    const content = convertDataToHtmlString(taskTree)
    const styles = 'body { font-family: sans-serif; font-size: 16px; } ul, li { margin-top: 6px }'
    const data = `<html><head><style>${styles}</style></head><body>${content}</body></html>`
    doExport(data, DataTypes.HTML)
}

const convertDataToJsonString = (): string => {
    return JSON.stringify(getAllTasks(), null, 2)
}

const getExportFileName = (type: DataTypes) => {
    const timestamp = new Date().toISOString()
    return `todolist_export_${timestamp}.${type}`
}

const convertDataToHtmlString = (task: Task): string => {
    const textDecoration = task.isDone 
        ? 'style="text-decoration: line-through"' 
        : ''

    const subTasksHtml = 
        `<ul>${task.subTasks?.map((it) => convertDataToHtmlString(it))}</ul>`

    return  `<li ${textDecoration}>${task.text + subTasksHtml}</li>`
            .replace(/>,</g, '><')
}

export default ExportImport
