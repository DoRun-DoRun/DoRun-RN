import React, {useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import {
  ButtonComponent,
  InputNotoSansKR,
  ModalViewPhoto,
  NotoSansKR,
  RowContainer,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ModalHeadText} from './CustomModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useMutation, useQueryClient} from 'react-query';
import useCamera from '../Hook/UseCamera';
import {useModal} from './ModalProvider';
import {DailyModal} from './Modals';
import {goalType} from '../../store/async/asyncStore';

const transformData = (state: goalType[]) => {
  return state.map(goal => ({
    PERSON_NM: goal.title,
    IS_DONE: goal.isComplete,
  }));
};

export const MyDailyDrayModal = ({
  challenge_user_no,
  personGoal,
}: {
  challenge_user_no: number;
  personGoal: goalType[];
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const CallApi = useApi();
  const {
    onLaunchCamera,
    onViewPhoto,
    deletePhoto,
    modalImage,
    imageVisible,
    onLaunchLibary,
  } = useCamera();

  const {accessToken, userName} = useSelector((state: RootState) => state.user);
  const {showModal} = useModal();

  const [inputText, setInputText] = useState('');

  const CreateDiary = async ({file_name}: {file_name: string}) =>
    CallApi({
      endpoint: 'diary',
      method: 'POST',
      accessToken: accessToken!,
      body: {
        CHALLENGE_USER_NO: challenge_user_no,
        IMAGE_FILE_NM: file_name,
        COMMENT: inputText,
        PERSON_GOAL: transformData(personGoal),
      },
    });

  const {mutate: createDiary, isLoading: loadingDiary} = useMutation(
    CreateDiary,
    {
      onSuccess: res => {
        queryClient.invalidateQueries('challenge_history');
        queryClient.invalidateQueries('ChallengeUserList');
        queryClient.invalidateQueries('getChallengeDetail');

        showModal(
          <DailyModal
            item_no={res.item_no}
            item_type={res.item_type}
            challenge_user_no={challenge_user_no}
            isDaily
          />,
        );
      },
      onError: error => {
        console.error('요청 실패:', error);
      },
    },
  );

  const UploadImage = async () => {
    const formData = new FormData();
    formData.append('image_file', {
      name: modalImage?.fileName,
      type: modalImage?.type,
      uri: modalImage?.uri,
    });

    return CallApi({
      endpoint: 'desc/upload/image',
      method: 'POST',
      accessToken: accessToken!,
      body: formData,
      formData: true,
    });
  };

  const {mutate: uploadImage, isLoading: loadingImage} = useMutation(
    UploadImage,
    {
      onSuccess: async data => {
        createDiary({file_name: data.fileName});
      },
    },
  );

  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20} weight="Bold">
          [{userName}]님 축하드려요! {'\n'}오늘 목표를 전부 완료했어요!
        </NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 16}}>
        {modalImage ? (
          <View style={{gap: 4}}>
            <Pressable onPress={onViewPhoto}>
              <ViewPhotoFrame
                source={{uri: modalImage?.uri}}
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
              개인별 목표와 남겨진 일기와 사진이 친구들에게 24시간 동안
              공유돼요.{'\n'}
              24시간 후에는 나만 확인 할 수 있게 프로필에 저장할게요.
            </NotoSansKR>
            <RowContainer gap={8}>
              <Pressable onPress={onLaunchCamera}>
                <PhotoUploadFrame>
                  <MaterialIcons
                    name="photo-camera"
                    color={theme.primary1}
                    size={40}
                  />
                </PhotoUploadFrame>
              </Pressable>

              <Pressable onPress={onLaunchLibary}>
                <PhotoUploadFrame>
                  <MaterialIcons
                    name="image"
                    color={theme.primary1}
                    size={40}
                  />
                </PhotoUploadFrame>
              </Pressable>
            </RowContainer>
          </>
        )}
        <InputNotoSansKR
          size={14}
          multiline
          weight="Medium"
          color="gray3"
          placeholder="한줄 일기를 작성해봐요!"
          value={inputText}
          onChangeText={setInputText}
          border
        />
        {modalImage || inputText ? (
          <ButtonComponent
            type="primary"
            disabled={loadingImage}
            onPress={() => {
              modalImage ? uploadImage() : createDiary({file_name: ''});
            }}>
            {loadingImage ? '업로드 중' : '작성 완료'}
          </ButtonComponent>
        ) : (
          <ButtonComponent
            disabled={loadingDiary}
            type="gray"
            onPress={() => {
              createDiary({file_name: ''});
            }}>
            {loadingDiary ? '업로드 중 ' : '오늘은 넘어갈래요'}
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

const ViewPhotoFrame = styled(Image)`
  height: 250px;
  border-radius: 10px;
`;
