import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {
  HomeContainer,
  NotoSansKR,
  RowContainer,
  RowScrollContainer,
  TossFace,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useQuery} from 'react-query';

const Profile = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fbef84;
  justify-content: center;
  align-items: center;
`;

const ChallengeInfo = ({
  mainText,
  subText,
}: {
  mainText: String;
  subText: String;
}) => {
  const TextContainer = styled.View`
    width: 122px;
    height: 154px;

    border-radius: 10px;
    padding: 12px 8px;
    background-color: white;
    /* shadow-color: #000;
    shadow-offset: 2px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    elevation: 5; */
    margin: 8px 0;
    gap: 40px;
  `;

  return (
    <TextContainer>
      <Profile>
        <TossFace size={22}>🥰</TossFace>
      </Profile>
      <View style={{gap: 8}}>
        <NotoSansKR size={14}>{mainText}</NotoSansKR>
        <NotoSansKR size={10} color="gray5">
          {subText}
        </NotoSansKR>
      </View>
    </TextContainer>
  );
};

const ChallengeSubInfo = ({
  mainText,
  subText,
}: {
  mainText: String;
  subText: String;
}) => {
  const TextSubContainer = styled.View`
    width: 108px;
    height: 124px;

    border-radius: 10px;
    padding: 12px 8px;
    background-color: white;
    gap: 20px;
    margin: 8px 0;
  `;

  return (
    <TextSubContainer>
      <Profile>
        <TossFace size={20}>🥰</TossFace>
      </Profile>
      <View style={{gap: 4}}>
        <NotoSansKR size={14}>{mainText}</NotoSansKR>
        <NotoSansKR size={10} color="gray5">
          {subText}
        </NotoSansKR>
      </View>
    </TextSubContainer>
  );
};

interface GoalBoxProps {
  isTeam?: boolean;
  isComplete?: boolean;
  title: string;
  count?: string;
}

const GoalBox: React.FC<GoalBoxProps> = ({
  isTeam,
  isComplete,
  title,
  count,
}) => {
  const theme = useTheme();

  const backgroundColor = isComplete
    ? theme.gray7
    : isTeam
    ? theme.primary1
    : theme.white;

  const textColor = isTeam ? 'white' : 'black';

  const iconColor = isComplete
    ? theme.gray4
    : isTeam
    ? theme.white
    : theme.primary1;

  const borderColor = !isComplete ? theme.primary1 : theme.gray7;

  const TodoTitle = styled(NotoSansKR)<{isComplete?: Boolean}>`
    text-decoration: line-through;
    color: ${props => props.theme.gray4};
    background-color: ${props => props.theme.gray7};
  `;

  const GoalContainer = styled.TouchableOpacity<{bc: string; border: string}>`
    background-color: ${props => props.bc};
    border-radius: 10px;
    border-color: ${props => props.border};
    border-width: 2px;
    padding: 12px;
  `;

  return (
    <GoalContainer bc={backgroundColor} border={borderColor}>
      <RowContainer seperate>
        <RowContainer gap={8}>
          <OcticonIcons name="check-circle-fill" size={24} color={iconColor} />
          {isComplete ? (
            <TodoTitle size={16}>{title}</TodoTitle>
          ) : (
            <NotoSansKR
              size={16}
              color={textColor}
              weight={isTeam ? 'Bold' : 'Medium'}>
              {title}
            </NotoSansKR>
          )}
        </RowContainer>
        {!isTeam ? (
          <OcticonIcons name="kebab-horizontal" size={24} color={theme.gray5} />
        ) : (
          <NotoSansKR size={16} color={textColor}>
            {count}
          </NotoSansKR>
        )}
      </RowContainer>
    </GoalContainer>
  );
};

const PlusContainers = ({title}: {title: String}) => {
  const theme = useTheme();

  return (
    <RowContainer gap={4} style={{justifyContent: 'flex-end'}}>
      <OcticonIcons name="plus-circle" size={16} color={theme.primary1} />
      <NotoSansKR size={13} color="primary1">
        {title}
      </NotoSansKR>
    </RowContainer>
  );
};

const ListItem = ({
  title,
  body,
  time,
}: {
  title: String;
  body: String;
  time: String;
}) => {
  const SomeTargetContainer = styled(RowContainer)`
    border-bottom-color: white;
    border-bottom-width: 1px;
    padding: 6px 0;
  `;

  return (
    <SomeTargetContainer seperate>
      <RowContainer gap={32}>
        <NotoSansKR size={14} weight="Regular" color="white">
          {title}
        </NotoSansKR>
        <NotoSansKR size={14} weight="Regular" color="white">
          {body}
        </NotoSansKR>
      </RowContainer>

      <RowContainer gap={8}>
        <NotoSansKR size={14} weight="Regular" color="yellow">
          {time}
        </NotoSansKR>
        <MaterialIcons name="queue" size={28} color={'white'} />
      </RowContainer>
    </SomeTargetContainer>
  );
};

const TopContainer = styled.View`
  gap: 8px;
  background-color: ${props => props.theme.primary2};
  padding: 16px;
