import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  Image,
  Pressable,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  HomeContainer,
  LoadingIndicatior,
  NotoSansKR,
  ScrollContainer,
  useApi,
} from '../Component';
import {useNavigation} from '@react-navigation/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useQuery} from 'react-query';
import {useModal} from '../Modal/ModalProvider';
import {CharacterModal} from '../Modal/CharacterModal';
import LottieView from 'lottie-react-native';
import {
  BackgroundImage,
  Dudus,
  avatarImage,
  defaultData,
  struggleLottie,
} from '../../store/data';
import FastImage from 'react-native-fast-image';
import {NavigationType} from '../App';

// interface ChallengeUserListType {
//   CHALLENGE_MST_NO: number;
//   CHALLENGE_MST_NM: string;
//   challenge_user: [ChallengeUserType];
// }

const ChallengeCreateButton = styled.TouchableOpacity`
  position: absolute;
  background-color: ${props => props.theme.white};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 205px;
  height: 56px;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translateX(-102.5px) translateY(-56px);
  ${Platform.OS === 'ios'
    ? `
    shadow-color: #000;
    shadow-offset: 2px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 2px;`
    : 'elevation: 3;'}
`;

export interface ChallengeUserType {
  CHALLENGE_USER_NO: number;
  PROGRESS: number;
  CHARACTER_NO: number;
  PET_NO: number;
  DIARIES: [
    {
      DAILY_COMPLETE_NO: number;
    },
  ];
}
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  useEffect(() => {
    if (challengeListData && challengeListData.total_page !== 0) {
      navigation.setOptions({
        title: challengeListData.CHALLENGE_MST_NM,
        headerRight:
          index < challengeListData?.total_page
            ? () => (
                <TouchableOpacity
                  style={{marginRight: 16}}
                  onPress={() => {
                    setIndex(prev => prev + 1);
                  }}>
                  <OcticonIcons name="arrow-right" size={24} />
                </TouchableOpacity>
              )
            : undefined,
        headerLeft:
          index > 1
            ? () => (
                <TouchableOpacity
                  style={{marginLeft: 16}}
                  onPress={() => {
                    setIndex(prev => prev - 1);
                  }}>
                  <OcticonIcons name="arrow-left" size={24} />
                </TouchableOpacity>
              )
            : undefined,
      });
    }
  }, [challengeListData, dispatch, index, navigation]);

  if (isLoading) {
    return <LoadingIndicatior />;
  }
  return (
    <HomeContainer color="background">
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
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ChallengeCreateButton
            onPress={() => {
              navigation.navigate('CreateChallengeScreen' as never);
            }}>
            <NotoSansKR size={16}>챌린지를 생성해주세요!</NotoSansKR>
          </ChallengeCreateButton>
          <DefaultImage />
        </View>
      )}

      <Navigation />
    </HomeContainer>
  );
};

const DefaultImage = () => {
  return (
    <BGImage
      source={require('../../assets/image/background/BG_header.png')}
      aspect-ratio={1}
      resizeMode="stretch"
      height={432}>
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
  const navigation = useNavigation<NavigationType>();

  const handleTouch = () => {
    showModal(
      <CharacterModal data={data} CHALLENGE_MST_NO={CHALLENGE_MST_NO} />,
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
  const windowHeight = Dimensions.get('window').height;

  // const duduInitialX = `${data.PROGRESS * (60 / 100)}%`;
  const duduInitialX =
    data.PROGRESS >= 100
      ? windowWidth - 60
      : windowWidth * (data.PROGRESS / 100);
  const duduInitialY = yPosition + 10;

  // 랜덤 위치를 저장할 상태
  const [position, setPosition] = useState({left: 0, top: 0});

  useEffect(() => {
    // 랜덤 위치 설정
    const randomLeft = Math.random() * windowWidth;
    const randomTop = Math.random() * windowHeight;

    setPosition({left: randomLeft, top: randomTop});
  }, [windowHeight, windowWidth]); // 빈 의존성 배열을 사용하여 마운트 시 한 번만 실행

  return (
    <>
      {data.DIARIES.map((diary, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate('DailyNoteScreen', {
                daily_no: diary.DAILY_COMPLETE_NO,
              });
            }}
            style={{
              position: 'absolute',
              left: position.left,
              top: position.top,
              zIndex: 1,
            }}>
            <Image source={require('../../assets/image/memo.png')} />
          </TouchableOpacity>
        );
      })}
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
          <View style={{width: 60, height: 70}}>
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
            <FastImage
              source={Dudus[data.CHARACTER_NO - 1]}
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
        )}
      </Animated.View>
    </>
  );
};

const BGImage = styled.ImageBackground<{height: number}>`
  height: ${props => props.height}px;
  width: 100%;
`;

const NavigationButton = styled(View)`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.white};
  ${Platform.OS === 'ios'
    ? `shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 1px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 1.5px;`
    : 'elevation: 3;'}

  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const NavigationContainer = styled(View)`
  position: absolute;
  top: 20px;
  right: 16px;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
`;

const Navigation = () => {
  const navigation = useNavigation();

  return (
    <NavigationContainer>
      <Pressable
        onPress={() => navigation.navigate('FriendScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="people" size={24} />
        </NavigationButton>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('SettingScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="gear" size={24} />
        </NavigationButton>
      </Pressable>
    </NavigationContainer>
  );
};
export default RaceTab;
