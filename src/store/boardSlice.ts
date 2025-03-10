import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, BoardState, Column, Task } from '../types';

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // Board actions
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard = null;
      }
    },

    // Column actions
    addColumn: (state, action: PayloadAction<{ boardId: string; column: Column }>) => {
      const { boardId, column } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns.push(column);
        if (state.currentBoard?.id === boardId) {
          state.currentBoard = { ...board };
        }
      }
    },
    updateColumn: (state, action: PayloadAction<{ boardId: string; column: Column }>) => {
      const { boardId, column } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const columnIndex = board.columns.findIndex(c => c.id === column.id);
        if (columnIndex !== -1) {
          board.columns[columnIndex] = column;
          if (state.currentBoard?.id === boardId) {
            state.currentBoard = { ...board };
          }
        }
      }
    },
    deleteColumn: (state, action: PayloadAction<{ boardId: string; columnId: string }>) => {
      const { boardId, columnId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns = board.columns.filter(c => c.id !== columnId);
        // Remove tasks from board that are in this column
        const column = board.columns.find(c => c.id === columnId);
        if (column) {
          column.taskIds.forEach(taskId => {
            delete board.tasks[taskId];
          });
        }
        if (state.currentBoard?.id === boardId) {
          state.currentBoard = { ...board };
        }
      }
    },

    // Task actions
    addTask: (state, action: PayloadAction<{ boardId: string; columnId: string; task: Task }>) => {
      const { boardId, columnId, task } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.tasks[task.id] = task;
        const column = board.columns.find(c => c.id === columnId);
        if (column) {
          column.taskIds.push(task.id);
        }
        if (state.currentBoard?.id === boardId) {
          state.currentBoard = { ...board };
        }
      }
    },
    updateTask: (state, action: PayloadAction<{ boardId: string; task: Task }>) => {
      const { boardId, task } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board && board.tasks[task.id]) {
        board.tasks[task.id] = task;
        if (state.currentBoard?.id === boardId) {
          state.currentBoard = { ...board };
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ boardId: string; taskId: string }>) => {
      const { boardId, taskId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Remove task from column
        board.columns.forEach(column => {
          column.taskIds = column.taskIds.filter(id => id !== taskId);
        });
        // Remove task from tasks object
        delete board.tasks[taskId];
        if (state.currentBoard?.id === boardId) {
          state.currentBoard = { ...board };
        }
      }
    },
    moveTask: (state, action: PayloadAction<{
      boardId: string;
      taskId: string;
      sourceColumnId: string;
      destinationColumnId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { boardId, taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const sourceColumn = board.columns.find(c => c.id === sourceColumnId);
        const destinationColumn = board.columns.find(c => c.id === destinationColumnId);

        if (sourceColumn && destinationColumn) {
          // Remove from source column
          sourceColumn.taskIds.splice(sourceIndex, 1);
          
          // Add to destination column
          destinationColumn.taskIds.splice(destinationIndex, 0, taskId);

          if (state.currentBoard?.id === boardId) {
            state.currentBoard = { ...board };
          }
        }
      }
    },

    // Loading/Error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBoards,
  addBoard,
  setCurrentBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setLoading,
  setError,
} = boardSlice.actions;

export default boardSlice.reducer; 