import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {
  HomeContainer,
  NotoSansKR,
  RowContainer,
  RowScrollContainer,
  TossFace,
  calculateDaysUntil,
  calculateTimeDifference,
  useApi,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useQuery} from 'react-query';
import {ChallengeStatusType} from '../../store/data';
import {useModal} from '../Modal/ModalProvider';
import {ChallengeListModal} from '../Modal/ChallengeListModal';
import {goalType, toggleGoal} from '../../store/slice/GoalSlice';
import {PersonGoalChoiceModal} from '../Modal/PersonGoalModal';

const Profile = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fbef84;
  justify-content: center;
  align-items: center;
`;

interface ChallengeInfoType {
  mainText: string;
  subText: string;
  headerEmoji: string;
  isSelected?: boolean;
}

const ChallengeInfo = ({
  mainText,
  subText,
  headerEmoji,
  isSelected,
}: ChallengeInfoType) => {
  const TextContainer = styled.View`
    width: 122px;
    height: 154px;

    border-radius: 10px;
    padding: 12px 8px;
    background-color: white;
    border-width: 2px;
    border-color: ${props =>
      isSelected ? props.theme.primary1 : props.theme.white};
    box-sizing: border-box;
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
        <TossFace size={22}>{headerEmoji}</TossFace>
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
  headerEmoji,
}: ChallengeInfoType) => {
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
        <TossFace size={20}>{headerEmoji}</TossFace>
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
  goal: goalType;
}
interface TeamGoalProps {
  isComplete?: boolean;
  count: string;
  title: string;
}

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

const GoalBox: React.FC<GoalBoxProps> = ({goal}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {showModal} = useModal();

  if (goal === undefined) {
    return (
      <HomeContainer>
        <NotoSansKR size={16}>오류</NotoSansKR>
      </HomeContainer>
    );
  }
  const backgroundColor = goal.isComplete ? theme.gray7 : theme.white;
  const textColor = 'black';
  const iconColor = goal.isComplete ? theme.gray4 : theme.primary1;
  const borderColor = goal.isComplete ? theme.gray7 : theme.primary1;

  const openEditeModal = (id: number) => {
    showModal(<PersonGoalChoiceModal id={id} />);
  };

  return (
    <GoalContainer
      onPress={() => dispatch(toggleGoal(goal.id))}
      bc={backgroundColor}
      border={borderColor}>
      <RowContainer seperate>
        <RowContainer gap={8}>
          <OcticonIcons name="check-circle-fill" size={24} color={iconColor} />
          {goal.isComplete ? (
            <TodoTitle size={16}>{goal.title}</TodoTitle>
          ) : (
            <NotoSansKR size={16} color={textColor} weight="Medium">
              {goal.title}
            </NotoSansKR>
          )}
        </RowContainer>
        <TouchableOpacity
          onPress={() => {
            openEditeModal(goal.id);
          }}>
          <OcticonIcons name="kebab-horizontal" size={24} color={theme.gray5} />
        </TouchableOpacity>
      </RowContainer>
    </GoalContainer>
  );
};

