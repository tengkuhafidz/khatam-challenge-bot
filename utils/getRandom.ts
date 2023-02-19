export const getRandom = (arr: any[]) => {
    return arr[Math.floor((Math.random() * arr.length))];
}