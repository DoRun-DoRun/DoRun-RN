import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageProps,
  Pressable,
  PressableProps,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {CalendarProvider, ExpandableCalendar} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {profileImage} from '../../store/data';
import {RootState} from '../../store/RootReducer';
import {
  HomeContainer,
  InnerContainer,
  LoadingIndicator,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  TossFace,
} from '../Component';
import {convertKoKRToUTC, GetImage, useApi} from '../Hook/hook';
import {Palette} from '../theme/palette';
import {useTheme} from '../theme/ThemeProvider';

interface PersonGoal {
  PERSON_NO: number;
  PERSON_NM: string;
  IS_DONE: true;
}

interface EmojiDataType {
  CHALLENGE_USER_NO: number;
  EMOJI: string;
}

function HistoryCalendar({theme}: {theme: Palette}) {
  const width = Dimensions.get('screen').width;
  const today = dayjs();

  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [currentMonth, setCurrentMonth] = useState(
    today.startOf('month').format('YYYY-MM-DD'),
  );

  const changeMonth = (offset: number) => {
    const next = dayjs(currentMonth).add(offset, 'month');

    if (next.isAfter(today, 'month')) return;
    setCurrentMonth(next.format('YYYY-MM-DD'));
  };

  const handleDayPress = (day: {dateString: string}) => {
    if (dayjs(day.dateString).isAfter(today, 'day')) return;
    setSelectedDate(day.dateString);
  };

  return (
    <CalendarProvider date={selectedDate}>
      <ExpandableCalendar
        renderHeader={d => (
          <NotoSansKR size={16}>{dayjs(d).format('YY년 MM월')}</NotoSansKR>
        )}
        current={currentMonth}
        onPressArrowLeft={() => changeMonth(-1)}
        onPressArrowRight={() => changeMonth(1)}
        disableArrowRight={dayjs(currentMonth).isSame(today, 'month')}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: theme.primary1,
          },
        }}
        maxDate={today.format('YYYY-MM-DD')}
        disableAllTouchEventsForDisabledDays={true}
        style={{borderRadius: 10}}
        calendarWidth={width - 32}
        allowShadow
      />
    </CalendarProvider>
  );
}

