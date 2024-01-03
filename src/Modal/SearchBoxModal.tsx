import React, {useEffect, useState} from 'react';
import {Dispatch, SetStateAction} from 'react';
import {styled} from 'styled-components/native';
import {InviteList} from '../screens/CreateChallengeScreen';
import {
  InputNotoSansKR,
  LoadingIndicatior,
  NotoSansKR,
  RowContainer,
  useApi,
} from '../Component';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {useQuery} from 'react-query';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import {ModalHeadBorder} from './CustomModal';

const SearchContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  /* gap: 16px; */
  /* z-index: 10; */
`;

const ExpandedContainer = styled.View`
  background-color: #fff;
  padding: 8px;
  margin-top: 8px;
  gap: 16px;
`;

export interface InviteFriendType {
  name: string;
  UID: number;
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
  inviteListData: InviteList[];
  localExist: InviteList[];
  setLocalExist: Dispatch<SetStateAction<InviteList[]>>;
  setUidInput: Dispatch<SetStateAction<string>>;
}

export const InviteFriend = ({
  name,
  UID,
  setInviteListData,
  setUidInput,
  localExist,
  setLocalExist,
}: InviteFriendType) => {
  const [uidExists, setUidExists] = useState(false);

  useEffect(() => {
    const exists = localExist.some(invite => invite.UID === UID);
    setUidExists(exists);
  }, [UID, localExist, setUidInput]);

  return (
    <RowContainer seperate>
      <NotoSansKR size={14} weight="Regular">
        {name}
      </NotoSansKR>

      <TouchableOpacity
        disabled={uidExists}
        onPress={() => {
          setInviteListData(prev => [
            ...prev,
            {UserName: name, UID, accept: false},
          ]);
          setLocalExist(prev => [
            ...prev,
            {UserName: name, UID, accept: false},
          ]);
          setUidInput('');
        }}>
        <NotoSansKR
          size={14}
          weight="Regular"
          color="gray3"
          style={{textDecorationLine: 'underline'}}>
          {uidExists ? '이미 초대된 사용자입니다.' : '초대하기'}
        </NotoSansKR>
      </TouchableOpacity>
    </RowContainer>
  );
};

interface SearchBoxType {
  setInviteListData: Dispatch<SetStateAction<InviteList[]>>;
  inviteListData: InviteList[];
}

interface FriendType {
  UID: number;
  USER_NM: string;
}

export const SearchBox = ({
  setInviteListData,
  inviteListData,
}: SearchBoxType) => {
  const [uidInput, setUidInput] = useState('');
  const [localExist, setLocalExist] = useState<InviteList[]>(inviteListData);

  const CallApi = useApi();
  const {accessToken, UID} = useSelector((state: RootState) => state.user);

  const FriendList = async () => {
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
    'FriendList',
    FriendList,
  );

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

  const {data: searchData, isLoading: searchLoading} = useQuery(
    ['SearchList', uidInput], // 쿼리 키에 uidInput 포함
    SearchList,
    {enabled: isUidValid}, // 쿼리 실행 조건
  );

  const handleInputChange = (text: string) => {
    // 입력된 텍스트가 숫자인지 확인
    const numericValue = text.replace(/[^0-9]/g, '');
    setUidInput(numericValue);
  };

  return (
    <SearchContainer>
      <RowContainer gap={8}>
        <OcticonIcons name="search" size={16} style={{position: 'absolute'}} />
        <InputNotoSansKR
          style={{flex: 1, paddingLeft: 24}}
          keyboardType="number-pad"
          maxLength={7}
          size={14}
          value={uidInput}
          onChangeText={handleInputChange}
          placeholder={`UID로 검색하기 (내 UID: ${UID})`}
          border
        />
      </RowContainer>

      <ExpandedContainer>
        <NotoSansKR size={14}>
          {uidInput === '' ? '친구 목록' : '검색 결과'}
        </NotoSansKR>

        {(searchLoading || friendLoading) && <LoadingIndicatior />}

        {uidInput === '' ? (
          friendData?.accepted.length > 0 ? (
            friendData?.accepted
              .slice(0, 3)
              .map((data: FriendType, key: number) => (
                <InviteFriend
                  key={key}
                  name={data.USER_NM}
                  UID={data.UID}
                  localExist={localExist}
                  setLocalExist={setLocalExist}
                  inviteListData={inviteListData}
                  setInviteListData={setInviteListData}
                  setUidInput={setUidInput}
                />
              ))
          ) : (
            <NotoSansKR size={14} color="gray5">
              친구 목록이 없습니다.
            </NotoSansKR>
          )
        ) : searchData?.USER_NM ? (
          <InviteFriend
            name={searchData.USER_NM}
            UID={searchData.UID}
            localExist={localExist}
            setLocalExist={setLocalExist}
            inviteListData={inviteListData}
            setInviteListData={setInviteListData}
            setUidInput={setUidInput}
          />
        ) : (
          <NotoSansKR size={14} color="gray5">
            검색결과가 없습니다.
          </NotoSansKR>
        )}
      </ExpandedContainer>
    </SearchContainer>
  );
};

export const ChallengeInviteFriend = ({
  setInviteListData,
  inviteListData,
}: SearchBoxType) => {
  useEffect(() => {}, [inviteListData]);

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <NotoSansKR size={18}>초대할 친구의 UID를 입력하세요</NotoSansKR>
      <SearchBox
        setInviteListData={setInviteListData}
        inviteListData={inviteListData}
      />
    </View>
  );
};
