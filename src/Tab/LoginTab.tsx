import React from 'react';
import {HomeContainer, NotoSansKR, RowContainer} from '../Component';
// import {useMutation} from 'react-query';
import {styled} from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

// const guestLogin = () =>
//   CallApi({endpoint: 'user/create/guest', method: 'POST'});

// const testCreate = () =>
//   CallApi({
//     endpoint: 'challenge/create',
//     method: 'POST',
//     accessToken:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAwMDA5IiwiZXhwIjoxNzAwNDA1NTM5fQ.DE1jk5yWiD2hEsE8iIUJrcn-zJNg236Iczm1sdVqFpw',
//     body: {
//       CHALLENGE_MST_NM: 'string',
//       USERS_UID: [0],
//       START_DT: '2023-11-18',
//       END_DT: '2023-11-18',
//       HEADER_EMOJI: 'string',
//       INSERT_DT: '2023-11-18T15:18:20.629Z',
//       CHALLENGE_STATUS: 'PENDING',
//     },
//   });

const LoginTab = () => {
  // const {mutate, data, isLoading, error} = useMutation(guestLogin, {
  //   onSuccess: () => {
  //     // 요청 성공 시 수행할 작업
  //     console.log('Success:', data);
  //   },
  //   onError: () => {
  //     // 요청 실패 시 수행할 작업
  //     console.error('Error:', error);
  //   },
  // });

  // const {mutate: test, data: dataTest} = useMutation(testCreate, {
  //   onSuccess: () => {
  //     // 요청 성공 시 수행할 작업
  //     console.log('Success:', dataTest);
  //   },
  //   onError: () => {
  //     // 요청 실패 시 수행할 작업
  //     console.error('Error:', error);
  //   },
  // });

  // const handleButtonClick = () => {
  //   mutate();
  // };

  // const testClick = () => {
  //   test();
  // };

  // console.log({data, isLoading});
  return (
    <HomeContainer>
      <BackgroundImage source={require('../../assets/image/background.png')} />
      <LoginContainer>
        <Title source={require('../../assets/image/title.png')} />

        <LoginButton kakao>
          <RowContainer gap={8}>
            <IconImage
              source={require('../../assets/image/kakao_icon.png')}
              size={24}
            />
            <NotoSansKR size={14} style={{flex: 1, textAlign: 'center'}}>
              카카오톡으로 시작하기
            </NotoSansKR>
          </RowContainer>
        </LoginButton>

        <LoginButton>
          <RowContainer gap={8}>
            <IconImage
              source={require('../../assets/image/apple_icon.png')}
              size={20}
            />
            <NotoSansKR size={14} style={{flex: 1, textAlign: 'center'}}>
              애플로 시작하기
            </NotoSansKR>
          </RowContainer>
        </LoginButton>

        <TouchableOpacity>
          <NotoSansKR
            size={14}
            weight="Medium"
            color="white"
            style={{
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}>
            게스트 계정으로 시작하기
          </NotoSansKR>
        </TouchableOpacity>
      </LoginContainer>
    </HomeContainer>
  );
};

const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
  resize: contain;
  flex: 1;
  bottom: 0;
`;

const LoginContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 32px;
  gap: 6px;
`;

const Title = styled.Image`
  margin-bottom: 4px;
`;
const IconImage = styled.Image<{size: number}>`
  width: ${({size}) => `${size}px`};
  height: ${({size}) => `${size}px`};
`;

const LoginButton = styled.TouchableOpacity<{kakao?: boolean}>`
  margin-top: 6px;
  width: 193px;
  background-color: ${({kakao}) => (kakao ? '#fddc3f' : '#fff')};
  padding: 8px 16px 8px 12px;
  border-radius: 5px;
`;

export default LoginTab;
