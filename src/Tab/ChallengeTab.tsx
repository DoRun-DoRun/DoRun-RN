import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {challengeData, goalType} from '../../store/async/asyncStore';
import {ChallengeStatusType} from '../../store/data';
import {RootState} from '../../store/RootReducer';
import {setSelectedChallengeMstNo} from '../../store/slice/ChallengeSlice';
import {
  removeChallenge,
  resetGoals,
  toggleGoal,
} from '../../store/slice/GoalSlice';
import {NavigationType} from '../App';
import {
  ButtonComponent,
  HomeContainer,
  LoadingIndicator,
  NotoSansKR,
  RowContainer,
  RowScrollContainer,
  TossFace,
} from '../Component';
import {calculateDaysUntil, calculateRemainTime, useApi} from '../Hook/hook';
import {AdditionalGoalModal} from '../Modal/AdditionalGoalModal';
import {ChallengeListModal} from '../Modal/ChallengeListModal';
import {useModal} from '../Modal/ModalProvider';
import {
  AlertItemModal,
  ChallengeLogType,
  DailyModal,
  ImageZoomModal,
  ItemLogType,
  ShareModal,
} from '../Modal/Modals';
import {MyDailyDrayModal} from '../Modal/MyDailyDiaryModal';
import {
  PersonGoalAddModal,
  PersonGoalEditModal,
} from '../Modal/PersonGoalModal';
import {useTheme} from '../theme/ThemeProvider';

interface GoalBoxProps {
  goal: goalType;
  challenge_mst_no: number;
}

interface ChallengeInfoType {
  mainText: string;
  subText: string;
  headerEmoji: string;
  isSelected?: boolean;
}

const GoalBox: React.FC<GoalBoxProps> = ({goal, challenge_mst_no}) => {
  const {SIGN_TYPE} = useSelector((state: RootState) => state.user);
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const {showModal} = useModal();

  const backgroundColor = goal.isComplete ? theme.gray7 : theme.white;
  const textColor = 'black';
  const iconColor = goal.isComplete ? theme.gray4 : theme.primary1;
  const borderColor = goal.isComplete ? theme.gray7 : theme.primary1;

  return (
    <GoalContainer
      onLongPress={() => {
        showModal(
          <PersonGoalEditModal
            id={goal.id}
            challenge_mst_no={challenge_mst_no}
            title={goal.title}
          />,
        );
      }}
      onPress={() =>
        dispatch(
          toggleGoal({
            type: SIGN_TYPE!,
            goalId: goal.id,
            challenge_mst_no: challenge_mst_no,
          }),
        )
      }
      bc={backgroundColor}
      border={borderColor}>
      <RowContainer>
        <RowContainer gap={8}>
          <OcticonIcons name="check-circle-fill" size={24} color={iconColor} />
          {goal.isComplete ? (
            <TodoTitle size={16}>{goal.title}</TodoTitle>
          ) : (
            <NotoSansKR size={16} color={textColor} weight="Medium">
              {goal.title}
            </NotoSansKR>
          )}
        </RowContainer>
        <TouchableOpacity
          onPress={() => {
            showModal(
              <PersonGoalEditModal
                id={goal.id}
                challenge_mst_no={challenge_mst_no}
                title={goal.title}
              />,
            );
          }}>
          <OcticonIcons name="kebab-horizontal" size={24} color={theme.gray5} />
        </TouchableOpacity>
      </RowContainer>
    </GoalContainer>
  );
};

const PlusContainers = ({title}: {title: String}) => {
  const {theme} = useTheme();

  return (
    <RowContainer gap={4} style={{justifyContent: 'flex-end'}}>
      <OcticonIcons name="plus-circle" size={16} color={theme.primary1} />
      <NotoSansKR size={14} color="primary1">
        {title}
      </NotoSansKR>
    </RowContainer>
  );
};

