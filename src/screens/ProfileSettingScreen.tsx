import React, {useState} from 'react';
import {
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  RowScrollContainer,
  ScrollContainer,
  adjustBrightness,
  useApi,
} from '../Component';
import {Image, Platform, View} from 'react-native';
import {styled} from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {RootState} from '../../store/RootReducer';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {Avatar, avatarImage} from '../../store/data';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {setUserName} from '../../store/slice/UserSlice';

const SelectedContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.primary2};
  margin: 0 -16px;
  padding: 24px 16px;
  align-items: center;
`;

const SelectedButton = styled.TouchableOpacity`
  padding: 8px 16px;
  color: ${props => props.theme.primary1};
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
`;

const CharecterSlot = styled.TouchableOpacity<{
  isEquip: boolean;
  isOwned: boolean;
}>`
  width: 88px;
  height: 104px;
  border-radius: 10px;
  border-width: ${props => (props.isEquip ? '2px' : 0)};
  border-color: ${props => props.theme.primary1};
  opacity: ${props => (props.isOwned ? 1 : 0.5)};
  background: ${props => props.theme.white};
  justify-content: center;
  align-items: center;
  margin: 4px 2px;
  ${Platform.OS === 'ios'
    ? `
    shadow-color: #000;
    shadow-offset: 2px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 2px;`
    : 'elevation: 3'}
`;

const CharecterSlotAndroid = styled.Pressable<{
  isEquip: boolean;
  isOwned: boolean;
}>`
  width: 88px;
  height: 104px;
  border-radius: 10px;
  border-width: ${props => (props.isEquip ? '2px' : 0)};
  border-color: ${props => props.theme.primary1};
  opacity: ${props => (props.isOwned ? 1 : 0.5)};
  background: ${props => props.theme.white};
  justify-content: center;
  align-items: center;
  ${Platform.OS === 'ios'
    ? `
    shadow-color: #000;
    shadow-offset: 2px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 2px;`
    : 'elevation: 3'}
`;

const PencilIcon = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 0 8px;
  padding-left: 24px;
`;

