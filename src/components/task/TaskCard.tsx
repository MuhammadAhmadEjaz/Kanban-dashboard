import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { Task, Priority as TaskPriority, User } from '../../types';
import Tag from '../common/Tag';
import { format } from 'date-fns';
import ClockIcon from '../icons/ClockIcon';
import FlagIcon from '../icons/FlagIcon';
import UserIcon from '../icons/UserIcon';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
  users: User[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick, users }) => {
  const assignee = users.find(user => user.id === task.assigneeId);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate ? dueDate < new Date() : false;

  const handleClick = () => {
    onClick(task);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'highPriority';
      case TaskPriority.MEDIUM:
        return 'mediumPriority';
      case TaskPriority.LOW:
        return 'lowPriority';
      default:
        return 'lowPriority';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <TaskCardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={snapshot.isDragging ? 'dragging' : ''}
          data-testid="task-card"
        >
          <TaskTitle>{task.title}</TaskTitle>
          
          {task.description && (
            <TaskDescription>
              {task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description}
            </TaskDescription>
          )}
          
          <TagsContainer>
            {task.tags.map(tag => (
              <Tag key={tag.id} tag={tag} interactive={false} />
            ))}
          </TagsContainer>
          
          <TaskFooter>
            {dueDate && (
              <DueDate $isOverdue={isOverdue ? true : undefined}>
                <ClockIcon size={12} />
                <span>{format(dueDate, 'MMM d')}</span>
              </DueDate>
            )}
            
            <Priority $color={getPriorityColor(task.priority)}>
              <FlagIcon size={12} />
              <span>{task.priority}</span>
            </Priority>
            
            {assignee && (
              <AssigneeContainer>
                <UserIcon size={12} />
                {assignee.avatar ? (
                  <Avatar src={assignee.avatar} alt={assignee.name} />
                ) : (
                  <AssigneeInitials>
                    {assignee.name.split(' ').map(n => n[0]).join('')}
                  </AssigneeInitials>
                )}
              </AssigneeContainer>
            )}
          </TaskFooter>
        </TaskCardContainer>
      )}
    </Draggable>
  );
};

const TaskCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.taskBackground};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};
  user-select: none;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }

  &.dragging {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const TaskTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const TaskDescription = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  white-space: pre-wrap;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const DueDate = styled.div<{ $isOverdue: boolean | undefined }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ $isOverdue, theme }) => ($isOverdue ? theme.colors.danger : theme.colors.secondary)};
  font-weight: ${({ $isOverdue, theme }) => ($isOverdue ? theme.font.weight.semiBold : theme.font.weight.regular)};
`;

const Priority = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ $color, theme }) => {
    switch ($color) {
      case 'highPriority':
        return theme.colors.highPriority;
      case 'mediumPriority':
        return theme.colors.mediumPriority;
      case 'lowPriority':
        return theme.colors.lowPriority;
      default:
        return theme.colors.lowPriority;
    }
  }};
`;

const AssigneeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const AssigneeInitials = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

export default TaskCard; 