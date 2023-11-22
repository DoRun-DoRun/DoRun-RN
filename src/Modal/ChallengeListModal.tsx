import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {ButtonComponent, HomeContainer, NotoSansKR} from '../Component';
import {
  BetweenModalContainer,
  ChallengeTimeBox,
  ModalHeadText,
  StatusComponent,
} from './CustomModal';
import {useModal} from './ModalProvider';
import OcticonIcons from 'react-native-vector-icons/Octicons';

export const ChallengeListModal = () => {
  const [isSecondSectionVisible, setSecondSectionVisible] = useState(false);
  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20} weight="Bold">
          [닉네임A]에게 초대가 왔어요
        </NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 16}}>
        <View style={{gap: 16, flexDirection: 'row', alignItems: 'center'}}>
          <NotoSansKR size={40} weight="Medium">
            🎲
          </NotoSansKR>
          <NotoSansKR size={25}>챌린지 목표</NotoSansKR>
        </View>

        <TouchableOpacity
          onPress={() => setSecondSectionVisible(!isSecondSectionVisible)}>
          <BetweenModalContainer>
            <NotoSansKR size={20}>챌린지 참여 인원</NotoSansKR>
            <OcticonIcons name="chevron-down" size={26} color={'black'} />
          </BetweenModalContainer>
        </TouchableOpacity>

        {isSecondSectionVisible && (
          <View style={{gap: 16}}>
            <StatusComponent username="닉네임 A" status="true" />
            <StatusComponent username="닉네임 A" status="false" />
          </View>
        )}
        <NotoSansKR size={20}>챌린지 기간</NotoSansKR>
        <ChallengeTimeBox>
          <NotoSansKR size={16} weight="Medium">
            2023. 10. 20(금) ~ 2024. 01. 01(월)
          </NotoSansKR>
        </ChallengeTimeBox>
        <ButtonComponent>참여하기</ButtonComponent>
        <ButtonComponent type="secondary">거절하기</ButtonComponent>
      </View>
    </View>
  );
};

export const ChallengeModal = () => {
  const {showModal} = useModal();
  const openModal = () => {
    showModal(<ChallengeListModal />);
  };

  return (
    <HomeContainer>
      <ButtonComponent onPress={openModal}>챌린지 모달 출력</ButtonComponent>
    </HomeContainer>
  );
};
