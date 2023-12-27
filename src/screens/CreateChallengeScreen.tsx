import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
  convertKoKRToUTC,
  useApi,
} from '../Component';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {styled, useTheme} from 'styled-components/native';
import EmojiPicker from 'rn-emoji-keyboard';
import {Calendar} from 'react-native-calendars';
import {useSelector} from 'react-redux';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {RootState} from '../../store/Store';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {Alert} from 'react-native';

const SearchContainer = styled.View<{isClicked: boolean}>`
  flex: 1;
  background-color: #fff;
  border: 1px solid ${props => props.theme.gray6};
  padding: 8px;
  border-radius: 10px;
  /* gap: 16px; */
  z-index: 10;
`;

const ExpandedContainer = styled.View`
  background-color: #fff;
  padding: 8px;
  margin-top: 8px;
  gap: 16px;
`;

export interface InviteFriendType {
  name: string;
  UID: number;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
  setUidInput?: Dispatch<SetStateAction<string>>;
}

export const InviteFriend = ({
  name,
  UID,
  setInviteListData,
  setUidInput,
}: InviteFriendType) => {
  return (
    <RowContainer seperate>
      <NotoSansKR size={14} weight="Regular">
        {name}
      </NotoSansKR>

      <TouchableOpacity
        onPress={() => {
          const ToastModal = (message: string) =>
            Toast.show({
              type: 'error',
              text1: '초대 실패',
              text2: message,
            });
          setInviteListData(prev => {
            // 이미 초대된 사용자인지 확인
            const existingUser = prev.find(item => item.UID === UID);
            if (existingUser) {
              ToastModal('이미 초대된 사용자입니다.');
              return prev;
            }

            // 초대 가능한 최대 인원수 확인
            if (prev.length >= 6) {
              ToastModal('최대 6명까지만 초대할 수 있습니다.');
              return prev;
            }

            // 사용자 추가
            return [...prev, {UserName: name, UID, accept: false}];
          });

          if (setUidInput) {
            setUidInput('');
          }
        }}>
        <NotoSansKR
          size={14}
          weight="Regular"
          color="gray3"
          style={{textDecorationLine: 'underline'}}>
          초대하기
        </NotoSansKR>
      </TouchableOpacity>
    </RowContainer>
  );
};

interface SearchBoxType {
  isClicked: boolean;
  setIsClicked: Dispatch<SetStateAction<boolean>>;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
}

interface FriendType {
  UID: number;
  USER_NM: string;
}

