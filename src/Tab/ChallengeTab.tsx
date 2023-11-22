import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Pressable, Text} from 'react-native';
import {HomeContainer, NotoSansKR} from '../Component';
import styled from 'styled-components/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
const TextContainer = styled.View`
  width: 122px;
  height: 154px;

  border-radius: 10px;
  padding: 12px 8px;
  background-color: white;
  elevation: 1;
  gap: 40px;
`;
const Profile = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fbef84;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const EmojiText = styled.Text`
  font-size: 18px;
`;
const TextBody = styled.View`
  gap: 8px;
`;
const MainText = styled.Text`
  font-family: Noto Sans KR;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  color: black;
`;

const ChallengeInfo = ({
  mainText,
  subText,
}: {
  mainText: String;
  subText: String;
}) => {
  return (
    <TextContainer>
      <Profile>
        <EmojiText>🥰</EmojiText>
      </Profile>
      <TextBody>
        <MainText>{mainText}</MainText>
        <Text>{subText}</Text>
      </TextBody>
    </TextContainer>
  );
};

const TextSubContainer = styled.View`
  width: 108px;
  height: 124px;

  border-radius: 10px;
  padding: 12px 8px;
  background-color: white;
  elevation: 1;
  gap: 20px;
`;
const TextSubBody = styled.View`
  gap: 4px;
`;
const ChallengeSubInfo = ({
  mainText,
  subText,
}: {
  mainText: String;
  subText: String;
}) => {
  return (
    <TextSubContainer>
      <Profile>
        <EmojiText>🥰</EmojiText>
      </Profile>
      <TextSubBody>
        <MainText>{mainText}</MainText>
        <Text>{subText}</Text>
      </TextSubBody>
    </TextSubContainer>
  );
};

interface GoalBoxProps {
  theme: 'white' | 'gray' | 'blue';
  title: string;
  count: string;
}
const GoalBoxContainer = styled.View`
  padding: 12px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 30px;
  overflow: hidden;
`;

const GoalBox: React.FC<GoalBoxProps> = ({theme, title, count}) => {
  const getBackgroundColor = () => {
    switch (theme) {
      case 'white':
        return 'white';
      case 'gray':
        return 'lightgray';
      case 'blue':
        return '#648cf3';
      default:
        return 'white';
    }
  };
  const getBorderColor = () => {
    switch (theme) {
      case 'white':
        return '#648cf3';
      case 'gray':
        return 'lightgray';
      case 'blue':
        return 'white';
      default:
        return 'white';
    }
  };
  return (
    <Pressable
      android_ripple={{color: '#eeeeee'}}
      style={{
        flex: 1,
        backgroundColor: getBackgroundColor(),
        borderRadius: 13,
        borderColor: getBorderColor(),
        borderWidth: 2, // Border width to make the border visible
        overflow: 'hidden',
      }}>
      <GoalBoxContainer>
        <PlusContainer>
          <NotoSansKR
            size={20}
            style={theme === 'gray' ? {textDecorationLine: 'line-through'} : {}}
            color={
              theme === 'blue' ? 'white' : theme === 'gray' ? 'gray3' : 'black'
            }>
            {title}
          </NotoSansKR>
          <OcticonIcons
            name="check-circle-fill"
            size={22}
            color={
              theme === 'blue' ? 'white' : theme === 'gray' ? 'gray' : '#648cf3'
            }
          />
        </PlusContainer>
        {theme === 'white' || theme === 'gray' ? (
          <OcticonIcons name="kebab-horizontal" size={22} color={'gray'} />
        ) : (
          <NotoSansKR size={20} color={theme === 'blue' ? 'white' : 'black'}>
            {count}
          </NotoSansKR>
        )}
      </GoalBoxContainer>
    </Pressable>
  );
};
const PlusContainer = styled.View`
  flex-direction: row-reverse;
  gap: 8px;
  display: flex;
  align-items: center;
`;
const PlusText = styled.Text`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  color: #648cf3;
`;

const PlusContainers = ({title}: {title: String}) => {
  return (
    <PlusContainer>
      <PlusText>{title}</PlusText>
      <OcticonIcons name="plus-circle" size={20} color={'#648cf3'} />
    </PlusContainer>
  );
};
const SomeTargetContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;

  border-bottom-color: white;
  border-bottom-width: 3px;
  margin-bottom: 10px;
