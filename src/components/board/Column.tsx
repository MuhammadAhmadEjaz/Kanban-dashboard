import React, { useState } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, Task as TaskType, User } from '../../types';
import TaskCard from '../task/TaskCard';
import Button from '../common/Button';
import PlusIcon from '../icons/PlusIcon';
import MoreIcon from '../icons/MoreIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  users: User[];
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (column: ColumnType) => void;
  onTaskClick: (task: TaskType) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  users,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskClick,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleAddTask = () => {
    onAddTask(column.id);
  };

  const handleEditColumn = () => {
    onEditColumn(column);
    setShowOptions(false);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(column);
    setShowOptions(false);
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <ColumnContainer>
      <ColumnHeader>
        <ColumnTitle>
          {column.title}
          <TaskCount>({tasks.length})</TaskCount>
        </ColumnTitle>
        <OptionsContainer>
          <OptionsButton onClick={toggleOptions} aria-label="Column options">
            <MoreIcon size={18} />
          </OptionsButton>
          {showOptions && (
            <OptionsMenu>
              <OptionItem onClick={handleEditColumn}>
                <EditIcon size={14} />
                Edit Column
              </OptionItem>
              <OptionItem onClick={handleDeleteColumn}>
                <TrashIcon size={14} />
                Delete Column
              </OptionItem>
            </OptionsMenu>
          )}
        </OptionsContainer>
      </ColumnHeader>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
                users={users}
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>

      <ColumnFooter>
        <Button
          onClick={handleAddTask}
          variant="outline"
          size="sm"
          leftIcon={<PlusIcon size={16} />}
          isFullWidth
        >
          Add Task
        </Button>
      </ColumnFooter>
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.columnBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  min-width: 280px;
  width: 280px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  max-height: 100%;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    min-width: 260px;
    width: 260px;
  }
`;

const ColumnHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
`;

const TaskCount = styled.span`
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.font.weight.regular};
`;

const OptionsContainer = styled.div`
  position: relative;
`;

const OptionsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 150px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const OptionItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  width: 100%;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const TaskList = styled.div<{ $isDraggingOver: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
  overflow-y: auto;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  background-color: ${({ $isDraggingOver, theme }) =>
    $isDraggingOver ? `${theme.colors.hover}` : 'transparent'};
  min-height: 100px;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

const ColumnFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default Column; 