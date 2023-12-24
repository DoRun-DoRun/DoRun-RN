import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, {useTheme} from 'styled-components/native';

import {
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  TossFace,
} from '../Component';
import EmojiPicker, {EmojiType} from 'rn-emoji-keyboard';

export const DailyNoteScreen = () => {
  const theme = useTheme();
  return (
    <HomeContainer>
      <InnerContainer seperate>
        <View style={{gap: 24}}>
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
        </View>
        <FaceBtn />
      </InnerContainer>
    </HomeContainer>
  );
};

const FaceBtn = () => {
  const theme = useTheme();
  const faceList = ['😀', '😊', '😍', '🔥', '👋'];
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>();

  return (
    <BtnAlign>
      {faceList.map((face, index) => (
        <TouchableOpacity key={index}>
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
  align-items: center;
  background-color: ${props => props.theme.gray7};
  border-radius: 100px;
  padding: 0 24px;
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
