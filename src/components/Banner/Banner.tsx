import React from 'react'
import './Banner.scss'
import { useTasksContext } from '../../contexts/TasksContext'
import { setBanner } from '../../contexts/actionCreators'

const Banner = () => {
    const [ store, dispatch ] = useTasksContext()

    if (!store.banner) return null

    const {
        type,
        text,
        delay,
    } = store.banner

    const closeBanner = () => dispatch(setBanner(null))

    return (
        <div className={`banner banner-${type}`}>
            {text}
            <i className="material-icons" onClick={closeBanner}>clear</i>
        </div>
    )
}

export default Banner