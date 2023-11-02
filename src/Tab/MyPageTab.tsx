import React, {useState} from 'react';
import {HomeContainer, InnerContainer} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import {ScrollView, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const ProfileContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 24px;
  border: 1px solid ${props => props.theme.primary};
  padding: 16px;
  border-radius: 10px;
`;

const UserIcon = styled.View`
  width: 80px;
  height: 80px;
  border: 3px solid ${props => props.theme.primary};
  border-radius: 80px;
`;

const UserStatsContainer = styled.View`
  display: flex;
  gap: 16px;
  flex-direction: row;
`;

const UserStatsCount = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${props => props.theme.primary2};
`;

const UserStatsBox = styled.View`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const UserStats = ({
  status,
  count,
}: {
  status: '완료' | '진행중' | '시작 전';
  count: number;
}) => {
  return (
    <UserStatsBox>
      <UserStatsCount>
        <Text>{count}</Text>
      </UserStatsCount>
      <Text>{status}</Text>
    </UserStatsBox>
  );
};

const Divider = styled.View`
  width: 0px;
  height: 56px;
  border: 1px solid ${props => props.theme.gray6};
`;

const UserName = styled.Text`
  padding: 0 8px 8px 8px;
`;

const HistoryContainer = styled.View`
  flex: 1;
  margin: 0 -16px;
  padding: 0 16px;
  background-color: ${props => props.theme.primary2};
`;

const CategoryContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin: 0 -16px;
  justify-content: flex-end;
  background-color: ${props => props.theme.white};
`;

const CategoryTab = styled.View`
  display: flex;
  flex-direction: row;
  border-radius: 5px 5px 0 0;
  background-color: ${props => props.theme.gray7};
`;
const Tab = styled.Pressable<{selected?: boolean}>`
  padding: 4px 24px;
  border-radius: 5px 5px 0 0;
  background-color: ${props =>
    props.selected ? props.theme.primary2 : props.theme.gray7};
`;

const HistoryDetailContainer = styled.View`
  display: flex;
  gap: 32px;
  padding: 16px 0;
  width: auto;
`;

const ChallengeName = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ChallengeDescription = styled.View`
  display: flex;
  gap: 16px;
`;

const DailyPicContiner = styled.View`
  align-items: center;
`;

const DailyPic = styled.View`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray7};
`;

const DailyTextContiner = styled.View`
  width: 200px;
  align-items: flex-end;
`;

const DailyDiary = styled.View`
  display: flex;
  gap: 8px;
  border-radius: 10px;
  padding: 16px;
  background-color: ${props => props.theme.primary};
`;

const DailyDiaryTitle = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DailyTodo = styled.View`
  display: flex;
  gap: 8px;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.white};
`;

const DailyTodoList = styled.View`
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 4px 0;
`;

const WeeklyTeamTodo = styled.View`
  display: flex;
  gap: 16px;
`;

const WeeklyTeamGoal = styled.View`
  display: flex;
  align-items: center;
  border: 2px solid ${props => props.theme.primary};
  padding: 8px;
  border-radius: 10px;
`;

const WeeklyTeamPic = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 10px;
  margin-bottom: 8px;
  margin-left: 8px;
  border: 2px solid ${props => props.theme.gray4};
`;

const History = () => {
  const theme = useTheme();
  return (
    <>
      <Calendar />
      <ChallengeName>
        <MaterialIcons name="chevron-left" size={24} />
        <Text>챌린지 이름</Text>
        <MaterialIcons name="chevron-right" size={24} />
      </ChallengeName>

      <DailyPicContiner>
        <DailyPic />
        <DailyTextContiner>
          <Text>😀</Text>
        </DailyTextContiner>
      </DailyPicContiner>

      <ChallengeDescription>
        <DailyDiary>
          <DailyDiaryTitle>
            <Text>11월 02일 한줄일기</Text>
            <Octicons name="pencil" size={20} color={'#fff'} />
          </DailyDiaryTitle>
          <Text>
            오늘 달리기를 하고 물을 마시고 하루의 목표 달성에 힘썼다. 정말
            유익하고 좋은 시간이었다. 앞으로도 계속 이어나가고 싶다.
          </Text>
        </DailyDiary>

        <DailyTodo>
          <DailyTodoList>
            <MaterialIcons name="list-alt" color={theme.primary} size={20} />
            <Text>달리기 1km 오늘도 화이이이이ㅣ이이티ㅣㅇㅇ</Text>
          </DailyTodoList>
          <DailyTodoList>
            <MaterialIcons name="list-alt" color={theme.primary} size={20} />
            <Text>달리기 1km 오늘도 화이이이이ㅣ이이티ㅣㅇㅇ</Text>
          </DailyTodoList>
        </DailyTodo>
      </ChallengeDescription>

      <WeeklyTeamTodo>
        <Text>팀 주간목표</Text>
        <WeeklyTeamGoal>
          <Text>“닭가슴살 1일 1회 먹기”</Text>
        </WeeklyTeamGoal>
        <ScrollView horizontal>
          <View>
            <WeeklyTeamPic />
            <Text>😀😀😀</Text>
          </View>
          <View>
            <WeeklyTeamPic />
            <Text>😀😀😀</Text>
          </View>
          <View>
            <WeeklyTeamPic />
            <Text>😀😀😀</Text>
          </View>
          <View>
            <WeeklyTeamPic />
            <Text>😀😀😀</Text>
          </View>
        </ScrollView>
      </WeeklyTeamTodo>
    </>
  );
};

const AlbumItem = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray6};
`;

const AlbumGrid = styled.View`
  width: 232px;
  height: 248px;
  column-gap: 8px;
  row-gap: 16px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;

const AlbumContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const Album = () => {
  return (
    <AlbumContainer>
      <MaterialIcons name="chevron-left" size={20} />
      <AlbumGrid>
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
        <AlbumItem />
      </AlbumGrid>
      <MaterialIcons name="chevron-right" size={20} />
    </AlbumContainer>
  );
};

const MyPageTab = () => {
  const [selected, setSelected] = useState('history');
  return (
    <HomeContainer>
      <ScrollView>
        <InnerContainer gap={24}>
          <ProfileContainer>
            <UserIcon />
            <View>
              <UserName>달려라 갓생팀</UserName>
              <UserStatsContainer>
                <UserStats status="완료" count={8} />
                <Divider />
                <UserStats status="진행중" count={1} />
                <Divider />
                <UserStats status="시작 전" count={3} />
              </UserStatsContainer>
            </View>
          </ProfileContainer>

          <HistoryContainer>
            <CategoryContainer>
              <CategoryTab>
                <Tab
                  selected={selected === 'history'}
                  onPress={() => {
                    setSelected('history');
                    console.log(selected);
                  }}>
                  <Text>기록</Text>
                </Tab>
                <Tab
                  selected={selected === 'album'}
                  onPress={() => {
                    setSelected('album');
                  }}>
                  <Text>앨범</Text>
                </Tab>
              </CategoryTab>
            </CategoryContainer>

            <HistoryDetailContainer>
              {selected === 'history' ? <History /> : <Album />}
            </HistoryDetailContainer>
          </HistoryContainer>
        </InnerContainer>
      </ScrollView>
    </HomeContainer>
  );
};

export default MyPageTab;
