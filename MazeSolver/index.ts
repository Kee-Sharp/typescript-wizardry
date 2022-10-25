import { Filter, IndexOf, Indices } from "../helpers/array";
import { Length } from "../helpers/common";
import { IsNegative, Sub, Add } from "../helpers/numbers";

type Space = "_";
type Start = "S";
type Goal = "G";
type FreeSpace = Space | Start | Goal;
type Wall = "|";
type MazeCell = FreeSpace | Wall;
type AnyMaze = MazeCell[][];
/** [row, column] */
type Pos = [number, number];
type Directions = ["Up", "Right", "Down", "Left"];
type Direction = Directions[number];
type Path = Direction[];
type State = [Pos, Path];
type DirectionToVector = {
  Up: [-1, 0];
  Right: [0, 1];
  Down: [1, 0];
  Left: [0, -1];
};

/** Returns the number of rows in Maze that include Cell */
type NumRowsWithCell<Maze extends AnyMaze, Cell extends MazeCell> = Length<
  Filter<Maze, Exclude<MazeCell, Cell>[]>
>;

type IsValidMaze<Maze extends AnyMaze> = NumRowsWithCell<Maze, Start> extends 1
  ? NumRowsWithCell<Maze, Goal> extends 1
    ? true
    : false
  : false;

/** Returns the start position of the maze */
type StartPos<
  Maze extends AnyMaze,
  Counter extends any[] = [],
  StartPosCurrentRow extends number = IndexOf<Maze[Length<Counter>], Start>
> = StartPosCurrentRow extends -1
  ? StartPos<Maze, [...Counter, any]>
  : [Length<Counter>, StartPosCurrentRow];

/** Returns whether P is within Maze */
type IsValidPos<Maze extends AnyMaze, P extends Pos> = IsNegative<P[0]> extends true
  ? false
  : IsNegative<P[1]> extends true
    ? false
    : P[0] extends Indices<Maze>
      ? P[1] extends Indices<Maze[0]>
        ? Maze[P[0]][P[1]] extends FreeSpace
          ? true
          : false
        : false
      : false;

/** A wrapper around Add to account for the -1 from the vectors */
type AddWithNegative<N extends number, M extends number> = M extends -1
  ? Sub<N, 1>
  : Add<N, M>;

/** Adds Direction D to Position P, returns 'invalid' if position is invalid */
type AddDirectionToPosition<
  Maze extends AnyMaze,
  P extends Pos,
  D extends Direction,
  Vector extends Pos = DirectionToVector[D]
> =
[AddWithNegative<P[0], Vector[0]>, AddWithNegative<P[1], Vector[1]>] extends infer NewPosition extends Pos
  ? IsValidPos<Maze, NewPosition> extends true
    ? NewPosition
    : "invalid"
  : "invalid";

/** Generates the successor states from the current state by adding each valid direction */
type Successors<
  Maze extends AnyMaze,
  Current extends State,
  DirectionsToAdd = Directions
> =
DirectionsToAdd extends [infer FirstDirection extends Direction, ...infer OtherDirections extends Direction[]]
  ? AddDirectionToPosition<Maze, Current[0], FirstDirection> extends infer NewPosition extends Pos
    ? [[NewPosition, [...Current[1], FirstDirection]], ...Successors<Maze, Current, OtherDirections>]
    : Successors<Maze, Current, OtherDirections>
  : [];

type MazeHelper<
  Maze extends AnyMaze,
  OpenList extends State[] = [],
  Visited extends Pos[] = []
> =
OpenList extends [infer CurrentState extends State, ...infer OtherOpenStates extends State[]]
  ? CurrentState extends [infer CurrentPos extends Pos, infer CurrentPath]
    ? Maze[CurrentPos[0]][CurrentPos[1]] extends Goal
      ? CurrentPath
      : CurrentPos extends Visited[number]
        ? MazeHelper<Maze, OtherOpenStates, Visited>
        : MazeHelper<Maze, [...OtherOpenStates, ...Successors<Maze, CurrentState>], [...Visited, CurrentPos]>
    : "should not get here, branching to assign variables"
  : "no possible path";
export type MazeSolver<Maze extends AnyMaze> = IsValidMaze<Maze> extends true
  ? MazeHelper<Maze, [[StartPos<Maze>, []]]>
  : "invalid maze";
