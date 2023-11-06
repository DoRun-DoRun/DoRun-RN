import React from 'react';
import styled from 'styled-components/native';

interface ButtonType {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'gray';
  onPress?: () => void;
}

const ButtonContainer = styled.TouchableOpacity<{color: string}>`
  background-color: ${props => props.theme[props.color]};
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

interface FontType {
  size: number;
  weight?: 'Bold' | 'Regular' | 'Medium';
  color?: string;
  lineHeight?: number;
}

export const NotoSansKR = styled.Text<FontType>`
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`};
  line-height: ${({lineHeight, size}) =>
    lineHeight ? lineHeight + 'px' : size * 1.45 + 'px'};
  font-size: ${({size}) => size + 'px'};
`;

export const InnerContainer = styled.View<{gap?: number}>`
  display: flex;
  flex: 1;
  padding: 16px 16px 0;
  text-align: left;
  gap: ${props => props.gap + 'px'};
`;

export const HomeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const RowScrollView = styled.View`
  flex-direction: row;
  padding: 0 16px;
`;

interface ScrollContainerType {
  children: React.ReactNode;
  gap?: number;
}

export const RowScrollContainer = ({children, gap}: ScrollContainerType) => {
  return (
    <ScrollContainer horizontal style={{marginLeft: -16, marginRight: -16}}>
      <RowScrollView style={{gap: gap}}>{children}</RowScrollView>
    </ScrollContainer>
  );
};

export const ButtonComponent = ({children, type, onPress}: ButtonType) => {
  let color = 'white';
  let backgroundColor = 'primary';

  if (type === 'secondary') {
    color = 'gray4';
    backgroundColor = 'null';
  } else if (type === 'gray') {
    color = 'gray2';
    backgroundColor = 'gray5';
  }

  return (
    <ButtonContainer color={backgroundColor} onPress={onPress}>
      <NotoSansKR color={color} size={16}>
        {children}
      </NotoSansKR>
    </ButtonContainer>
  );
};
