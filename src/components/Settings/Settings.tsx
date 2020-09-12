import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { setAppData } from '../../contexts/actionCreators'
import './Settings.scss'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {
    const [ store, dispatch ] = useTasksContext()

    const { backToTaskList } = props

    const excludeKeys = [
        'path',
        'selectedSubTaskPath'
    ]

    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value

    const exportData = () => {
        const storedData = JSON.stringify(store.rootProject, replacer, 2)
        const dataToExport = 'data:text/json;charset=utf-8,' + storedData
        const encodedUri = encodeURI(dataToExport)
        const timestamp = new Date().toISOString()
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `todolist_export_${timestamp}.json`);
        link.click();
    }

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (window.confirm('Do you want to overwrite existing data?')) {
                let dataToImport
                try {
                    dataToImport = JSON.parse(reader.result as string)
                } catch(e) {
                    alert('BAD DATA (JSON)')
                    return
                }
                if (!validateExportedData(dataToImport)) {
                    alert('BAD DATA (shape)')
                    return
                }
                dispatch(setAppData(dataToImport))
                backToTaskList()
            } else {
                return
            }
        };
        const files = e.target.files
        files && reader.readAsText(files[0])
    }

    return (
        <div>
            <input type="file" id="importData" onChange={importData} />
            <button onClick={() => {}}>Import</button>
            <button onClick={exportData}>Export</button>
        </div>
    )
}

type ExportedData = {
    text: string
    isDone: boolean
    tasks: ExportedData[]
}

const isExportedData = (data: any): data is ExportedData => {
    const dAs = data as ExportedData
    return dAs.text !== undefined 
            && dAs.isDone !== undefined 
            && dAs.tasks !== undefined
}

const validateExportedData = (data: any): boolean => {
    if (!isExportedData(data)) return false
    for (let task of data.tasks) {
        if(!validateExportedData(task)) return false;
    }
    return true
} 

export default Settings
