import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: String[]
}

const CloseButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons common-btn close-btn${classNames.join(' ')}`} 
            onClick={action}
        >close</i>
    )
}

export default memo(CloseButton)