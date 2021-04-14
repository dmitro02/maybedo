import Task from '../classes/Task'

export enum DataTypes {
    JSON = 'json',
    HTML = 'html'
}

export const convertDataToJsonString = (taskList: Task): string => {
    const excludeKeys = [
        'path',
        'selectedSubTaskPath',
        'parent'
    ]
    const replacer = (key: string, value: any) =>
        excludeKeys.includes(key) ? undefined : value

    return JSON.stringify(taskList, replacer, 2)
}

const getSubTasks = (root: Task): Task[] => {
    return []
}

export const convertDataToHtmlString = (taskList: Task): string => {
    const textDecoration = taskList.isDone 
        ? 'style="text-decoration: line-through"' : ''
    const subtasks = 
        `<ul>${getSubTasks(taskList).map((task) => convertDataToHtmlString(task))}</ul>`
    const item = `<li ${textDecoration}>${taskList.text + subtasks}</li>` 
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
}

export const validateExportedData = (data: any): boolean => {
    if (!isExportedData(data)) return false
    return validateTaks(data)
}

const isTask = (data: any): data is Task => {
    const dataToValidate = data as Task
    return dataToValidate.text !== undefined 
            && dataToValidate.isDone !== undefined 
}

const validateTaks = (data: any): boolean => {
    return isTask(data)
} 
