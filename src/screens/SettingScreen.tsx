import React from 'react';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  useApi,
} from '../Component';
import {View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Slider} from '@miblanchard/react-native-slider';
import {useQuery} from 'react-query';
import {RootState} from '../../store/RootReducer';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setVolume} from '../../store/slice/SettingSlice';

const SettingScreen = () => {
  // const [pushAlarm, setPushAlarm] = useState(true);
  // const [marketingAlarm, setMarketingAlarm] = useState(true);
  // const [nightAlarm, setNightAlarm] = useState(true);
  // const [soundEffect, setSoundEffect] = useState(100);
  const {volume} = useSelector((state: RootState) => state.setting);

  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    return <LoadingIndicatior />;
  }
  // const OnPushAlarmToggle = () => {
  //   setPushAlarm(!pushAlarm);
  // };

  // const OnMarketingAlarmToggle = () => {
  //   setMarketingAlarm(!marketingAlarm);
  // };

  // const OnNightAlarmToggle = () => {
  //   setNightAlarm(!nightAlarm);
  // };

  return (
    <HomeContainer>
      <InnerContainer>
        <View style={{gap: 36}}>
          <NotoSansKR size={20}>환경 설정</NotoSansKR>

          {/* <View style={{gap: 8}}>
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
          </View> */}

          <View style={{gap: 8}}>
            {/* <SliderComponent
              sliderValue={soundEffect}
              setSliderValue={setSoundEffect}>
              효과음
            </SliderComponent> */}
            <SliderComponent
              sliderValue={volume}
              setSliderValue={e => dispatch(setVolume({volume: e}))}>
              배경음악
            </SliderComponent>
          </View>

          <View style={{gap: 8}}>
            <RowContainer seperate>
              <NotoSansKR size={16} weight="Medium">
                소셜 로그인 정보
              </NotoSansKR>
              <NotoSansKR size={16} weight="Medium">
                {data.SIGN_TYPE}
              </NotoSansKR>
            </RowContainer>
            <RowContainer seperate>
              <NotoSansKR size={16} weight="Medium">
                UID
              </NotoSansKR>
              <NotoSansKR size={16} weight="Medium">
                {data.UID}
              </NotoSansKR>
            </RowContainer>
          </View>
        </View>
      </InnerContainer>
      <View style={{gap: 8, padding: 16}}>
        {/* <ButtonComponent>고객 센터</ButtonComponent> */}
        <ButtonComponent
          // type="secondary"
          onPress={() => {
            navigation.navigate('LoginTab' as never);
          }}>
          로그아웃
        </ButtonComponent>
      </View>
    </HomeContainer>
  );
};

// const ToggleWheel = styled(Animated.View)`
//   width: 20px;
//   height: 20px;
//   background-color: ${props => props.theme.white};
//   border-radius: 12.5px;
// `;

// const Wrap = styled(View)`
//   flex-direction: row;
//   align-items: center;
// `;

// const ToggleFrame = styled(View)`
//   width: 48px;
//   height: 23px;
//   border-radius: 30px;
//   justify-content: center;
// `;

// interface ToggleComponentType {
//   children: React.ReactNode;
//   isOn: Boolean;
//   onToggle: () => void;
// }

// const ToggleComponent = ({children, isOn, onToggle}: ToggleComponentType) => {
//   const theme = useTheme();

//   const aniValue = new Animated.Value(isOn ? 1 : 0);
//   const color = isOn ? theme.primary1 : theme.gray6;

//   const moveSwitchToggle = aniValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 25],
//   });

//   Animated.timing(aniValue, {
//     toValue: isOn ? 1 : 0,
//     duration: 200,
//     easing: Easing.linear,
//     useNativeDriver: true,
//   }).start();

//   return (
//     <RowContainer seperate>
//       <NotoSansKR size={16} weight="Medium">
//         {children}
//       </NotoSansKR>
//       <Wrap>
//         <Pressable onPress={onToggle} style={{marginVertical: 2.5}}>
//           <ToggleFrame style={{backgroundColor: color}}>
//             <ToggleWheel
//               style={[{transform: [{translateX: moveSwitchToggle}]}]}
//             />
//           </ToggleFrame>
//         </Pressable>
//       </Wrap>
//     </RowContainer>
//   );
// };

interface SliderComponentType {
  children: React.ReactNode;
  sliderValue: number;
  setSliderValue: (value: number) => void;
}

export const SliderComponent = ({
  children,
  sliderValue,
  setSliderValue,
}: SliderComponentType) => {
  const theme = useTheme();

  return (
    <RowContainer>
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
    </RowContainer>
  );
};

export default SettingScreen;
