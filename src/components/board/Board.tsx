import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Board as BoardType, Column as ColumnType, Task as TaskType, User } from '../../types';
import Column from './Column';
import Button from '../common/Button';
import PlusIcon from '../icons/PlusIcon';
import { v4 as uuidv4 } from 'uuid';

interface BoardProps {
  board: BoardType;
  users: User[];
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  onAddColumn: (column: ColumnType) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (column: ColumnType) => void;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: TaskType) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  users,
  onMoveTask,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onTaskClick,
}) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onMoveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleAddColumnClick = () => {
    setShowAddColumn(true);
  };

  const handleAddColumnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newColumnTitle.trim()) {
      const newColumn: ColumnType = {
        id: uuidv4(),
        title: newColumnTitle.trim(),
        taskIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onAddColumn(newColumn);
      setNewColumnTitle('');
      setShowAddColumn(false);
    }
  };

  const handleAddColumnCancel = () => {
    setNewColumnTitle('');
    setShowAddColumn(false);
  };

  return (
    <BoardContainer>
      <DragDropContext onDragEnd={handleDragEnd}>
        <ColumnsContainer>
          {board.columns.map(column => {
            const columnTasks = column.taskIds.map(taskId => board.tasks[taskId]).filter(Boolean);
            
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                users={users}
                onAddTask={onAddTask}
                onEditColumn={onEditColumn}
                onDeleteColumn={onDeleteColumn}
                onTaskClick={onTaskClick}
              />
            );
          })}

          {showAddColumn ? (
            <AddColumnForm onSubmit={handleAddColumnSubmit}>
              <AddColumnInput
                type="text"
                placeholder="Enter column title..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                autoFocus
              />
              <AddColumnActions>
                <Button type="submit" size="sm" variant="primary">
                  Add
                </Button>
                <Button type="button" size="sm" variant="text" onClick={handleAddColumnCancel}>
                  Cancel
                </Button>
              </AddColumnActions>
            </AddColumnForm>
          ) : (
            <AddColumnButton onClick={handleAddColumnClick}>
              <PlusIcon size={20} />
              <span>Add Column</span>
            </AddColumnButton>
          )}
        </ColumnsContainer>
      </DragDropContext>
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
`;

const ColumnsContainer = styled.div`
  display: flex;
  height: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const AddColumnButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.columnBackground}80`};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  min-width: 280px;
  width: 280px;
  height: 100px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.columnBackground};
  }

  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
  }
`;

const AddColumnForm = styled.form`
  background-color: ${({ theme }) => theme.colors.columnBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  min-width: 280px;
  width: 280px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
  }
`;

const AddColumnInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.font.size.md};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const AddColumnActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export default Board; 