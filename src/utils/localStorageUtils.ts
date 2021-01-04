import { convertDataToJson } from '../components/Settings/ExportImport'
import { Task } from '../types'

const saveToLocalStorage = (root: Task) => 
    localStorage.setItem('data', convertDataToJson(root))