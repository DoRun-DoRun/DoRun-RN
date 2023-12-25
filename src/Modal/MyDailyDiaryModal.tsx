import React, {useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import {
  ButtonComponent,
  InputNotoSansKR,
  ModalViewPhoto,
  NotoSansKR,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ModalHeadText} from './CustomModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useMutation} from 'react-query';
import {goalType} from '../../store/slice/GoalSlice';
import useCamera from '../Hook/UseCamera';

const transformData = (state: goalType[]) => {
  return state.map(goal => ({
    PERSON_NM: goal.title,
    IS_DONE: goal.isComplete,
  }));
};

// 사용 예시

export const MyDailyDrayModal = ({
  challenge_user_no,
  personGoal,
}: {
  challenge_user_no: number;
  personGoal: goalType[];
}) => {
  const theme = useTheme();
  const CallApi = useApi();
  const {onLaunchCamera, onViewPhoto, deletePhoto, modalImage, imageVisible} =
    useCamera();
  const {accessToken} = useSelector((state: RootState) => state.user);

  const [inputText, setInputText] = useState('');

  console.log('!!!!!!!!!!!personGoal: ', personGoal); // 개인별 목표 내용들
  const CreateDiary = () =>
    CallApi({
      endpoint: 'diary',
      method: 'POST',
      accessToken: accessToken!,
      body: {
        challenge_user_no: challenge_user_no,
        IMAGE_FILE_NM: '',
        COMMENT: inputText,
        PERSON_GOAL: transformData(personGoal),
      },
    });

  const {mutate} = useMutation(CreateDiary, {
    onSuccess: async data => {
      console.log(data);
    },
  });

  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20} weight="Bold">
          [닉네임A]님 축하드려요! {'\n'}오늘 목표를 전부 완료했어요!
        </NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 16}}>
        {modalImage ? (
          <View style={{gap: 4}}>
            <Pressable onPress={onViewPhoto}>
              <ViewPhotoFrame
                source={{uri: modalImage.assets[0]?.uri}}
                resizeMode="cover"
              />
              <ModalViewPhoto
                visible={imageVisible}
                onClose={onViewPhoto}
                res={modalImage}
              />
            </Pressable>
            <View style={{alignItems: 'flex-end'}}>
              <Pressable onPress={deletePhoto}>
                <NotoSansKR size={10} color="gray4">
                  사진 삭제
                </NotoSansKR>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <NotoSansKR size={16}>오늘을 사진과 글로 남겨봐요!</NotoSansKR>
            <NotoSansKR size={12} color="gray3">
              해당 내용은 친구들이 24시간동안 확인할 수 있어요! {'\n'}
              24시간 후에는 나만 확인 할 수 있게 프로필에 저장할게요.
            </NotoSansKR>

            <Pressable onPress={onLaunchCamera}>
              <PhotoUploadFrame>
                <MaterialIcons
                  name="add-to-photos"
                  color={theme.primary1}
                  size={40}
                />
              </PhotoUploadFrame>
            </Pressable>
          </>
        )}
        <InputNotoSansKR
          size={14}
          weight="Medium"
          color="gray3"
          placeholder="한줄 일기를 작성해봐요!"
          value={inputText}
          onChangeText={setInputText}
          border
        />
        {modalImage || inputText ? (
          <ButtonComponent
            onPress={() => {
              mutate();
            }}>
            작성 완료
          </ButtonComponent>
        ) : (
          <ButtonComponent
            type="gray"
            onPress={() => {
              mutate();
            }}>
            오늘은 넘어갈래요
          </ButtonComponent>
        )}
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

const ViewPhotoFrame = styled(Image)<{height: any}>`
  height: 250px;
  border-radius: 10px;
`;
