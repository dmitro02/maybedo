import React from 'react'
import './Settings.scss'
import ExportImport from './ExportImport' 
import DropboxSync from './DropboxSettings'
import Divider from '../Divider/Divider'
import Spinner from '../Spinner/Spinner'

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
            <Spinner />
        </>
    )
}

export default Settings
