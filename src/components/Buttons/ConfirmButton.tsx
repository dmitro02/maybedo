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
        <button 
            className={`material-icons common-btn confirm-btn${classNames.join(' ')}`} 
            onClick={action}
        >check</button>
    )
}

export default memo(ConfirmButton)