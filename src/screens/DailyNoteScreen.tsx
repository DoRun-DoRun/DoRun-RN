import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageProps,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import EmojiPicker from 'rn-emoji-keyboard';
import {groupImage} from '../../store/data';
import {RootState} from '../../store/RootReducer';
import {DailyNoteRouteType} from '../App';
import {
  HomeContainer,
  InnerContainer,
  LoadingIndicator,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
} from '../Component';
import {GetImage, timeSince, useApi} from '../Hook/hook';
import {useModal} from '../Modal/ModalProvider';
import {ImageZoomModal} from '../Modal/Modals';
import {useTheme} from '../theme/ThemeProvider';

interface goal {
  PERSON_NM: string;
  IS_DONE: boolean;
}
// DailyNoteScreen 컴포넌트
export const DailyNoteScreen = ({route}: {route: DailyNoteRouteType}) => {
  const {daily_no} = route.params;
  const {theme} = useTheme();
  const CallApi = useApi();
  const {showModal} = useModal();

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
    return <LoadingIndicator />;
  }
  if (!data || data.dairy!) {
    return <NotoSansKR size={16}>에러</NotoSansKR>;
  }

  return (
    <HomeContainer>
      <InnerContainer separate>
        <ScrollContainer>
          <View style={{gap: 24}}>
            <RowContainer>
              <NotoSansKR size={18}>[{data.user}]</NotoSansKR>
              <NotoSansKR size={14} color="gray4">
                &nbsp;· {timeSince(data.diary.INSERT_DT)}
              </NotoSansKR>
            </RowContainer>

            <View style={{gap: 16, alignContent: 'center'}}>
              {data.diary.IMAGE_FILE_NM !== '' ? (
                <TouchableOpacity
                  onPress={() => {
                    showModal(
                      <ImageZoomModal file_name={data.diary.IMAGE_FILE_NM} />,
                    );
                  }}>
                  <Image
                    source={{uri: GetImage(data.diary.IMAGE_FILE_NM)}}
                    resizeMode="contain"
                    style={{width: '100%', height: 300}}
                  />
                </TouchableOpacity>
              ) : (
                <ImageContainer
                  source={groupImage[randomIndex]}
                  resizeMode="contain"
                />
              )}
              <NotoSansKR size={16}>오늘 하루 목표</NotoSansKR>
              <View>
                {data.goals?.map((goal: goal, key: number) => {
                  return (
                    <RowContainer key={key} gap={8}>
                      {goal.IS_DONE ? (
                        <MaterialIcons
                          name="check-box"
                          color={theme.primary1}
                          size={20}
                        />
                      ) : (
                        <MaterialIcons
                          name="check-box-outline-blank"
                          color={theme.primary1}
                          size={20}
                        />
                      )}
                      <NotoSansKR
                        size={14}
                        weight="Medium"
                        color={goal.IS_DONE ? 'primary1' : 'gray1'}>
                        {goal.PERSON_NM}
                      </NotoSansKR>
                    </RowContainer>
                  );
                })}
              </View>

              {data.diary.COMMENT && (
                <>
                  <NotoSansKR size={16}>작성한 일기</NotoSansKR>
                  <NotoSansKR size={14} weight="Medium">
                    {data.diary.COMMENT}
                  </NotoSansKR>
                </>
              )}
            </View>
          </View>
        </ScrollContainer>
        <FaceBtn daily_no={daily_no} />
      </InnerContainer>
    </HomeContainer>
  );
};

const FaceBtn = ({daily_no}: {daily_no: number}) => {
  const {theme} = useTheme();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const CallApi = useApi();

  const postEmoji = ({emoji}: {emoji: string}) =>
    CallApi({
      endpoint: `diary/emoji/${daily_no}?emoji=${emoji}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate} = useMutation(postEmoji, {
    onSuccess: () => {
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

/** ─── BtnAlign (styled.View → StyleSheet + useTheme) ───────────────── */
export const BtnAlign: React.FC<ViewProps> = ({style, children, ...rest}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[styles.btnAlign, {backgroundColor: theme.gray7}, style]}>
      {children}
    </View>
  );
};

/** ─── ImageContainer (styled.Image → StyleSheet) ────────────────────── */
export const ImageContainer: React.FC<ImageProps> = ({style, ...rest}) => (
  <Image {...rest} style={[styles.imageContainer, style]} />
);

/** ─── StyleSheet 정의 ───────────────────────────────────────────────── */
const styles = StyleSheet.create({
  btnAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 100,
    paddingVertical: 0,
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: '100%',
    height: 222,
    borderRadius: 10,
  },
});
