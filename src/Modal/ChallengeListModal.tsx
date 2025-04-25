import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {InviteAcceptType} from '../../store/data';
import {RootState} from '../../store/RootReducer';
import {
  ButtonComponent,
  LoadingIndicator,
  NotoSansKR,
  RowContainer,
  TossFace,
} from '../Component';
import {convertUTCToKoKRDay, useApi} from '../Hook/hook';
import {useTheme} from '../theme/ThemeProvider';
import {ModalHeadText} from './CustomModal';
import {useModal} from './ModalProvider';

const StatusComponent = ({
  username,
  status,
}: {
  username: String;
  status?: Boolean | null;
}) => {
  return (
    <RowContainer separate>
      <NotoSansKR size={16} weight="Medium">
        {username}
      </NotoSansKR>
      <NotoSansKR size={14} weight="Medium" color={status ? 'green' : 'red'}>
        {status ? '참여 중' : '대기 중'}
      </NotoSansKR>
    </RowContainer>
  );
};

interface participantsType {
  UID: number;
  USER_NM: string;
  ACCEPT_STATUS: InviteAcceptType;
}

export const ChallengeListModal = ({
  challenge_mst_no,
  count_challenge,
}: {
  challenge_mst_no: number;
  count_challenge: number;
}) => {
  const queryClient = useQueryClient();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const {hideModal} = useModal();
  const CallApi = useApi();

  const GetInviteChallenge = async () => {
    try {
      const response = await CallApi({
        endpoint: `challenge/invite/${challenge_mst_no}`,
        method: 'GET',
        accessToken: accessToken!,
      });
      return response;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '올바르지 않은 접근입니다',
      });
      hideModal();
    }
  };
  const {data, isLoading} = useQuery('GetInviteChallenge', GetInviteChallenge);

  const changeChallengeStatus = (status: InviteAcceptType) =>
    CallApi({
      endpoint: `challenge/invite/${challenge_mst_no}`,
      method: 'PUT',
      accessToken: accessToken!,
      body: {
        CHALLENGE_MST_NO: challenge_mst_no,
        ACCEPT_STATUS: status,
      },
    });

  const {mutate: changeChallengeStatusMutation} = useMutation(
    changeChallengeStatus,
    {
      onSuccess: response => {
        Toast.show({
          type: 'success',
          text1:
            response.status === InviteAcceptType.ACCEPTED
              ? '챌린지 초대를 수락했어요.'
              : '챌린지를 거절했어요 ',
        });
        queryClient.invalidateQueries('getChallenge');
        hideModal();
      },
      onError: error => {
        console.error('Challenge Status Change Error:', error);
      },
    },
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <View style={{gap: 24}}>
      <ModalHeadText>
        <NotoSansKR size={20}>
          [{data?.PARTICIPANTS[0].USER_NM}]에게 초대가 왔어요
        </NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 16}}>
        <RowContainer gap={16}>
          <TossFace size={40}>{data?.HEADER_EMOJI}</TossFace>
          <NotoSansKR size={20}>{data?.CHALLENGE_MST_NM}</NotoSansKR>
        </RowContainer>

        <View style={{gap: 8}}>
          <NotoSansKR size={18}>챌린지 기간</NotoSansKR>
          <ChallengeTimeBox>
            <NotoSansKR size={14} weight="Medium">
              {convertUTCToKoKRDay(data?.START_DT) +
                ' ~ ' +
                convertUTCToKoKRDay(data?.END_DT)}
            </NotoSansKR>
          </ChallengeTimeBox>
        </View>

        <NotoSansKR size={18}>챌린지 참여 인원</NotoSansKR>

        <View style={{gap: 8}}>
          {data?.PARTICIPANTS.map((user: participantsType) => {
            return (
              <StatusComponent
                key={user.UID}
                username={user.USER_NM}
                status={
                  user.ACCEPT_STATUS === InviteAcceptType.ACCEPTED
                    ? true
                    : user.ACCEPT_STATUS === InviteAcceptType.PENDING
                      ? false
                      : null
                }
              />
            );
          })}
        </View>

        <View style={{gap: 8}}>
          <ButtonComponent
            onPress={() => {
              if (count_challenge >= 3) {
                Toast.show({
                  type: 'error',
                  text1: '현재는 챌린지를 3개까지만 진행할 수 있어요',
                });
                hideModal();
              } else {
                changeChallengeStatusMutation(InviteAcceptType.ACCEPTED);
              }
            }}>
            참여하기
          </ButtonComponent>
          <ButtonComponent
            type="secondary"
            onPress={() =>
              changeChallengeStatusMutation(InviteAcceptType.DECLINED)
            }>
            거절하기
          </ButtonComponent>
        </View>
      </View>
    </View>
  );
};

// export const ChallengeModal = () => {
//   const {showModal} = useModal();
//   const openModal = () => {
//     showModal(<ChallengeListModal />);
//   };

//   return (
//     <HomeContainer>
//       <ButtonComponent onPress={openModal}>챌린지 모달 출력</ButtonComponent>
//     </HomeContainer>
//   );
// };

export const ChallengeTimeBox: React.FC<ViewProps> = ({
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.box, {borderColor: theme.gray5}, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 100,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