`;

const CenterContainer = styled.View`
  padding: 0 16px;
  gap: 16px;
`;

const FootContainer = styled.View`
  gap: 16px;
  background-color: #2c2c2c;
  flex: 1;
  padding: 16px;
  text-align: left;
`;

const ChallengeTab = () => {
  const CallApi = useApi();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  const getChallenge = async () => {
    try {
      const response = await CallApi({
        endpoint: 'challenge/list',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const {data, isLoading} = useQuery('getChallenge', getChallenge);

  if (isLoading) {
    return <NotoSansKR size={15}>로딩중</NotoSansKR>;
  }

  if (data?.pending_challenges.length === 0) {
    return (
      <HomeContainer>
        <TopContainer style={{flex: 1}}>
          <NotoSansKR size={16}>진행중 챌린지</NotoSansKR>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              gap: 24,
            }}>
            <Image
              style={{height: 136}}
              source={require('../../assets/images/nuts05.png')}
              resizeMode="contain"
            />
            <NotoSansKR size={16} color="gray5">
              진행중인 챌린지가 없어요!
            </NotoSansKR>
          </View>

          <NotoSansKR size={16}>초대된 챌린지</NotoSansKR>
          {data.progress_challenges.length === 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
              }}>
              <NotoSansKR size={16} color="gray5">
                초대된 챌린지가 없어요!
              </NotoSansKR>
            </View>
          ) : (
            <View />
          )}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateChallengeScreen' as never)
            }>
            <PlusContainers title="챌린지 추가하기" />
          </TouchableOpacity>
        </TopContainer>
      </HomeContainer>
    );
  }

  return (
    <ScrollView>
      <HomeContainer style={{gap: 32}}>
        <TopContainer>
          <NotoSansKR size={16}>진행중 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
          </RowScrollContainer>

          <NotoSansKR size={16}>초대된 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
          </RowScrollContainer>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateChallengeScreen' as never)
            }>
            <PlusContainers title="챌린지 추가하기" />
          </TouchableOpacity>
        </TopContainer>
        <CenterContainer>
          <NotoSansKR size={18}>팀 주간 목표</NotoSansKR>
          <GoalBox isTeam title="개인이 맡은 UI 완료하기" count="1/4" />
        </CenterContainer>
        <CenterContainer>
          <NotoSansKR size={18}>개인별 목표</NotoSansKR>
          <View style={{gap: 8}}>
            <GoalBox title="한줄이라도 코드 작성하기" />
            <GoalBox title="1시간씩 자리에 앉아 있기" />
            <GoalBox title="밥 잘 챙겨먹기" />
            <GoalBox title="팀 회의 참여하기" isComplete />
          </View>
          <TouchableOpacity>
            <PlusContainers title="목표 추가하기" />
          </TouchableOpacity>
        </CenterContainer>
        <FootContainer>
          <RowContainer seperate>
            <NotoSansKR size={18} color="white">
              추가 목표
            </NotoSansKR>
            <OcticonIcons name="hourglass" size={24} color={'white'} />
          </RowContainer>
          <View>
            <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
            <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
            <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
            <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
          </View>
        </FootContainer>
      </HomeContainer>
    </ScrollView>
  );
};

export default ChallengeTab;
