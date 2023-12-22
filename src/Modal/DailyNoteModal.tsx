import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, {useTheme} from 'styled-components/native';

import {useModal} from './ModalProvider';
import {
  ButtonComponent,
  HomeContainer,
  NotoSansKR,
  TossFace,
} from '../Component';
import {ModalHeadBorder} from './CustomModal';
import EmojiPicker, {EmojiType} from 'rn-emoji-keyboard';

export const DailyNoteModal = () => {
  const theme = useTheme();
  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />

      <LetterAlign>
        <NotoSansKR size={18} weight="Bold">
          [닉네임A]
        </NotoSansKR>
        <NotoSansKR size={14} weight="Bold" color={theme.gray4}>
          &nbsp;· 12시간전
        </NotoSansKR>
      </LetterAlign>

      <View style={{gap: 16, alignContent: 'center'}}>
        <ImageContainer
          source={require('../../assets/image/DailyNoteImage.png')}
          resizeMode="contain"
        />
        <NotoSansKR size={14} weight="Medium">
          오늘도 보람찬 하루였어요!
        </NotoSansKR>
      </View>

      <FaceBtn />
    </View>
  );
};

const FaceBtn = () => {
  const theme = useTheme();
  const faceList = ['😀', '😊', '😍', '🔥', '👋'];
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>();

  return (
    <BtnAlign>
      {faceList.map(face => (
        <TouchableOpacity>
          <TossFace size={30}>{face}</TossFace>
        </TouchableOpacity>
      ))}
      {/* 이모지를 추가로 누른 후 확인하는 코드 */}
      {/* <TossFace size={30}>{selectedEmoji?.emoji}</TossFace> */}
      <TouchableOpacity onPress={() => setEmojiOpen(true)}>
        <MaterialIcons
          name="add-circle-outline"
          color={theme.primary3}
          size={40}
        />
      </TouchableOpacity>

      <EmojiPicker
        onEmojiSelected={emojiObject => setSelectedEmoji(emojiObject)}
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
      />
    </BtnAlign>
  );
};

const BtnAlign = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const LetterAlign = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

export const ImageContainer = styled.Image`
  width: 100%;
  height: 222px;
  border-radius: 10px;
`;

export const TryModal = () => {
  const {showModal} = useModal();
  const openModal = () => {
    showModal(<DailyNoteModal />);
  };

  return (
    <HomeContainer>
      <ButtonComponent onPress={openModal}>
        클릭 시 일일 일기 모달 호출
      </ButtonComponent>
    </HomeContainer>
  );
};
