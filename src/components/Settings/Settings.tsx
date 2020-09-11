import React from 'react'
import { useTasksContext } from '../../contexts/TasksContext'
import { setAppData } from '../../contexts/actionCreators'
import './Settings.scss'

const Settings = () => {
    const [ store, dispatch ] = useTasksContext()

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
            const dataToImport = JSON.parse(reader.result as string)
            if (window.confirm('Do you want to overwrite existing data?')) {
                dispatch(setAppData(dataToImport))
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

export default Settings