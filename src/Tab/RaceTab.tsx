import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  Image,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import {HomeContainer, NotoSansKR, ScrollContainer, useApi} from '../Component';
import {useNavigation} from '@react-navigation/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useQuery} from 'react-query';
import {decreaseIndex, increaseIndex} from '../../store/slice/IndexSlice';
import {useModal} from '../Modal/ModalProvider';

// interface ChallengeUserListType {
//   CHALLENGE_MST_NO: number;
//   CHALLENGE_MST_NM: string;
//   challenge_user: [ChallengeUserType];
// }

interface ChallengeUserType {
  CHALLENGE_USER_NO: number;
  PROGRESS: number;
  CHARACTER_NO: number;
  PET_NO: number;
  DIARIES: [
    {
      DAILY_COMPLETE_NO: number;
      IMAGE_FILE_NM: string;
      INSERT_DT: string;
      COMMENTS: string;
    },
  ];
}

const RaceTab = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const CallApi = useApi();
  const dispatch = useDispatch();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const {index} = useSelector((state: RootState) => state.index);

  const navigation = useNavigation();

  const ChallengeUserList = async () => {
    try {
      const response = await CallApi({
        endpoint: 'challenge/user/list',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const {data: challengeListData, isLoading} = useQuery(
    'ChallengeUserList',
    ChallengeUserList,
  );

  useEffect(() => {
    if (
      challengeListData &&
      challengeListData.length > 0 &&
      index < challengeListData.length
    ) {
      navigation.setOptions({
        title: challengeListData[index]?.CHALLENGE_MST_NM,
        headerRight:
          index! < challengeListData?.length - 1
            ? () => (
                <TouchableOpacity
                  style={{marginRight: 16}}
                  onPress={() => {
                    dispatch(increaseIndex());
                  }}>
                  <OcticonIcons name="arrow-right" size={24} />
                </TouchableOpacity>
              )
            : undefined,
        headerLeft:
          index! > 0
            ? () => (
                <TouchableOpacity
                  style={{marginLeft: 16}}
                  onPress={() => {
                    dispatch(decreaseIndex());
                  }}>
                  <OcticonIcons name="arrow-left" size={24} />
                </TouchableOpacity>
              )
            : undefined,
      });
    }
  }, [challengeListData, dispatch, index, navigation]);

  if (isLoading) {
    return <NotoSansKR size={16}>로딩중</NotoSansKR>;
  }
  return (
    <HomeContainer color="background">
      {challengeListData && challengeListData?.length !== 0 ? (
        <ScrollContainer
          scrollEnabled={scrollEnabled}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
          {challengeListData[index!].challenge_user.map(
            (data: ChallengeUserType, key: number) => {
              return (
                <BGComponent
                  key={data.CHALLENGE_USER_NO}
                  progress={data.PROGRESS}
                  BGN={key}
                  setScrollEnabled={setScrollEnabled}
                />
              );
            },
          )}
        </ScrollContainer>
      ) : (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
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
      source={require('../../assets/images/BGABody0.png')}
      aspect-ratio={1}
      resizeMode="stretch"
      height={432}>
      <Image
        source={require('../../assets/images/race_image.png')}
        style={{
          width: '80%',
          resizeMode: 'contain',
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }}
      />
    </BGImage>
  );
};

interface BGComponentType {
  BGN: number;
  setScrollEnabled: any;
  progress: number;
}

const BGComponent = ({BGN, setScrollEnabled, progress}: BGComponentType) => {
  const {showModal} = useModal();
  const BGA = [
    {url: require('../../assets/images/BGAHeader1.png'), height: 176},
    {url: require('../../assets/images/BGABody1.png'), height: 137},
    {url: require('../../assets/images/BGABody2.png'), height: 137},
    {url: require('../../assets/images/BGABody3.png'), height: 137},
    {url: require('../../assets/images/BGABody3.png'), height: 137},
    {url: require('../../assets/images/BGABody3.png'), height: 137},
  ];
  const Dudus = [
    require('../../assets/images/dudu00.png'),
    require('../../assets/images/nuts00.png'),
    require('../../assets/images/pachi00.png'),
    require('../../assets/images/peats00.png'),
  ];

  const handleTouch = () => {
    showModal(<View />);
    // 추가 로직 구현...
  };

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        handleTouch();
        setScrollEnabled(false); // 드래그 시작 시 스크롤 비활성화
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        Animated.spring(
          pan,
          {toValue: {x: 0, y: 0}, useNativeDriver: false}, // 원래 위치로 돌아가게 설정
        ).start(() => setScrollEnabled(true)); // 드래그 종료 시 스크롤 활성화
      },
    }),
  ).current;

  let yPosition = 0;
  for (let i = BGN; i > 0; i--) {
    yPosition += BGA[i].height;
  }

  // const duduInitialX = `${progress * (80 / 100)}%`;
  const duduInitialX = progress;
  const duduInitialY = yPosition + 10;

  return (
    <>
      <BGImage
        source={BGA[BGN].url}
        aspect-ratio={1}
        resizeMode="stretch"
        height={BGA[BGN].height}
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
        <Image source={Dudus[BGN]} />
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
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 1px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  elevation: 4;
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
