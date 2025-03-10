import React, { ReactNode, JSXElementConstructor } from 'react';
import styled from 'styled-components';

interface IconWrapperProps {
  children: ReactNode;
}

// A simpler wrapper component that should work for React icons
const IconWrapper: React.FC<IconWrapperProps> = ({ children }) => {
  return <span className="icon-wrapper" style={{ display: 'inline-flex', flexShrink: 0 }}>{children}</span>;
};

export default IconWrapper; 