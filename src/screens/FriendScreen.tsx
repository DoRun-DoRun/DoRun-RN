import React, {useState} from 'react';
import {
  ButtonComponent,
  HomeContainer,
  InnerContainer,
  NotoSansKR,
} from '../Component';
import {TextInput, TouchableOpacity, View} from 'react-native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {styled, useTheme} from 'styled-components/native';

const InvitedFriend = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FrinedListContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
`;
const FrinedCharacter = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  border: 1px solid ${props => props.theme.secondary};
`;

const RowContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const Friend = ({invited}: {invited?: boolean}) => {
  const theme = useTheme();

  return (
    <FrinedListContainer>
      <RowContainer>
        <FrinedCharacter />
        <NotoSansKR size={14} weight="Medium">
          닉네임 A
        </NotoSansKR>
      </RowContainer>

      {invited ? (
        <RowContainer>
          <TouchableOpacity>
            <OcticonIcons name="check" size={24} color={theme.green} />
          </TouchableOpacity>
          <TouchableOpacity>
            <OcticonIcons name="x" size={24} color={theme.red} />
          </TouchableOpacity>
        </RowContainer>
      ) : (
        <TouchableOpacity>
          <OcticonIcons name="trash" size={24} color={theme.gray4} />
        </TouchableOpacity>
      )}
    </FrinedListContainer>
  );
};

const SearchContainer = styled.View<{isClicked: boolean}>`
  position: absolute;
  width: 100%;
  top: 52px;
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

const SearchBox = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [textValue, setTextValue] = useState('');

  return (
    <SearchContainer isClicked={isClicked}>
      <RowContainer>
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
          <InviteFriend />
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

const FriendScreen = () => {
  const [reqeusted, setReqeusted] = useState(true);
  return (
    <HomeContainer>
      <InnerContainer style={{justifyContent: 'space-between'}}>
        <View style={{gap: 24}}>
          <NotoSansKR size={20} style={{marginBottom: 54}}>
            친구 목록
          </NotoSansKR>

          <SearchBox />

          <View style={{gap: 8}}>
            <InvitedFriend>
              <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
                요청된 친구 초대
              </NotoSansKR>
              <TouchableOpacity onPress={() => setReqeusted(!reqeusted)}>
                <OcticonIcons
                  name={reqeusted ? 'chevron-down' : 'chevron-up'}
                  size={28}
                />
              </TouchableOpacity>
            </InvitedFriend>
            {reqeusted ? (
              <View style={{gap: 8}}>
                <Friend invited />
                <Friend invited />
                <Friend invited />
              </View>
            ) : null}
          </View>

          <View style={{gap: 8}}>
            <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
              친구 목록
            </NotoSansKR>

            <Friend />
            <Friend />
            <Friend />
          </View>
        </View>
        <ButtonComponent>카카오톡으로 초대하기</ButtonComponent>
      </InnerContainer>
    </HomeContainer>
  );
};

export default FriendScreen;
