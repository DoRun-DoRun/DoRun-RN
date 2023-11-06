import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  NotoSansKR,
  RowContainer,
} from '../Component';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {styled, useTheme} from 'styled-components/native';

const SearchContainer = styled.View<{isClicked: boolean}>`
  flex: 1;
  background-color: #fff;
  border: 1px solid ${props => props.theme.gray6};
  padding: 8px;
  border-radius: 10px;
  gap: 16px;
  z-index: 10;
`;

const ExpandedContainer = styled.View`
  background-color: #fff;
  padding: 0 8px;
  gap: 8px;
  padding-bottom: 16px;
`;

const InviteFriend = () => {
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
      <NotoSansKR size={14} weight="Regular">
        닉네임 A
      </NotoSansKR>
      <NotoSansKR
        size={14}
        weight="Regular"
        color="gray3"
        style={{textDecorationLine: 'underline'}}>
        친구요청
      </NotoSansKR>
    </View>
  );
};

const SearchBox = ({
  isClicked,
  setIsClicked,
}: {
  isClicked: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [textValue, setTextValue] = useState('');

  return (
    <SearchContainer isClicked={isClicked}>
      <RowContainer gap={8}>
        <OcticonIcons name="search" size={16} />
        <TextInput
          value={textValue}
          onChangeText={text => setTextValue(text)}
          style={{flex: 1}}
          placeholder="Friend UID"
          onBlur={() => setIsClicked(false)}
          onFocus={() => setIsClicked(true)}
        />
      </RowContainer>

      {isClicked && !textValue ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>친구 목록</NotoSansKR>
          <InviteFriend />
        </ExpandedContainer>
      ) : null}

      {isClicked && textValue ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>검색 결과</NotoSansKR>
          <NotoSansKR size={14} weight="Regular">
            닉네임 A
          </NotoSansKR>
        </ExpandedContainer>
      ) : null}
    </SearchContainer>
  );
};

const DatePicker = styled.TouchableOpacity`
  border: 1px solid ${props => props.theme.gray5};
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
`;

const CreateChallengeScreen = () => {
  const [isOpened, setIsOpened] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const theme = useTheme();

  return (
    <HomeContainer>
      <InnerContainer seperate>
        <View style={{gap: 24}}>
          <NotoSansKR size={20} weight="Bold">
            도전을 시작해볼까요?
          </NotoSansKR>
          <RowContainer gap={16}>
            <TouchableOpacity>
              <OcticonIcons name="plus-circle" size={40} />
            </TouchableOpacity>
            <TextInput placeholder="챌린지 목표" />
          </RowContainer>

          <RowContainer gap={8}>
            <SearchBox isClicked={isClicked} setIsClicked={setIsClicked} />
            {!isClicked ? <OcticonIcons name="plus-circle" size={24} /> : null}
          </RowContainer>

          <View style={{gap: 16}}>
            <RowContainer style={{justifyContent: 'space-between'}}>
              <NotoSansKR size={18} style={{marginBottom: 4}}>
                챌린지 참여 인원
              </NotoSansKR>
              <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
                <OcticonIcons
                  name={isOpened ? 'chevron-down' : 'chevron-up'}
                  size={28}
                  color={theme.gray3}
                />
              </TouchableOpacity>
            </RowContainer>
          </View>
          <View style={{gap: 12}}>
            <RowContainer seperate>
              <NotoSansKR size={16} weight="Medium">
                닉네임 A
              </NotoSansKR>
              <NotoSansKR size={14} weight="Regular" color="green">
                참여중이에요
              </NotoSansKR>
            </RowContainer>

            <RowContainer seperate>
              <NotoSansKR size={16} weight="Medium">
                닉네임 A
              </NotoSansKR>
              <NotoSansKR size={14} weight="Regular" color="red">
                참여를 기다리고 있어요
              </NotoSansKR>
            </RowContainer>
          </View>

          <View style={{gap: 8}}>
            <NotoSansKR size={18}>챌린지 기간</NotoSansKR>
            <DatePicker>
              <NotoSansKR size={14} weight="Medium" color="gray4">
                날짜를 선택해주세요
              </NotoSansKR>
            </DatePicker>
          </View>
        </View>

        <View style={{gap: 8}}>
          <ButtonComponent>지금 시작하기</ButtonComponent>
          <ButtonComponent type="secondary">참여 기다리기</ButtonComponent>
        </View>
      </InnerContainer>
    </HomeContainer>
  );
};

export default CreateChallengeScreen;
