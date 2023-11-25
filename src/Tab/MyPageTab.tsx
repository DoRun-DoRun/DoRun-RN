import React, {useState} from 'react';
import {
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
} from '../Component';
import styled, {useTheme} from 'styled-components/native';
import {Pressable, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useModal} from '../Modal/ModalProvider';

const ProfileContainer = styled(RowContainer)`
  border: 1px solid ${props => props.theme.primary1};
  padding: 16px;
  border-radius: 10px;
`;

const UserIcon = styled.View`
  width: 80px;
  height: 80px;
  border: 3px solid ${props => props.theme.primary1};
  border-radius: 80px;
`;

const UserStatsCount = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${props => props.theme.primary2};
`;

const UserStatsBox = styled.View`
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
        <NotoSansKR size={16} color="primary1">
          {count}
        </NotoSansKR>
      </UserStatsCount>
      <NotoSansKR size={12} color="gray4" weight="Medium">
        {status}
      </NotoSansKR>
    </UserStatsBox>
  );
};

const Divider = styled.View`
  height: 56px;
  border: 1px solid ${props => props.theme.gray6};
`;

const UserName = styled(NotoSansKR)`
  padding: 0 8px 8px 8px;
`;

const HistoryContainer = styled.View`
  flex: 1;
  margin: 0 -16px;
  padding: 0 16px;
  margin-bottom: -16px;
  background-color: ${props => props.theme.primary2};
`;

const CategoryContainer = styled(RowContainer)`
  margin: 0 -16px;
  justify-content: flex-end;
  background-color: ${props => props.theme.white};
`;

const CategoryTab = styled(RowContainer)`
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
  gap: 32px;
  padding: 16px 0;
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
  gap: 8px;
  border-radius: 10px;
  padding: 16px;
  background-color: ${props => props.theme.primary1};
`;

const DailyTodo = styled.View`
  gap: 8px;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.white};
`;

const DailyTodoList = styled(RowContainer)`
  padding: 4px 0;
`;

// const WeeklyTeamGoal = styled.View`
//   align-items: center;
//   border: 2px solid ${props => props.theme.primary1};
//   padding: 8px;
//   border-radius: 10px;
// `;

// const WeeklyTeamPic = styled.View`
//   width: 96px;
//   height: 96px;
//   border-radius: 10px;
//   margin-bottom: 8px;
//   border: 2px solid ${props => props.theme.gray4};
// `;

const History = () => {
  const theme = useTheme();
  return (
    <>
      <Calendar />
      <RowContainer seperate>
        <MaterialIcons name="chevron-left" size={24} />
        <NotoSansKR size={18}>챌린지 이름</NotoSansKR>
        <MaterialIcons name="chevron-right" size={24} />
      </RowContainer>

      <DailyPicContiner>
        <DailyPic />
        <DailyTextContiner>
          <Text>😀</Text>
        </DailyTextContiner>
      </DailyPicContiner>

      <View style={{gap: 16}}>
        <DailyDiary>
          <NotoSansKR color="white" size={16}>
            11월 02일 한줄일기
          </NotoSansKR>
          <NotoSansKR color="white" size={14} weight="Regular">
            오늘 달리기를 하고 물을 마시고 하루의 목표 달성에 힘썼다. 정말
            유익하고 좋은 시간이었다. 앞으로도 계속 이어나가고 싶다.
          </NotoSansKR>
        </DailyDiary>

        <DailyTodo>
          <DailyTodoList gap={8}>
            <MaterialIcons name="list-alt" color={theme.primary1} size={20} />
            <NotoSansKR size={13} color="gray3">
              달리기 1km 오늘도 화이이이이ㅣ이이티ㅣㅇㅇ
            </NotoSansKR>
          </DailyTodoList>
          <DailyTodoList gap={8}>
            <MaterialIcons name="list-alt" color={theme.primary1} size={20} />
            <NotoSansKR size={13} color="gray3">
              달리기 1km 오늘도 화이이이이ㅣ이이티ㅣㅇㅇ
            </NotoSansKR>
          </DailyTodoList>
        </DailyTodo>
      </View>

      {/* <View style={{gap: 16}}>
        <NotoSansKR size={18}>팀 주간목표</NotoSansKR>
        <WeeklyTeamGoal>
          <NotoSansKR size={18} color="primary1">
            “닭가슴살 1일 1회 먹기”
          </NotoSansKR>
        </WeeklyTeamGoal>
        <RowScrollContainer gap={8}>
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
        </RowScrollContainer>
      </View> */}
    </>
  );
};

const AlbumItem = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background-color: ${props => props.theme.gray6};
`;

const AlbumGrid = styled(RowContainer)`
  width: 232px;
  height: 248px;
  column-gap: 8px;
  row-gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Album = () => {
  const {showModal, hideModal} = useModal();

  const openModal = () => {
    const modalContent = (
      <View style={{alignItems: 'center', gap: 24}}>
        <View style={{height: 200, width: 200, backgroundColor: '#ccc'}} />
        <NotoSansKR size={14} onPress={() => hideModal()}>
          닫기
        </NotoSansKR>
      </View>
    );
    showModal(modalContent);
  };

  return (
    <RowContainer style={{justifyContent: 'space-between', padding: 16}}>
      <MaterialIcons name="chevron-left" size={20} />
      <AlbumGrid>
        <Pressable
          onPress={() => {
            openModal();
          }}>
          <AlbumItem />
        </Pressable>
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
    </RowContainer>
  );
};

const MyPageTab = () => {
  const [selected, setSelected] = useState('history');
  return (
    <HomeContainer>
      <ScrollContainer>
        <InnerContainer gap={24}>
          <ProfileContainer gap={24}>
            <UserIcon />
            <View>
              <UserName size={16}>달려라 갓생팀</UserName>
              <RowContainer gap={16}>
                <UserStats status="완료" count={8} />
                <Divider />
                <UserStats status="진행중" count={1} />
                <Divider />
                <UserStats status="시작 전" count={3} />
              </RowContainer>
            </View>
          </ProfileContainer>

          <HistoryContainer>
            <CategoryContainer>
              <CategoryTab>
                <Tab
                  selected={selected === 'history'}
                  onPress={() => {
                    setSelected('history');
                  }}>
                  <NotoSansKR
                    size={14}
                    color={selected === 'history' ? 'primary1' : 'gray4'}>
                    기록
                  </NotoSansKR>
                </Tab>
                <Tab
                  selected={selected === 'album'}
                  onPress={() => {
                    setSelected('album');
                  }}>
                  <NotoSansKR
                    size={14}
                    color={selected === 'album' ? 'primary1' : 'gray4'}>
                    앨범
                  </NotoSansKR>
                </Tab>
              </CategoryTab>
            </CategoryContainer>

            <HistoryDetailContainer>
              {selected === 'history' ? <History /> : <Album />}
            </HistoryDetailContainer>
          </HistoryContainer>
        </InnerContainer>
      </ScrollContainer>
    </HomeContainer>
  );
};

export default MyPageTab;
