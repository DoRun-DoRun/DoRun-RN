import React from 'react';
import {
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  ScrollContainer,
} from '../Component';
import {View} from 'react-native';
import {styled} from 'styled-components/native';

const TextContainer = styled.TextInput`
  flex: 1;
  padding: 6px 8px;
  border-bottom-width: 1px;
`;

const SelectedContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.primary};
  margin: 0 -16px;
  padding: 24px 16px;
  align-items: center;
`;

const SelectedButton = styled.TouchableOpacity`
  width: 72px;
  padding: 8px 10px;
  color: ${props => props.theme.primary};
  background-color: #fff;
  border-radius: 10px;
`;

const SlotContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  padding: 0 16px;
`;

const CharecterSlot = styled.View`
  width: 88px;
  height: 104px;
  border-radius: 10px;
  background: ${props => props.theme.white};
`;

const ProfileSettingScreen = () => {
  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          <NotoSansKR size={20}>프로필 수정</NotoSansKR>
          <View>
            <NotoSansKR size={18} weight="Medium">
              닉네임 변경
            </NotoSansKR>
            <TextContainer />
          </View>
          <View style={{gap: 16}}>
            <NotoSansKR size={18} weight="Medium">
              캐릭터/펫 변경
            </NotoSansKR>
            <SelectedContainer>
              <SelectedButton>
                <NotoSansKR size={14} color="primary" weight="Medium">
                  선택하기
                </NotoSansKR>
              </SelectedButton>
              <View style={{height: 300}} />
              <ScrollContainer
                horizontal
                style={{marginRight: -16, marginLeft: -16}}>
                <SlotContainer>
                  <CharecterSlot />
                  <CharecterSlot />
                  <CharecterSlot />
                  <CharecterSlot />
                  <CharecterSlot />
                  <CharecterSlot />
                </SlotContainer>
              </ScrollContainer>
            </SelectedContainer>
          </View>
        </InnerContainer>
      </ScrollContainer>
    </HomeContainer>
  );
};

export default ProfileSettingScreen;
