import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  NotoSansKR,
  RowContainer,
  TossFace,
} from '../Component';
import {ModalHeadText} from './CustomModal';
import {useModal} from './ModalProvider';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

const ChallengeTimeBox = styled.View`
  border-radius: 100px;
  border: 2px solid lightgray;
  padding: 4px;
  align-items: center;
  justify-content: center;
`;
const StatusComponent = ({
  username,
  status,
}: {
  username: String;
  status?: Boolean;
}) => {
  return (
    <RowContainer seperate>
      <NotoSansKR size={16} weight="Medium">
        {username}
      </NotoSansKR>
      {status ? (
        <NotoSansKR size={14} weight="Medium" color="green">
          참여중이에요
        </NotoSansKR>
      ) : (
        <NotoSansKR size={14} weight="Medium" color="red">
          참여를 기다리고 있어요
        </NotoSansKR>
      )}
    </RowContainer>
  );
};
export const ChallengeListModal = () => {
  const [isSecondSectionVisible, setSecondSectionVisible] = useState(true);
  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20}>[닉네임A]에게 초대가 왔어요</NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 16}}>
        <RowContainer gap={16}>
          <TossFace size={40}>🎲</TossFace>
          <NotoSansKR size={20}>챌린지 목표</NotoSansKR>
        </RowContainer>

        <TouchableOpacity
          onPress={() => setSecondSectionVisible(!isSecondSectionVisible)}>
          <RowContainer seperate>
            <NotoSansKR size={18}>챌린지 참여 인원</NotoSansKR>
            <OcticonIcons name="chevron-down" size={28} />
          </RowContainer>
        </TouchableOpacity>

        {isSecondSectionVisible && (
          <View style={{gap: 8}}>
            <StatusComponent username="닉네임 A" status />
            <StatusComponent username="닉네임 A" />
          </View>
        )}

        <View style={{gap: 8}}>
          <NotoSansKR size={18}>챌린지 기간</NotoSansKR>
          <ChallengeTimeBox>
            <NotoSansKR size={14} weight="Medium" lineHeight={28}>
              2023. 10. 20(금) ~ 2024. 01. 01(월)
            </NotoSansKR>
          </ChallengeTimeBox>
        </View>

        <View style={{gap: 8}}>
          <ButtonComponent>참여하기</ButtonComponent>
          <ButtonComponent type="secondary">거절하기</ButtonComponent>
        </View>
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
