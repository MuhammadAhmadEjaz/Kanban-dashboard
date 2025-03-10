# Kanban Task Management Dashboard

A modern, feature-rich Kanban-style task management application built with React, TypeScript, and Redux.

## Features

- **Multiple Columns & Custom Workflow**
  - Default columns: "To Do," "In Progress," and "Done"
  - Create custom columns for personalized workflows
  - Drag-and-drop task movement between columns
  - Responsive layout for all devices

- **Task Management**
  - Create, edit, and delete tasks
  - Inline editing for task details
  - Task tagging with customizable labels
  - Priority settings (low, medium, high) with visual indicators
  - Detailed task view with comments and history

- **Real-Time Collaboration**
  - User presence on tasks
  - Visual indicators for task deadlines

- **User Interface**
  - Clean, intuitive interface with modern design
  - Smooth animations for drag-and-drop and transitions
  - Dark mode toggle with full theme support
  - Accessible design following best practices
  - Search and filtering options

- **Analytics Dashboard**
  - Task distribution visualization
  - Productivity trends
  - Deadline tracking

## Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Styled-components
- **UI Components**: Custom components
- **Drag and Drop**: react-beautiful-dnd
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/kanban-task-management.git
   cd kanban-task-management
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard View

The main view displays your Kanban board with tasks organized in columns. From here, you can:

- Drag and drop tasks between columns
- Click on a task to view or edit details
- Add new tasks by clicking the "+" button in any column
- Add new columns using the "Add Column" button
- Toggle dark/light mode using the theme button in the header

### Task Management

- **Creating Tasks**: Click the "+" button in a column and fill in the task details
- **Editing Tasks**: Click on a task to open the task detail modal, then click "Edit"
- **Moving Tasks**: Drag a task card and drop it in the desired column
- **Deleting Tasks**: Open the task detail modal and click "Delete"

### Analytics

Navigate to the Analytics page to view charts and statistics about your tasks:

- Priority distribution
- Tasks by column
- Deadline status
- Overall task metrics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and Redux teams for the excellent libraries
- The creators of react-beautiful-dnd for the drag and drop functionality
- Chart.js team for the visualization tools
