import React, {useState} from 'react';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  useApi,
} from '../Component';
import {Animated, Easing, Pressable, View} from 'react-native';
import {styled, useTheme} from 'styled-components/native';
import {Slider} from '@miblanchard/react-native-slider';
import {useQuery} from 'react-query';
import {RootState} from '../../store/RootReducer';
import {useSelector} from 'react-redux';

const SettingScreen = () => {
  const [pushAlarm, setPushAlarm] = useState(true);
  const [marketingAlarm, setMarketingAlarm] = useState(true);
  const [nightAlarm, setNightAlarm] = useState(true);
  const [soundEffect, setSoundEffect] = useState(100);
  const [backgroundMusic, setBackgroundMusic] = useState(100);

  const CallApi = useApi();
  const {accessToken} = useSelector((state: RootState) => state.user);

  const UserDataSetting = async () => {
    try {
      const response = CallApi({
        endpoint: 'user/setting',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const {data, isLoading} = useQuery('UserDataSetting', UserDataSetting);
  if (isLoading) {
    return <NotoSansKR size={16}>로딩중</NotoSansKR>;
  }
  const OnPushAlarmToggle = () => {
    setPushAlarm(!pushAlarm);
  };

  const OnMarketingAlarmToggle = () => {
    setMarketingAlarm(!marketingAlarm);
  };

  const OnNightAlarmToggle = () => {
    setNightAlarm(!nightAlarm);
  };

  return (
    <HomeContainer>
      <InnerContainer>
        <View style={{gap: 36}}>
          <NotoSansKR size={20}>환경 설정</NotoSansKR>

          <ObjectList>
            <ToggleComponent isOn={pushAlarm} onToggle={OnPushAlarmToggle}>
              푸시 알람
            </ToggleComponent>
            <ToggleComponent
              isOn={marketingAlarm}
              onToggle={OnMarketingAlarmToggle}>
              마케팅 푸시 알람
            </ToggleComponent>
            <ToggleComponent isOn={nightAlarm} onToggle={OnNightAlarmToggle}>
              23시 ~ 09시 푸시 알람
            </ToggleComponent>
          </ObjectList>

          <ObjectList>
            <SliderComponent
              sliderValue={soundEffect}
              setSliderValue={setSoundEffect}>
              효과음
            </SliderComponent>
            <SliderComponent
              sliderValue={backgroundMusic}
              setSliderValue={setBackgroundMusic}>
              배경음악
            </SliderComponent>
          </ObjectList>
          <ObjectList>
            <ObjectContainer>
              <NotoSansKR size={16} weight="Medium">
                소셜 로그인 정보
              </NotoSansKR>
              <NotoSansKR size={16} weight="Medium">
                {data.SIGN_TYPE}
              </NotoSansKR>
            </ObjectContainer>
            <ObjectContainer>
              <NotoSansKR size={16} weight="Medium">
                UID
              </NotoSansKR>
              <NotoSansKR size={16} weight="Medium">
                {data.UID}
              </NotoSansKR>
            </ObjectContainer>
          </ObjectList>
        </View>
      </InnerContainer>
      <View style={{gap: 8, padding: 16}}>
        <ButtonComponent>고객 센터</ButtonComponent>
        <ButtonComponent type="secondary">로그아웃</ButtonComponent>
      </View>
    </HomeContainer>
  );
};

const ObjectList = styled(View)`
  gap: 8px;
`;

const ObjectContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ToggleWheel = styled(Animated.View)`
  width: 25px;
  height: 25px;
  background-color: ${props => props.theme.white};
  border-radius: 12.5px;
`;

const Wrap = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const ToggleFrame = styled(View)`
  width: 50px;
  height: 30px;
  padding-left: 2px;
  border-radius: 15px;
  justify-content: center;
`;

interface ToggleComponentType {
  children: React.ReactNode;
  isOn: Boolean;
  onToggle: () => void;
}

const ToggleComponent = ({children, isOn, onToggle}: ToggleComponentType) => {
  const theme = useTheme();

  const aniValue = new Animated.Value(isOn ? 1 : 0);
  const color = isOn ? theme.primary1 : theme.gray6;

  const moveSwitchToggle = aniValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  Animated.timing(aniValue, {
    toValue: isOn ? 1 : 0,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start();

  return (
    <ObjectContainer>
      <NotoSansKR size={16} weight="Medium">
        {children}
      </NotoSansKR>
      <Wrap>
        <Pressable onPress={onToggle}>
          <ToggleFrame style={{backgroundColor: color}}>
            <ToggleWheel
              style={[{transform: [{translateX: moveSwitchToggle}]}]}
            />
          </ToggleFrame>
        </Pressable>
      </Wrap>
    </ObjectContainer>
  );
};

interface SliderComponentType {
  children: React.ReactNode;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
}

const SliderComponent = ({
  children,
  sliderValue,
  setSliderValue,
}: SliderComponentType) => {
  const theme = useTheme();

  return (
    <ObjectContainer>
      <View style={{width: 240}}>
        <NotoSansKR size={16} weight="Medium">
          {children}
        </NotoSansKR>
      </View>
      <View style={{flex: 1}}>
        <Slider
          value={sliderValue}
          minimumTrackTintColor={theme.primary1}
          maximumTrackTintColor={theme.primary2}
          thumbTintColor={theme.primary1}
          onValueChange={values => setSliderValue(values[0])}
        />
      </View>
    </ObjectContainer>
  );
};

export default SettingScreen;
