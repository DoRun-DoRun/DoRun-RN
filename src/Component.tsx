import React from 'react';
import styled from 'styled-components/native';

interface ButtonType {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'disabled';
  onPress?: () => void;
}

const ButtonContainer = styled.TouchableOpacity<{color: string}>`
  background-color: ${props => props.theme[props.color]};
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

export const TextComponent = styled.Text`
  font-family: 'NotoSansKr';
`;

const ButtonText = styled.Text<{color: string}>`
  color: ${props => props.theme[props.color]};
  font-weight: 700;
`;

export const InnerContainer = styled.View`
  padding: 16px;
  text-align: left;
`;

export const Button = ({children, type, onPress}: ButtonType) => {
  let color = 'white';
  let backgroundColor = 'primary';

  if (type === 'secondary') {
    color = 'gray4';
    backgroundColor = 'null';
  } else if (type === 'disabled') {
    color = 'gray2';
    backgroundColor = 'gray5';
  }

  return (
    <ButtonContainer color={backgroundColor} onPress={onPress}>
      <ButtonText color={color}>{children}</ButtonText>
    </ButtonContainer>
  );
};
