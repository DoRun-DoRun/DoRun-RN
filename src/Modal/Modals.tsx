import React from 'react';
import {View} from 'react-native';
import {ButtonComponent, HomeContainer, NotoSansKR} from '../Component';
import styled, {useTheme} from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useModal} from './ModalProvider';

export const DailyModal = () => {
  const theme = useTheme();
  return (
    <View>
      <ModalHeader>
        <MaterialIcons name="horizontal-rule" size={35} color={theme.gray6} />
      </ModalHeader>
      <View style={{gap: 24}}>
        <NotoSansKR size={18} weight="Bold" textAlign="center">
          우리가 해냈어요!{'\n'}
          두런두런이 여러분의 앞길을 응원할게요!
        </NotoSansKR>
        <ImageContainer>
          <ImageDummy />
        </ImageContainer>

        <>
          <ButtonComponent>친구한테 자랑하기</ButtonComponent>
          <ButtonComponent type="secondary">이미지 저장하기</ButtonComponent>
        </>
      </View>
    </View>
  );
};

const ModalHeader = styled(View)`
  align-items: center;
  padding: 20px 0;
`;

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
  padding: 22px;
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
