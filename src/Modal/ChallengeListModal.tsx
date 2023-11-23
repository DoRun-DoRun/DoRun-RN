import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  NotoSansKR,
  TossFace,
} from '../Component';
import {ModalHeadText} from './CustomModal';
import {useModal} from './ModalProvider';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
export const BetweenModalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
`;
export const ChallengeTimeBox = styled.Text`
  width: 100%;
  border-radius: 25px;
  border: 2px solid lightgray;
  padding: 12px 40px;
  align-items: center;
  justify-content: center;
`;
export const StatusComponent = ({
  username,
  status,
}: {
  username: String;
  status: String;
}) => {
  return (
    <BetweenModalContainer>
      <NotoSansKR size={17} weight="Medium">
        {username}
      </NotoSansKR>
      {status === 'true' ? (
        <NotoSansKR size={16} weight="Medium" color="green">
          참여중이에요
        </NotoSansKR>
      ) : (
        <NotoSansKR size={16} weight="Medium" color="red">
          참여를 기다리고 있어요
        </NotoSansKR>
      )}
    </BetweenModalContainer>
  );
};
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
          <TossFace size={40}>🎲</TossFace>
          <NotoSansKR size={20}>챌린지 목표</NotoSansKR>
        </View>

        <TouchableOpacity
          onPress={() => setSecondSectionVisible(!isSecondSectionVisible)}>
          <BetweenModalContainer>
            <NotoSansKR size={18}>챌린지 참여 인원</NotoSansKR>
            <OcticonIcons name="chevron-down" size={26} color={'black'} />
          </BetweenModalContainer>
        </TouchableOpacity>

        {isSecondSectionVisible && (
          <View style={{gap: 16}}>
            <StatusComponent username="닉네임 A" status="true" />
            <StatusComponent username="닉네임 A" status="false" />
          </View>
        )}
        <NotoSansKR size={18}>챌린지 기간</NotoSansKR>
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
