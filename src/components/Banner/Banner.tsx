import React, { useCallback, useEffect } from 'react'
import './Banner.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { CloseButton } from '../Buttons/Buttons'

const Banner = () => {
    const { store: { banner } , actions } = useTasksContext()

    const closeBanner = useCallback(() => actions.setBanner(null), [actions])

    useEffect(() => {
        if (banner && banner.delay && banner.delay > 0) {
            setTimeout(closeBanner, banner.delay * 1000)
        }
    }, [banner, closeBanner])

    if (!banner) return null

    const { text, type } = banner

    return (
        <div className={`banner banner-${type}`}>
            <div>{text}</div>
            <CloseButton action={closeBanner} />
        </div>
    )
}

export default Banner