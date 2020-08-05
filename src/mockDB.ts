import { ITask } from './types';

const project1: ITask = { 
    id: 1,
    text: 'Project 1',
    isDone: false,
    subTasks: [
        {
            isDone: false,
            text: 'make love',
            id: 1,
            subTasks: []
        },
        {
            isDone: true,
            text: 'take five',
            id: 2,
            subTasks: []
        },
        {
            isDone: true,
            text: 'kiss wife',
            id: 3,
            subTasks: []
        },
        {
            isDone: false,
            text: 'enjoy life',
            id: 4,
            subTasks: []
        },
        {
            isDone: true,
            text: 'catch dove',
            id: 5,
            subTasks: []
        },
        {
            isDone: false,
            text: 'milk cow',
            id: 6,
            subTasks: []
        },
        {
            isDone: false,
            text: 'sharpen knife',
            id: 7,
            subTasks: []
        },
        {
            isDone: false,
            text: 'test drive',
            id: 8,
            subTasks: []
        },
        {
            isDone: false,
            text: 'free dive',
            id: 9,
            subTasks: []
        },
        {
            isDone: false,
            text: 'sky dive',
            id: 10,
            subTasks: []
        },
        {
            isDone: false,
            text: 'scuba dive',
            id: 11,
            subTasks: []
        }
    ]
}

const project2: ITask = { 
    id: 2,
    text: 'Project 2',
    isDone: false,
    subTasks: [
        {
            isDone: false,
            text: 'kill hector',
            id: 1,
            subTasks: []
        },
        {
            isDone: false,
            text: 'draw vector',
            id: 2,
            subTasks: []
        },
        {
            isDone: false,
            text: 'occupy sector',
            id: 3,
            subTasks: []
        }
    ]
}

export const DB = [ project1, project2 ]
