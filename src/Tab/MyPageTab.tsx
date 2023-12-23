import React, {useState} from 'react';
import {
  GetImage,
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  convertKoKRToUTC,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useModal} from '../Modal/ModalProvider';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import LinearGradient from 'react-native-linear-gradient';

const ProfileContainer = styled(RowContainer)`
  border: 1px solid ${props => props.theme.primary1};
  padding: 16px;
  border-radius: 10px;
`;

const UserIcon = styled.View`
  width: 80px;
  height: 80px;
  border: 3px solid ${props => props.theme.primary1};
  border-radius: 80px;
`;

const UserStatsCount = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${props => props.theme.primary2};
`;

const UserStatsBox = styled.View`
  gap: 3px;
  align-items: center;
`;

const UserStats = ({
  status,
  count,
}: {
  status: '완료' | '진행중' | '시작 전';
  count: number;
}) => {
  return (
    <UserStatsBox>
      <UserStatsCount>
        <NotoSansKR size={16} color="primary1">
          {count}
        </NotoSansKR>
      </UserStatsCount>
      <NotoSansKR size={12} color="gray4" weight="Medium">
        {status}
      </NotoSansKR>
    </UserStatsBox>
  );
};

const Divider = styled.View`
  height: 56px;
  border: 1px solid ${props => props.theme.gray6};
`;

const UserName = styled(NotoSansKR)`
  padding: 0 8px 8px 8px;
`;

const HistoryContainer = styled.View`
  flex: 1;
  margin: 0 -16px;
  padding: 0 16px;
  margin-bottom: -16px;
  background-color: ${props => props.theme.primary2};
`;

const CategoryContainer = styled(RowContainer)`
  margin: 0 -16px;
  justify-content: flex-end;
  background-color: ${props => props.theme.white};
`;

const CategoryTab = styled(RowContainer)`
  border-radius: 5px 5px 0 0;
  background-color: ${props => props.theme.gray7};
`;

const Tab = styled.Pressable<{selected?: boolean}>`
  padding: 4px 24px;
  border-radius: 5px 5px 0 0;
  background-color: ${props =>
    props.selected ? props.theme.primary2 : props.theme.gray7};
`;

const HistoryDetailContainer = styled.View`
  gap: 32px;
  padding: 16px 0;
`;

const DailyPicContiner = styled.View`
  align-items: center;
`;

const DailyPic = styled.Image`
  width: 300px;
  height: 300px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray7};
`;

const DailyTextContiner = styled.View`
  width: 200px;
  align-items: flex-end;
`;

const DailyDiary = styled(LinearGradient).attrs({
  start: {x: 1.27, y: 4.29},
  end: {x: -0.19, y: -2.08},
})`
  border-radius: 10px;
  padding: 16px;
  /* shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 30px;
  elevation: 4; */
`;

const DailyTodo = styled(LinearGradient).attrs({
  start: {x: 0.05, y: 0},
  end: {x: 1.07, y: 1},
})`
  gap: 8px;
  border-radius: 10px;
  padding: 8px 16px;
`;

const DailyTodoList = styled(RowContainer)`
  padding: 4px 0;
