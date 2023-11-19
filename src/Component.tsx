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
  weight?: 'Bold' | 'Medium' | 'Regular';
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

export const InputNotoSansKR = styled.TextInput<FontType>`
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  // 안드로이드에서 font 오류
  /* font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`}; */
  line-height: ${({lineHeight, size}) =>
    lineHeight ? lineHeight + 'px' : size * 1.45 + 'px'};
  font-size: ${({size}) => size + 'px'};
  padding: 0;
  margin: 0;
  align-items: center;
`;

export const TossFace = styled.Text<{size?: number}>`
  font-size: ${({size}) => size + 'px'};
  font-family: 'TossFaceFontMac';
`;

export const InnerContainer = styled.View<{gap?: number; seperate?: boolean}>`
  flex: 1;
  padding: 16px;
  text-align: left;
  justify-content: ${props =>
    props.seperate ? 'space-between' : 'flex-start'};
`;

export const HomeContainer = styled.SafeAreaView`
  position: relative;
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
  let backgroundColor = 'primary1';

  if (type === 'secondary') {
    color = 'gray4';
    backgroundColor = 'white';
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

export const RowContainer = styled.View<{gap?: number; seperate?: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: ${props =>
    props.seperate ? 'space-between' : 'flex-start'};
`;

export async function createGuestUser() {
  const response = await fetch('http://dorun.site/user/create/guest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // 필요한 경우 body 데이터를 추가하세요.
    // body: JSON.stringify({ key: 'value' }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

interface API {
  endpoint: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  accessToken?: string;
  body?: object;
}

interface Config {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
}

export async function CallApi({endpoint, method, accessToken, body}: API) {
  const url = `http://dorun.site/${endpoint}`;

  const config: Config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (body && method !== 'GET') {
    // GET 요청은 body를 포함하지 않음
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
}
