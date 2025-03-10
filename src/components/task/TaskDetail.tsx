import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, Priority, User, Tag as TagType } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Tag from '../common/Tag';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Import our custom icons
import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import FlagIcon from '../icons/FlagIcon';
import UserIcon from '../icons/UserIcon';
import TrashIcon from '../icons/TrashIcon';
import EditIcon from '../icons/EditIcon';
import SaveIcon from '../icons/SaveIcon';
import XIcon from '../icons/XIcon';
import PlusIcon from '../icons/PlusIcon';
import TagIcon from '../icons/TagIcon';

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  users: User[];
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  users,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4a6cfa');
  const [showAddTag, setShowAddTag] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask(JSON.parse(JSON.stringify(task)));
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const assignee = users.find(user => user.id === task.assigneeId);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate ? dueDate < new Date() : false;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedTask(JSON.parse(JSON.stringify(task)));
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdate({
        ...editedTask,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        dueDate: e.target.value ? new Date(e.target.value) : null,
      });
    }
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        assigneeId: e.target.value || undefined,
      });
    }
  };

  const handleDeleteTag = (tagId: string) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        tags: editedTask.tags.filter(tag => tag.id !== tagId),
      });
    }
  };

  const handleAddTag = () => {
    if (editedTask && newTagName.trim()) {
      const newTag: TagType = {
        id: uuidv4(),
        name: newTagName.trim(),
        color: newTagColor,
      };
      
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag],
      });
      
      setNewTagName('');
      setShowAddTag(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirmation(false);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : task.title}
      size="lg"
      footer={
        isEditing ? (
          <FooterActions>
            <Button
              onClick={handleSave}
              variant="primary"
              leftIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="text"
              leftIcon={<XIcon />}
            >
              Cancel
            </Button>
          </FooterActions>
        ) : (
          <FooterActions>
            <Button
              onClick={handleEdit}
              variant="primary"
              leftIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              leftIcon={<TrashIcon />}
            >
              Delete
            </Button>
          </FooterActions>
        )
      }
    >
      <TaskDetailContent>
        {showDeleteConfirmation && (
          <DeleteConfirmation>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <DeleteConfirmationActions>
              <Button onClick={confirmDelete} variant="danger">
                Yes, Delete
              </Button>
              <Button onClick={cancelDelete} variant="outline">
                Cancel
              </Button>
            </DeleteConfirmationActions>
          </DeleteConfirmation>
        )}

        {!showDeleteConfirmation && (
          <>
            {isEditing ? (
              <TaskForm>
                <FormGroup>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormInput
                    type="text"
                    id="title"
                    name="title"
                    value={editedTask.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormTextarea
                    id="description"
                    name="description"
                    value={editedTask.description}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="priority">Priority</FormLabel>
                    <FormSelect
                      id="priority"
                      name="priority"
                      value={editedTask.priority}
                      onChange={handleInputChange}
                    >
                      <option value={Priority.LOW}>Low</option>
                      <option value={Priority.MEDIUM}>Medium</option>
                      <option value={Priority.HIGH}>High</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                    <FormInput
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={
                        editedTask.dueDate
                          ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd')
                          : ''
                      }
                      onChange={handleDueDateChange}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel htmlFor="assignee">Assignee</FormLabel>
                  <FormSelect
                    id="assignee"
                    name="assignee"
                    value={editedTask.assigneeId || ''}
                    onChange={handleAssigneeChange}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>

                <FormGroup>
                  <TagHeader>
                    <FormLabel>Tags</FormLabel>
                    {!showAddTag && (
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<PlusIcon />}
                        onClick={() => setShowAddTag(true)}
                      >
                        Add Tag
                      </Button>
                    )}
                  </TagHeader>
                  {showAddTag && (
                    <AddTagForm>
                      <FormInput
                        type="text"
                        placeholder="Tag name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                      />
                      <ColorInput
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                      />
                      <Button size="sm" variant="primary" onClick={handleAddTag}>
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        onClick={() => setShowAddTag(false)}
                      >
                        Cancel
                      </Button>
                    </AddTagForm>
                  )}
                  <TagsContainer>
                    {editedTask.tags.map((tag) => (
                      <Tag
                        key={tag.id}
                        tag={tag}
                        onRemove={handleDeleteTag}
                      />
                    ))}
                  </TagsContainer>
                </FormGroup>
              </TaskForm>
            ) : (
              <>
                <TaskDescription>{task.description}</TaskDescription>

                <TaskInfo>
                  <InfoItem>
                    <InfoIcon $priority={task.priority}>
                      <FlagIcon />
                    </InfoIcon>
                    <InfoLabel>Priority:</InfoLabel>
                    <InfoValue>{task.priority}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <UserIcon />
                    </InfoIcon>
                    <InfoLabel>Assignee:</InfoLabel>
                    <InfoValue>
                      {assignee ? (
                        <AssigneeInfo>
                          {assignee.avatar && (
                            <Avatar src={assignee.avatar} alt={assignee.name} />
                          )}
                          <span>{assignee.name}</span>
                        </AssigneeInfo>
                      ) : (
                        'Unassigned'
                      )}
                    </InfoValue>
                  </InfoItem>

                  {dueDate && (
                    <InfoItem>
                      <InfoIcon $overdue={isOverdue}>
                        <CalendarIcon />
                      </InfoIcon>
                      <InfoLabel>Due Date:</InfoLabel>
                      <InfoValue $overdue={isOverdue ? true : undefined}>
                        {format(dueDate, 'MMM d, yyyy')}
                        {isOverdue && ' (Overdue)'}
                      </InfoValue>
                    </InfoItem>
                  )}

                  <InfoItem>
                    <InfoIcon>
                      <ClockIcon />
                    </InfoIcon>
                    <InfoLabel>Created:</InfoLabel>
                    <InfoValue>
                      {format(new Date(task.createdAt), 'MMM d, yyyy')}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <ClockIcon />
                    </InfoIcon>
                    <InfoLabel>Updated:</InfoLabel>
                    <InfoValue>
                      {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                    </InfoValue>
                  </InfoItem>

                  {task.tags.length > 0 && (
                    <InfoItem>
                      <InfoIcon>
                        <TagIcon />
                      </InfoIcon>
                      <InfoLabel>Tags:</InfoLabel>
                      <TagsContainer>
                        {task.tags.map((tag) => (
                          <Tag key={tag.id} tag={tag} interactive={false} />
                        ))}
                      </TagsContainer>
                    </InfoItem>
                  )}
                </TaskInfo>
              </>
            )}
          </>
        )}
      </TaskDetailContent>
    </Modal>
  );
};

const TaskDetailContent = styled.div`
  position: relative;
`;

const TaskDescription = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  white-space: pre-wrap;
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.font.size.md};
`;

const InfoIcon = styled.div<{ $priority?: Priority; $overdue?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme, $priority, $overdue }) => {
    if ($overdue) return theme.colors.danger;
    if ($priority === Priority.HIGH) return theme.colors.highPriority;
    if ($priority === Priority.MEDIUM) return theme.colors.mediumPriority;
    if ($priority === Priority.LOW) return theme.colors.lowPriority;
    return theme.colors.primary;
  }};
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.secondary};
  min-width: 80px;
`;

const InfoValue = styled.span<{ $overdue?: boolean }>`
  color: ${({ theme, $overdue }) => ($overdue ? theme.colors.danger : theme.colors.text)};
  font-weight: ${({ theme, $overdue }) => ($overdue ? theme.font.weight.semiBold : theme.font.weight.regular)};
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FooterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskForm = styled.div`
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

const FormLabel = styled.label`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
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

const FormSelect = styled.select`
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

const TagHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AddTagForm = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const DeleteConfirmation = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.danger};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const DeleteConfirmationActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default TaskDetail; 