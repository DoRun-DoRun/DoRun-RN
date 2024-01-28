import React, {useState} from 'react';
import {
  GetImage,
  HomeContainer,
  InnerContainer,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
  convertKoKRToUTC,
  formatDate,
  formatDateToYYYYMM,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import LinearGradient from 'react-native-linear-gradient';
import {adBannerMyPage, profileImage} from '../../store/data';
import {Direction} from 'react-native-calendars/src/types';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const ProfileContainer = styled(RowContainer)`
  border: 1px solid ${props => props.theme.primary1};
  padding: 16px;
  padding-right: 36px;
  border-radius: 10px;
`;

const UserIcon = styled.View`
  width: 80px;
  height: 80px;
  border: 3px solid ${props => props.theme.primary1};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  width: 100%;
  height: 300px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray7};
`;

const DailyTextContiner = styled.View`
  width: 200px;
  flex-direction: row;
  justify-content: flex-end;
`;

const DailyDiary = styled(LinearGradient).attrs({
  start: {x: 1.27, y: 4.29},
  end: {x: -0.19, y: -2.08},
})`
  border-radius: 10px;
  padding: 16px;
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

interface EmojiDataType {
  CHALLENGE_USER_NO: number;
  EMOJI: string;
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
  const [index, setIndex] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [disabledRight, setDisabledRight] = useState(false);

  const ChallengeHistory = async () => {
    try {
      const response = CallApi({
        endpoint: `challenge/history?current_day=${convertKoKRToUTC(
          date,
        ).toISOString()}&page=${index}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const {data, isLoading} = useQuery(
    ['challenge_history', date, index],
    ChallengeHistory,
  );

  const width = Dimensions.get('screen').width;

  return (
    <>
      <CalendarProvider
        date={date}
        // onMonthChange={e =>
        //   e.month > currentDate.getMonth() + 1
        //     ? setDisabledRight(false)
        //     : setDisabledRight(true)
        // }
      >
        <ExpandableCalendar
          renderHeader={(dateString: string) => (
            <NotoSansKR size={16}>{formatDateToYYYYMM(dateString)}</NotoSansKR>
          )}
          style={{borderRadius: 10, padding: 10}}
          renderArrow={(direction: Direction) =>
            direction === 'left' ? (
              <MaterialIcons
                name="arrow-back"
                size={20}
                color={theme.primary1}
              />
            ) : !disabledRight ? (
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={theme.primary1}
              />
            ) : (
              <View style={{width: 20}} />
            )
          }
          disableArrowRight={disabledRight}
          monthFormat="yy년 MM월"
          calendarWidth={width - 52}
          allowShadow
          onDayPress={e => setDate(e.dateString)}
          maxDate={formatDate(new Date())}
        />
      </CalendarProvider>

      {isLoading ? (
        <LoadingIndicatior />
      ) : data.total_size > 0 ? (
        <>
          <RowContainer seperate>
            {index !== 1 ? (
              <TouchableOpacity onPress={() => setIndex(prev => prev - 1)}>
                <MaterialIcons name="chevron-left" size={24} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 24}} />
            )}
            <NotoSansKR size={18}>{data.CHALLENGE_MST_NM}</NotoSansKR>
            {index < data.total_size ? (
              <TouchableOpacity onPress={() => setIndex(prev => prev + 1)}>
                <MaterialIcons name="chevron-right" size={24} />
              </TouchableOpacity>
            ) : (
              <View style={{width: 24}} />
            )}
          </RowContainer>

          {data.IMAGE_FILE_NM && (
            <DailyPicContiner>
              <DailyPic source={{uri: GetImage(data.IMAGE_FILE_NM)}} />
              <DailyTextContiner>
                {data.EMOJI.map((emojiData: EmojiDataType, key: number) => {
                  return (
                    <TossFace size={16} key={key}>
                      {emojiData.EMOJI}
                    </TossFace>
                  );
                })}
              </DailyTextContiner>
            </DailyPicContiner>
          )}

          <View style={{gap: 16}}>
            {data.COMMENT && (
              <DailyDiary colors={['#09277b', '#3967ef', '#9eb8f9']}>
                <NotoSansKR color="white" size={16}>
                  {date} 한줄일기
                </NotoSansKR>
                <NotoSansKR color="white" size={14} weight="Regular">
                  {data.COMMENT}
                </NotoSansKR>
              </DailyDiary>
            )}

            {data.personGoal.length > 0 && (
              <DailyTodo colors={['#ffffff', 'rgba(255, 255, 255, 0.3)']}>
                {data.personGoal.map((goal: PersonGoal, idx: number) => (
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
            )}
          </View>

          {!data?.IMAGE_FILE_NM &&
            !data?.COMMENT &&
            data?.personGoal?.length === 0 && (
              <View
                style={{
                  height: 140,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NotoSansKR size={16}>
                  이날은 하루를 완료하지 못했어요.
                </NotoSansKR>
              </View>
            )}
        </>
      ) : (
        <View
          style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
          <NotoSansKR size={16}>이날은 챌린지를 진행하지 않았어요</NotoSansKR>
        </View>
      )}
    </>
  );
};

const Album = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <NotoSansKR size={16}>열심히 개발중이에요!</NotoSansKR>
    </View>
  );
};

const MyPageTab = () => {
  const CallApi = useApi();
  const [selected, setSelected] = useState('history');
  const {accessToken, userName} = useSelector((state: RootState) => state.user);

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

  const {data, isLoading, error} = useQuery('userData', UserProfile);

  if (error) {
    return <NotoSansKR size={16}>'ERROR...'</NotoSansKR>;
  }

  return (
    <HomeContainer>
      <ScrollContainer contentContainerStyle={{flexGrow: 1}}>
        <InnerContainer gap={24}>
          {isLoading ? (
            <LoadingIndicatior />
          ) : (
            <ProfileContainer gap={24}>
              <UserIcon>
                <Image
                  source={profileImage[data.USER_CHARACTER_NO - 1]}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </UserIcon>

              <View style={{flex: 1}}>
                <UserName size={16}>{userName}</UserName>
                <RowContainer gap={16} seperate>
                  <UserStats status="완료" count={data.COMPLETE} />
                  <Divider />
                  <UserStats status="진행중" count={data.PROGRESS} />
                  <Divider />
                  <UserStats status="시작 전" count={data.PENDING} />
                </RowContainer>
              </View>
            </ProfileContainer>
          )}
          <View style={{marginLeft: -16}}>
            <BannerAd
              unitId={adBannerMyPage!}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>

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
