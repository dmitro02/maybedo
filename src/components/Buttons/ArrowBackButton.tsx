import { memo } from 'react'
import './Button.scss'

type Props = {
    action: (e: any) => void
    classNames?: string[]
    title?: string
}

const ArrowBackButton = (props: Props) => {
    const {
        action,
        classNames = [],
        title = ''
    } = props

    return (
        <i 
            className={`material-icons common-btn ${classNames.join(' ')}`} 
            onClick={action}
            title={title}
        >arrow_back_ios</i>
    )
}

export default memo(ArrowBackButton)