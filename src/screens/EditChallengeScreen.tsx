import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {
  ButtonComponent,
  GetImage,
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
  convertKoKRToUTC,
  convertUTCToKoKR,
  getDayOfWeek,
  useApi,
} from '../Component';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import EmojiPicker from 'rn-emoji-keyboard';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {RootState} from '../../store/Store';
import {useNavigation} from '@react-navigation/native';
import {
  CalendarContainer,
  DatePicker,
  formatDate,
} from './CreateChallengeScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useModal} from '../Modal/ModalProvider';
import {ChallengeInviteFriend} from '../Modal/SearchBoxModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ChallengeOptionModal} from '../Modal/Modals';
import KakaoShareLink from 'react-native-kakao-share-link';
import {setSelectedChallengeMstNo} from '../../store/slice/ChallengeSlice';
import {ChallengeStatusType, InviteAcceptType} from '../../store/data';
import {EditChallengeRouteType} from '../App';

export interface InviteList {
  UserName: string;
  UID: number;
  accept?: boolean;
}

interface InviteListType {
  UserName: string;
  challenge_mst_no: number;
  UID: number;
  accept?: boolean;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
}

const InviteList = ({
  challenge_mst_no,
  UserName,
  accept,
  UID,
  setInviteListData,
}: InviteListType) => {
  const {accessToken} = useSelector((state: RootState) => state.user);

  const CallApi = useApi();

  const deleteChallegeUser = (uid: number) =>
    CallApi({
      endpoint: `challenge/delete_user/${challenge_mst_no}?user_uid=${uid}`,
      method: 'DELETE',
      accessToken: accessToken!,
    });

  const {mutate: DeleteChallegeUser} = useMutation(deleteChallegeUser, {
    onSuccess: () => {},
    onError: error => {
      console.error('Error:', error);
    },
  });

  return (
    <RowContainer seperate>
      <NotoSansKR size={16} weight="Medium">
        {UserName}
      </NotoSansKR>
      <RowContainer gap={9}>
        <NotoSansKR size={14} weight="Regular" color={accept ? 'green' : 'red'}>
          {accept ? '참여 중' : '초대완료'}
        </NotoSansKR>
        {!accept && (
          <TouchableOpacity
            onPress={() => {
              setInviteListData(prev => prev.filter(item => item.UID !== UID));
              DeleteChallegeUser(UID);
            }}>
            <NotoSansKR
              size={14}
              weight="Regular"
              color="gray3"
              style={{textDecorationLine: 'underline'}}>
              취소하기
            </NotoSansKR>
          </TouchableOpacity>
        )}
      </RowContainer>
    </RowContainer>
  );
};

interface participantsDataType {
  UID: number;
  USER_NM: string;
  ACCEPT_STATUS: InviteAcceptType;
}