const ProfileSettingScreen = () => {
  const CallApi = useApi();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const [userNameText, setUserNameText] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const [selectedPet, setSelectedPet] = useState<null | number>(null);
  const navigation = useNavigation();

  const SettingProfile = async () => {
    try {
      const response = await CallApi({
        endpoint: 'user/avatar',
        method: 'GET',
        accessToken: accessToken!,
      });
      setUserNameText(response.USER_NM);
      for (const avatar of response.avatars) {
        if (avatar.IS_EQUIP) {
          if (avatar.AVATAR_TYPE === 'CHARACTER') {
            setSelectedCharacter(avatar.AVATAR_NO);
          } else {
            setSelectedPet(avatar.AVATAR_NO);
          }
        }
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const {data, isLoading} = useQuery('SettingProfile', SettingProfile);

  const SetAvatar = async (avatar_no: number[]) => {
    try {
      const response = await CallApi({
        endpoint: 'user/avatar',
        method: 'PUT',
        accessToken: accessToken!,
        body: avatar_no,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  const {mutate: setCharacter, isLoading: loadingSetCharacter} = useMutation(
    SetAvatar,
    {
      onSuccess: () => {
        // SetAvatar 성공 후 SettingProfile 쿼리를 다시 가져옴
        queryClient.invalidateQueries('SettingProfile');
        queryClient.invalidateQueries('ChallengeUserList');
        queryClient.invalidateQueries('userData');
        Toast.show({
          type: 'success',
          text1: '내 정보를 업데이트 했어요.',
        });
      },
    },
  );

  const SetName = async () => {
    try {
      const response = await CallApi({
        endpoint: 'user',
        method: 'PUT',
        accessToken: accessToken!,
        body: {
          USER_NM: userNameText,
        },
      });
      return response;
    } catch (err) {
      console.log('error', err);
      throw err;
    }
  };

  const {mutate: setName, isLoading: loadingName} = useMutation(SetName, {
    onSuccess: () => {
      dispatch(setUserName({userName: userNameText}));
      // SetAvatar 성공 후 SettingProfile 쿼리를 다시 가져옴
      queryClient.invalidateQueries('SettingProfile');
      queryClient.invalidateQueries('ChallengeUserList');
      queryClient.invalidateQueries('userData');
      navigation.goBack();
      Toast.show({
        type: 'success',
        text1: '이름을 변경했어요',
      });
    },
    onError: () => {},
  });

  if (isLoading) {
    return <LoadingIndicatior />;
  }

  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          <NotoSansKR size={20}>프로필 수정</NotoSansKR>
          <View style={{gap: 8}}>
            <NotoSansKR size={18} weight="Medium">
              닉네임 변경
            </NotoSansKR>
            <RowContainer>
              <InputNotoSansKR
                style={{flex: 1}}
                maxLength={12}
                size={14}
                placeholder={data.USER_NM}
                value={userNameText}
                onChangeText={setUserNameText}
                border
              />
              <PencilIcon
                disabled={loadingName}
                onPress={() => {
                  setName();
                }}>
                <OcticonIcons name="pencil" size={20} color={'black'} />
              </PencilIcon>
            </RowContainer>
          </View>
          <View style={{gap: 16, flex: 1}}>
            <NotoSansKR size={18} weight="Medium">
              캐릭터/펫 변경
            </NotoSansKR>
            <SelectedContainer>
              <SelectedButton
                disabled={loadingSetCharacter}
                onPress={() => {
                  if (selectedPet) {
                    setCharacter([selectedCharacter, selectedPet]);
                  } else {
                    setCharacter([selectedCharacter]);
                  }
                }}>
                <NotoSansKR size={14} color="primary1" weight="Medium">
                  {loadingSetCharacter ? '변경 중' : '캐릭터/펫 변경하기'}
                </NotoSansKR>
              </SelectedButton>
              <View
                style={{
                  width: 200,
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 40,
                }}>
                <Image
                  source={avatarImage[selectedCharacter - 1]}
                  style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                />
                {!!selectedPet && (
                  <Image
                    source={avatarImage[selectedPet - 1]}
                    style={{
                      right: 0,
                      top: 0,
                      position: 'absolute',
                      width: '24%',
                      height: '24%',
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </View>

              <RowScrollContainer gap={8}>
                {data.avatars.map((avatar: Avatar) =>
                  Platform.OS === 'android' ? (
                    <View
                      key={avatar.AVATAR_NO}
                      style={{
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}>
                      <CharecterSlotAndroid
                        android_ripple={{
                          color: adjustBrightness('white', 0.95),
                        }}
                        onPress={() => {
                          if (!avatar.IS_OWNED) {
                            Toast.show({
                              type: 'info',
                              text1:
                                '챌린지 완료를 통해 캐릭터/펫을 흭득할 수 있어요',
                              text2:
                                '여러 친구들과 오래 챌린지를 진행할수록 흭득 확률이 올라가요!',
                            });
                            return;
                          }
                          if (avatar.AVATAR_TYPE === 'CHARACTER') {
                            setSelectedCharacter(avatar.AVATAR_NO);
                          }
                          if (avatar.AVATAR_TYPE === 'PET') {
                            setSelectedPet(avatar.AVATAR_NO);
                          }
                        }}
                        isEquip={avatar.IS_EQUIP}
                        isOwned={avatar.IS_OWNED}>
                        <Image
                          source={avatarImage[avatar.AVATAR_NO - 1]}
                          style={
                            avatar.AVATAR_TYPE === 'PET' && {
                              width: '50%',
                              height: '50%',
                            }
                          }
                          resizeMode="contain"
                        />
                      </CharecterSlotAndroid>
                    </View>
                  ) : (
                    <CharecterSlot
                      key={avatar.AVATAR_NO}
                      onPress={() => {
                        if (!avatar.IS_OWNED) {
                          Toast.show({
                            type: 'info',
                            text1:
                              '챌린지 완료를 통해 캐릭터/펫을 흭득할 수 있어요',
                            text2:
                              '여러 친구들과 오래 챌린지를 진행할수록 흭득 확률이 올라가요!',
                          });
                          return;
                        }
                        if (avatar.AVATAR_TYPE === 'CHARACTER') {
                          setSelectedCharacter(avatar.AVATAR_NO);
                        }
                        if (avatar.AVATAR_TYPE === 'PET') {
                          setSelectedPet(avatar.AVATAR_NO);
                        }
                      }}
                      isEquip={avatar.IS_EQUIP}
                      isOwned={avatar.IS_OWNED}>
                      <Image
                        source={avatarImage[avatar.AVATAR_NO - 1]}
                        style={
                          avatar.AVATAR_TYPE === 'PET' && {
                            width: '50%',
                            height: '50%',
                          }
                        }
                        resizeMode="contain"
                      />
                    </CharecterSlot>
                  ),
                )}
              </RowScrollContainer>
            </SelectedContainer>
          </View>
        </InnerContainer>
      </ScrollContainer>
    </HomeContainer>
  );
};

export default ProfileSettingScreen;
