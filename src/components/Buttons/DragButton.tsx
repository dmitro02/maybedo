import { memo } from 'react'
import './Button.scss'

type Props = { title?: string }

const DragButton = (props: Props) => {
    const { title = 'move item' } = props

    return (
        <i 
            className="material-icons common-btn hidden-btn drag-mark"
            title={title}
        >drag_indicator</i>
    )
}

export default memo(DragButton)