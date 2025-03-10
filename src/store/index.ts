import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import boardReducer from './boardSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['board/addTask', 'board/updateTask'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.task.dueDate', 'payload.task.createdAt', 'payload.task.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: [
          'board.boards.tasks.dueDate',
          'board.boards.tasks.createdAt',
          'board.boards.tasks.updatedAt',
          'board.currentBoard.tasks.dueDate',
          'board.currentBoard.tasks.createdAt',
          'board.currentBoard.tasks.updatedAt',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 