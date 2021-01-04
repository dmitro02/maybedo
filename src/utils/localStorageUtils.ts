import { Task } from '../types'
import { convertDataToJson } from './exportImportUtils'

const saveToLocalStorage = (root: Task) => 
    localStorage.setItem('data', convertDataToJson(root))