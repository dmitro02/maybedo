import './Spinner.scss'

type Props = {
    customClass?: string
}

const Spinner = (props: Props) =>
    <div className={`spinner ${props.customClass || ''}`} />

export default Spinner