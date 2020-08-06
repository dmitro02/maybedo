import { ITask } from './types';

const project1: ITask = { 
    id: 1,
    text: 'Project 1',
    isDone: false,
    tasks: [
        {
            isDone: false,
            text: 'make love',
            id: 1,
            tasks: []
        },
        {
            isDone: true,
            text: 'take five',
            id: 2,
            tasks: []
        },
        {
            isDone: true,
            text: 'kiss wife',
            id: 3,
            tasks: []
        },
        {
            isDone: false,
            text: 'enjoy life',
            id: 4,
            tasks: []
        },
        {
            isDone: true,
            text: 'catch dove',
            id: 5,
            tasks: []
        },
        {
            isDone: false,
            text: 'milk cow',
            id: 6,
            tasks: []
        },
        {
            isDone: false,
            text: 'sharpen knife',
            id: 7,
            tasks: []
        },
        {
            isDone: false,
            text: 'test drive',
            id: 8,
            tasks: []
        },
        {
            isDone: false,
            text: 'free dive',
            id: 9,
            tasks: []
        },
        {
            isDone: false,
            text: 'sky dive',
            id: 10,
            tasks: []
        },
        {
            isDone: false,
            text: 'scuba dive',
            id: 11,
            tasks: []
        }
    ]
}

const project2: ITask = { 
    id: 2,
    text: 'Project 2',
    isDone: false,
    tasks: [
        {
            isDone: false,
            text: 'kill hector',
            id: 1,
            tasks: []
        },
        {
            isDone: false,
            text: 'draw vector',
            id: 2,
            tasks: []
        },
        {
            isDone: false,
            text: 'occupy sector',
            id: 3,
            tasks: []
        }
    ]
}

export const DB = [ project1, project2 ]
