import React from 'react'
import './Settings.scss'
import ExportImport from './ExportImport' 
import { getCurrentAccount } from '../../utils/dropBoxUtils'

type Props = {
    backToTaskList(): void
}

const Settings = (props: Props) => {

    const { backToTaskList } = props

    return (
        <>
            <ExportImport backToTaskList={backToTaskList} />
            <button onClick={getCurrentAccount}>getCurrentAccount</button>
        </>
    )
}

export default Settings
