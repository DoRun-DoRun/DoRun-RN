import React from 'react';
import {TextInput, View} from 'react-native';
import {ButtonComponent, HomeContainer, NotoSansKR} from '../Component';
import styled, {useTheme} from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useModal} from './ModalProvider';

export const DailyModal = () => {
  const theme = useTheme();
  return (
    <View style={{gap: 24}}>
      <BorderBottomContainer>
        <NotoSansKR size={20} weight="Bold">
          [닉네임A]님 축하드려요! {'\n'} 오늘 목표를 전부 완료했어요!
        </NotoSansKR>
      </BorderBottomContainer>
      <View style={{gap: 16}}>
        <NotoSansKR size={16}>오늘을 사진과 글로 남겨봐요!</NotoSansKR>
        <NotoSansKR size={12} color="gray3">
          해당 내용은 친구들이 24시간동안 확인할 수 있어요! {'\n'}
          24시간 후에는 나만 확인 할 수 있게 프로필에 저장할게요.
        </NotoSansKR>
        <PhotoUploadFrame>
          <MaterialIcons
            name="add-to-photos"
            color={theme.primary1}
            size={40}
          />
        </PhotoUploadFrame>
        <BorderBottomContainer>
          <TextInput
            style={{color: theme.gray3, fontSize: 14}}
            placeholder="한줄 일기를 작성해봐요!"
          />
        </BorderBottomContainer>
        <ButtonComponent type="secondary">오늘은 넘어갈래요</ButtonComponent>
      </View>
    </View>
  );
};

const PhotoUploadFrame = styled(View)`
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 88px;
  height: 96px;
  border: 2px solid ${props => props.theme.primary1};
`;

const BorderBottomContainer = styled(View)`
  border-bottom: 1px solid ${props => props.theme.gray5};
`;

export const TryModal = () => {
  const {showModal} = useModal();
  const openModal = () => {
    showModal(<DailyModal />);
  };

  return (
    <HomeContainer>
      <ButtonComponent onPress={openModal}>
        클릭 시 일일 일기 모달 호출
      </ButtonComponent>
    </HomeContainer>
  );
};
