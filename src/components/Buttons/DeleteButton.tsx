import { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: string[]
    title?: string
}

const DeleteButton = (props: Props) => {
    const {
        action,
        classNames = [],
        title = 'delete item'
    } = props

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onClick={action}
            title={title}
        >delete</i>
    )
}

export default memo(DeleteButton)