import React, { useState } from 'react';
import styled from 'styled-components';
import { Priority, Task, User } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  columnId: string;
  users: User[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  columnId,
  users,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || undefined,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onSubmit(newTask);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDueDate('');
    setAssigneeId('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="md"
      footer={
        <FooterActions>
          <Button type="submit" form="task-form" variant="primary">
            Create Task
          </Button>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </FooterActions>
      }
    >
      <StyledForm id="task-form" onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={5}
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            id="assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormGroup>
      </StyledForm>
    </Modal>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  & > * {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.font.size.md};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.font.size.md};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.font.size.md};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const FooterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export default TaskForm; 