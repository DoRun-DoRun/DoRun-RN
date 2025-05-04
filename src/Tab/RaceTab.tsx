import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageBackgroundProps,
  ImageSourcePropType,
  PanResponder,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {
  BackgroundImage,
  Dudus,
  UserStatusType,
  // adBannerRace,
  avatarImage,
  defaultData,
  sleepLottie,
  struggleLottie,
} from '../../store/data';
import {RootState} from '../../store/RootReducer';
import {NavigationType} from '../App';
import {
  HomeContainer,
  LoadingIndicator,
  NotoSansKR,
  ScrollContainer,
} from '../Component';
import {useApi} from '../Hook/hook';
import {CharacterModal} from '../Modal/CharacterModal';
import {useModal} from '../Modal/ModalProvider';
import {useTheme} from '../theme/ThemeProvider';

// interface ChallengeUserListType {
//   CHALLENGE_MST_NO: number;
//   CHALLENGE_MST_NM: string;
//   DIARIES: DiaryType[];
//   total_page: number;
//   challenge_user: ChallengeUserType[];
// }

interface DiaryType {
  DAILY_COMPLETE_NO: number;
}

export interface ChallengeUserType {
  CHALLENGE_USER_NO: number;
  PROGRESS: number;
  CHARACTER_NO: number;
  PET_NO: number;
  DIARIES: DiaryType[];
  STATUS: UserStatusType;
}
const DiaryComponent = ({
  diary,
  height,
}: {
  diary: DiaryType;
  height: number;
}) => {
  const navigation = useNavigation<NavigationType>();

  const windowWidth = Dimensions.get('window').width;
  const [position, setPosition] = useState({left: 0});

  useEffect(() => {
    const randomLeft = Math.random() * windowWidth;
    setPosition({left: randomLeft});
  }, [windowWidth]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DailyNoteScreen', {
          daily_no: diary.DAILY_COMPLETE_NO,
        })
      }
      style={{
        position: 'absolute',
        left: position.left,
        bottom: height,
        zIndex: 1,
      }}>
      <Image source={require('../../assets/image/memo.png')} />
    </TouchableOpacity>
  );
};

