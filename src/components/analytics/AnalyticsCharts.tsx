import React, { useMemo } from 'react';
import styled from 'styled-components';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Board, Priority } from '../../types';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsChartsProps {
  board: Board;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ board }) => {
  // Calculate task statistics
  const taskStats = useMemo(() => {
    const allTasks = Object.values(board.tasks);
    const totalTasks = allTasks.length;
    
    // Count tasks by priority
    const priorityCounts = {
      [Priority.LOW]: 0,
      [Priority.MEDIUM]: 0,
      [Priority.HIGH]: 0,
    };
    
    // Count tasks by column
    const columnCounts: Record<string, number> = {};
    board.columns.forEach(column => {
      columnCounts[column.title] = column.taskIds.length;
    });
    
    // Count overdue tasks
    const now = new Date();
    const overdueTasks = allTasks.filter(
      task => task.dueDate && new Date(task.dueDate) < now
    ).length;
    
    // Count upcoming tasks (due in next 7 days)
    const upcomingDeadline = new Date();
    upcomingDeadline.setDate(upcomingDeadline.getDate() + 7);
    const upcomingTasks = allTasks.filter(
      task => 
        task.dueDate && 
        new Date(task.dueDate) >= now && 
        new Date(task.dueDate) <= upcomingDeadline
    ).length;
    
    // Count tasks by priority
    allTasks.forEach(task => {
      priorityCounts[task.priority]++;
    });
    
    return {
      totalTasks,
      priorityCounts,
      columnCounts,
      overdueTasks,
      upcomingTasks,
    };
  }, [board]);

  // Data for priority distribution chart
  const priorityChartData: ChartData<'pie'> = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: [
          taskStats.priorityCounts[Priority.LOW],
          taskStats.priorityCounts[Priority.MEDIUM],
          taskStats.priorityCounts[Priority.HIGH],
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(220, 53, 69, 0.6)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for tasks by column chart
  const columnChartData: ChartData<'bar'> = {
    labels: Object.keys(taskStats.columnCounts),
    datasets: [
      {
        label: 'Tasks',
        data: Object.values(taskStats.columnCounts),
        backgroundColor: 'rgba(74, 108, 250, 0.6)',
        borderColor: 'rgba(74, 108, 250, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for due date status chart
  const dueStatusChartData: ChartData<'pie'> = {
    labels: ['Overdue', 'Due Soon', 'Other'],
    datasets: [
      {
        data: [
          taskStats.overdueTasks,
          taskStats.upcomingTasks,
          taskStats.totalTasks - taskStats.overdueTasks - taskStats.upcomingTasks,
        ],
        backgroundColor: [
          'rgba(220, 53, 69, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(108, 117, 125, 0.6)',
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AnalyticsContainer>
      <ChartSection>
        <ChartTitle>Task Priority Distribution</ChartTitle>
        <ChartContainer>
          <Pie 
            data={priorityChartData} 
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </ChartContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>Tasks by Column</ChartTitle>
        <ChartContainer>
          <Bar 
            data={columnChartData} 
            options={{
              plugins: {
                legend: {
                  display: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }}
          />
        </ChartContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>Task Deadline Status</ChartTitle>
        <ChartContainer>
          <Pie 
            data={dueStatusChartData} 
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </ChartContainer>
      </ChartSection>

      <StatsSection>
        <StatItem>
          <StatValue>{taskStats.totalTasks}</StatValue>
          <StatLabel>Total Tasks</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{taskStats.overdueTasks}</StatValue>
          <StatLabel>Overdue Tasks</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{taskStats.upcomingTasks}</StatValue>
          <StatLabel>Due Soon</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{board.columns.length}</StatValue>
          <StatLabel>Columns</StatLabel>
        </StatItem>
      </StatsSection>
    </AnalyticsContainer>
  );
};

const AnalyticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  background-color: ${({ theme }) => theme.colors.taskBackground};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChartTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  background-color: ${({ theme }) => theme.colors.taskBackground};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export default AnalyticsCharts; 