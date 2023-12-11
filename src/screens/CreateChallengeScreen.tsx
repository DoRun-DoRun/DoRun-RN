import React, {Dispatch, SetStateAction, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
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
import {useMutation, useQuery} from 'react-query';
import {RootState} from '../../store/Store';
import {useNavigation} from '@react-navigation/native';

const SearchContainer = styled.View<{isClicked: boolean}>`
  flex: 1;
  background-color: #fff;
  border: 1px solid ${props => props.theme.gray6};
  padding: 8px;
  border-radius: 10px;
  gap: 16px;
  z-index: 10;
`;

const ExpandedContainer = styled.View`
  background-color: #fff;
  padding: 0 8px;
  gap: 16px;
  padding-bottom: 8px;
`;

interface InviteFriendType {
  name: string;
  UID: number;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
}

const InviteFriend = ({name, UID, setInviteListData}: InviteFriendType) => {
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
      <NotoSansKR size={14} weight="Regular">
        {name}
      </NotoSansKR>

      <TouchableOpacity
        onPress={() => {
          setInviteListData(prev => {
            if (!prev.find(item => item.UID === UID)) {
              return [...prev, {UserName: name, UID, accept: false}];
            }
            // 중복된 항목이 있으면 리스트 변경 없이 반환
            return prev;
          });
        }}>
        <NotoSansKR
          size={14}
          weight="Regular"
          color="gray3"
          style={{textDecorationLine: 'underline'}}>
          초대하기
        </NotoSansKR>
      </TouchableOpacity>
    </View>
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

const SearchBox = ({
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
  if (searchLoading || friendLoading) {
    return <NotoSansKR size={16}>로딩중</NotoSansKR>;
  }
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
          onBlur={() => setIsClicked(false)}
          onFocus={() => setIsClicked(true)}
        />
      </RowContainer>

      {isClicked && !uidInput ? (
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
      ) : null}

      {isClicked && uidInput ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>검색 결과</NotoSansKR>
          {searchData?.USER_NM ? (
            <InviteFriend
              name={searchData.USER_NM}
              UID={searchData.UID}
              setInviteListData={setInviteListData}
            />
          ) : (
            <NotoSansKR size={14} color="gray5">
              검색결과가 없습니다.
            </NotoSansKR>
          )}
        </ExpandedContainer>
      ) : null}
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

interface InviteList {
  UserName: string;
  UID: number;
  accept?: boolean;
}

const InviteList = ({UserName, accept}: InviteList) => {
  return (
    <RowContainer seperate>
      <NotoSansKR size={16} weight="Medium">
        {UserName}
      </NotoSansKR>
      <NotoSansKR size={14} weight="Regular" color={accept ? 'green' : 'red'}>
        {accept ? '참여중이에요' : '참여를 기다리고 있어요'}
      </NotoSansKR>
    </RowContainer>
  );
};

// const emojiObject = {
//   emoji: '❤️',
//   name: 'red heart',
//   slug: 'red_heart',
//   unicode_version: '0.6',
// };
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

const formatDate = (date: Date): string => {
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

const CalendarContainer = ({
  setCalendarOpen,
  setCalendarData,
}: {
  setCalendarOpen: Dispatch<SetStateAction<boolean>>;
  setCalendarData: Dispatch<SetStateAction<{start: string; end: string}>>;
}) => {
  const [markedDates, setMarkedDates] = useState<MarkedDataType>({});
  const theme = useTheme();

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
          color: theme.primary1,
          textColor: 'white',
        },
      });
    }
  };

  const sendCalendarData = () => {
    setCalendarOpen(false);
    const keys = Object.keys(markedDates);
    const endDate = new Date(keys![keys.length - 1]);
    endDate.setDate(endDate.getDate() + 1);

    setCalendarData({
      start: keys![0],
      end: formatDate(endDate),
    });
  };
  return (
    <CalendarModal onPress={() => setCalendarOpen(false)}>
      <CalendarModalContainer onPress={e => e.stopPropagation()}>
        <Calendar
          style={{padding: 16}}
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

  const navigation = useNavigation();

  // const validAccessToken = accessToken || '기본값 또는 대체값';
  const validUserName = userName || '기본 사용자 이름';
  const validUID = UID || 1000000;

  const [listOpen, setListOpen] = useState(true);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>();
  const [challengeName, setChallengeName] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarData, setCalendarData] = useState({start: '', end: ''});

  const [inviteListData, setInviteListData] = useState<InviteList[]>([
    {UserName: validUserName, UID: validUID, accept: true},
  ]);

  const theme = useTheme();
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
    onSuccess: response => {
      console.log('Success:', response);

      navigation.navigate('MainTab' as never);
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const {mutate: ChallengeCreateNowMutate} = useMutation(createChallenge, {
    onSuccess: response => {
      console.log('Success:', response);
      Alert.alert(
        '챌린지 시작하기',
        '시작 날짜까지 참가지를 기다리지 않고 바로 시작하시겠습니까?',
        [
          {
            text: '바로시작',
            onPress: () => ChallengeStartMutate(response.CHALLENGE_MST_NO),
            style: 'default',
          },
          {
            text: '기다리기',
            onPress: () => navigation.navigate('MainTab' as never),
          },
        ],
      );
    },
    onError: error => {
      console.error('Error:', error);
    },
  });

  const challengeStart = (challenge_mst_no: number) =>
    CallApi({
      endpoint: `challenge/start?challenge_mst_no=${challenge_mst_no}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate: ChallengeStartMutate} = useMutation(challengeStart, {
    onSuccess: response => {
      console.log('Success:', response);

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
            {!searchOpen ? <OcticonIcons name="plus-circle" size={24} /> : null}
          </RowContainer>

          <View style={{gap: 16}}>
            <RowContainer style={{justifyContent: 'space-between'}}>
              <NotoSansKR size={18} style={{marginBottom: 4}}>
                챌린지 참여 인원
              </NotoSansKR>
              <TouchableOpacity onPress={() => setListOpen(!listOpen)}>
                <OcticonIcons
                  name={listOpen ? 'chevron-down' : 'chevron-up'}
                  size={28}
                  color={theme.gray3}
                />
              </TouchableOpacity>
            </RowContainer>

            {listOpen ? (
              <View style={{gap: 12}}>
                {inviteListData.map((data, key) => (
                  <InviteList
                    key={key}
                    UserName={data.UserName}
                    UID={data.UID}
                    accept={data.accept}
                  />
                ))}
              </View>
            ) : null}
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
            if (
              !challengeName ||
              !calendarData.start ||
              !calendarData.end ||
              !selectedEmoji
            ) {
              console.error('모든 필수 필드를 채워주세요.');
              return;
            }
            ChallengeCreateNowMutate();
          }}>
          바로 시작하기
        </ButtonComponent>
        <ButtonComponent
          type="secondary"
          onPress={() => {
            if (
              !challengeName ||
              !calendarData.start ||
              !calendarData.end ||
              !selectedEmoji
            ) {
              console.error('모든 필수 필드를 채워주세요.');
              return;
            }
            ChallengeCreateMutate();
          }}>
          시작 날짜까지 기다리기
        </ButtonComponent>
      </View>

      <EmojiPicker
        onEmojiSelected={emojiObject => setSelectedEmoji(emojiObject)}
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
      />

      {calendarOpen ? (
        <CalendarContainer
          setCalendarOpen={setCalendarOpen}
          setCalendarData={setCalendarData}
        />
      ) : null}
    </HomeContainer>
  );
};
export default CreateChallengeScreen;
