// var remote = [1, 2, 6, 7, 8, 9, 10, 11]
// var local =  [1, 2, 5, 6, 7, 8, 11]

const remote = [1, 2, 6, 7, 8, 9, 10, 11] 
const local = [1, 2, 3, 4, 5, 6, 7, 8]

export const getDelta = (arr1: any, arr2: any) => {
    return arr1.filter((it: any) => !arr2.includes(it))
}

const addToLocal = getDelta(remote, local)

const removeFromLocal = getDelta(local, remote)

console.log('=======================')
console.log('addToLocal', addToLocal)
console.log('removeFromLocal', removeFromLocal)