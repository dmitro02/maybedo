import { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: string[]
}

const ConfirmButton = (props: Props) => {
    const {
        action,
        classNames = []
    } = props

    return (
        <i 
            className={`material-icons common-btn confirm-btn${classNames.join(' ')}`} 
            onClick={action}
        >check</i>
    )
}

export default memo(ConfirmButton)