import React from 'react';
import {View} from 'react-native';
import {ButtonComponent, HomeContainer, NotoSansKR} from '../Component';
import styled from 'styled-components';
import {useModal} from './ModalProvider';
import {ModalHeadBorder} from './CustomModal';

export const DailyModal = () => {
  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <View style={{gap: 24}}>
        <NotoSansKR size={18} weight="Bold" textAlign="center">
          우리가 해냈어요!{'\n'}
          두런두런이 여러분의 앞길을 응원할게요!
        </NotoSansKR>
        <ImageContainer>
          <ImageDummy />
        </ImageContainer>

        <View style={{gap: 8}}>
          <ButtonComponent>친구한테 자랑하기</ButtonComponent>
          <ButtonComponent type="secondary">이미지 저장하기</ButtonComponent>
        </View>
      </View>
    </View>
  );
};

const ImageDummy = styled(View)`
  width: 248px;
  height: 264px;
  background: ${props => props.theme.gray6};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 3;
`;

const ImageContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const ZoomImageDummy = styled(View)`
  width: 264px;
  height: 264px;
  background: ${props => props.theme.gray6};
`;

export const ImageZoomModal = () => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <ZoomImageDummy />
    </View>
  );
};

export const UsedItemModal = () => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <ZoomImageDummy />
      <NotoSansKR size={18} weight="Bold" textAlign="center">
        이런! [닉네임A]님이{'\n'}
        [아이템]을 사용했어요!
      </NotoSansKR>
    </View>
  );
};

export const TryModal = () => {
  const {showModal} = useModal();
  const openModal = () => {
    showModal(<UsedItemModal />);
  };

  return (
    <HomeContainer>
      <ButtonComponent onPress={openModal}>
        클릭 시 일일 일기 모달 호출
      </ButtonComponent>
    </HomeContainer>
  );
};
