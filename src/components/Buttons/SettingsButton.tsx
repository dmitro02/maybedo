import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: string[]
    title?: string
}

const SettingsButton = (props: Props) => {
    const {
        action,
        classNames = [],
        title = 'settings'
    } = props

    return (
        <i 
            className={`material-icons-outlined common-btn ${classNames.join(' ')}`} 
            onClick={action}
            title={title}
        >settings</i>
    )
}

export default memo(SettingsButton)