`;
const ListContainer = styled.View`
  flex-direction: row;
  gap: 32px;
  display: flex;
  align-items: center;
  flex: 1;
  margin-bottom: 10px;
`;
const ListSecContainer = styled.View`
  flex-direction: row-reverse;
  gap: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const ListItem = ({
  title,
  body,
  time,
}: {
  title: String;
  body: String;
  time: String;
}) => {
  return (
    <SomeTargetContainer>
      <ListContainer>
        <NotoSansKR size={20} weight="Regular" color="white">
          {title}
        </NotoSansKR>
        <NotoSansKR size={20} weight="Regular" color="white">
          {body}
        </NotoSansKR>
      </ListContainer>

      <ListSecContainer>
        <OcticonIcons name="duplicate" size={28} color={'white'} />
        <NotoSansKR size={20} weight="Regular" color="white">
          {time}
        </NotoSansKR>
      </ListSecContainer>
    </SomeTargetContainer>
  );
};
const TopContainer = styled.View`
  gap: 16px;
  background-color: #dfeaff;
  flex: 1;
  padding: 16px;
  text-align: left;
`;
const ChallengesContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
`;

const CenterContainer = styled.View`
  background-color: white;
  padding: 32px 16px 16px 16px;
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
  const navigation = useNavigation();
  const [showAdditionalGoals, setShowAdditionalGoals] = useState(false);

  const toggleAdditionalGoals = () => {
    setShowAdditionalGoals(prev => !prev);
  };
  return (
    <ScrollView>
      <HomeContainer>
        <TopContainer>
          <NotoSansKR size={20}>진행중 챌린지</NotoSansKR>
          <ChallengesContainer>
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
            <ChallengeInfo mainText={'프론트 엔드 팀'} subText={'50% 진행됨'} />
          </ChallengesContainer>

          <NotoSansKR size={20}>초대된 챌린지</NotoSansKR>
          <ChallengesContainer>
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
            <ChallengeSubInfo mainText={'챌린지 이름'} subText={'내일 시작'} />
          </ChallengesContainer>

          <Pressable
            onPress={() =>
              navigation.navigate('CreateChallengeScreen' as never)
            }
            android_ripple={{color: '#eeeeee'}}>
            <PlusContainers title="챌린지 추가하기" />
          </Pressable>
        </TopContainer>

        <CenterContainer>
          <NotoSansKR size={26}>팀 주간 목표</NotoSansKR>
          <GoalBox theme="blue" title="개인이 맡은 UI 완료하기" count="1/4" />
        </CenterContainer>
        <CenterContainer>
          <NotoSansKR size={26}>개인별 목표</NotoSansKR>
          <View style={{gap: 8}}>
            <GoalBox
              theme="white"
              title="한줄이라도 코드 작성하기"
              count="1/4"
            />
            <GoalBox
              theme="white"
              title="1시간씩 자리에 앉아 있기"
              count="1/4"
            />
            <GoalBox theme="white" title="밥 잘 챙겨먹기" count="1/4" />
            <GoalBox theme="gray" title="팀 회의 참여하기" count="1/4" />
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('CreateChallengeScreen' as never)
            }
            android_ripple={{color: '#eeeeee'}}>
            <PlusContainers title="목표 추가하기" />
          </Pressable>
        </CenterContainer>
        <FootContainer>
          <Pressable
            onPress={toggleAdditionalGoals}
            android_ripple={{color: 'transparent'}}>
            <ChallengesContainer>
              <NotoSansKR size={22} color="white">
                추가 목표
              </NotoSansKR>
              <OcticonIcons name="diff-added" size={28} color={'white'} />
            </ChallengesContainer>
          </Pressable>
          {showAdditionalGoals && (
            <View style={{flexDirection: 'column'}}>
              <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
              <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
              <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
              <ListItem title={'닉네임'} body={'달리기 1km'} time={'00:00'} />
            </View>
          )}
        </FootContainer>
      </HomeContainer>
    </ScrollView>
  );
};

export default ChallengeTab;
