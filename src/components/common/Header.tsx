import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppSelector } from '../../hooks/reduxHooks';
import Button from './Button';
import MenuIcon from '../icons/MenuIcon';
import MoonIcon from '../icons/MoonIcon';
import SunIcon from '../icons/SunIcon';
import UserIcon from '../icons/UserIcon';
import LogoutIcon from '../icons/LogoutIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onLogout }) => {
  const { themeMode, toggleTheme } = useTheme();
  const { currentUser } = useAppSelector(state => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <MenuIcon size={20} />
        </MenuButton>
        <Logo>Kanban Board</Logo>
      </HeaderLeft>

      <HeaderRight>
        <ThemeToggle onClick={toggleTheme} aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          {themeMode === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
        </ThemeToggle>

        {currentUser && (
          <UserSection>
            <UserButton onClick={handleUserMenuToggle}>
              {currentUser.avatar ? (
                <UserAvatar src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <UserInitials>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </UserInitials>
              )}
              <UserName>{currentUser.name}</UserName>
              <ChevronDownIcon size={16} />
            </UserButton>

            {showUserMenu && (
              <UserMenu>
                <UserMenuItem>
                  <UserIcon size={16} />
                  <span>Profile</span>
                </UserMenuItem>
                <UserMenuItem onClick={handleLogout}>
                  <LogoutIcon size={16} />
                  <span>Logout</span>
                </UserMenuItem>
              </UserMenu>
            )}
          </UserSection>
        )}

        {!currentUser && (
          <Button size="sm" variant="primary">
            Login
          </Button>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  margin: 0 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInitials = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 200px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const UserMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.text};

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

export default Header; 