const EditChallengeScreen = ({route}: {route: EditChallengeRouteType}) => {
  const {challenge_mst_no} = route.params;

  const {accessToken, userName} = useSelector((state: RootState) => state.user);

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>();
  const [challengeName, setChallengeName] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarData, setCalendarData] = useState({start: '', end: ''});

  const [inviteListData, setInviteListData] = useState<InviteList[]>([]);
  const {showModal, hideModal} = useModal();
  const dispatch = useDispatch();

  const CallApi = useApi();

  const getChallengeEdit = () =>
    CallApi({
      endpoint: `challenge/invite/${challenge_mst_no}`,
      method: 'GET',
      accessToken: accessToken!,
    });

  const {data: challengeData, isLoading: loadingChallenge} = useQuery(
    'getChallengeEdit',
    getChallengeEdit,
  );

  const editChallenge = () =>
    CallApi({
      endpoint: `challenge/${challenge_mst_no}`,
      method: 'PUT',
      accessToken: accessToken!,
      body: {
        CHALLENGE_MST_NM: challengeName,
        USERS_UID: inviteListData.map(item => ({
          USER_UID: item.UID,
          INVITE_STATS: item.accept
            ? InviteAcceptType.ACCEPTED
            : InviteAcceptType.DELETED,
        })),
        START_DT: convertKoKRToUTC(calendarData.start).toISOString(),
        END_DT: convertKoKRToUTC(calendarData.end).toISOString(),
        HEADER_EMOJI: selectedEmoji,
      },
    });

  const {mutate: ChallengeEditMutate} = useMutation(editChallenge, {
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '챌린지 정보가 수정되었어요.',
      });
      queryClient.invalidateQueries('getChallenge');
      queryClient.invalidateQueries('ChallengeUserList');
      queryClient.invalidateQueries('challenge_history');
      queryClient.invalidateQueries('userData');
      navigation.navigate('MainTab' as never);
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const {mutate: ChallengeStartMutate} = useMutation(editChallenge, {
    onSuccess: () => {
      ChallengeStart();
    },
    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  const challengeStart = () =>
    CallApi({
      endpoint: `challenge/start?challenge_mst_no=${challenge_mst_no}&start_dt=${convertKoKRToUTC(
        formatDate(new Date()),
      ).toISOString()}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate: ChallengeStart} = useMutation(challengeStart, {
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '챌린지가 시작되었어요.',
      });
      queryClient.invalidateQueries('getChallenge');
      queryClient.invalidateQueries('getChallengeDetail');
      queryClient.invalidateQueries('ChallengeUserList');
      queryClient.invalidateQueries('challenge_history');
      queryClient.invalidateQueries('userData');
      hideModal();
      navigation.navigate('MainTab' as never);
    },
    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  useEffect(() => {
    if (challengeData !== undefined) {
      const listData = challengeData.PARTICIPANTS?.map(
        (participant: participantsDataType) => ({
          UserName: participant.USER_NM,
          UID: participant.UID,
          accept: participant.ACCEPT_STATUS === InviteAcceptType.ACCEPTED,
        }),
      );

      setChallengeName(challengeData.CHALLENGE_MST_NM);
      setInviteListData(listData);
      setCalendarData({
        start: convertUTCToKoKR(challengeData.START_DT),
        end: convertUTCToKoKR(challengeData.END_DT),
      });
      setSelectedEmoji(challengeData.HEADER_EMOJI);
    }
  }, [
    challengeData,
    challengeData?.CHALLENGE_MST_NM,
    challengeData?.END_DT,
    challengeData?.HEADER_EMOJI,
    challengeData?.PARTICIPANTS,
    challengeData?.START_DT,
  ]);

  const challengeDelete = () =>
    CallApi({
      endpoint: `challenge/${challenge_mst_no}`,
      method: 'DELETE',
      accessToken: accessToken!,
    });

  const {mutate: ChallengeDeleteMutation} = useMutation(challengeDelete, {
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '챌린지가 삭제되었어요.',
      });
      dispatch(setSelectedChallengeMstNo(null));
      hideModal();

      // 상태 업데이트가 반영된 후 쿼리 무효화
      queryClient.invalidateQueries('getChallenge');
      queryClient.invalidateQueries('ChallengeUserList');
      queryClient.invalidateQueries('challenge_history');
      queryClient.invalidateQueries('userData');

      navigation.navigate('MainTab' as never);
    },

    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  // const sendURL = async () => {
  //   const deepLinkUrl = `myapp://challenge?INVITE_CHALLENGE_NO=${challengeData.CHALLENGE_MST_NO}`;

  //   try {
  //     await Share.share({
  //       message: `${userName}님이 챌린지에 초대했어요!\n${challengeData.CHALLENGE_MST_NM}에 도전해보세요!\n${deepLinkUrl}`,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const sendKakao = async () => {
    try {
      const response = await KakaoShareLink.sendFeed({
        content: {
          title: `${userName}님이 챌린지에 초대했어요!`,
          imageUrl: GetImage('group_default_3@3x.png'),
          link: {
            webUrl: 'https://developers.kakao.com/',
            mobileWebUrl: 'https://developers.kakao.com/',
          },
          description: `두런두런과 함께 갓생 살기\n지금 친구들과 ${challengeData.CHALLENGE_MST_NM}에 도전해보세요!`,
        },
        buttons: [
          {
            title: '앱에서 보기',
            link: {
              androidExecutionParams: [
                {
                  key: 'INVITE_CHALLENGE_NO',
                  value: challengeData.CHALLENGE_MST_NO.toString(),
                },
              ],
              iosExecutionParams: [
                {
                  key: 'INVITE_CHALLENGE_NO',
                  value: challengeData.CHALLENGE_MST_NO.toString(),
                },
              ],
            },
          },
        ],
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        challengeData?.CHALLENGE_STATUS === ChallengeStatusType.PENDING &&
        challengeData?.IS_OWNER && (
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={'#1C1B1F'}
            onPress={() => {
              const missingItems = [];

              if (!challengeName) {
                missingItems.push('챌린지 목표');
              }
              if (!calendarData.start || !calendarData.end) {
                missingItems.push('챌린지 날짜');
              }
              if (!selectedEmoji) {
                missingItems.push('이모지');
              }

              showModal(
                <ChallengeOptionModal
                  missingItems={missingItems}
                  deleteChallenge={ChallengeDeleteMutation}
                  editChallenge={ChallengeEditMutate}
                />,
              );
            }}
          />
        ),
    });
  }, [
    ChallengeDeleteMutation,
    ChallengeEditMutate,
    calendarData.end,
    calendarData.start,
    challengeData?.CHALLENGE_STATUS,
    challengeData?.IS_OWNER,
    challengeName,
    navigation,
    selectedEmoji,
    showModal,
  ]);

  if (loadingChallenge) {
    return <LoadingIndicatior />;
  }

  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          {challengeData.CHALLENGE_STATUS === ChallengeStatusType.PENDING ? (
            <NotoSansKR size={20}>
              <NotoSansKR size={20} color="primary1">
                대기중
              </NotoSansKR>
              인 챌린지 정보에요
            </NotoSansKR>
          ) : (
            <NotoSansKR size={20}>
              <NotoSansKR size={20} color="primary1">
                진행중
              </NotoSansKR>
              인 챌린지 정보에요
            </NotoSansKR>
          )}

          <RowContainer gap={16}>
            <TouchableOpacity
              onPress={() =>
                challengeData.CHALLENGE_STATUS ===
                  ChallengeStatusType.PENDING &&
                challengeData.IS_OWNER &&
                setEmojiOpen(true)
              }>
              {selectedEmoji ? (
                <TossFace size={40}>{selectedEmoji}</TossFace>
              ) : (
                <OcticonIcons name="plus-circle" size={40} />
              )}
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <InputNotoSansKR
                maxLength={14}
                size={20}
                placeholder="챌린지 목표"
                onChangeText={setChallengeName}
                value={challengeName}
                editable={
                  challengeData.CHALLENGE_STATUS ===
                    ChallengeStatusType.PENDING && challengeData.IS_OWNER
                }
              />
            </View>
          </RowContainer>

          <View style={{gap: 8}}>
            <NotoSansKR size={18}>챌린지 기간</NotoSansKR>

            <DatePicker
              onPress={() => {
                challengeData.CHALLENGE_STATUS ===
                  ChallengeStatusType.PENDING &&
                  challengeData.IS_OWNER &&
                  setCalendarOpen(true);
              }}>
              {calendarData.end && calendarData.start ? (
                <NotoSansKR size={14} weight="Medium" color="gray2">
                  {`${calendarData.start} (${getDayOfWeek(
                    calendarData.start,
                  )}) ~ ${calendarData.end} (${getDayOfWeek(
                    calendarData.end,
                  )})`}
                </NotoSansKR>
              ) : (
                <NotoSansKR size={14} weight="Medium" color="gray4">
                  시작날짜와 종료날짜를 선택해주세요
                </NotoSansKR>
              )}
            </DatePicker>
          </View>

          <View style={{gap: 12}}>
            <NotoSansKR size={18}>참여중인 인원</NotoSansKR>

            {inviteListData?.map((data, key) => (
              <InviteList
                challenge_mst_no={challenge_mst_no}
                key={key}
                UserName={data.UserName}
                UID={data.UID}
                accept={data.accept}
                setInviteListData={setInviteListData}
              />
            ))}
          </View>
        </InnerContainer>
      </ScrollContainer>

      {challengeData.CHALLENGE_STATUS === ChallengeStatusType.PENDING &&
      challengeData.IS_OWNER ? (
        <View style={{gap: 8, padding: 16}}>
          <ButtonComponent
            onPress={() => {
              Alert.alert(
                '오늘 날짜로 시작합니다', // 대화상자 제목
                '챌린지 도중에는 참여가 불가능합니다\n지금 시작하시겠습니까?', // 메시지
                [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '바로 시작',
                    onPress: () => {
                      ChallengeStartMutate();
                    },
                    style: 'destructive',
                  },
                ],
              );
            }}>
            지금 시작하기
          </ButtonComponent>
          <RowContainer gap={8}>
            <View style={{flex: 1}}>
              <ButtonComponent
                type="secondary"
                onPress={() => {
                  sendKakao();
                }}>
                카카오톡 공유하기
              </ButtonComponent>
            </View>
            <View style={{flex: 1}}>
              <ButtonComponent
                type="secondary"
                onPress={() => {
                  showModal(
                    <ChallengeInviteFriend
                      challenge_mst_no={challenge_mst_no}
                      setInviteListData={setInviteListData}
                      inviteListData={inviteListData}
                    />,
                  );
                }}>
                친구 초대하기
              </ButtonComponent>
            </View>
          </RowContainer>
        </View>
      ) : (
        <View style={{gap: 8, padding: 16}}>
          <ButtonComponent
            type="primary"
            onPress={() => {
              Alert.alert(
                '정말로 챌린지를 그만하시겠습니까?', // 대화상자 제목
                '', // 메시지
                [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '그만하기',
                    onPress: () => {
                      ChallengeDeleteMutation(); // 챌린지 삭제 함수 호출
                    },
                    style: 'destructive',
                  },
                ],
              );
            }}>
            챌린지 중단하기
          </ButtonComponent>
        </View>
      )}

      <EmojiPicker
        onEmojiSelected={emojiObject => setSelectedEmoji(emojiObject.emoji)}
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
      />

      {calendarOpen ? (
        <CalendarContainer
          calendarData={calendarData}
          setCalendarOpen={setCalendarOpen}
          setCalendarData={setCalendarData}
        />
      ) : null}
    </HomeContainer>
  );
};

export default EditChallengeScreen;
