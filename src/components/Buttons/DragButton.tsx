import React, { memo } from 'react'
import './Button.scss'

const DragButton = () =>
    <i className="material-icons common-btn hidden-btn drag-mark">drag_indicator</i>

export default memo(DragButton)