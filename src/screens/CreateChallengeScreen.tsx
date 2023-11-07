import React, {Dispatch, SetStateAction, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
} from '../Component';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {styled, useTheme} from 'styled-components/native';
import EmojiPicker from 'rn-emoji-keyboard';
import {Calendar} from 'react-native-calendars';

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
  gap: 8px;
  padding-bottom: 16px;
`;

interface InviteFriendType {
  name: string;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
}

const InviteFriend = ({name, setInviteListData}: InviteFriendType) => {
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
      <NotoSansKR size={14} weight="Regular">
        {name}
      </NotoSansKR>

      <TouchableOpacity
        onPress={() => {
          setInviteListData(prev => [...prev, {name: name, accept: false}]);
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

const SearchBox = ({
  isClicked,
  setIsClicked,
  setInviteListData,
}: SearchBoxType) => {
  const [textValue, setTextValue] = useState('');
  const FriendListData = [{name: '닉네임 C'}];
  const SearchListData = [{name: '닉네임 D'}];

  return (
    <SearchContainer isClicked={isClicked}>
      <RowContainer gap={8}>
        <OcticonIcons name="search" size={16} />
        <TextInput
          value={textValue}
          onChangeText={text => setTextValue(text)}
          style={{flex: 1}}
          placeholder="Friend UID"
          onBlur={() => setIsClicked(false)}
          onFocus={() => setIsClicked(true)}
        />
      </RowContainer>

      {isClicked && !textValue ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>친구 목록</NotoSansKR>
          {FriendListData.map((data, key) => (
            <InviteFriend
              key={key}
              name={data.name}
              setInviteListData={setInviteListData}
            />
          ))}
        </ExpandedContainer>
      ) : null}

      {isClicked && textValue ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>검색 결과</NotoSansKR>
          {SearchListData.map((data, key) => (
            <InviteFriend
              key={key}
              name={data.name}
              setInviteListData={setInviteListData}
            />
          ))}
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
  name: string;
  accept?: boolean;
}

const InviteList = ({name, accept}: InviteList) => {
  return (
    <RowContainer seperate>
      <NotoSansKR size={16} weight="Medium">
        {name}
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
  const [listOpen, setListOpen] = useState(true);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiType>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarData, setCalendarData] = useState({start: '', end: ''});

  const [inviteListData, setInviteListData] = useState<InviteList[]>([
    {name: '닉네임 A', accept: true},
    {name: '닉네임 B', accept: false},
  ]);

  const theme = useTheme();

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
            <InputNotoSansKR size={20} placeholder="챌린지 목표" />
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
                  <InviteList key={key} name={data.name} accept={data.accept} />
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
        <ButtonComponent>지금 시작하기</ButtonComponent>
        <ButtonComponent type="secondary">참여 기다리기</ButtonComponent>
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
