import { Task } from '../types';

export enum DataTypes {
    JSON = 'json',
    HTML = 'html'
}

export const convertDataToJsonString = (root: Task): string => {
    const excludeKeys = [
        'path',
        'selectedSubTaskPath'
    ]
    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value
    const data = { 
        timestamp: Date.now(),
        tasklist: root
     }
    return JSON.stringify(data, replacer, 2)
}

export const convertDataToHtmlString = (root: Task): string => {
    const textDecoration = root.isDone 
        ? 'style="text-decoration: line-through"' : ''
    const subtasks = root.tasks.length 
        ? `<ul>${root.tasks.map(task => convertDataToHtmlString(task))}</ul>` : ''
    const item = `<li ${textDecoration}>${root.text + subtasks}</li>` 
    return item.replace(/>,</g, '><')
}

export const getExportFileName = (type: DataTypes) => {
    const timestamp = new Date().toISOString()
    return `todolist_export_${timestamp}.${type}`
}

export const getExportFileNameJson = () => getExportFileName(DataTypes.JSON)

export const isExportedData = (data: any): data is Task => {
    if (!data) return false
    const dataToValidate = data as Task
    return dataToValidate.text !== undefined
            && dataToValidate.isDone !== undefined 
            && dataToValidate.tasks !== undefined 
}

export const validateExportedData = (data: any): boolean => {
    if (!isExportedData(data)) return false
    return validateTaks(data)
}

const isTask = (data: any): data is Task => {
    const dataToValidate = data as Task
    return dataToValidate.text !== undefined 
            && dataToValidate.isDone !== undefined 
            && dataToValidate.tasks !== undefined
}

const validateTaks = (data: any): boolean => {
    if (!isTask(data)) return false
    for (let task of data.tasks) {
        if(!validateTaks(task)) return false;
    }
    return true
} 
