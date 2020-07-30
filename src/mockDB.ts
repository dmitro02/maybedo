import { IProject } from './types';

const project1: IProject = { 
    id: 1,
    text: 'Project 1',
    isDone: false,
    tasks: [
        {
            isDone: false,
            text: 'make love',
            id: 1
        },
        {
            isDone: true,
            text: 'take five',
            id: 2
        },
        {
            isDone: true,
            text: 'kiss wife',
            id: 3
        },
        {
            isDone: false,
            text: 'enjoy life',
            id: 4
        },
        {
            isDone: true,
            text: 'catch dove',
            id: 5
        },
        {
            isDone: false,
            text: 'milk cow',
            id: 6
        },
        {
            isDone: false,
            text: 'sharpen knife',
            id: 7
        },
        {
            isDone: false,
            text: 'test drive',
            id: 8
        },
        {
            isDone: false,
            text: 'free dive',
            id: 9
        },
        {
            isDone: false,
            text: 'sky dive',
            id: 10
        },
        {
            isDone: false,
            text: 'scuba dive',
            id: 11
        }
    ]
}

const project2: IProject = { 
    id: 2,
    text: 'Project 2',
    isDone: false,
    tasks: [
        {
            isDone: false,
            text: 'kill hector',
            id: 1
        },
        {
            isDone: false,
            text: 'draw vector',
            id: 2
        },
        {
            isDone: false,
            text: 'occupy sector',
            id: 3
        }
    ]
}

export const DB = [ project1, project2 ]
