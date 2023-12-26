import React, {useState} from 'react';
import {
  HomeContainer,
  InnerContainer,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  RowScrollContainer,
  ScrollContainer,
  useApi,
} from '../Component';
import {Image, TouchableOpacity, View} from 'react-native';
import {styled} from 'styled-components/native';
import {useSelector} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {RootState} from '../../store/RootReducer';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {Avatar, avatarImage} from '../../store/data';

const TextContainer = styled.TextInput`
  flex: 1;
  padding: 6px 8px;
  border-bottom-width: 1px;
`;

const SelectedContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.primary1};
  margin: 0 -16px;
  padding: 24px 16px;
  align-items: center;
`;

const SelectedButton = styled.TouchableOpacity`
  width: 72px;
  padding: 8px 10px;
  color: ${props => props.theme.primary1};
  background-color: #fff;
  border-radius: 10px;
`;

const CharecterSlot = styled.View<{isEquip: boolean; isOwned: boolean}>`
  width: 88px;
  height: 104px;
  border-radius: 10px;
  border-width: ${props => (props.isEquip ? '2px' : 0)};
  opacity: ${props => (props.isOwned ? 1 : 0.5)};
  background: ${props => props.theme.white};
  justify-content: center;
  align-items: center;
`;

const PencilIcon = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
`;

const ProfileSettingScreen = () => {
  const CallApi = useApi();
  const queryClient = useQueryClient();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const [userName, setUserName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(1);

  const SettingProfile = async () => {
    try {
      const response = await CallApi({
        endpoint: 'user/avatar',
        method: 'GET',
        accessToken: accessToken!,
      });
      setUserName(response.USER_NM);
      for (const avatar of response.avatars) {
        if (avatar.IS_EQUIP) {
          setSelectedCharacter(avatar.AVATAR_NO);
          break; // 착용 중인 아바타를 찾았으므로 루프 종료
        }
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const SetAvatar = async (avatar_no: number) => {
    try {
      const response = await CallApi({
        endpoint: `user/avatar?avatar_no=${avatar_no}`,
        method: 'PUT',
        accessToken: accessToken!,
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
      },
    },
  );
  const {data, isLoading} = useQuery('SettingProfile', SettingProfile);

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
              <TextContainer
                placeholder={data.USER_NM}
                value={userName}
                onChangeText={setUserName}
              />
              <PencilIcon>
                <OcticonIcons name="pencil" size={20} />
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
                  setCharacter(selectedCharacter);
                }}>
                <NotoSansKR size={14} color="primary1" weight="Medium">
                  {loadingSetCharacter ? '변경 중' : '선택하기'}
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
              </View>

              <RowScrollContainer gap={8}>
                {data.avatars.map((avatar: Avatar) => (
                  <TouchableOpacity
                    key={avatar.AVATAR_NO}
                    onPress={() => {
                      if (avatar.IS_OWNED) {
                        setSelectedCharacter(avatar.AVATAR_NO);
                      }
                    }}>
                    <CharecterSlot
                      isEquip={avatar.IS_EQUIP}
                      isOwned={avatar.IS_OWNED}>
                      <Image source={avatarImage[avatar.AVATAR_NO - 1]} />
                    </CharecterSlot>
                  </TouchableOpacity>
                ))}
              </RowScrollContainer>
            </SelectedContainer>
          </View>
        </InnerContainer>
      </ScrollContainer>
    </HomeContainer>
  );
};

export default ProfileSettingScreen;
