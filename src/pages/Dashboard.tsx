import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import {
  addBoard,
  setCurrentBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
} from '../store/boardSlice';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Board from '../components/board/Board';
import TaskForm from '../components/task/TaskForm';
import TaskDetail from '../components/task/TaskDetail';
import { Board as BoardType, Column, Task } from '../types';
import { createMockBoard } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boards, currentBoard } = useAppSelector(state => state.board);
  const { users } = useAppSelector(state => state.user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string>('');

  // Initialize with a mock board if no boards exist
  useEffect(() => {
    if (boards.length === 0) {
      const mockBoard = createMockBoard();
      dispatch(addBoard(mockBoard));
      dispatch(setCurrentBoard(mockBoard));
    } else if (!currentBoard && boards.length > 0) {
      dispatch(setCurrentBoard(boards[0]));
    }
  }, [boards, currentBoard, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreateBoard = () => {
    const newBoard: BoardType = {
      id: uuidv4(),
      title: 'New Board',
      columns: [],
      tasks: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch(addBoard(newBoard));
    dispatch(setCurrentBoard(newBoard));
  };

  const handleBoardSelect = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      dispatch(setCurrentBoard(board));
    }
  };

  const handleAddColumn = (column: Column) => {
    if (currentBoard) {
      dispatch(addColumn({ boardId: currentBoard.id, column }));
    }
  };

  const handleEditColumn = (column: Column) => {
    if (currentBoard) {
      dispatch(updateColumn({ boardId: currentBoard.id, column }));
    }
  };

  const handleDeleteColumn = (column: Column) => {
    if (currentBoard) {
      dispatch(deleteColumn({ boardId: currentBoard.id, columnId: column.id }));
    }
  };

  const handleMoveTask = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    if (currentBoard) {
      dispatch(
        moveTask({
          boardId: currentBoard.id,
          taskId,
          sourceColumnId,
          destinationColumnId,
          sourceIndex,
          destinationIndex,
        })
      );
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleTaskUpdate = (task: Task) => {
    if (currentBoard) {
      dispatch(updateTask({ boardId: currentBoard.id, task }));
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (currentBoard) {
      dispatch(deleteTask({ boardId: currentBoard.id, taskId }));
    }
  };

  const handleAddTask = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsTaskFormOpen(true);
  };

  const handleTaskCreate = (task: Task) => {
    if (currentBoard && activeColumnId) {
      dispatch(
        addTask({
          boardId: currentBoard.id,
          columnId: activeColumnId,
          task,
        })
      );
    }
  };

  return (
    <DashboardContainer>
      <Header onToggleSidebar={toggleSidebar} />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onCreateBoard={handleCreateBoard}
        currentBoardId={currentBoard?.id}
        onBoardSelect={handleBoardSelect}
      />

      <MainContent $sidebarOpen={isSidebarOpen}>
        {currentBoard ? (
          <Board
            board={currentBoard}
            users={users}
            onMoveTask={handleMoveTask}
            onAddColumn={handleAddColumn}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <EmptyState>
            <h2>No board selected</h2>
            <p>Please select a board from the sidebar or create a new one.</p>
          </EmptyState>
        )}
      </MainContent>

      {/* Task Detail Modal */}
      <TaskDetail
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        users={users}
      />

      {/* Task Creation Form */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskCreate}
        columnId={activeColumnId}
        users={users}
      />
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '280px' : '0')};
  margin-top: 64px;
  height: calc(100vh - 64px);
  transition: margin-left ${({ theme }) => theme.transitions.normal};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};

  h2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default Dashboard; 