export const SearchBox = ({
  isClicked,
  setIsClicked,
  setInviteListData,
}: SearchBoxType) => {
  const [uidInput, setUidInput] = useState('');

  const CallApi = useApi();
  const {accessToken} = useSelector((state: RootState) => state.user);

  const FriendList = async () => {
    try {
      const response = CallApi({
        endpoint: 'friend/list',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const {data: friendData, isLoading: friendLoading} = useQuery(
    'FriendList',
    FriendList,
  );

  const SearchList = async () => {
    try {
      const response = CallApi({
        endpoint: `user/search/${uidInput}`,
        method: 'GET',
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const isUidValid = uidInput.length === 7 && /^\d{7}$/.test(uidInput);

  const {data: searchData, isLoading: searchLoading} = useQuery(
    ['SearchList', uidInput], // 쿼리 키에 uidInput 포함
    SearchList,
    {enabled: isUidValid}, // 쿼리 실행 조건
  );

  return (
    <SearchContainer isClicked={isClicked}>
      <RowContainer gap={8}>
        <OcticonIcons name="search" size={16} />
        <InputNotoSansKR
          keyboardType="number-pad"
          maxLength={7}
          size={14}
          value={uidInput}
          onChangeText={text => setUidInput(text)}
          style={{flex: 1}}
          placeholder="Friend UID"
          onFocus={() => setIsClicked(true)}
        />
      </RowContainer>

      {isClicked && !uidInput && (
        <>
          {friendLoading ? (
            <LoadingIndicatior />
          ) : (
            friendData?.accepted.length > 0 && (
              <ExpandedContainer>
                <NotoSansKR size={14}>친구 목록</NotoSansKR>
                {friendData?.accepted.map((data: FriendType, key: number) => (
                  <InviteFriend
                    key={key}
                    name={data.USER_NM}
                    UID={data.UID}
                    setInviteListData={setInviteListData}
                  />
                ))}
              </ExpandedContainer>
            )
          )}
        </>
      )}

      {isClicked && uidInput && (
        <ExpandedContainer>
          <NotoSansKR size={14}>검색 결과</NotoSansKR>
          {searchLoading ? (
            <LoadingIndicatior />
          ) : searchData?.USER_NM ? (
            <InviteFriend
              name={searchData.USER_NM}
              UID={searchData.UID}
              setInviteListData={setInviteListData}
              setUidInput={setUidInput}
            />
          ) : (
            <NotoSansKR size={14} color="gray5">
              검색결과가 없습니다.
            </NotoSansKR>
          )}
        </ExpandedContainer>
      )}
    </SearchContainer>
  );
};

const DatePicker = styled.TouchableOpacity`
  border: 1px solid ${props => props.theme.gray5};
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
`;

export interface InviteList {
  UserName: string;
  UID: number;
  accept?: boolean;
}

interface InviteListType {
  UserName: string;
  UID: number;
  accept?: boolean;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
}

export const InviteList = ({
  UserName,
  accept,
  UID,
  setInviteListData,
}: InviteListType) => {
  return (
    <RowContainer seperate>
      <NotoSansKR size={16} weight="Medium">
        {UserName}
      </NotoSansKR>
      <RowContainer gap={9}>
        <NotoSansKR size={14} weight="Regular" color={accept ? 'green' : 'red'}>
          {accept ? '참여중이에요' : '참여를 기다리고 있어요'}
        </NotoSansKR>
        {!accept && (
          <TouchableOpacity
            onPress={() => {
              setInviteListData(prev => prev.filter(item => item.UID !== UID));
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

interface EmojiType {
  emoji: string;
  name: string;
  slug: string;
  unicode_version: string;
}
interface Day {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

interface MarkedDataType {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    marked?: boolean;
    dotColor?: string;
    color?: string;
    textColor?: string;
  };
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarModal = styled.TouchableOpacity`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  justify-content: flex-end;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const CalendarModalContainer = styled.Pressable`
  padding-top: 16px;
  background-color: #fff;
  border-radius: 16px;
  z-index: 2;
`;

const CalendarRowContainer = styled(RowContainer)`
  justify-content: flex-end;
  border-top-width: 1px;
  padding: 12px;
  border-color: ${props => props.theme.primary1};
`;

export const CalendarContainer = ({
  setCalendarOpen,
  setCalendarData,
  calendarData,
}: {
  setCalendarOpen: Dispatch<SetStateAction<boolean>>;
  setCalendarData: Dispatch<SetStateAction<{start: string; end: string}>>;
  calendarData: {start: string; end: string};
}) => {
  const [markedDates, setMarkedDates] = useState<MarkedDataType>({});
  const theme = useTheme();

  useEffect(() => {
    if (calendarData.start !== '' && calendarData.end !== '') {
      console.log(calendarData);
      const {start, end} = calendarData;
      const startDate = new Date(start);
      const endDate = new Date(end);
      const newMarkedDates = {...markedDates};

      let day = new Date(startDate);
      day.setDate(day.getDate() + 1); // 시작 날짜 다음 날부터 순회 시작

      newMarkedDates[start] = {
        startingDay: true,
        color: theme.primary1,
        textColor: 'white',
      };

      while (day < endDate) {
        const dayStr = formatDate(day);
        newMarkedDates[dayStr] = {
          marked: true,
          dotColor: 'transparent',
          color: theme.primary1,
          textColor: 'white',
        };
        day.setDate(day.getDate() + 1);
      }

      newMarkedDates[end] = {
        endingDay: true,
        color: theme.primary1,
        textColor: 'white',
      };

      setMarkedDates(newMarkedDates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDayPress = (date: Day) => {
    const {dateString} = date;

    const newDates = {...markedDates};
    if (newDates.start && newDates.end) {
      // 이미 시작과 종료 날짜가 선택되었다면 초기화
      setMarkedDates({});
    }

    const keys = Object.keys(markedDates);
    if (keys.length === 1) {
      const [start] = keys;

      // 두 날짜를 Date 객체로 변환
      const startDate = new Date(start);
      const endDate = new Date(dateString);

      // 시작 날짜가 종료 날짜보다 클 경우 종료 날짜를 시작으로, 시작 날짜를 종료로 설정
      if (startDate >= endDate) {
        setMarkedDates({
          [dateString]: {
            startingDay: true,
            endingDay: true,
            color: theme.primary1,
            textColor: 'white',
          },
        });
        return;
      }

      // 시작, 종료 날짜 및 사이의 모든 날짜를 markedDates 객체에 추가
      const newMarkedDates: MarkedDataType = {
        [start]: {startingDay: true, color: theme.primary1, textColor: 'white'},
        [dateString]: {
          endingDay: true,
          color: theme.primary1,
          textColor: 'white',
        },
      };

      const day = new Date(startDate);
      day.setDate(day.getDate() + 1); // 시작 날짜 다음 날부터 순회 시작

      while (day < endDate) {
        const dayStr = formatDate(day);
        newMarkedDates[dayStr] = {
          marked: true,
          dotColor: 'transparent',
          color: theme.primary1,
          textColor: 'white',
        };
        day.setDate(day.getDate() + 1);
      }
      setMarkedDates(newMarkedDates);
    } else {
      setMarkedDates({
        [dateString]: {
          startingDay: true,
          endingDay: true,
          color: theme.primary1,
          textColor: 'white',
        },
      });
    }
  };

  const sendCalendarData = () => {
    setCalendarOpen(false);
    const keys = Object.keys(markedDates);

    setCalendarData({
      start: keys![0],
      end: keys.length <= 1 ? keys![0] : keys![1],
    });
  };

  return (
    <CalendarModal onPress={() => setCalendarOpen(false)}>
      <CalendarModalContainer onPress={e => e.stopPropagation()}>
        <Calendar
          style={{padding: 16}}
          minDate={formatDate(new Date())}
          onDayPress={onDayPress}
          markingType={'period'}
          markedDates={markedDates}
        />
        <CalendarRowContainer gap={16}>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => setCalendarOpen(false)}>
            <NotoSansKR size={14} color="primary1">
              Cancel
            </NotoSansKR>
          </TouchableOpacity>

          <TouchableOpacity style={{padding: 10}} onPress={sendCalendarData}>
            <NotoSansKR size={14} color="primary1">
              Ok
            </NotoSansKR>
          </TouchableOpacity>
        </CalendarRowContainer>
      </CalendarModalContainer>
    </CalendarModal>
  );
};

const CreateChallengeScreen = () => {
  const {accessToken, userName, UID} = useSelector(
    (state: RootState) => state.user,
  );
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  // const validAccessToken = accessToken || '기본값 또는 대체값';
  const validUserName = userName || '기본 사용자 이름';
  const validUID = UID || 1000000;

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>();
  const [challengeName, setChallengeName] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarData, setCalendarData] = useState({start: '', end: ''});

  const [inviteListData, setInviteListData] = useState<InviteList[]>([
    {UserName: validUserName, UID: validUID, accept: true},
  ]);

  const CallApi = useApi();

  const createChallenge = () =>
    CallApi({
      endpoint: 'challenge',
      method: 'POST',
      accessToken: accessToken!,
      body: {
        CHALLENGE_MST_NM: challengeName,
        USERS_UID: inviteListData.map(item => ({
          USER_UID: item.UID,
          INVITE_STATS: item.accept ? 'ACCEPTED' : 'PENDING',
        })),
        START_DT: convertKoKRToUTC(calendarData.start).toISOString(),
        END_DT: convertKoKRToUTC(calendarData.end).toISOString(),
        HEADER_EMOJI: selectedEmoji?.emoji,
      },
    });

  const {mutate: ChallengeCreateMutate} = useMutation(createChallenge, {
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '챌린지가 생성되었어요.',
      });
      queryClient.invalidateQueries('getChallenge');
      navigation.navigate('MainTab' as never);
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const {mutate: ChallengeStartMutate} = useMutation(createChallenge, {
    onSuccess: response => {
      ChallengeStart(response.CHALLENGE_MST_NO);
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const challengeStart = (selectedChallengeMstNo: number) =>
    CallApi({
      endpoint: `challenge/start?challenge_mst_no=${selectedChallengeMstNo}`,
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
      queryClient.invalidateQueries('ChallengeUserList');
      queryClient.invalidateQueries('challenge_history');
      queryClient.invalidateQueries('userData');
      navigation.navigate('MainTab' as never);
    },
    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          <NotoSansKR size={20} weight="Bold">
            도전을 시작해볼까요?
          </NotoSansKR>

          <RowContainer gap={16}>
            <TouchableOpacity onPress={() => setEmojiOpen(true)}>
              {selectedEmoji ? (
                <TossFace size={40}>{selectedEmoji?.emoji}</TossFace>
              ) : (
                <OcticonIcons name="plus-circle" size={40} />
              )}
            </TouchableOpacity>
            <InputNotoSansKR
              size={20}
              placeholder="챌린지 목표"
              onChangeText={setChallengeName}
              value={challengeName}
            />
          </RowContainer>

          <RowContainer gap={8}>
            <SearchBox
              isClicked={searchOpen}
              setIsClicked={setSearchOpen}
              setInviteListData={setInviteListData}
            />
            {/* {!searchOpen ? <OcticonIcons name="plus-circle" size={24} /> : null} */}
          </RowContainer>

          <View style={{gap: 16}}>
            <RowContainer style={{justifyContent: 'space-between'}}>
              <NotoSansKR size={18} style={{marginBottom: 4}}>
                챌린지 참여 인원
              </NotoSansKR>
            </RowContainer>

            <View style={{gap: 12}}>
              {inviteListData.map((data, key) => (
                <InviteList
                  key={key}
                  UserName={data.UserName}
                  UID={data.UID}
                  accept={data.accept}
                  setInviteListData={setInviteListData}
                />
              ))}
            </View>
          </View>

          <View style={{gap: 8}}>
            <NotoSansKR size={18}>챌린지 기간</NotoSansKR>

            <DatePicker
              onPress={() => {
                setCalendarOpen(true);
              }}>
              {calendarData.end && calendarData.start ? (
                <NotoSansKR size={14} weight="Medium" color="gray2">
                  {calendarData.start + ' ~ ' + calendarData.end}
                </NotoSansKR>
              ) : (
                <NotoSansKR size={14} weight="Medium" color="gray4">
                  날짜를 선택해주세요
                </NotoSansKR>
              )}
            </DatePicker>
          </View>
        </InnerContainer>
      </ScrollContainer>

      <View style={{gap: 8, padding: 16}}>
        <ButtonComponent
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

            if (missingItems.length > 0) {
              Toast.show({
                type: 'error',
                text1: '모든 항목을 채워주세요',
                text2: missingItems.join(', ') + '을(를) 작성해주세요.',
              });
              return;
            }

            if (
              calendarData.start === formatDate(new Date()) &&
              inviteListData.length > 1
            ) {
              Alert.alert(
                '챌린지 시작 날짜가 오늘입니다.', // 경고 제목
                '친구들을 기다리지 않고 바로 시작할까요?', // 경고 메시지
                [
                  {
                    text: '날짜 변경하기',
                    style: 'cancel',
                  },
                  {
                    text: '바로 시작하기',
                    onPress: () => ChallengeStartMutate(),
                    style: 'destructive',
                  },
                ],
                {cancelable: false},
              );
            } else {
              ChallengeCreateMutate();
            }
          }}>
          챌린지 생성하기
        </ButtonComponent>
      </View>

      <EmojiPicker
        onEmojiSelected={emojiObject => setSelectedEmoji(emojiObject)}
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
export default CreateChallengeScreen;
