import { memo } from 'react'
import './Button.scss'

const EmptyButton = () => 
    <i className="material-icons common-btn empty-btn">_</i>

export default memo(EmptyButton)