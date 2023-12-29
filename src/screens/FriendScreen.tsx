import React, {useState} from 'react';
import {
  HomeContainer,
  InnerContainer,
  InputNotoSansKR,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  ScrollContainer,
  useApi,
} from '../Component';
import {TouchableOpacity, View} from 'react-native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {styled, useTheme} from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {InviteAcceptType} from '../../store/data';

// const FrinedCharacter = styled.View`
//   width: 32px;
//   height: 32px;
//   border-radius: 32px;
//   border: 1px solid ${props => props.theme.secondary};
// `;

interface FriendType {
  accessToken: string | null;
  name: string;
  friendNo: number;
  invited?: boolean;
}

const Friend = ({accessToken, name, friendNo, invited}: FriendType) => {
  const theme = useTheme();
  const CallApi = useApi();
  const queryClient = useQueryClient();

  const changeFriend = (status: InviteAcceptType) =>
    CallApi({
      endpoint: `friend/${friendNo}?status=${status}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate: changeFriendMutation} = useMutation(changeFriend, {
    onSuccess: response => {
      console.log('Success:', response);
      queryClient.invalidateQueries('FriendListModal');
    },
    onError: error => {
      console.error('Challenge Status Change Error:', error);
    },
  });

  return (
    <RowContainer gap={8}>
      {/* <FrinedCharacter /> */}
      <NotoSansKR size={14} weight="Medium" style={{flex: 1}}>
        {name}
      </NotoSansKR>

      {invited ? (
        <>
          <TouchableOpacity
            onPress={() => changeFriendMutation(InviteAcceptType.ACCEPTED)}>
            <OcticonIcons name="check" size={24} color={theme.green} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeFriendMutation(InviteAcceptType.DECLINED)}>
            <OcticonIcons name="x" size={24} color={theme.red} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => changeFriendMutation(InviteAcceptType.DELETED)}>
          <OcticonIcons name="trash" size={24} color={theme.gray4} />
        </TouchableOpacity>
      )}
    </RowContainer>
  );
};

const SearchContainer = styled.View<{isClicked: boolean}>`
  width: 100%;
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
  padding-bottom: 8px;
`;

interface InviteFriendType {
  name: string;
  UID: number;
  setUidInput: React.Dispatch<React.SetStateAction<string>>;
}

const InviteFriend = ({name, UID, setUidInput}: InviteFriendType) => {
  const CallApi = useApi();
  const {accessToken} = useSelector((state: RootState) => state.user);

  const inviteFriend = () =>
    CallApi({
      endpoint: `friend/${UID}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate} = useMutation(inviteFriend, {
    onSuccess: response => {
      console.log('Success:', response);
      setUidInput('');
    },
    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  return (
    <RowContainer seperate>
      <NotoSansKR size={14} weight="Regular">
        {name}
      </NotoSansKR>
      <TouchableOpacity onPress={() => mutate()}>
        <NotoSansKR
          size={14}
          weight="Regular"
          color="gray3"
          style={{textDecorationLine: 'underline'}}>
          친구요청
        </NotoSansKR>
      </TouchableOpacity>
    </RowContainer>
  );
};

const SearchBox = ({UID}: {UID: number}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [uidInput, setUidInput] = useState('');
  const CallApi = useApi();
  const SearchList = async () => {
    try {
      const response = CallApi({
        endpoint: `user/search/${uidInput}`,
        method: 'GET',
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const isUidValid = uidInput.length === 7 && /^\d{7}$/.test(uidInput);

  const {data, isLoading} = useQuery(
    ['SearchList', uidInput], // 쿼리 키에 uidInput 포함
    SearchList,
    {enabled: isUidValid}, // 쿼리 실행 조건
  );

  return (
    <SearchContainer isClicked={isClicked}>
      <RowContainer gap={8}>
        <OcticonIcons name="search" size={16} />
        <InputNotoSansKR
          size={14}
          value={uidInput}
          keyboardType="number-pad"
          maxLength={7}
          onChangeText={setUidInput}
          style={{flex: 1}}
          placeholder={`친구 UID를 입력해요. 내 UID는 ${UID}에요`}
          onFocus={() => setIsClicked(true)}
        />
      </RowContainer>

      {isClicked && uidInput ? (
        <ExpandedContainer>
          <NotoSansKR size={14}>검색 결과</NotoSansKR>
          {isLoading ? (
            <LoadingIndicatior />
          ) : data?.USER_NM ? (
            <InviteFriend
              name={data?.USER_NM}
              UID={data?.UID}
              setUidInput={setUidInput}
            />
          ) : (
            <NotoSansKR size={14}>검색 결과가 없습니다.</NotoSansKR>
          )}
        </ExpandedContainer>
      ) : null}
    </SearchContainer>
  );
};

interface friendAPIType {
  USER_NM: string;
  FRIEND_NO: number;
  UID: number;
}

const FriendScreen = () => {
  const {accessToken, UID} = useSelector((state: RootState) => state.user);
  const CallApi = useApi();
  const FriendListModal = async () => {
    try {
      const response = CallApi({
        endpoint: 'friend/list',
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const {data: friendData, isLoading: friendLoading} = useQuery(
    'FriendListModal',
    FriendListModal,
  );

  if (friendLoading) {
    return <LoadingIndicatior />;
  }

  return (
    <HomeContainer>
      <InnerContainer seperate>
        <ScrollContainer style={{flex: 1}}>
          <View style={{gap: 24}}>
            <NotoSansKR size={20}>친구 목록</NotoSansKR>
            <SearchBox UID={UID!} />

            <View style={{gap: 8}}>
              <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
                요청된 친구 초대
              </NotoSansKR>

              <View style={{gap: 8}}>
                {friendData?.pending.map((data: friendAPIType) => {
                  return (
                    <Friend
                      accessToken={accessToken}
                      key={data.FRIEND_NO}
                      name={data.USER_NM}
                      friendNo={data.FRIEND_NO}
                      invited
                    />
                  );
                })}
              </View>
            </View>

            <View style={{gap: 8}}>
              <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
                친구 목록
              </NotoSansKR>

              {friendData?.accepted.map((data: friendAPIType) => {
                return (
                  <Friend
                    accessToken={accessToken}
                    key={data.FRIEND_NO}
                    name={data.USER_NM}
                    friendNo={data.FRIEND_NO}
                  />
                );
              })}
            </View>
          </View>
        </ScrollContainer>
        {/* <ButtonComponent>카카오톡으로 초대하기</ButtonComponent> */}
      </InnerContainer>
    </HomeContainer>
  );
};

export default FriendScreen;
