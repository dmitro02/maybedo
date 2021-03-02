import './NoProjects.scss'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'

const NoProjects = () => {
    return (
        <div className="no-projects-message">
            <MdCheckBoxOutlineBlank />
            <span>Know thyself!</span>
        </div>
    )
}

export default NoProjects
