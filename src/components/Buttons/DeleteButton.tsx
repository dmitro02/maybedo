import React, { memo } from 'react'

type Props = {
    action: (e: any) => void
    classNames: String[]
}

const DeleteButton = (props: Props) => {
    const {
        action = () => {},
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons commom-btn ${classNames.join(' ')}`} 
            onClick={action}
        >clear</i>
    )
}

export default memo(DeleteButton)