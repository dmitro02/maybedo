import React, {memo} from 'react'
import './Divider.scss'

type Props = { isHidden?: boolean }

const Divider = ({ isHidden }: Props) => (
    <div className={'divider' + (isHidden ? ' hidden' : '')} />
)

export default memo(Divider)