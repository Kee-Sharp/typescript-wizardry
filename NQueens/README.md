# N Queens

### Given a positive integer **N**, this type can list out all the possible solutions to placing **N** queens on an **NxN** chessboard so that none of the queens are attacking each other. There are two output formats.

## N Queens Output Formats
1. The *NQueens* type returns a tuple of all of the possible board representations with a 'board' being a 2d tuple where `'_'` is a free space and `'Q'` is a queen
2. Also exported is a helper type *BoardsToPos* which takes in the tuple of boards in the format above and returns another tuple where each board is represented by a tuple of size **N** with the indices for the queen in each row.

## N Queens Example
```
type NQueens4 = NQueens<4>;
const result: NQueens4 = [
  [
    ["_", "Q", "_", "_"],
    ["_", "_", "_", "Q"],
    ["Q", "_", "_", "_"],
    ["_", "_", "Q", "_"]
  ],
  [
    ["_", "_", "Q", "_"],
    ["Q", "_", "_", "_"],
    ["_", "_", "_", "Q"],
    ["_", "Q", "_", "_"]
  ]
];
type NQueens4Pos = BoardsToPos<NQueens4>;
const resultPos: NQueens4Pos = [[1, 3, 0, 2], [2, 0, 3, 1]];
```