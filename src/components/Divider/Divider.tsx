import React from 'react'
import './Divider.scss'

interface IProps { isHidden?: boolean }

const Divider = ({ isHidden }: IProps) => (
    <div className={'divider' + (isHidden ? ' hidden' : '')} />
)

export default Divider