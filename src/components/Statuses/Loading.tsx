import Fog from '../Fog/Fog'
import Spinner from './Spinner'
import './Loading.scss'
import { usePropertyWithState } from '../../classes/Store2'

type Props = {
    spinnerClass?: string
}

const Loading = (props: Props) => {
    const { spinnerClass } = props

    const [ showLoading ] = usePropertyWithState('showLoading')

    if (!showLoading) return null
    
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