`;

interface PersonGoal {
  PERSON_NO: number;
  PERSON_NM: string;
  IS_DONE: true;
}

const History = () => {
  const {accessToken} = useSelector((state: RootState) => state.user);
  const CallApi = useApi();
  const currentDate = new Date();
  const formattedDate = currentDate
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '-')
    .replace('.', '');

  const theme = useTheme();
  const [date, setDate] = useState(formattedDate);
  const [index, setIndex] = useState(0);

  const ChallengeHistory = async () => {
    try {
      const response = CallApi({
        endpoint: `challenge/history?current_day=${convertKoKRToUTC(
          date,
        ).toISOString()}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const {data, isLoading} = useQuery(
    ['challenge_history', date],
    ChallengeHistory,
  );

  return (
    <>
      <View style={{marginHorizontal: -16}}>
        <CalendarProvider date={date} onDateChanged={e => setDate(e)}>
          <ExpandableCalendar firstDay={1} onDayPress={() => setIndex(0)} />
        </CalendarProvider>
      </View>
      {isLoading && <Text>로딩중</Text>}
      {data?.length > 0 ? (
        <>
          <RowContainer seperate>
            {index !== 0 ? (
              <TouchableOpacity onPress={() => setIndex(prev => prev - 1)}>
                <MaterialIcons name="chevron-left" size={24} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 24}} />
            )}
            <NotoSansKR size={18}>{data[index].CHALLENGE_MST_NM}</NotoSansKR>
            {index < data.length - 1 ? (
              <TouchableOpacity onPress={() => setIndex(prev => prev + 1)}>
                <MaterialIcons name="chevron-right" size={24} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 24}} />
            )}
          </RowContainer>

          {data[index].IMAGE_FILE_NM && (
            <DailyPicContiner>
              <DailyPic source={{uri: GetImage(data[index].IMAGE_FILE_NM)}} />
              <DailyTextContiner>
                <Text>{data[index].EMOJI}</Text>
              </DailyTextContiner>
            </DailyPicContiner>
          )}

          <View style={{gap: 16}}>
            {data[index].COMMENT && (
              <DailyDiary colors={['#09277b', '#3967ef', '#9eb8f9']}>
                <NotoSansKR color="white" size={16}>
                  {date} 한줄일기
                </NotoSansKR>
                <NotoSansKR color="white" size={14} weight="Regular">
                  {data[index].COMMENT}
                </NotoSansKR>
              </DailyDiary>
            )}

            {data[index].personGoal.length > 0 ? (
              <DailyTodo colors={['#ffffff', 'rgba(255, 255, 255, 0.3)']}>
                {data[index].personGoal.map((goal: PersonGoal, idx: number) => (
                  <DailyTodoList key={idx} gap={8}>
                    {goal.IS_DONE ? (
                      <MaterialIcons
                        name="check-box"
                        color={theme.primary1}
                        size={20}
                      />
                    ) : (
                      <MaterialIcons
                        name="check-box-outline-blank"
                        color={theme.primary1}
                        size={20}
                      />
                    )}

                    <NotoSansKR size={13} color="gray3">
                      {goal.PERSON_NM}
                    </NotoSansKR>
                  </DailyTodoList>
                ))}
              </DailyTodo>
            ) : (
              <Text>해당 날짜에 진행사항이 없어요</Text>
            )}

            {data[index].teamGoal && (
              <DailyTodo colors={['#ffffff', 'rgba(255, 255, 255, 0.4)']}>
                <DailyTodoList gap={8}>
                  {data[index].teamGoal.IS_DONE ? (
                    <MaterialIcons
                      name="check-box"
                      color={theme.primary1}
                      size={20}
                    />
                  ) : (
                    <MaterialIcons
                      name="check-box-outline-blank"
                      color={theme.primary1}
                      size={20}
                    />
                  )}

                  <NotoSansKR size={13} color="gray3">
                    {data[index].teamGoal.TEAM_NM}
                  </NotoSansKR>
                </DailyTodoList>
              </DailyTodo>
            )}
          </View>
        </>
      ) : (
        <NotoSansKR size={16}>챌린지 기록이 존재하지 않아요</NotoSansKR>
      )}
    </>
  );
};
const AlbumItem = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray6};
`;
const AlbumGrid = styled(RowContainer)`
  width: 232px;
  height: 248px;
  column-gap: 8px;
  row-gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Album = () => {
  const {showModal, hideModal} = useModal();

  const openModal = () => {
    const modalContent = (
      <View style={{alignItems: 'center', gap: 24}}>
        <View style={{height: 200, width: 200, backgroundColor: '#ccc'}} />
        <NotoSansKR size={14} onPress={() => hideModal()}>
          닫기
        </NotoSansKR>
      </View>
    );
    showModal(modalContent);
  };

  return (
    <RowContainer style={{justifyContent: 'space-between', padding: 16}}>
      <MaterialIcons name="chevron-left" size={20} />
      <AlbumGrid>
        <Pressable
          onPress={() => {
            openModal();
          }}>
          <AlbumItem />
        </Pressable>
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
      </AlbumGrid>
      <MaterialIcons name="chevron-right" size={20} />
    </RowContainer>
  );
};

const MyPageTab = () => {
  const CallApi = useApi();
  const [selected, setSelected] = useState('history');
  const {accessToken} = useSelector((state: RootState) => state.user);

  const UserProfile = async () => {
    try {
      const response = CallApi({
        endpoint: 'user',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const {data, isLoading, error} = useQuery('userData', UserProfile, {
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <Text>'Loading...'</Text>;
  }

  if (error) {
    return <Text>'ERROR...'</Text>;
  }

  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          <ProfileContainer gap={24}>
            <UserIcon />
            <View>
              <UserName size={16}>{data.USER_NM}</UserName>
              <RowContainer gap={16}>
                <UserStats status="완료" count={data.COMPLETE} />
                <Divider />
                <UserStats status="진행중" count={data.PROGRESS} />
                <Divider />
                <UserStats status="시작 전" count={data.PENDING} />
              </RowContainer>
            </View>
          </ProfileContainer>

          <HistoryContainer>
            <CategoryContainer>
              <CategoryTab>
                <Tab
                  selected={selected === 'history'}
                  onPress={() => {
                    setSelected('history');
                  }}>
                  <NotoSansKR
                    size={14}
                    color={selected === 'history' ? 'primary1' : 'gray4'}>
                    기록
                  </NotoSansKR>
                </Tab>
                <Tab
                  selected={selected === 'album'}
                  onPress={() => {
                    setSelected('album');
                  }}>
                  <NotoSansKR
                    size={14}
                    color={selected === 'album' ? 'primary1' : 'gray4'}>
                    앨범
                  </NotoSansKR>
                </Tab>
              </CategoryTab>
            </CategoryContainer>

            <HistoryDetailContainer>
              {selected === 'history' ? <History /> : <Album />}
            </HistoryDetailContainer>
          </HistoryContainer>
        </InnerContainer>
      </ScrollContainer>
    </HomeContainer>
  );
};

export default MyPageTab;
