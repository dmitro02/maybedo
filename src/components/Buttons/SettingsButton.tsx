import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: String[]
}

const SettingsButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons-outlined common-btn ${classNames.join(' ')}`} 
            onClick={action}
        >settings</i>
    )
}

export default memo(SettingsButton)