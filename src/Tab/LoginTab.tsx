import React from 'react';
import {ButtonComponent, CallApi, HomeContainer} from '../Component';
import {useMutation} from 'react-query';

const guestLogin = () =>
  CallApi({endpoint: 'user/create/guest', method: 'POST'});

const testCreate = () =>
  CallApi({
    endpoint: 'challenge/create',
    method: 'POST',
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAwMDA5IiwiZXhwIjoxNzAwNDA1NTM5fQ.DE1jk5yWiD2hEsE8iIUJrcn-zJNg236Iczm1sdVqFpw',
    body: {
      CHALLENGE_MST_NM: 'string',
      USERS_UID: [0],
      START_DT: '2023-11-18',
      END_DT: '2023-11-18',
      HEADER_EMOJI: 'string',
      INSERT_DT: '2023-11-18T15:18:20.629Z',
      CHALLENGE_STATUS: 'PENDING',
    },
  });

const LoginTab = () => {
  const {mutate, data, isLoading, error} = useMutation(guestLogin, {
    onSuccess: () => {
      // 요청 성공 시 수행할 작업
      console.log('Success:', data);
    },
    onError: () => {
      // 요청 실패 시 수행할 작업
      console.error('Error:', error);
    },
  });

  const {mutate: test, data: dataTest} = useMutation(testCreate, {
    onSuccess: () => {
      // 요청 성공 시 수행할 작업
      console.log('Success:', dataTest);
    },
    onError: () => {
      // 요청 실패 시 수행할 작업
      console.error('Error:', error);
    },
  });

  const handleButtonClick = () => {
    mutate();
  };

  const testClick = () => {
    test();
  };

  console.log({data, isLoading});
  return (
    <HomeContainer>
      <ButtonComponent onPress={handleButtonClick}>
        게스트로그인
      </ButtonComponent>
      <ButtonComponent onPress={testClick}>Header & Body Test</ButtonComponent>
    </HomeContainer>
  );
};

export default LoginTab;
