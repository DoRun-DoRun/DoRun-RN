import React from 'react';
import {
  Image,
  ImageProps,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useMutation, useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {ButtonComponent, ModalViewPhoto, NotoSansKR} from '../Component';
import {useApi} from '../Hook/hook';
import useCamera from '../Hook/UseCamera';
import {useTheme} from '../theme/ThemeProvider';
import {ModalHeadText} from './CustomModal';
import {useModal} from './ModalProvider';

export const AdditionalGoalModal = ({
  additional_goal_no,
  additional_goal_nm,
}: {
  additional_goal_no: number;
  additional_goal_nm: string;
}) => {
  const {theme} = useTheme();
  const CallApi = useApi();
  const {onLaunchCamera, onViewPhoto, deletePhoto, modalImage, imageVisible} =
    useCamera();

  const {accessToken} = useSelector((state: RootState) => state.user);
  const {hideModal} = useModal();
  const queryClient = useQueryClient();

  const doneAdditionalGoal = async ({file_name}: {file_name: string}) =>
    CallApi({
      endpoint: `additional_goal/${additional_goal_no}?image_file_nm=${file_name}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate: DoneAdditionalGoal, isLoading: loadingAdditionalGoal} =
    useMutation(doneAdditionalGoal, {
      onSuccess: () => {
        queryClient.invalidateQueries('getChallenge');
        queryClient.invalidateQueries('getChallengeDetail');
        hideModal();
      },
      onError: error => {
        console.error('요청 실패:', error);
      },
    });

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
        DoneAdditionalGoal({file_name: data.fileName});
      },
    },
  );

  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20} weight="Bold">
          추가 목표를 완료해주세요!
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
                uri={modalImage?.uri ?? ''}
              />
            </Pressable>
            <View style={{alignItems: 'flex-end'}}>
              <Pressable onPress={deletePhoto}>
                <NotoSansKR size={12} color="gray4">
                  사진 삭제
                </NotoSansKR>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <NotoSansKR size={16}>
              {additional_goal_nm}을 완료하고 인증 사진을 올려주세요
            </NotoSansKR>
            <NotoSansKR size={12} color="gray3">
              24시간안에 인증사진을 올리고 잃어버린 진행도를 되찾을 수 있어요.
              {'\n'}해당 사진은 같이 챌린지를 하는 친구들만 확인 할 수 있어요.
            </NotoSansKR>

            <Pressable onPress={onLaunchCamera}>
              <PhotoUploadFrame>
                <MaterialIcons
                  name="photo-camera"
                  color={theme.primary1}
                  size={40}
                />
              </PhotoUploadFrame>
            </Pressable>
          </>
        )}
        <ButtonComponent
          type="primary"
          disabled={loadingImage || loadingAdditionalGoal || !modalImage}
          onPress={() => {
            uploadImage();
          }}>
          {loadingImage || loadingAdditionalGoal
            ? '업로드 중'
            : modalImage
              ? '업로드하기'
              : '사진을 올려주세요'}
        </ButtonComponent>
      </View>
    </View>
  );
};

/** ─────────────────────────────────────────────────────────────────────────
 * 1) PhotoUploadFrame (styled(View) 대체)
 */
export const PhotoUploadFrame: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[styles.uploadFrame, {borderColor: theme.primary1}, style]}
      {...rest}>
      {children}
    </View>
  );
};

/** ─────────────────────────────────────────────────────────────────────────
 * 2) ViewPhotoFrame (styled(Image) 대체)
 */
export const ViewPhotoFrame: React.FC<ImageProps> = ({style, ...rest}) => (
  <Image style={[styles.photoFrame, style]} {...rest} />
);

/** ─────────────────────────────────────────────────────────────────────────
 * 3) StyleSheet 정의
 */
const styles = StyleSheet.create({
  uploadFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 88,
    height: 96,
    borderWidth: 2,
  },
  photoFrame: {
    height: 250,
    borderRadius: 10,
  },
});
