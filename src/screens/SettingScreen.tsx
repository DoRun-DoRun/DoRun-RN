import React, {useState} from 'react';
import {HomeContainer, InnerContainer, NotoSansKR} from '../Component';
import {Animated, Easing, Pressable, View} from 'react-native';
import {styled, useTheme} from 'styled-components/native';
import {Slider} from '@miblanchard/react-native-slider';

const SettingScreen = () => {
  const [pushAlarm, setPushAlarm] = useState(true);
  const [marketingAlarm, setMarketingAlarm] = useState(true);
  const [nightAlarm, setNightAlarm] = useState(true);

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
            <SliderComponent>효과음</SliderComponent>
            <SliderComponent1 />
          </ObjectList>
        </View>
      </InnerContainer>
    </HomeContainer>
  );
};

const ObjectList = styled(View)`
  display: flex;
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

const Container = styled(View)`
  /* flex: 1; */
  /* margin-left: 10; */
  /* margin-right: 10; */
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
`;

const SliderComponent = ({children}: {children: React.ReactNode}) => {
  return (
    <Container>
      <NotoSansKR size={16} weight="Medium">
        {children}
      </NotoSansKR>
      <Slider value={0.2} />
    </Container>
  );
};

const SliderComponent1 = () => {
  const theme = useTheme();

  return (
    <Container>
      <Slider
        value={0.2}
        minimumTrackTintColor={theme.primary1}
        maximumTrackTintColor={theme.primary2}
        thumbTintColor={theme.primary1}
        // trackStyle={{width: '200px'}}
      />
      {/* <Text>Value: {this.state.value}</Text> */}
    </Container>
  );
};

export default SettingScreen;
