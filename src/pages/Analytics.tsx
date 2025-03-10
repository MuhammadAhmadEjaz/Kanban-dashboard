import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks/reduxHooks';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import BarChartIcon from '../components/icons/BarChartIcon';
import FilterIcon from '../components/icons/FilterIcon';

const Analytics: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { boards, currentBoard } = useAppSelector(state => state.board);
  const [selectedBoardId, setSelectedBoardId] = useState<string | undefined>(
    currentBoard?.id || boards[0]?.id
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId);
  };

  const handleCreateBoard = () => {
    // This should be handled by Redux, but we're focusing on the Analytics UI here
  };

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  return (
    <AnalyticsContainer>
      <Header onToggleSidebar={toggleSidebar} />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onCreateBoard={handleCreateBoard}
        currentBoardId={selectedBoardId}
        onBoardSelect={handleBoardSelect}
      />

      <MainContent $sidebarOpen={isSidebarOpen}>
        <PageHeader>
          <PageTitle>
            <BarChartIcon size={20} />
            Analytics Dashboard
          </PageTitle>

          <FilterContainer>
            <FilterLabel>
              <FilterIcon size={16} />
              <span>Board:</span>
            </FilterLabel>
            <BoardSelector 
              value={selectedBoardId} 
              onChange={(e) => handleBoardSelect(e.target.value)}
            >
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </BoardSelector>
          </FilterContainer>
        </PageHeader>

        {selectedBoard ? (
          <AnalyticsCharts board={selectedBoard} />
        ) : (
          <EmptyState>
            <h2>No board selected</h2>
            <p>Please select a board from the dropdown menu.</p>
          </EmptyState>
        )}
      </MainContent>
    </AnalyticsContainer>
  );
};

const AnalyticsContainer = styled.div`
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
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const BoardSelector = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 80px);
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};

  h2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default Analytics; 