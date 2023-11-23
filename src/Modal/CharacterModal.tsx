/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import {View} from 'react-native';
import {
  ButtonComponent,
  ButtonContainer,
  HomeContainer,
  NotoSansKR,
} from '../Component';
import {useModal} from './ModalProvider';
import styled, {useTheme} from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Slider} from '@miblanchard/react-native-slider';

const UserProfile = styled(View)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  border: 4px solid #648cf3;
`;
const UserStatues = styled(View)`
  display: flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 4px;
  background-color: #dfeaff;
`;

export const CharacterModal = () => {
  const theme = useTheme();
  const [myValue, setMyValue] = useState(0);
  return (
    <View style={{paddingVertical: 16, paddingHorizontal: 12}}>
      <View style={{gap: 16, flexDirection: 'column'}}>
        <View style={{gap: 8, flexDirection: 'row'}}>
          <UserProfile />
          <View style={{gap: 8, flexDirection: 'column', alignItems: 'center'}}>
            <View
              style={{
                gap: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <UserStatues>
                <MaterialIcons
                  name="directions-run"
                  color={theme.primary1}
                  size={18}
                />
                <NotoSansKR size={14} color="primary1">
                  뛰고 있음
                </NotoSansKR>
              </UserStatues>

              <NotoSansKR size={20}>달려라 갓생팀</NotoSansKR>
            </View>
            <View style={{flex: 1}}>
              <Slider
                value={myValue}
                minimumTrackTintColor={theme.primary1}
                maximumTrackTintColor={theme.primary2}
                thumbTintColor={theme.primary1}
                onValueChange={values => setMyValue(values[0])}
              />
            </View>
          </View>
        </View>
        <ButtonContainer color="primary2">
          <NotoSansKR size={14} color="primary1">
            "오늘도 열심히 해야지!"
          </NotoSansKR>
        </ButtonContainer>
        <View
          style={{
            gap: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name="speaker-notes"
            color={theme.primary1}
            size={32}
          />
          <NotoSansKR size={18} color={'gray3'}>
            달리기 1km 오늘도 화이ㅣ이이팅
          </NotoSansKR>
        </View>
      </View>
    </View>
  );
};

export const CharModal = () => {
  const {showModal} = useModal();
  const openModal = () => {
    showModal(<CharacterModal />);
  };

  return (
    <HomeContainer>
      <ButtonComponent onPress={openModal}>챌린지 모달 출력</ButtonComponent>
    </HomeContainer>
  );
};