const RaceTab = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const CallApi = useApi();
  const dispatch = useDispatch();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const [index, setIndex] = useState(1);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const ChallengeUserList = async () => {
    try {
      const response = await CallApi({
        endpoint: `challenge/user/list?page=${index}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const {
    data: challengeListData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(['ChallengeUserList', index], ChallengeUserList);

  useEffect(() => {
    if (challengeListData && challengeListData.total_page !== 0) {
      navigation.setOptions({
        title: challengeListData.CHALLENGE_MST_NM,
        headerRight:
          index < challengeListData?.total_page
            ? () => (
                <OcticonIcons
                  name="arrow-right"
                  size={24}
                  style={{paddingRight: 16, paddingLeft: 24}}
                  onPress={() => {
                    setIndex(prev => prev + 1);
                  }}
                />
              )
            : null,
        headerLeft:
          index > 1
            ? () => (
                <OcticonIcons
                  name="arrow-left"
                  size={24}
                  style={{paddingRight: 24, paddingLeft: 16}}
                  onPress={() => {
                    setIndex(prev => prev - 1);
                  }}
                />
              )
            : null,
      });
    } else {
      navigation.setOptions({
        title: '두런두런',
        headerRight: null,
        headerLeft: null,
      });
    }
  }, [challengeListData, dispatch, index, navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, [refetch]);
  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <HomeContainer color="background">
      {/* <BannerAd
        unitId={adBannerRace!}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      /> */}

      {challengeListData && challengeListData?.total_page !== 0 ? (
        <ScrollContainer
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isFetching}
              onRefresh={onRefresh}
            />
          }
          scrollEnabled={scrollEnabled}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
          {challengeListData.challenge_user.map(
            (data: ChallengeUserType, key: number) => {
              return (
                <BGComponent
                  key={data.CHALLENGE_USER_NO}
                  data={data}
                  CHALLENGE_MST_NO={challengeListData.CHALLENGE_MST_NO}
                  BGN={key}
                  setScrollEnabled={setScrollEnabled}
                />
              );
            },
          )}
        </ScrollContainer>
      ) : (
        <ScrollContainer
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isFetching}
              onRefresh={onRefresh}
            />
          }>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <ChallengeCreateButton
              onPress={() => {
                navigation.navigate('CreateChallengeScreen' as never);
              }}>
              <NotoSansKR size={16}>진행중인 챌린지가 없어요!</NotoSansKR>
            </ChallengeCreateButton>
            <DefaultImage />
          </View>
        </ScrollContainer>
      )}

      <Navigation />
    </HomeContainer>
  );
};

const DefaultImage = () => {
  return (
    <BGImage
      source={require('../../assets/image/background/default_image.png')}
      aspect-ratio={1}
      resizeMode="cover"
      height={420}>
      <Image
        source={require('../../assets/image/group/race_image.png')}
        style={{
          width: '80%',
          resizeMode: 'contain',
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
        }}
      />
    </BGImage>
  );
};

interface BGComponentType {
  BGN: number;
  setScrollEnabled: any;
  data: ChallengeUserType;
  CHALLENGE_MST_NO: number;
}

const BGComponent = ({
  BGN,
  setScrollEnabled,
  data,
  CHALLENGE_MST_NO,
}: BGComponentType) => {
  const [isDragging, setIsDragging] = useState(false);
  const {showModal} = useModal();

  const handleTouch = () => {
    showModal(
      <CharacterModal data={data} CHALLENGE_MST_NO={CHALLENGE_MST_NO} />,
      () => {},
      false,
    );
  };

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        setScrollEnabled(false); // 드래그 시작 시 스크롤 비활성화
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (event, gestureState) => {
        // 드래그 종료 시 스크롤 활성화
        setIsDragging(false);
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
        }).start(() => setScrollEnabled(true));

        // 드래그 거리가 짧으면 handleTouch 호출
        if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          handleTouch();
        }
      },
    }),
  ).current;

  let yPosition = 0;
  for (let i = BGN; i > 0; i--) {
    yPosition += BackgroundImage[i].height;
  }

  const windowWidth = Dimensions.get('window').width;

  // const duduInitialX = `${data.PROGRESS * (60 / 100)}%`;
  const duduInitialX =
    data.PROGRESS >= 100
      ? windowWidth - 60
      : windowWidth * (data.PROGRESS / 100);
  const duduInitialY = yPosition + 10;

  console.log(data);

  return (
    <>
      {data.DIARIES.map((diary: DiaryType) => (
        <DiaryComponent
          key={diary.DAILY_COMPLETE_NO}
          diary={diary}
          height={duduInitialY}
        />
      ))}
      <BGImage
        source={BackgroundImage[BGN].url}
        aspect-ratio={1}
        resizeMode="stretch"
        height={BackgroundImage[BGN].height}
      />
      <Animated.View
        style={{
          position: 'absolute',
          left: duduInitialX,
          bottom: duduInitialY,
          transform: [{translateX: pan.x}, {translateY: pan.y}],
          zIndex: 1,
        }}
        {...panResponder.panHandlers}>
        {isDragging ? (
          <View style={{width: 85, height: 105}}>
            <LottieView
              source={struggleLottie[data.CHARACTER_NO - 1]}
              autoPlay
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            {!!data.PET_NO && (
              <FastImage
                source={avatarImage[data.PET_NO - 1]}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 30,
                  left: -20,
                  bottom: 5,
                }}
              />
            )}
          </View>
        ) : data.PROGRESS >= 100 ? (
          <>
            <FastImage
              source={defaultData.Avatar[data.CHARACTER_NO - 1].URL}
              style={{width: 60, height: 70}}
            />
            {!!data.PET_NO && (
              <FastImage
                source={avatarImage[data.PET_NO - 1]}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 30,
                  left: -20,
                  bottom: 5,
                }}
              />
            )}
          </>
        ) : (
          <>
            {data.STATUS === UserStatusType.SLEEPING ? (
              <LottieView
                source={sleepLottie[data.CHARACTER_NO - 1]}
                autoPlay
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 60,
                }}
              />
            ) : (
              <FastImage
                source={Dudus[data.CHARACTER_NO - 1]}
                style={{width: 60, height: 70}}
              />
            )}

            {!!data.PET_NO && (
              <FastImage
                source={avatarImage[data.PET_NO - 1]}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 30,
                  left: -20,
                  bottom: 5,
                }}
              />
            )}
          </>
        )}
      </Animated.View>
    </>
  );
};

const Navigation = () => {
  const navigation = useNavigation();

  return (
    <NavigationContainer>
      <Pressable
        onPress={() => navigation.navigate('FriendScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="people" size={24} color="#B5B5B5" />
        </NavigationButton>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('SettingScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="gear" size={24} color="#B5B5B5" />
        </NavigationButton>
      </Pressable>
    </NavigationContainer>
  );
};
export default RaceTab;

/** ─── ChallengeCreateButton ───────────────────────────────────────────── */
export const ChallengeCreateButton: React.FC<TouchableOpacityProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      {...rest}
      style={[
        styles.createButton,
        {backgroundColor: theme.white},
        ...(Platform.select({
          ios: [styles.createButtonShadow],
          android: [styles.createButtonElevation],
        }) || []),
        style,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

/** ─── BGImage ─────────────────────────────────────────────────────────── */
export const BGImage: React.FC<
  {height?: number; source: ImageSourcePropType} & Omit<
    ImageBackgroundProps,
    'source'
  >
> = ({height = 0, style, ...rest}) => (
  <ImageBackground
    {...rest}
    source={rest.source}
    style={[{width: '100%', height}, style]}
  />
);

/** ─── NavigationButton ───────────────────────────────────────────────── */
export const NavigationButton: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.navButton,
        {backgroundColor: theme.white},
        ...(Platform.select({
          ios: [styles.createButtonShadow],
          android: [styles.createButtonElevation],
        }) || []),
        style,
      ]}>
      {children}
    </View>
  );
};

/** ─── NavigationContainer ────────────────────────────────────────────── */
export const NavigationContainer: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => (
  <View {...rest} style={[styles.navContainer, style]}>
    {children}
  </View>
);

/** ─── StyleSheet 定義 ────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  createButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 205,
    height: 56,
    top: '50%',
    left: '50%',
    zIndex: 5,
    transform: [{translateX: -102.5}, {translateY: -56}],
  },
  createButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  createButtonElevation: {
    elevation: 3,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonShadow: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  navButtonElevation: {
    elevation: 3,
  },
  navContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    flexDirection: 'column',
    gap: 16,
    // gap not supported in core RN; add spacing via child styles or.Wrap children with margin.
  },
});