const TeamGoalBox: React.FC<TeamGoalProps> = ({title, count, isComplete}) => {
  const theme = useTheme();

  const backgroundColor = isComplete ? theme.gray7 : theme.primary1;
  const textColor = 'white';
  const iconColor = isComplete ? theme.gray4 : theme.white;

  return (
    <GoalContainer bc={backgroundColor} border={theme.primary1}>
      <RowContainer seperate>
        <RowContainer gap={8}>
          <OcticonIcons name="check-circle-fill" size={24} color={iconColor} />
          <NotoSansKR size={16} color={textColor} weight="Bold">
            {title}
          </NotoSansKR>
        </RowContainer>
        <NotoSansKR size={16} color={textColor}>
          {count}
        </NotoSansKR>
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
  name,
  body,
  time,
}: {
  name: String;
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
          {name}
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

const FootContainer = styled.View<{disalbed?: boolean}>`
  gap: 16px;
  /* background-color: #2c2c2c; */
  background-color: ${props =>
    props.disalbed ? props.theme.gray5 : props.theme.gray1};
  flex: 1;
  padding: 16px;
  text-align: left;
`;

interface ChallengeInfo {
  CHALLENGE_MST_NO: number;
  CHALLENGE_MST_NM: string;
  START_DT: string;
  END_DT: string;
  HEADER_EMOJI: string;
  CHALLENGE_STATUS: ChallengeStatusType;
  PROGRESS: number;
}

interface TeamInfo {
  TEAM_NO: number;
  TEAM_NM: string;
  IS_DONE: boolean;
  CHALLENGE_USER_NO: number;
}

interface AdditionalInfo {
  ADDITIONAL_NO: number;
  ADDITIONAL_NM: string;
  IS_DONE: boolean;
  IMAGE_FILE_NM: string;
  START_DT: string;
  END_DT: string;
  CHALLENGE_USER_NO: number;
  CHALLENGE_USER_NN: string;
}

const ChallengeTab = () => {
  const CallApi = useApi();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [selectedChallenge, setSelectedChallenge] = useState<number>();
  const {showModal} = useModal();

  const goals = useSelector((state: RootState) => state.goal.goals);

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
  const {data: listData, isLoading: listLoading} = useQuery(
    'getChallenge',
    getChallenge,
  );
  const current_day = new Date().toISOString();
  const getChallengeDetail = async () => {
    try {
      const response = await CallApi({
        endpoint: `challenge/detail/${selectedChallenge}?current_day=${current_day}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  const {data: detailData, isLoading: detailLoading} = useQuery(
    ['getChallengeDetail', selectedChallenge],
    getChallengeDetail,
    {enabled: selectedChallenge !== undefined},
  );

  useEffect(() => {
    setSelectedChallenge(listData?.progress_challenges[0]?.CHALLENGE_MST_NO);
  }, [listData?.progress_challenges]);

  if (listLoading || detailLoading) {
    return <NotoSansKR size={15}>로딩중</NotoSansKR>;
  }

  if (listData?.progress_challenges.length === 0) {
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
          {listData?.invited_challenges.length === 0 ? (
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
            listData?.invited_challenges.map((challenge: ChallengeInfo) => (
              <ChallengeSubInfo
                key={challenge.CHALLENGE_MST_NO}
                headerEmoji={challenge.HEADER_EMOJI}
                mainText={challenge.CHALLENGE_MST_NM}
                subText={calculateDaysUntil(challenge.START_DT).toString()}
              />
            ))
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
  const openInviteModal = (challenge_mst_no: number) => {
    showModal(<ChallengeListModal challenge_mst_no={challenge_mst_no} />);
  };

  return (
    <ScrollView>
      <HomeContainer style={{gap: 32}}>
        <TopContainer>
          <NotoSansKR size={16}>진행중 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            {listData?.progress_challenges.map((challenge: ChallengeInfo) => (
              <TouchableOpacity
                key={challenge.CHALLENGE_MST_NO}
                onPress={() => {
                  setSelectedChallenge(challenge.CHALLENGE_MST_NO);
                }}>
                <ChallengeInfo
                  isSelected={challenge.CHALLENGE_MST_NO === selectedChallenge}
                  headerEmoji={challenge.HEADER_EMOJI}
                  mainText={challenge.CHALLENGE_MST_NM}
                  subText={
                    challenge.CHALLENGE_STATUS === ChallengeStatusType.PENDING
                      ? '시작전'
                      : `${Number(challenge.PROGRESS.toFixed(2))}% 진행됨`
                  }
                />
              </TouchableOpacity>
            ))}
          </RowScrollContainer>

          <NotoSansKR size={16}>초대된 챌린지</NotoSansKR>
          <RowScrollContainer gap={8}>
            {listData?.invited_challenges.map((challenge: ChallengeInfo) => {
              const leftDay = calculateDaysUntil(challenge.START_DT);
              return (
                <TouchableOpacity
                  key={challenge.CHALLENGE_MST_NO}
                  onPress={() => openInviteModal(challenge.CHALLENGE_MST_NO)}>
                  <ChallengeSubInfo
                    headerEmoji={challenge.HEADER_EMOJI}
                    mainText={challenge.CHALLENGE_MST_NM}
                    subText={leftDay === 0 ? '내일시작' : `${leftDay}일후 시작`} // 여기에 적절한 날짜 처리 로직을 추가할 수 있습니다
                  />
                </TouchableOpacity>
              );
            })}
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
          {detailData?.teamGoal.length !== 0 ? (
            <TeamGoalBox
              title={detailData?.teamGoal[0].TEAM_NM}
              count={
                detailData?.teamGoal.filter(
                  (item: TeamInfo) => item.IS_DONE === true,
                ).length +
                '/' +
                detailData?.teamGoal.length
              }
            />
          ) : (
            <TeamGoalBox
              title="팀 목표 생성을 기다리고 있습니다."
              count="0/0"
            />
          )}
        </CenterContainer>
        <CenterContainer>
          <NotoSansKR size={18}>개인별 목표</NotoSansKR>
          <View style={{gap: 8}}>
            {goals.map(goal => (
              <GoalBox key={goal.id} goal={goal} />
            ))}
          </View>
          <TouchableOpacity>
            <PlusContainers title="목표 추가하기" />
          </TouchableOpacity>
        </CenterContainer>
        {detailData?.additionalGoal.length !== 0 ? (
          <FootContainer>
            <RowContainer seperate>
              <NotoSansKR size={18} color="white">
                추가 목표
              </NotoSansKR>
              <OcticonIcons name="hourglass" size={24} color={'white'} />
            </RowContainer>
            <View>
              {detailData?.additionalGoal.map((data: AdditionalInfo) => {
                return (
                  <ListItem
                    key={data.ADDITIONAL_NO}
                    name={data.CHALLENGE_USER_NN}
                    body={data.ADDITIONAL_NM}
                    time={calculateTimeDifference(data.END_DT)}
                  />
                );
              })}
            </View>
          </FootContainer>
        ) : (
          <FootContainer disalbed>
            <RowContainer seperate>
              <NotoSansKR size={18} color="white">
                추가 목표
              </NotoSansKR>
              <OcticonIcons name="hourglass" size={24} color={'white'} />
            </RowContainer>
          </FootContainer>
        )}
      </HomeContainer>
    </ScrollView>
  );
};

export default ChallengeTab;