const ListItem = ({data}: {data: AdditionalInfo}) => {
  const {showModal} = useModal();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength) + '...';
  };

  return (
    <RowContainer separate>
      <RowContainer gap={32}>
        <NotoSansKR size={14} weight="Regular" color="white">
          {data.CHALLENGE_USER_NN}
        </NotoSansKR>
        <NotoSansKR size={14} weight="Regular" color="white">
          {truncateText(data.ADDITIONAL_NM, 14)}
        </NotoSansKR>
      </RowContainer>

      <RowContainer gap={8}>
        <NotoSansKR size={14} weight="Regular" color="yellow">
          {data.IS_DONE ? '목표 완료!' : calculateRemainTime(data.END_DT)}
        </NotoSansKR>

        {data.IS_MINE && !data.IS_DONE && (
          <TouchableOpacity
            onPress={() => {
              showModal(
                <AdditionalGoalModal
                  additional_goal_no={data.ADDITIONAL_NO}
                  additional_goal_nm={data.ADDITIONAL_NM}
                />,
              );
            }}>
            <MaterialIcons name="photo-camera" size={28} color={'white'} />
          </TouchableOpacity>
        )}

        {data.IS_DONE && (
          <TouchableOpacity
            onPress={() => {
              showModal(<ImageZoomModal file_name={data.IMAGE_FILE_NM} />);
            }}>
            <MaterialIcons name="photo" size={28} color={'white'} />
          </TouchableOpacity>
        )}
      </RowContainer>
    </RowContainer>
  );
};

interface AdditionalInfo {
  ADDITIONAL_NO: number;
  ADDITIONAL_NM: string;
  IS_DONE: boolean;
  IMAGE_FILE_NM: string;
  START_DT: string;
  END_DT: string;
  CHALLENGE_USER_NO: number;
  CHALLENGE_USER_NN: string;
  IS_MINE: boolean;
}

const getPersonalGoalsByChallengeNo = ({
  challenges,
  challengeNo,
}: {
  challenges: challengeData[];
  challengeNo: number;
}) => {
  const challenge = challenges.find(ch => ch.challenge_mst_no === challengeNo);
  return challenge ? challenge.personalGoals : [];
};

