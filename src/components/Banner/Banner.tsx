import React, { useCallback, useEffect } from 'react'
import './Banner.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { setBanner } from '../../contexts/actionCreators'
import { CloseButton } from '../Buttons/Buttons'

const Banner = () => {
    const [ store, dispatch ] = useTasksContext()

    const { banner } = store

    const closeBanner = useCallback(
        () => dispatch(setBanner(null)), 
        [dispatch]
    )

    useEffect(() => {
        if (banner && banner.delay && banner.delay > 0) {
            setTimeout(closeBanner, banner.delay * 1000)
        }
    }, [banner, closeBanner])

    if (!banner) return null

    const { text, type } = banner

    return (
        <div className={`banner banner-${type}`}>
            {text}
            <CloseButton action={closeBanner} />
        </div>
    )
}

export default Banner