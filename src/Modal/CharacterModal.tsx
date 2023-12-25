import React from 'react';
import {Image, View} from 'react-native';
import {ButtonContainer, NotoSansKR, RowContainer, useApi} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from '@miblanchard/react-native-slider';
import {ChallengeUserType} from '../Tab/RaceTab';
import {useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {profileImage} from '../../store/data';
import {useModal} from './ModalProvider';
import {UsedItemModal} from './Modals';

const UserProfile = styled.View<{IS_ME: boolean}>`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  border: 3px solid
    ${props => (props.IS_ME ? props.theme.primary1 : props.theme.secondary1)};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const UserStatues = styled.View<{IS_ME: boolean}>`
  display: flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 4px;
  background-color: ${props =>
    props.IS_ME ? props.theme.primary2 : props.theme.secondary2};
`;

export const CharacterModal = ({data}: {data: ChallengeUserType}) => {
  const CallApi = useApi();
  const theme = useTheme();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const {showModal} = useModal();
  const useItem = ({item_no}: {item_no: number}) =>
    CallApi({
      endpoint: `item/${data.CHALLENGE_USER_NO}?item_no=${item_no}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const ChallengeUser = async () => {
    try {
      const response = await CallApi({
        endpoint: `challenge/user/${data.CHALLENGE_USER_NO}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const {data: user, isLoading} = useQuery('ChallengeUser', ChallengeUser);

  const {mutate} = useMutation(useItem, {
    onSuccess: response => {
      console.log('Success:', response);
      showModal(
        <UsedItemModal
          item_no={response.item_no}
          user_name={user.USER_NM}
          character_no={data.CHARACTER_NO}
        />,
      );
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  if (isLoading) {
    return <NotoSansKR size={16}>로딩중</NotoSansKR>;
  }

  if (!user) {
    return <NotoSansKR size={16}>데이터 오류</NotoSansKR>;
  }

  return (
    <View style={{paddingTop: 16}}>
      <View style={{gap: 9}}>
        <RowContainer gap={9}>
          <UserProfile IS_ME={user.IS_ME}>
            <Image
              source={profileImage[user.CHARACTER_NO - 1]}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          </UserProfile>
          <View style={{flex: 1}}>
            <RowContainer gap={8}>
              <UserStatues IS_ME={user.IS_ME}>
                <MaterialIcons
                  name="directions-run"
                  color={user.IS_ME ? theme.primary1 : theme.secondary1}
                  size={16}
                />
                <NotoSansKR
                  size={10}
                  color={user.IS_ME ? 'primary1' : 'secondary1'}>
                  {user.STATUS}
                </NotoSansKR>
              </UserStatues>

              <NotoSansKR size={16}>{user.USER_NM}</NotoSansKR>
            </RowContainer>
            <View style={{flex: 1}}>
              <Slider
                value={data.PROGRESS / 100}
                minimumTrackTintColor={
                  user.IS_ME ? theme.primary1 : theme.secondary1
                }
                maximumTrackTintColor={theme.gray7}
                thumbTintColor={user.IS_ME ? theme.primary1 : theme.secondary1}
                disabled
                // onValueChange={values => setMyValue(values[0])}
              />
            </View>
          </View>
        </RowContainer>

        <ButtonContainer color={user.IS_ME ? 'primary1' : 'secondary1'}>
          <NotoSansKR size={13} color="white">
            "{user.COMMENT}"
          </NotoSansKR>
        </ButtonContainer>
        {user.ITEM && !user.IS_ME ? (
          <RowContainer gap={18}>
            <View style={{flex: 1}}>
              <ButtonContainer
                color={user.IS_ME ? 'primary1' : 'secondary1'}
                disabled={user.ITEM[0].COUNT === 0}
                onPress={() => {
                  mutate({item_no: 1});
                }}>
                <RowContainer gap={4}>
                  <MaterialCommunityIcons
                    name="bomb"
                    size={20}
                    color={theme.white}
                  />
                  <NotoSansKR size={12} color="white">
                    폭탄 터트리기 X {user.ITEM[0].COUNT}
                  </NotoSansKR>
                </RowContainer>
              </ButtonContainer>
            </View>

            <View style={{flex: 1}}>
              <ButtonContainer
                color={user.IS_ME ? 'primary1' : 'secondary1'}
                disabled={user.ITEM[1].COUNT === 0}
                onPress={() => {
                  mutate({item_no: 2});
                }}>
                <RowContainer gap={4}>
                  <MaterialCommunityIcons
                    name="hammer"
                    size={20}
                    color={theme.white}
                  />
                  <NotoSansKR size={12} color="white">
                    망치 사용하기 X {user.ITEM[1].COUNT}
                  </NotoSansKR>
                </RowContainer>
              </ButtonContainer>
            </View>
          </RowContainer>
        ) : (
          <RowContainer gap={8}>
            <MaterialIcons
              name="speaker-notes"
              color={theme.primary1}
              size={20}
            />
            <NotoSansKR size={13} color={'gray3'}>
              달리기 1km 오늘도 화이ㅣ이이팅
            </NotoSansKR>
          </RowContainer>
        )}
      </View>
    </View>
  );
};
