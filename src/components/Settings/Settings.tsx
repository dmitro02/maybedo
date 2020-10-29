import React from 'react'
import './Settings.scss'
import ExportImport from './ExportImport' 
import DropboxSync from './DropboxSync'
import Divider from '../Divider/Divider'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <>
            <ExportImport backToTaskList={backToTaskList} />
            <Divider />
            <DropboxSync />
        </>
    )
}

export default Settings
