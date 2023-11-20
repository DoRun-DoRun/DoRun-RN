import React, {useState} from 'react';
import {HomeContainer, InnerContainer, NotoSansKR} from '../Component';
import {Animated, Easing, Pressable, View} from 'react-native';
import {styled, useTheme} from 'styled-components/native';

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
            <ToggleComponent isOn={nightAlarm} onToggle={OnNightAlarmToggle}>
              23시 ~ 09시 푸시 알람
            </ToggleComponent>
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

const ToggleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
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
    <ToggleContainer>
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
    </ToggleContainer>
  );
};

export default SettingScreen;
