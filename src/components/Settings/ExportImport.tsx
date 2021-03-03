import { useRef, useState } from 'react'
import Task from '../../classes/Task'
import { FailureBanner, SuccessBanner } from '../Banner/Banner'
import { readFile } from '../../utils/commonUtils'
import { 
    convertDataToHtmlString,
    convertDataToJsonString, 
    DataTypes, 
    getExportFileName,
    validateExportedData
} from '../../utils/persistDataUtils'
import taskStore, { actions } from '../../classes/Store'
import Portal from '../../HOCs/Portal'
import ImportModal from './ImportModal'
import Button from '../Buttons/Button'

type Props = {
    backToTaskList(): void
}

const ExportImport = (props: Props) => {
    const [ showModal, setShowModal ] = useState(false)

    const { taskList } = taskStore

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

    const doImport = async () => {
        let taskList: Task | null = null
        try {
            const files = fileInputRef.current?.files
            if (files) {
                const fileContent = await readFile(files[0])
                taskList = JSON.parse(fileContent)
                clearFileInput()
                setShowModal(false)
            }
        } catch(err) {
            setShowModal(false)
            const banner = new FailureBanner('Failed to parse JSON file')
            actions.showBanner(banner)
            clearFileInput()
            return
        }
        if (!validateExportedData(taskList)) {
            const banner = new FailureBanner('Some required fields are missing')
            actions.showBanner(banner)
            return
        }
        taskStore.setData(taskList, Date.now())
        
        backToTaskList()
        const banner = new SuccessBanner('Data successfully imported', 5)
        actions.showBanner(banner)
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
