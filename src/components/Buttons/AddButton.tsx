import React, { memo } from 'react'
import './Button.scss'

type Props = {
    action?: (e: any) => void
    classNames?: string[]
    title?: string
}

const AddButton = (props: Props) => {
    const {
        action = () => {},
        classNames = [],
        title = ''
    } = props

    return (
        <i 
            className={`material-icons common-btn add-btn${classNames.join(' ')}`} 
            onClick={action}
            title={title}
        >add</i>
    )
}

export default memo(AddButton)