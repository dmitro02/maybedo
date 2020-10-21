import React from 'react'
import './Settings.scss'
import ExportImport from './ExportImport' 

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <>
            <ExportImport backToTaskList={backToTaskList} />
        </>
    )
}

export default Settings
