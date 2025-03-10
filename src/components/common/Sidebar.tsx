import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/reduxHooks';
import { UserRole } from '../../types';
import GridIcon from '../icons/GridIcon';
import ListIcon from '../icons/ListIcon';
import CalendarIcon from '../icons/CalendarIcon';
import SettingsIcon from '../icons/SettingsIcon';
import BarChartIcon from '../icons/BarChartIcon';
import PlusIcon from '../icons/PlusIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: () => void;
  currentBoardId?: string;
  onBoardSelect: (boardId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
  currentBoardId,
  onBoardSelect,
}) => {
  const { boards } = useAppSelector(state => state.board);
  const { currentUser } = useAppSelector(state => state.user);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const canCreateBoards = isAdmin || currentUser?.role === UserRole.EDITOR;

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <SidebarTitle>Navigation</SidebarTitle>
        <CloseButton onClick={onClose} aria-label="Close Sidebar">
          <ArrowLeftIcon size={20} />
        </CloseButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSection>
          <SidebarSectionTitle>Views</SidebarSectionTitle>
          <NavItem active>
            <GridIcon size={18} />
            <span>Boards</span>
          </NavItem>
          <NavItem>
            <ListIcon size={18} />
            <span>Tasks</span>
          </NavItem>
          <NavItem>
            <CalendarIcon size={18} />
            <span>Calendar</span>
          </NavItem>
          <NavItem>
            <BarChartIcon size={18} />
            <span>Analytics</span>
          </NavItem>
        </SidebarSection>

        <SidebarSection>
          <SidebarSectionHeader>
            <SidebarSectionTitle>My Boards</SidebarSectionTitle>
            {canCreateBoards && (
              <AddButton onClick={onCreateBoard} aria-label="Create new board">
                <PlusIcon size={16} />
              </AddButton>
            )}
          </SidebarSectionHeader>
          
          <BoardsList>
            {boards.map(board => (
              <BoardItem
                key={board.id}
                $active={board.id === currentBoardId}
                onClick={() => onBoardSelect(board.id)}
              >
                <BoardIcon>
                  <GridIcon size={16} />
                </BoardIcon>
                <BoardName>{board.title}</BoardName>
              </BoardItem>
            ))}
          </BoardsList>
        </SidebarSection>
      </SidebarContent>

      {isAdmin && (
        <SidebarFooter>
          <NavItem>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </NavItem>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  width: 280px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 64px;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-280px')};
  z-index: ${({ theme }) => theme.zIndex.header - 1};
  transition: left ${({ theme }) => theme.transitions.normal};
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 260px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-260px')};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SidebarSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SidebarSectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.text)};
  background-color: ${({ theme, active }) => (active ? `${theme.colors.primary}10` : 'transparent')};
  font-weight: ${({ theme, active }) => (active ? theme.font.weight.semiBold : theme.font.weight.regular)};
  text-align: left;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, active }) => (active ? `${theme.colors.primary}20` : theme.colors.hover)};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BoardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 300px;
  overflow-y: auto;
`;

const BoardItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: left;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.primary}10` : 'transparent')};
  font-weight: ${({ theme, $active }) => ($active ? theme.font.weight.semiBold : theme.font.weight.regular)};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? `${theme.colors.primary}20` : theme.colors.hover)};
  }
`;

const BoardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const BoardName = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default Sidebar; 