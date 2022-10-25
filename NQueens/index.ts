import { IndexOf, Filter, Replace, Slice } from "../helpers/array";
import { Tuple, Length } from "../helpers/common";
import { Add, Sub } from "../helpers/numbers";

type Space = '_' | 'Q';
type AnyBoard = Space[][];
/** [row, column] */
type Coord = [number, number]

/** Creates an empty board of size NxN */
type EmptyBoard<N extends number> = Tuple<N, Tuple<N, '_'>>;

/** Returns the index of the first row in a board without a queen */
type EmptyRowIndex<B extends AnyBoard> = IndexOf<B, '_'[]>;

/** Returns the index of the queen in a row */
type QueenPos<Row extends Space[]> = IndexOf<Row, 'Q'>

/** Returns a list of all of the queen coordinates */ 
type AllQueenPos<
  B extends AnyBoard,
  Pos extends Coord[] = []
> = B extends [infer FirstRow extends Space[], ...infer Rest extends AnyBoard]
  ? AllQueenPos<Rest, [...Pos, [Length<Pos>, QueenPos<FirstRow>]]>
  : Filter<Pos, [number, -1]>;

type IsSameColumn<A extends Coord, B extends Coord> = A[1] extends B[1] ? true : false;

type IsSameDiagonal<A extends Coord, B extends Coord> = Add<A[0], A[1]> extends Add<B[0], B[1]>
  ? true
  : Sub<A[0], A[1]> extends Sub<B[0], B[1]>
    ? true
    : false;

type IsAttacking<
  A extends Coord,
  B extends Coord
> = [IsSameColumn<A, B>, IsSameDiagonal<A, B>] extends false[] ? false : true;

/** Returns whether A is attacking any of the coordinates in C */
type IsAttackingArray<
  A extends Coord,
  C extends Coord[]
> = C extends [infer C0 extends Coord, ...infer Rest extends Coord[]]
  ? IsAttacking<A, C0> extends true
    ? true
    : IsAttackingArray<A, Rest>
  : false;

/** Returns whether any of the queens on the board are attacking each other */
type IsValidBoard<
  B extends AnyBoard,
  Pos extends Coord[] = AllQueenPos<B>
> = Pos extends [infer Pos0 extends Coord, ...infer Rest extends Coord[]]
  ? IsAttackingArray<Pos0, Rest> extends true ? false : IsValidBoard<B, Rest>
  : true;

/** Returns an array of rows where each spot in row has been filled with a queen */
type FillEachSlot<
  Row extends Space[],
  Ret extends Space[][] = []
> = Length<Ret> extends Length<Row> ? Ret : FillEachSlot<Row, [...Ret, Replace<Row, Length<Ret>, 'Q'>]>;

/** Returns the new boards for B at this step in the recursion */
type NewBoardsAtIndex<
  B extends AnyBoard,
  Index extends number,
  RowsToAdd extends Space[][] = FillEachSlot<B[Index]>,
  Ret extends AnyBoard[] = [],
  SplitRowsToAdd extends [Space[][], Space[][]] = Slice<RowsToAdd, 1>
> = Length<RowsToAdd> extends 0
  ? Ret
  : Slice<B, Index> extends [infer Beginning extends Space[][], infer RowPlusEnd extends Space[][]]
    ? [...Beginning, SplitRowsToAdd[0][0], ...Slice<RowPlusEnd, 1>[1]] extends infer NewBoard extends AnyBoard
      ? NewBoardsAtIndex<B, Index, SplitRowsToAdd[1], [...Ret, ...(IsValidBoard<NewBoard> extends true ? [NewBoard] : [])]>
      : []
    : [];

type NQueensHelper<
  B extends AnyBoard,
  EmptyIndex extends number = EmptyRowIndex<B>,
  NewBoards extends AnyBoard[] = EmptyIndex extends -1 ? [] : NewBoardsAtIndex<B, EmptyIndex>
> = EmptyIndex extends -1
  ? [B]
  : NewBoards extends [infer FirstNewBoard extends AnyBoard, ...infer OtherNewBoards extends AnyBoard[]]
    ? [...NQueensHelper<FirstNewBoard>, ...NQueensHelper<B, EmptyIndex, OtherNewBoards>]
    : [];
export type NQueens<N extends number> = NQueensHelper<EmptyBoard<N>>;

/** Converts the board notation to an array of queen column indices */
type BoardToPos<
  Board extends AnyBoard,
  Ret extends number[] = []
> = Length<Ret> extends Length<Board>
  ? Ret
  : BoardToPos<Board, [...Ret, QueenPos<Board[Length<Ret>]>]>

export type BoardsToPos<Boards extends AnyBoard[]> =
  Boards extends [infer FirstBoard extends AnyBoard, ...infer OtherBoards extends AnyBoard[]]
  ? [BoardToPos<FirstBoard>, ...BoardsToPos<OtherBoards>]
  : [];