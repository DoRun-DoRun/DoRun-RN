import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, {useTheme} from 'styled-components/native';

import {
  HomeContainer,
  InnerContainer,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  TossFace,
  timeSince,
  useApi,
} from '../Component';
import EmojiPicker from 'rn-emoji-keyboard';
import {useMutation, useQuery} from 'react-query';
import {RouteType} from '../App';
import {groupImage} from '../../store/data';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '../../store/RootReducer';
import {useSelector} from 'react-redux';

// DailyNoteScreen 컴포넌트
export const DailyNoteScreen = ({route}: {route: RouteType}) => {
  const {daily_no} = route.params;
  const CallApi = useApi();

  const getDiary = async () => {
    try {
      const response = await CallApi({
        endpoint: `diary/${daily_no}`,
        method: 'GET',
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    // 0부터 2까지의 랜덤한 정수 생성
    const index = Math.floor(Math.random() * 3);
    setRandomIndex(index);
  }, []);

  const {data, isLoading} = useQuery('getDiary', getDiary);

  if (isLoading) {
    return <LoadingIndicatior />;
  }
  if (!data || data.dairy!) {
    return <NotoSansKR size={16}>에러</NotoSansKR>;
  }

  return (
    <HomeContainer>
      <InnerContainer seperate>
        <View style={{gap: 24}}>
          <RowContainer>
            <NotoSansKR size={18}>[{data.user}]</NotoSansKR>
            <NotoSansKR size={14} color="gray4">
              &nbsp;· {timeSince(data.diary.INSERT_DT)}
            </NotoSansKR>
          </RowContainer>

          <View style={{gap: 16, alignContent: 'center'}}>
            {data.diary.IMAGE_FILE_NM !== '' ? (
              <Image
                source={{
                  uri: `https://do-run.s3.amazonaws.com/${data.diary.IMAGE_FILE_NM}`,
                }}
                style={{width: '100%', height: 222}}
              />
            ) : (
              <ImageContainer
                source={groupImage[randomIndex]}
                resizeMode="contain"
              />
            )}

            <NotoSansKR size={14} weight="Medium">
              {data.diary.COMMENT}
            </NotoSansKR>
          </View>
        </View>
        <FaceBtn daily_no={daily_no} />
      </InnerContainer>
    </HomeContainer>
  );
};

const FaceBtn = ({daily_no}: {daily_no: number}) => {
  const theme = useTheme();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const CallApi = useApi();

  const postEmoji = ({emoji}: {emoji: string}) =>
    CallApi({
      endpoint: `diary/emoji/${daily_no}?emoji=${emoji}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate} = useMutation(postEmoji, {
    onSuccess: response => {
      console.log('Success:', response);
      navigation.goBack();
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const faceList = ['😀', '😊', '😍', '🔥', '👋'];
  const [emojiOpen, setEmojiOpen] = useState(false);
  const navigation = useNavigation();
  return (
    <BtnAlign>
      {faceList.map((face, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            mutate({emoji: face});
          }}>
          <TossFace size={30}>{face}</TossFace>
        </TouchableOpacity>
      ))}
      {/* 이모지를 추가로 누른 후 확인하는 코드 */}
      {/* <TossFace size={30}>{selectedEmoji?.emoji}</TossFace> */}
      <TouchableOpacity onPress={() => setEmojiOpen(true)}>
        <MaterialIcons
          name="add-circle-outline"
          color={theme.primary1}
          size={40}
        />
      </TouchableOpacity>

      <EmojiPicker
        onEmojiSelected={emojiObject => {
          mutate({emoji: emojiObject.emoji});
        }}
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

export const ImageContainer = styled.Image`
  width: 100%;
  height: 222px;
  border-radius: 10px;
`;
