import React from 'react'
import styled from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode,
}

const CardIcon: React.FC<CardIconProps> = ({ children }) => (
  <StyledCardIcon>
    {children}
  </StyledCardIcon>
)

const StyledCardIcon = styled.div`
  background-color: ${props => props.theme.color.grey[200]};
  font-size: 36px;
  height: 40px;
  width: 80px;
  border-radius: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  // margin: 0 auto ${props => props.theme.spacing[3]}px;
  @media (max-width: 767px) {
    height: 50px;
    width: 50px;
    border-radius: 25px;
    margin: 0 auto 11px;
    }

`

export default CardIcon