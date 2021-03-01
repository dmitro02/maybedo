import Fog from '../Fog/Fog'
import Spinner from './Spinner'
import './Loading.scss'
import taskStore from '../../utils/Store'
import { useEffect, useState } from 'react'

type Props = {
    spinnerClass?: string
}

const Loading = (props: Props) => {
    const { spinnerClass } = props

    const [ isDiplayed, setIsDisplayed ] = useState(false)

    const show = () => setIsDisplayed(true)
    const hide = () => setIsDisplayed(false)

    useEffect(() => {
        taskStore.subscribe('showLoading', show)
        taskStore.subscribe('hideLoading', hide)

        return () => {
            taskStore.unsubscribe('showLoading', show)
            taskStore.unsubscribe('hideLoading', hide)
        }
    }, [])

    if (!isDiplayed) return null
    
    return (
        <>
            <Fog isDisplayed={true} />
            <div className="loading">
                <Spinner customClass={spinnerClass} />
            </div>
        </>
    )
}

export default Loading
