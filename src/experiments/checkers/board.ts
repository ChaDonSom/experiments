export function placeContinuingInLine(place1: string, place2: string): string {
    let [row1, col1] = getNumbersFromPlace(place1)
    let [row2, col2] = getNumbersFromPlace(place2)
    if (Math.abs(row2 - row1) != 1 || Math.abs(col2 - col1) != 1) throw Error("Places must be diagonally adjacent")
    let rowBeyondJump = row1 + ((row2 - row1) * 2)
    let colBeyondJump = col1 + ((col2 - col1) * 2)
    return `${rowBeyondJump}${colBeyondJump}`
}

export function placeBetweenPlaces(place1: string, place2: string): string {
    let [row1, col1] = getNumbersFromPlace(place1)
    let [row2, col2] = getNumbersFromPlace(place2)
    if (Math.abs(row2 - row1) != 2 || Math.abs(col2 - col1) != 2) throw Error("Places must be separated by one space")
    let rowMod = row2 - row1 > 0 ? 1 : -1
    let colMod = col2 - col1 > 0 ? 1 : -1
    let rowDirectlyAfter = row1 + rowMod
    let colDirectlyAfter = col1 + colMod
    return `${rowDirectlyAfter}${colDirectlyAfter}`
}

export function getNumbersFromPlace(place: string): number[] {
    let row1 = Number(place[0])
    let col1 = Number(place[1])
    return [row1, col1]
}