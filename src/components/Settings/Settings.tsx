import React from 'react'
import './Settings.scss'
import ExportImport from './ExportImport' 
import DropboxSync from './DropboxSettings'
import Divider from '../Divider/Divider'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <div className="settings">
            <ExportImport backToTaskList={backToTaskList} />
            <Divider />
            <DropboxSync />
        </div>
    )
}

export default Settings