const ChallengeTab = () => {
  const CallApi = useApi();

  const {accessToken, SIGN_TYPE} = useSelector(
    (state: RootState) => state.user,
  );
  const {selectedChallengeMstNo} = useSelector(
    (state: RootState) => state.challenge,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationType>();
  const {showModal} = useModal();

  const challenges = useSelector((state: RootState) => state.goal);

  const getChallenge = async () => {
    try {
      const response = await CallApi({
        endpoint: 'challenge/list',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  const {
    data: listData,
    isLoading: listLoading,
    refetch,
    isFetching,
  } = useQuery('getChallenge', getChallenge, {
    onSuccess: data => {
      // 쿼리 성공 시 실행될 로직
      if (data?.progress_challenges?.length > 0) {
        const firstChallengeMstNo =
          data.progress_challenges[0].CHALLENGE_MST_NO;
        dispatch(setSelectedChallengeMstNo(firstChallengeMstNo));
      }
    },
  });

  const getChallengeDetail = async () => {
    try {
      const response = await CallApi({
        endpoint: `challenge/detail/${selectedChallengeMstNo}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  const {
    data: detailData,
    isLoading: detailLoading,
    refetch: refetchDetail,
    isFetching: isFetchingDetail,
  } = useQuery(
    ['getChallengeDetail', selectedChallengeMstNo],
    getChallengeDetail,
    {
      enabled: !!selectedChallengeMstNo,
    },
  );

  const [refreshing, setRefreshing] = useState(false);

  const [modalQueue, setModalQueue] = useState<ItemLogType[]>([]);

  const ItemLog = async () => {
    try {
      const response = await CallApi({
        endpoint: `item/log/${selectedChallengeMstNo}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      setModalQueue(response);

      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const {refetch: refetchItemLog, isFetching: isFetchingItemLog} = useQuery(
    ['ItemLog', selectedChallengeMstNo],
    ItemLog,
    {
      enabled: !!selectedChallengeMstNo,
    },
  );

  const updateItemLog = () =>
    CallApi({
      endpoint: `item/log/${modalQueue[0].ITEM_LOG_NO}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate} = useMutation(updateItemLog, {
    onSuccess: () => {},
    onError: error => {
      console.error('Error:', error);
    },
  });

  const removeModalFromQueue = useCallback(() => {
    mutate();
    setModalQueue(prevQueue => {
      const [, ...remainingQueue] = prevQueue;
      return remainingQueue;
    });
  }, [mutate]);

  useEffect(() => {
    if (modalQueue.length > 0) {
      showModal(
        <AlertItemModal response={modalQueue[0]} />,
        removeModalFromQueue,
      );
    }
  }, [modalQueue, removeModalFromQueue, showModal]);

  const [challengeModalQueue, setChallengeModalQueue] = useState<
    ChallengeLogType[]
  >([]);

  const ChallengeLog = async () => {
    try {
      const response = await CallApi({
        endpoint: 'challenge/log',
        method: 'GET',
        accessToken: accessToken!,
      });
      setChallengeModalQueue(response);

      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const {refetch: refetchChallengeLog, isFetching: isFetchingChallengeLog} =
    useQuery('ChallengeLog', ChallengeLog);

  const updateChallengeLog = () =>
    CallApi({
      endpoint: `challenge/log/${challengeModalQueue[0].CHALLENGE_USER_NO}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate: mutateUpdateChallengeLog} = useMutation(updateChallengeLog, {
    onSuccess: response => {
      dispatch(
        removeChallenge({
          type: SIGN_TYPE!,
          challenge_mst_no: challengeModalQueue[0].CHALLENGE_MST_NO,
        }),
      );
      showModal(
        <DailyModal
          item_no={response.AVATAR_NO}
          item_type={response.AVATAR_TYPE}
        />,
        removeChallengeModalFromQueue,
      );
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const removeChallengeModalFromQueue = useCallback(() => {
    setChallengeModalQueue(prevQueue => {
      const [, ...remainingQueue] = prevQueue;
      return remainingQueue;
    });
  }, []);

  useEffect(() => {
    if (challengeModalQueue.length > 0) {
      showModal(<ShareModal response={challengeModalQueue[0]} />, () =>
        mutateUpdateChallengeLog(),
      );
    }
  }, [challengeModalQueue, mutateUpdateChallengeLog, showModal]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (!selectedChallengeMstNo) {
      Promise.all([refetch(), refetchChallengeLog()]).then(() => {
        setRefreshing(false);
      });
    } else {
      Promise.all([
        refetch(),
        refetchDetail(),
        refetchItemLog(),
        refetchChallengeLog(),
      ]).then(() => {
        setRefreshing(false);
      });
    }
  }, [
    refetch,
    refetchChallengeLog,
    refetchDetail,
    refetchItemLog,
    selectedChallengeMstNo,
  ]);

  if (listLoading || detailLoading) {
    return <LoadingIndicator />;
  }

  if (listData.progress_challenges?.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing ||
              isFetching ||
              isFetchingDetail ||
              isFetchingItemLog ||
              isFetchingChallengeLog
            }
            onRefresh={onRefresh}
          />
        }>
        <HomeContainer>
          <TopContainer style={{flex: 1}}>
            <NotoSansKR size={16}>진행중인 챌린지</NotoSansKR>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                gap: 24,
              }}>
              <Image
                source={require('../../assets/image/character/nuts05.png')}
                resizeMode="contain"
              />
              <NotoSansKR size={16} color="gray5">
                진행중인 챌린지가 없어요!
              </NotoSansKR>
            </View>
          </TopContainer>
          <TopContainer>
            <NotoSansKR size={16}>초대된 챌린지</NotoSansKR>
            {listData.invited_challenges?.length === 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 16,
                }}>
                <NotoSansKR size={16} color="gray5">
                  초대된 챌린지가 없어요!
                </NotoSansKR>
              </View>
            ) : (
              <RowScrollContainer gap={8}>
                {listData.invited_challenges?.map((challenge: any) => {
                  const leftDay = calculateDaysUntil(challenge.START_DT);
                  return (
                    <Pressable
                      key={challenge.CHALLENGE_MST_NO}
                      onPress={() =>
                        showModal(
                          <ChallengeListModal
                            count_challenge={
                              listData.progress_challenges?.length
                            }
                            challenge_mst_no={challenge.CHALLENGE_MST_NO}
                          />,
                        )
                      }>
                      <ChallengeSubInfo
                        headerEmoji={challenge.HEADER_EMOJI}
                        mainText={challenge.CHALLENGE_MST_NM}
                        subText={
                          leftDay === 0 ? '내일시작' : `${leftDay}일 뒤 시작`
                        }
                      />
                    </Pressable>
                  );
                })}
              </RowScrollContainer>
            )}

            <TouchableOpacity
              style={{padding: 8}}
              onPress={() =>
                navigation.navigate('CreateChallengeScreen' as never)
              }>
              <PlusContainers title="챌린지 시작하기" />
            </TouchableOpacity>
          </TopContainer>
        </HomeContainer>
      </ScrollView>
    );
  }

  const personGoal = getPersonalGoalsByChallengeNo({
    challenges: challenges[SIGN_TYPE!] ? challenges[SIGN_TYPE!] : [],
    challengeNo: selectedChallengeMstNo!,
  });

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isFetching || isFetchingDetail}
          onRefresh={onRefresh}
        />
      }>
      <HomeContainer style={{gap: 32}}>
        <TopContainer>
          <NotoSansKR size={16}>진행중인 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            {listData.progress_challenges?.map((challenge: any) => (
              <Pressable
                key={challenge.CHALLENGE_MST_NO}
                onLongPress={() => {
                  dispatch(
                    setSelectedChallengeMstNo(challenge.CHALLENGE_MST_NO),
                  );
                  navigation.navigate('EditChallengeScreen', {
                    challenge_mst_no: challenge.CHALLENGE_MST_NO,
                  });
                }}
                onPress={() => {
                  dispatch(
                    setSelectedChallengeMstNo(challenge.CHALLENGE_MST_NO),
                  );
                }}>
                <ChallengeInfo
                  isSelected={
                    challenge.CHALLENGE_MST_NO === selectedChallengeMstNo
                  }
                  headerEmoji={challenge.HEADER_EMOJI}
                  mainText={challenge.CHALLENGE_MST_NM}
                  subText={
                    challenge.CHALLENGE_STATUS === ChallengeStatusType.PENDING
                      ? '시작전'
                      : `${Number(challenge.PROGRESS.toFixed(2))}% 진행됨`
                  }
                />
              </Pressable>
            ))}
          </RowScrollContainer>

          <NotoSansKR size={16}>초대된 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            {listData.invited_challenges?.map((challenge: any) => {
              const leftDay = calculateDaysUntil(challenge.START_DT);
              return (
                <Pressable
                  key={challenge.CHALLENGE_MST_NO}
                  onPress={() =>
                    showModal(
                      <ChallengeListModal
                        count_challenge={listData.progress_challenges?.length}
                        challenge_mst_no={challenge.CHALLENGE_MST_NO}
                      />,
                    )
                  }>
                  <ChallengeSubInfo
                    headerEmoji={challenge.HEADER_EMOJI}
                    mainText={challenge.CHALLENGE_MST_NM}
                    subText={
                      leftDay === 0 ? '내일시작' : `${leftDay}일 뒤 시작`
                    }
                  />
                </Pressable>
              );
            })}
          </RowScrollContainer>

          <TouchableOpacity
            onPress={() => {
              if (listData.progress_challenges?.length >= 3) {
                Toast.show({
                  type: 'error',
                  text1: '현재는 챌린지를 3개까지만 진행할 수 있어요',
                });
              } else {
                navigation.navigate('CreateChallengeScreen' as never);
              }
            }}>
            <PlusContainers title="챌린지 시작하기" />
          </TouchableOpacity>
        </TopContainer>
        <View style={{marginTop: -16}}>
          {/* <BannerAd
            unitId={adBannerChallenge!}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          /> */}
        </View>

        {detailData?.CHALLENGE_STATUS === ChallengeStatusType.PROGRESS ? (
          <>
            <CenterContainer style={{flexGrow: 1}}>
              <RowContainer>
                <NotoSansKR size={18}>오늘 할 일 목록</NotoSansKR>
                <MaterialIcons
                  name="restore"
                  size={24}
                  color={'black'}
                  style={{paddingLeft: 16}}
                  onPress={() => {
                    Toast.show({
                      type: 'success',
                      text1: '오늘 할 일 완료상태를 초기화 했어요',
                    });
                    dispatch(
                      resetGoals({
                        type: SIGN_TYPE!,
                        challenge_mst_no: selectedChallengeMstNo!,
                      }),
                    );
                  }}
                />
              </RowContainer>

              <View style={{gap: 8}}>
                {personGoal?.map(goal => (
                  <GoalBox
                    key={goal.id}
                    goal={goal}
                    challenge_mst_no={selectedChallengeMstNo!}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  showModal(
                    <PersonGoalAddModal
                      challenge_mst_no={selectedChallengeMstNo!}
                    />,
                  );
                }}>
                <PlusContainers title="할 일 추가하기" />
              </TouchableOpacity>
            </CenterContainer>
            <CenterContainer>
              <ButtonComponent
                disabled={detailData.IS_DONE_TODAY || personGoal?.length === 0}
                onPress={() => {
                  showModal(
                    <MyDailyDrayModal
                      challenge_user_no={detailData.CHALLENGE_USER_NO}
                      personGoal={personGoal}
                    />,
                  );
                }}>
                {detailData.IS_DONE_TODAY
                  ? '오늘은 일기를 작성했어요'
                  : personGoal?.length === 0
                    ? '아직 할 일을 추가하지 않았어요'
                    : '오늘 하루 완료하기'}
              </ButtonComponent>
            </CenterContainer>
            {detailData?.additionalGoal.length !== 0 ? (
              <FootContainer>
                <RowContainer separate>
                  <NotoSansKR size={18} color="white">
                    개인 미션
                  </NotoSansKR>
                  <MaterialCommunityIcons
                    name="bomb"
                    size={24}
                    color={'white'}
                  />
                </RowContainer>
                <View>
                  {detailData?.additionalGoal.map((data: AdditionalInfo) => {
                    return <ListItem key={data.ADDITIONAL_NO} data={data} />;
                  })}
                </View>
              </FootContainer>
            ) : (
              <FootContainer disalbed>
                <RowContainer separate>
                  <NotoSansKR size={18} color="white">
                    개인 미션
                  </NotoSansKR>
                  <MaterialCommunityIcons
                    name="bomb"
                    size={24}
                    color={'white'}
                  />
                </RowContainer>
              </FootContainer>
            )}
          </>
        ) : (
          <CenterContainer style={{height: 300}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                gap: 24,
              }}>
              <Image
                style={{height: 136}}
                source={require('../../assets/image/character/nuts05.png')}
                resizeMode="contain"
              />
              <NotoSansKR size={16} color="gray5">
                챌린지가 시작하지 않았어요!
              </NotoSansKR>
            </View>
          </CenterContainer>
        )}
      </HomeContainer>
    </ScrollView>
  );
};

export default ChallengeTab;

/* ---------- Profile 원본: styled.View ------------------------------------ */
const profileStyle = StyleSheet.create({
  box: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const Profile: React.FC<React.PropsWithChildren<{style?: ViewStyle}>> = ({
  children,
  style,
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[profileStyle.box, {backgroundColor: theme.secondary2}, style]}>
      {children}
    </View>
  );
};

/* ---------- TodoTitle 원본: styled(NotoSansKR) --------------------------- */
const TodoTitle: React.FC<
  React.ComponentProps<typeof NotoSansKR> & {style?: TextStyle}
> = ({children, style, ...rest}) => {
  const {theme} = useTheme();
  return (
    <NotoSansKR
      {...rest}
      style={[
        {
          textDecorationLine: 'line-through',
          color: theme.gray4,
          backgroundColor: theme.gray7,
        },
        style,
      ]}>
      {children}
    </NotoSansKR>
  );
};

/* ---------- GoalContainer 원본: styled.TouchableOpacity ------------------ */
interface GoalContainerProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  bc: string;
  border: string;
}
const goalContainerStyle = StyleSheet.create({
  base: {borderRadius: 10, borderWidth: 2, padding: 12},
});
const GoalContainer: React.FC<GoalContainerProps> = ({
  bc,
  border,
  style,
  children,
  ...rest
}) => (
  <TouchableOpacity
    style={[
      goalContainerStyle.base,
      {backgroundColor: bc, borderColor: border},
      style,
    ]}
    {...rest}>
    {children}
  </TouchableOpacity>
);

/* ---------- ChallengeInfo / ChallengeSubInfo ---------------------------- */
interface ChallengeInfoType {
  mainText: string;
  subText: string;
  headerEmoji: string;
  isSelected?: boolean;
}
const infoStyle = StyleSheet.create({
  big: {
    width: 122,
    height: 154,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginVertical: 8,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {elevation: 3},
    }),
  },
  small: {
    width: 108,
    height: 144,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    marginVertical: 8,
    gap: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {elevation: 3},
    }),
  },
});
const ChallengeInfo: React.FC<ChallengeInfoType> = ({
  mainText,
  subText,
  headerEmoji,
  isSelected,
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        infoStyle.big,
        {
          borderWidth: 2,
          borderColor: isSelected ? theme.primary1 : theme.white,
        },
      ]}>
      <Profile>
        <TossFace size={22}>{headerEmoji}</TossFace>
      </Profile>
      <View style={{gap: 8}}>
        <NotoSansKR size={14}>{mainText}</NotoSansKR>
        <NotoSansKR size={11} color="gray5">
          {subText}
        </NotoSansKR>
      </View>
    </View>
  );
};
const ChallengeSubInfo: React.FC<ChallengeInfoType> = ({
  mainText,
  subText,
  headerEmoji,
}) => (
  <View style={infoStyle.small}>
    <Profile>
      <TossFace size={20}>{headerEmoji}</TossFace>
    </Profile>
    <View style={{gap: 4}}>
      <NotoSansKR size={14}>{mainText}</NotoSansKR>
      <NotoSansKR size={10} color="gray5">
        {subText}
      </NotoSansKR>
    </View>
  </View>
);

/* ---------- Top / Center / Foot Container ------------------------------ */
const layoutStyle = StyleSheet.create({
  top: {gap: 8, padding: 16},
  center: {paddingHorizontal: 16, gap: 16},
  foot: {gap: 16, padding: 16},
});
const TopContainer: React.FC<React.ComponentProps<typeof View>> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[layoutStyle.top, {backgroundColor: theme.primary2}, style]}
      {...rest}>
      {children}
    </View>
  );
};
const CenterContainer: React.FC<React.ComponentProps<typeof View>> = ({
  style,
  children,
  ...rest
}) => (
  <View style={[layoutStyle.center, style]} {...rest}>
    {children}
  </View>
);
const FootContainer: React.FC<
  React.ComponentProps<typeof View> & {disalbed?: boolean}
> = ({disalbed, style, children, ...rest}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        layoutStyle.foot,
        {backgroundColor: disalbed ? theme.gray5 : theme.gray1},
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
};
