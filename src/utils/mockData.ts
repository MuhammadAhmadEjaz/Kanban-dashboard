import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Priority, Task, User, UserRole } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: UserRole.ADMIN,
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: UserRole.EDITOR,
  },
  {
    id: uuidv4(),
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: UserRole.VIEWER,
  },
];

// Create mock tasks
const createMockTasks = (): { [key: string]: Task } => {
  const tasks: { [key: string]: Task } = {};

  // Create a few sample tasks
  const taskIds = [
    // To Do column tasks
    uuidv4(),
    uuidv4(),
    uuidv4(),
    // In Progress column tasks
    uuidv4(),
    uuidv4(),
    // Done column tasks
    uuidv4(),
    uuidv4(),
  ];

  // To Do tasks
  tasks[taskIds[0]] = {
    id: taskIds[0],
    title: 'Research competitor products',
    description: 'Analyze top 5 competitor products and identify key features',
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: mockUsers[0].id,
    tags: [
      { id: uuidv4(), name: 'Research', color: '#FF5733' },
      { id: uuidv4(), name: 'Marketing', color: '#33FFA8' },
    ],
  };

  tasks[taskIds[1]] = {
    id: taskIds[1],
    title: 'Design new homepage layout',
    description: 'Create wireframes and mockups for the new homepage design',
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: mockUsers[1].id,
    tags: [
      { id: uuidv4(), name: 'Design', color: '#33A1FF' },
      { id: uuidv4(), name: 'UI/UX', color: '#D133FF' },
    ],
  };

  tasks[taskIds[2]] = {
    id: taskIds[2],
    title: 'Update user documentation',
    description: 'Review and update the user documentation with new features',
    priority: Priority.LOW,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: mockUsers[2].id,
    tags: [
      { id: uuidv4(), name: 'Documentation', color: '#33FF57' },
    ],
  };

  // In Progress tasks
  tasks[taskIds[3]] = {
    id: taskIds[3],
    title: 'Implement authentication system',
    description: 'Set up OAuth and JWT for the new authentication system',
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: mockUsers[0].id,
    tags: [
      { id: uuidv4(), name: 'Development', color: '#FFD700' },
      { id: uuidv4(), name: 'Security', color: '#FF0000' },
    ],
  };

  tasks[taskIds[4]] = {
    id: taskIds[4],
    title: 'Refactor API endpoints',
    description: 'Refactor API endpoints to follow REST principles',
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: mockUsers[1].id,
    tags: [
      { id: uuidv4(), name: 'API', color: '#008080' },
      { id: uuidv4(), name: 'Development', color: '#FFD700' },
    ],
  };

  // Done tasks
  tasks[taskIds[5]] = {
    id: taskIds[5],
    title: 'Fix navigation bug',
    description: 'Fixed the bug in the navigation menu that caused it to collapse on mobile',
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    assigneeId: mockUsers[0].id,
    tags: [
      { id: uuidv4(), name: 'Bug', color: '#FF0000' },
      { id: uuidv4(), name: 'Mobile', color: '#800080' },
    ],
  };

  tasks[taskIds[6]] = {
    id: taskIds[6],
    title: 'Create login page design',
    description: 'Designed the new login page with dark mode support',
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    assigneeId: mockUsers[1].id,
    tags: [
      { id: uuidv4(), name: 'Design', color: '#33A1FF' },
      { id: uuidv4(), name: 'UI/UX', color: '#D133FF' },
    ],
  };

  return tasks;
};

// Create mock columns
const createMockColumns = (taskIds: string[]): Column[] => {
  return [
    {
      id: uuidv4(),
      title: 'To Do',
      taskIds: taskIds.slice(0, 3),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'In Progress',
      taskIds: taskIds.slice(3, 5),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Done',
      taskIds: taskIds.slice(5, 7),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Create mock board
export const createMockBoard = (): Board => {
  const tasks = createMockTasks();
  const taskIds = Object.keys(tasks);
  const columns = createMockColumns(taskIds);

  return {
    id: uuidv4(),
    title: 'Development Board',
    columns,
    tasks,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}; 