const History = () => {
  const {accessToken} = useSelector((state: RootState) => state.user);
  const CallApi = useApi();
  const today = dayjs().format('YYYY-MM-DD');

  const {theme} = useTheme();
  const [index, setIndex] = useState(1);

  const ChallengeHistory = async () => {
    try {
      const response = CallApi({
        endpoint: `challenge/history?current_day=${convertKoKRToUTC(
          today,
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
    ['challenge_history', today, index],
    ChallengeHistory,
  );

  return (
    <>
      <HistoryCalendar theme={theme} />

      {isLoading ? (
        <LoadingIndicator />
      ) : data.total_size > 0 ? (
        <>
          <RowContainer separate>
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
                  {today} 한줄일기
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
            <LoadingIndicator />
          ) : (
            <ProfileContainer>
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

              <View>
                <UserName size={16}>{userName}</UserName>
                <RowContainer gap={16}>
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
            {/* <BannerAd
              unitId={adBannerMyPage!}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            /> */}
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

/** ─── ProfileContainer ───────────────────────────────────────────────── */
export const ProfileContainer: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <RowContainer
      {...rest}
      style={[styles.profileContainer, {borderColor: theme.primary1}, style]}>
      {children}
    </RowContainer>
  );
};

/** ─── UserIcon ───────────────────────────────────────────────────────── */
export const UserIcon: React.FC<ViewProps> = ({style, children, ...rest}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[styles.userIcon, {borderColor: theme.primary1}, style]}>
      {children}
    </View>
  );
};

/** ─── UserStatsCount & UserStatsBox ─────────────────────────────────── */
export const UserStatsCount: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[styles.userStatsCount, {backgroundColor: theme.primary2}, style]}>
      {children}
    </View>
  );
};

export const UserStatsBox: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => (
  <View {...rest} style={[styles.userStatsBox, style]}>
    {children}
  </View>
);

/** ─── Divider ────────────────────────────────────────────────────────── */
export const Divider: React.FC<ViewProps> = ({style, ...rest}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[styles.divider, {borderColor: theme.gray6}, style]}
    />
  );
};

/** ─── UserName ───────────────────────────────────────────────────────── */
export const UserName: React.FC<React.ComponentProps<typeof NotoSansKR>> = ({
  style,
  ...rest
}) => <NotoSansKR {...rest} style={[styles.userName, style]} />;

/** ─── HistoryContainer ───────────────────────────────────────────────── */
export const HistoryContainer: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.historyContainer,
        {backgroundColor: theme.primary2},
        style,
      ]}>
      {children}
    </View>
  );
};

/** ─── CategoryContainer & CategoryTab ───────────────────────────────── */
export const CategoryContainer: React.FC<
  React.ComponentProps<typeof RowContainer>
> = ({style, children, ...rest}) => (
  <RowContainer {...rest} style={[styles.categoryContainer, style]}>
    {children}
  </RowContainer>
);

export const CategoryTab: React.FC<
  React.ComponentProps<typeof RowContainer>
> = ({style, children, ...rest}) => {
  const {theme} = useTheme();
  return (
    <RowContainer
      {...rest}
      style={[styles.categoryTab, {backgroundColor: theme.gray7}, style]}>
      {children}
    </RowContainer>
  );
};

/** ─── Tab ─────────────────────────────────────────────────────────────── */
export const Tab: React.FC<{selected?: boolean} & PressableProps> = ({
  selected,
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <Pressable
      {...rest}
      style={({pressed}) => [
        styles.tab,
        {
          backgroundColor: selected ? theme.primary2 : theme.gray7,
          opacity: pressed ? 0.8 : 1,
        },

        typeof style === 'function' ? style({pressed}) : style,
      ]}>
      {children}
    </Pressable>
  );
};

/** ─── HistoryDetailContainer ─────────────────────────────────────────── */
export const HistoryDetailContainer: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => (
  <View {...rest} style={[styles.historyDetailContainer, style]}>
    {children}
  </View>
);

/** ─── DailyPicContiner & DailyPic ───────────────────────────────────── */
export const DailyPicContiner: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => (
  <View {...rest} style={[styles.dailyPicContainer, style]}>
    {children}
  </View>
);

export const DailyPic: React.FC<ImageProps> = ({style, ...rest}) => {
  const {theme} = useTheme();
  return (
    <Image
      {...rest}
      style={[styles.dailyPic, {backgroundColor: theme.gray7}, style]}
    />
  );
};

/** ─── DailyTextContiner ──────────────────────────────────────────────── */
export const DailyTextContiner: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => (
  <View {...rest} style={[styles.dailyTextContainer, style]}>
    {children}
  </View>
);

/** ─── DailyDiary & DailyTodo ─────────────────────────────────────────── */
export const DailyDiary: React.FC<
  React.ComponentProps<typeof LinearGradient>
> = ({style, ...rest}) => (
  <LinearGradient
    {...rest}
    start={{x: 1.27, y: 4.29}}
    end={{x: -0.19, y: -2.08}}
    style={[styles.dailyDiary, style]}
  />
);

export const DailyTodo: React.FC<
  React.ComponentProps<typeof LinearGradient>
> = ({style, ...rest}) => (
  <LinearGradient
    {...rest}
    start={{x: 0.05, y: 0}}
    end={{x: 1.07, y: 1}}
    style={[styles.dailyTodo, style]}
  />
);

/** ─── DailyTodoList ─────────────────────────────────────────────────── */
export const DailyTodoList: React.FC<
  React.ComponentProps<typeof RowContainer>
> = ({style, ...rest}) => (
  <RowContainer {...rest} style={[styles.dailyTodoList, style]} />
);

/** ─── Stylesheet ─────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  profileContainer: {
    borderWidth: 1,
    padding: 16,
    paddingRight: 36,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userStatsCount: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStatsBox: {
    alignItems: 'center',
    // gap: 3, // RN core doesn't support gap; add margins manually if needed
  },
  divider: {
    height: 56,
    borderWidth: 1,
    marginHorizontal: 0,
  },
  userName: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  historyContainer: {
    flex: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: -16,
  },
  categoryContainer: {
    marginHorizontal: -16,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  categoryTab: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  historyDetailContainer: {
    paddingVertical: 16,
    gap: 32,
  },
  dailyPicContainer: {
    alignItems: 'center',
  },
  dailyPic: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  dailyTextContainer: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dailyDiary: {
    borderRadius: 10,
    padding: 16,
  },
  dailyTodo: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    // gap: 8,
  },
  dailyTodoList: {
    paddingVertical: 4,
  },
});
