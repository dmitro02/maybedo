import React from 'react'
import { useTasksContext, IStore } from '../../contexts/TasksContext'
import './Settings.scss'

const Settings = () => {
    const [ store ] = useTasksContext()

    return (
        <div>
            <input type="file" id="importData" onChange={handleFileSelect} />
            <button onClick={() => {}}>Import</button>
            <button onClick={() => exportData(store)}>Export</button>
        </div>
    )
}

const excludeKeys = [
    'path',
    'selectedSubTaskPath',
    'addedItemPath'
]

const replacer = (key: string, value: any) =>
    excludeKeys.includes(key) ? undefined : value

const exportData = (store: IStore) => {
    const storedData = JSON.stringify(store, replacer, 2)
    const dataToExport = 'data:text/json;charset=utf-8,' + storedData
    const encodedUri = encodeURI(dataToExport)
    const timestamp = new Date().toISOString()
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `todolist_export_${timestamp}.json`);
    link.click();
}

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = () => {
       console.log(JSON.parse(reader.result as string));
    };
    const files = e.target.files
    files && reader.readAsText(files[0])

}

export default Settings