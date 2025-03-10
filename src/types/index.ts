export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  assigneeId?: string;
  tags: Tag[];
  attachments?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  tasks: { [key: string]: Task };
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
} 