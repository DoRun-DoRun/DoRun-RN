import React, {useState} from 'react';
import {
  ButtonComponent,
  GetImage,
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
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import KakaoShareLink from 'react-native-kakao-share-link';

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
    onSuccess: () => {
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

const SearchContainer = styled.View`
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
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '친구요청을 보냈어요.',
      });
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
    <RowContainer gap={8}>
      <SearchContainer>
        <RowContainer gap={8}>
          <OcticonIcons name="search" size={16} color={'#000'} />
          <InputNotoSansKR
            size={14}
            value={uidInput}
            keyboardType="number-pad"
            maxLength={7}
            onChangeText={setUidInput}
            style={{flex: 1}}
            placeholder={`친구 UID 검색 (내 UID: ${UID})`}
          />
        </RowContainer>

        {uidInput && (
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
        )}
      </SearchContainer>
    </RowContainer>
  );
};

interface friendAPIType {
  USER_NM: string;
  FRIEND_NO: number;
  UID: number;
}

const FriendScreen = () => {
  const {accessToken, UID, userName} = useSelector(
    (state: RootState) => state.user,
  );
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

  const sendKakao = async () => {
    try {
      const response = await KakaoShareLink.sendFeed({
        content: {
          title: `${userName}님이 친구요청을 보냈어요!`,
          imageUrl: GetImage('group_default_3@3x.png'),
          link: {
            webUrl: 'https://developers.kakao.com/',
            mobileWebUrl: 'https://developers.kakao.com/',
          },
          description:
            '두런두런과 함께 갓생 살기\n지금 친구들과 시작해 보세요!',
        },
        buttons: [
          {
            title: '앱에서 보기',
            link: {
              androidExecutionParams: [
                {key: 'SENDER_NO', value: UID!.toString()},
              ],
              iosExecutionParams: [{key: 'SENDER_NO', value: UID!.toString()}],
            },
          },
        ],
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

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
            <View style={{gap: 32}}>
              <View style={{gap: 8}}>
                <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
                  요청된 친구 초대
                </NotoSansKR>

                {friendData?.pending.length !== 0 ? (
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
                ) : (
                  <NotoSansKR size={12} weight="Medium" color="gray4">
                    요청된 친구 초대가 없습니다
                  </NotoSansKR>
                )}
              </View>

              <View style={{gap: 8}}>
                <NotoSansKR size={14} weight="Medium" style={{marginBottom: 4}}>
                  친구 목록
                </NotoSansKR>
                {friendData?.accepted.length !== 0 ? (
                  <View style={{gap: 8}}>
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
                ) : (
                  <NotoSansKR size={12} weight="Medium" color="gray4">
                    친구목록이 없습니다
                  </NotoSansKR>
                )}
              </View>
            </View>
          </View>
        </ScrollContainer>
        <ButtonComponent
          onPress={() => {
            sendKakao();
          }}>
          카카오톡으로 초대하기
        </ButtonComponent>
      </InnerContainer>
    </HomeContainer>
  );
};

export default FriendScreen;
