/**
 * Create a new empty board.
 * The board size is 20 by 40.
 */
export function createBoard() {
    return Array(40).fill(null).map(a => a = Array(10).fill((0)));
}
