import React, {useMemo} from 'react';
import {Image, View} from 'react-native';
import {
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  isWithin24Hours,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from '@miblanchard/react-native-slider';
import {ChallengeUserType} from '../Tab/RaceTab';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {UserStatusType, profileImage} from '../../store/data';
import {useModal} from './ModalProvider';
import {UsedItemModal} from './Modals';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const ButtonContainer = styled.TouchableOpacity<{
  color: string;
}>`
  background-color: ${props =>
    props.disabled ? props.theme.gray4 : props.theme[props.color]};
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

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

export const CharacterModal = ({
  data,
  CHALLENGE_MST_NO,
}: {
  data: ChallengeUserType;
  CHALLENGE_MST_NO: number;
}) => {
  const CallApi = useApi();
  const theme = useTheme();
  const {showModal} = useModal();
  const {accessToken, SIGN_TYPE} = useSelector(
    (state: RootState) => state.user,
  );
  const queryClient = useQueryClient();

  const goals = useSelector((state: RootState) => state.goal, shallowEqual);

  const personalGoals = useMemo(() => {
    const challenge = goals[SIGN_TYPE!].find(
      ch => ch.challenge_mst_no === CHALLENGE_MST_NO,
    );
    return challenge ? challenge.personalGoals : [];
  }, [goals, SIGN_TYPE, CHALLENGE_MST_NO]);

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
      queryClient.invalidateQueries('getChallenge');
      queryClient.invalidateQueries('getChallengeDetail');
      queryClient.invalidateQueries('ChallengeUserList');
      showModal(
        <UsedItemModal
          item_no={response.item_no}
          user_name={user.USER_NM}
          character_no={response.character_no}
        />,
      );
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  if (isLoading) {
    return <LoadingIndicatior />;
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
                <MaterialCommunityIcons
                  name={
                    user.STATUS === UserStatusType.SLEEPING
                      ? 'sleep'
                      : user.STATUS === UserStatusType.WALKING
                      ? 'walk'
                      : 'run-fast'
                  }
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
                  isWithin24Hours(user.END_DT)
                    ? Toast.show({
                        type: 'error',
                        text1: '종료 24시간 전에는 아이템을 사용할 수 없습니다',
                      })
                    : mutate({item_no: 1});
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
                  isWithin24Hours(user.END_DT)
                    ? Toast.show({
                        type: 'error',
                        text1: '종료 24시간 전에는 아이템을 사용할 수 없습니다',
                      })
                    : mutate({item_no: 2});
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
          personalGoals?.map(goal => {
            return (
              <RowContainer
                gap={8}
                key={goal.id}
                style={{alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="text-box-check-outline"
                  color={theme.primary1}
                  size={26}
                />
                <NotoSansKR size={13} color={'gray3'}>
                  {goal.title}
                </NotoSansKR>
              </RowContainer>
            );
          })
        )}
      </View>
    </View>
  );
};
