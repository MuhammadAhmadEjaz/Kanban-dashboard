import React from 'react';
import styled from 'styled-components';
import { Tag as TagType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import XIcon from '../icons/XIcon';

interface TagProps {
  tag: TagType;
  onRemove?: (id: string) => void;
  interactive?: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, onRemove, interactive = true }) => {
  const { themeMode } = useTheme();
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag.id);
    }
  };

  return (
    <TagContainer color={tag.color} interactive={interactive} darkMode={themeMode === 'dark'}>
      <TagText>{tag.name}</TagText>
      {onRemove && interactive && (
        <RemoveButton onClick={handleRemove} aria-label={`Remove tag ${tag.name}`}>
          <XIcon size={12} />
        </RemoveButton>
      )}
    </TagContainer>
  );
};

const TagContainer = styled.div<{ color: string; interactive: boolean; darkMode: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${({ color }) => `${color}44`}; // Using alpha for transparency
  color: ${({ color, darkMode }) => (darkMode ? '#ffffff' : color)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  border: 1px solid ${({ color }) => `${color}88`};
  cursor: ${({ interactive }) => (interactive ? 'default' : 'auto')};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ color, interactive }) => interactive ? `${color}66` : `${color}44`};
  }
`;

const TagText = styled.span`
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ theme }) => theme.spacing.xs};
  padding: 2px;
  cursor: pointer;
  border-radius: 50%;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default Tag; 