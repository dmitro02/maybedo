import { ITask } from './types';

export const createTaskObj = (
    data: string = '', 
    isDone: boolean = false, 
    id: number = generateNextTaskId()
): ITask => ({id, data, isDone})

const generateNextTaskId = () => {
    return 100
}